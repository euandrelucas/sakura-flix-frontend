import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define paths that require authentication
const protectedPaths = [
  "/user/dashboard",
  "/user/profile",
  "/user/settings",
  "/user/watchlist",
];

// Define paths that are only accessible when not authenticated
const authPaths = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const path = request.nextUrl.pathname;

  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some((pp) => path.startsWith(pp));

  // Check if the current path is only for non-authenticated users
  const isAuthPath = authPaths.some((ap) => path === ap);

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPath) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && isProtectedPath) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", encodeURI(path));
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Configure paths that will trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside public)
     * 4. /icons (inside public)
     * 5. all root files inside public (e.g. /favicon.ico)
     */
    "/((?!api|_next|fonts|icons|[\\w-]+\\.\\w+).*)",
  ],
};
