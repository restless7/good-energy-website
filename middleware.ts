import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// ===========================
// PLACEHOLDER DEPLOYMENT DETECTION
// ===========================

const isPlaceholderDeployment =
  process.env.CLERK_SECRET_KEY === 'sk_test_placeholder' ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'pk_test_placeholder' ||
  process.env.CLERK_SECRET_KEY?.includes('placeholder') ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('placeholder')

// ===========================
// PUBLIC ROUTES (bypass Clerk auth)
// ===========================

const isPublicRoute = createRouteMatcher([
  '/',
  '/blog(.*)',
  '/comunidad(.*)',
  '/investment-simulator(.*)',
  '/join-conference(.*)',
  '/sales-playbook(.*)',
  '/api/contact(.*)',
  '/api/conference(.*)',
  '/api/simulator(.*)',
  '/api/dashboard(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

// ===========================
// MAIN MIDDLEWARE
// ===========================

export default function middleware(request: NextRequest, event: any) {
  // If using placeholder keys, skip Clerk entirely — allow all routes
  if (isPlaceholderDeployment) {
    return NextResponse.next()
  }

  return clerkMiddleware(async (auth, request) => {
    // Skip Clerk protection for public routes
    if (isPublicRoute(request)) {
      return NextResponse.next()
    }

    const { userId } = await auth();
    const pathname = request.nextUrl.pathname;

    // ── Admin Route Family ──────────────────────────────
    if (pathname.startsWith('/admin') && !userId) {
      // Unauthenticated → redirect to Clerk sign-in
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      url.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next()
  })(request, event)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API and tRPC routes
    '/(api|trpc)(.*)',
    // Clerk auto-proxy path (required for Next.js 15+)
    '/__clerk/(.*)',
  ],
}
