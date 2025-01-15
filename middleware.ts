import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/products(.*)', 'about']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Setup Clerk middleware to protect non-public routes
export default clerkMiddleware(async (auth, req) => {
  const isAdminUser = (await auth()).userId === process.env.ADMIN_USER_ID;

  // Redirect unauthorized users to the homepage
  if (isAdminRoute(req) && !isAdminUser) {
    console.log('Unauthorized access to admin route');
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isPublicRoute(req)) await auth.protect();
});

// Middleware configuration
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // This pattern excludes files with common web extensions and Next.js internal routes
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Always run middleware for API routes and tRPC endpoints
    '/(api|trpc)(.*)',
  ],
};
