import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { publicRoutes } from "./config/route-list";

export async function proxy(request: NextRequest) {
  // const startTime = Date.now();
  const pathname = request.nextUrl.pathname;
  const sessionCookie = getSessionCookie(request);
  // const requestId =
  //   request.headers.get("x-request-id") ||
  //   `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Set request context for logging
  // apiLogger.setRequestId(requestId);

  // Log incoming request
  // apiLogger.http(`${request.method} ${pathname}`, {
  //   method: request.method,
  //   url: pathname,
  //   userAgent: request.headers.get("user-agent"),
  //   ip: request.ip || request.headers.get("x-forwarded-for") || "unknown",
  //   referer: request.headers.get("referer"),
  // });

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // const duration = Date.now() - startTime;
    // apiLogger.http(`${request.method} ${pathname} - 200 (public)`, {
    //   duration,
    // });
    return NextResponse.next();
  }

  // Check for auth cookie instead of calling Better Auth API
  // const authCookie = request.cookies.get('better-auth.session_token');
  // console.log('authCookie', authCookie);

  if (!sessionCookie) {
    // const duration = Date.now() - startTime;
    // apiLogger.http(`${request.method} ${pathname} - 302 (redirect to login)`, {
    //   duration,
    // });
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check dashboard route permissions
  // const matchedRoute = dashboardRoutes.includes(pathname);

  // if (matchedRoute) {
  //   // This would need to be enhanced to check actual user roles from database
  //   // For now, we'll handle this in the page components
  //   return NextResponse.next();
  // }

  // Default dashboard redirect
  // if (pathname === '/dashboard' || pathname === '/dashboard/') {
  //   return NextResponse.redirect(new URL('/dashboard/customer', request.url));
  // }

  // const duration = Date.now() - startTime;
  // apiLogger.http(`${request.method} ${pathname} - 200 (authenticated)`, {
  //   duration,
  // });
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
