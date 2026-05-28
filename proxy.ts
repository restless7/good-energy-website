import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

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
  '/api/webhooks(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

// ===========================
// MAIN MIDDLEWARE
// clerkMiddleware MUST be the direct default export — never wrap it.
// ===========================

export default clerkMiddleware(async (auth, request) => {
  // Public routes: no auth required
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }

  const { userId } = await auth()
  const pathname = request.nextUrl.pathname

  // Unauthenticated user trying to access /admin → redirect to sign-in
  if (pathname.startsWith('/admin') && !userId) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    url.searchParams.set('redirect_url', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

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
