'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

// ===========================
// TYPES
// ===========================

export type UserRole = 'SUPER_ADMIN' | 'PARTNER' | 'INVESTOR' | 'USER'

export interface ClerkUserRow {
  id: string
  name: string
  email: string
  role: UserRole
  imageUrl: string
  createdAt: number
}

export interface UpdateUserRoleResult {
  success: boolean
  error?: string
}

// ===========================
// HELPERS
// ===========================

async function assertOwner(): Promise<string> {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    throw new Error('Unauthenticated')
  }

  const role = (sessionClaims?.metadata as Record<string, unknown> | undefined)?.role as string | undefined

  // Owners: SUPER_ADMIN and PARTNER have full admin access
  if (role !== 'SUPER_ADMIN' && role !== 'PARTNER') {
    throw new Error('Forbidden: Owner access required (SUPER_ADMIN or PARTNER).')
  }

  return userId
}

// Legacy alias for backward compatibility
const assertSuperAdmin = assertOwner

function extractRole(publicMetadata: Record<string, unknown> | null | undefined): UserRole {
  const raw = publicMetadata?.role as string | undefined
  if (!raw) return 'USER'
  const upper = raw.toUpperCase()
  if (['SUPER_ADMIN', 'PARTNER', 'INVESTOR', 'USER'].includes(upper)) {
    return upper as UserRole
  }
  return 'USER'
}

// ===========================
// SERVER ACTIONS
// ===========================

/**
 * Fetch paginated Clerk users. Returns mapped rows safe for client consumption.
 * Caller must be SUPER_ADMIN.
 */
export async function getUsersAction(limit = 50, offset = 0): Promise<ClerkUserRow[]> {
  await assertOwner()

  const client = await clerkClient()
  const response = await client.users.getUserList({ limit, offset, orderBy: '-created_at' })

  return response.data.map((u) => {
    const email = u.primaryEmailAddress?.emailAddress ?? u.emailAddresses[0]?.emailAddress ?? ''
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || email.split('@')[0]
    return {
      id: u.id,
      name,
      email,
      role: extractRole(u.publicMetadata as Record<string, unknown>),
      imageUrl: u.imageUrl,
      createdAt: u.createdAt,
    }
  })
}

/**
 * Unified role-change action with automatic PartnerProfile lifecycle management.
 *
 * Promotion → PARTNER :
 *   1. Update Clerk publicMetadata.role = "PARTNER"
 *   2. Resolve the local Prisma User via clerkUserId
 *   3. Upsert a PartnerProfile (create if absent; re-activate if previously deactivated)
 *
 * Demotion from PARTNER → anything else :
 *   1. Update Clerk publicMetadata.role = newRole
 *   2. Soft-deactivate the PartnerProfile (isActive = false) — data is preserved
 *
 * All Prisma writes are wrapped in a single transaction.
 * Caller must be SUPER_ADMIN.
 */
export async function updateUserRoleAction(
  targetClerkUserId: string,
  newRole: UserRole
): Promise<UpdateUserRoleResult> {
  try {
    const actorId = await assertOwner()

    if (!targetClerkUserId || typeof targetClerkUserId !== 'string') {
      return { success: false, error: 'Invalid target user ID.' }
    }

    const validRoles: UserRole[] = ['SUPER_ADMIN', 'PARTNER', 'INVESTOR', 'USER']
    if (!validRoles.includes(newRole)) {
      return { success: false, error: `Invalid role: ${newRole}` }
    }

    // ── 1. Fetch current Clerk user to know previous role ──────────────────
    const clerk = await clerkClient()
    const clerkUser = await clerk.users.getUser(targetClerkUserId)
    const previousRole = extractRole(clerkUser.publicMetadata as Record<string, unknown>)

    // ── 2. Update Clerk metadata first (source-of-truth for auth) ──────────
    await clerk.users.updateUserMetadata(targetClerkUserId, {
      publicMetadata: { role: newRole },
    })

    // ── 3. Sync local Prisma state inside a transaction ────────────────────
    try {
      await prisma.$transaction(async (tx) => {
        // Resolve local User record from the Clerk ID
        const localUser = await tx.user.findUnique({
          where: { clerkUserId: targetClerkUserId },
          select: { id: true, name: true, email: true },
        })

        if (!localUser) {
          // Webhook hasn't synced this user yet — Prisma side is a no-op.
          // The webhook will set the correct role when it eventually fires.
          console.warn(`[RBAC] No local User found for clerkUserId=${targetClerkUserId}. Skipping Prisma sync.`)
          return
        }

        if (newRole === 'PARTNER') {
          // ── Case A: Promotion → provision / re-activate PartnerProfile ──
          const existing = await tx.partnerProfile.findUnique({
            where: { userId: localUser.id },
            select: { id: true, isActive: true },
          })

          if (existing) {
            if (!existing.isActive) {
              await tx.partnerProfile.update({
                where: { userId: localUser.id },
                data: { isActive: true },
              })
              console.log(`[RBAC] Re-activated PartnerProfile for userId=${localUser.id}`)
            }
            // Already active — nothing to do
          } else {
            // Build a clean displayName: prefer "First Last", fall back to email prefix
            const displayName =
              [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() ||
              localUser.name ||
              localUser.email.split('@')[0]

            await tx.partnerProfile.create({
              data: {
                userId: localUser.id,
                displayName,
                isActive: true,
              },
            })
            console.log(`[RBAC] Provisioned new PartnerProfile for userId=${localUser.id} ("${displayName}")`)
          }
        } else if (previousRole === 'PARTNER') {
          // ── Case B: Demotion from PARTNER → soft-deactivate ──────────────
          const existing = await tx.partnerProfile.findUnique({
            where: { userId: localUser.id },
            select: { id: true },
          })

          if (existing) {
            await tx.partnerProfile.update({
              where: { userId: localUser.id },
              data: { isActive: false },
            })
            console.log(`[RBAC] Soft-deactivated PartnerProfile for userId=${localUser.id}`)
          }
        }
      })
    } catch (dbErr) {
      // Clerk is already updated; log the DB failure but don't surface it as a
      // hard error — the role change succeeded from the auth perspective.
      console.error('[RBAC] Prisma sync failed after Clerk update:', dbErr instanceof Error ? dbErr.message : dbErr)
    }

    console.log(`[RBAC] ${actorId} changed role of ${targetClerkUserId}: ${previousRole} → ${newRole}`)

    revalidatePath('/admin/usuarios')
    revalidatePath('/admin/partners')
    revalidatePath('/admin/mi-gestion')

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[RBAC] updateUserRoleAction failed:', message)
    return { success: false, error: message }
  }
}
