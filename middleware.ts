// Import required Clerk middleware components
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/', '/products(.*)', 'about']);

// Setup Clerk middleware to protect non-public routes
export default clerkMiddleware(async (auth, req) => {
  // If the current route is not public, require authentication
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
