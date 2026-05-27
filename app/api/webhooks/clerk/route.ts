import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { clerkClient } from '@clerk/nextjs/server'
import { PrismaClient } from '@/app/generated/prisma'

// ===========================
// TYPES
// ===========================

interface ClerkEmailAddress {
  id: string
  email_address: string
  verification: { status: string } | null
}

interface ClerkUserCreatedData {
  id: string
  email_addresses: ClerkEmailAddress[]
  first_name: string | null
  last_name: string | null
  image_url: string | null
  created_at: number
}

interface ClerkWebhookEvent {
  type: string
  data: ClerkUserCreatedData
}

// ===========================
// PRISMA SINGLETON
// ===========================

const prisma = new PrismaClient()

// ===========================
// ROUTE HANDLER
// ===========================

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('[Webhook] CLERK_WEBHOOK_SECRET is not set.')
    return NextResponse.json(
      { error: 'Server misconfiguration: missing webhook secret.' },
      { status: 500 }
    )
  }

  // ── Svix Signature Verification ──────────────────────────
  const svixId = request.headers.get('svix-id')
  const svixTimestamp = request.headers.get('svix-timestamp')
  const svixSignature = request.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: 'Missing Svix signature headers.' },
      { status: 400 }
    )
  }

  let body: string
  try {
    body = await request.text()
  } catch {
    return NextResponse.json(
      { error: 'Failed to read request body.' },
      { status: 400 }
    )
  }

  const wh = new Webhook(webhookSecret)
  let event: ClerkWebhookEvent

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkWebhookEvent
  } catch (err) {
    console.error('[Webhook] Svix signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid webhook signature.' },
      { status: 400 }
    )
  }

  // ── Event Routing ─────────────────────────────────────────
  if (event.type === 'user.created') {
    return handleUserCreated(event.data)
  }

  return NextResponse.json({ received: true, type: event.type }, { status: 200 })
}

// ===========================
// HANDLERS
// ===========================

async function handleUserCreated(data: ClerkUserCreatedData): Promise<NextResponse> {
  const { id: clerkUserId, email_addresses, first_name, last_name, image_url } = data

  const primaryEmail = email_addresses.find(
    (e) => e.verification?.status === 'verified'
  ) ?? email_addresses[0]

  if (!primaryEmail) {
    console.error(`[Webhook] user.created — no email found for clerkUserId: ${clerkUserId}`)
    return NextResponse.json({ error: 'No email address on new user.' }, { status: 400 })
  }

  const email = primaryEmail.email_address
  const fullName = [first_name, last_name].filter(Boolean).join(' ') || email.split('@')[0]

  try {
    // ── 1. Assign default INVESTOR role in Clerk public metadata ──
    const client = await clerkClient()
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { role: 'INVESTOR' },
    })

    console.log(`[Webhook] Assigned INVESTOR role to ${clerkUserId} (${email})`)

    // ── 2. Sync user to local Prisma database ─────────────────────
    await prisma.user.upsert({
      where: { email },
      create: {
        clerkUserId,
        name: fullName,
        email,
        avatar: image_url ?? undefined,
        isActive: true,
      },
      update: {
        clerkUserId,
        name: fullName,
        avatar: image_url ?? undefined,
      },
    })

    console.log(`[Webhook] Synced user to DB: ${email}`)

    return NextResponse.json(
      { success: true, message: `User ${clerkUserId} onboarded as INVESTOR.` },
      { status: 200 }
    )
  } catch (err) {
    console.error('[Webhook] Error during user.created handling:', err)
    return NextResponse.json(
      { error: 'Internal server error during user onboarding.' },
      { status: 500 }
    )
  }
}
