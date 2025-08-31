import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { dashboardRoutes, publicRoutes } from './helpers/route';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = getSessionCookie(request);

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth cookie instead of calling Better Auth API
  // const authCookie = request.cookies.get('better-auth.session_token');
  // console.log('authCookie', authCookie);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check dashboard route permissions
  const matchedRoute = Object.keys(dashboardRoutes).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    // This would need to be enhanced to check actual user roles from database
    // For now, we'll handle this in the page components
    return NextResponse.next();
  }

  // Default dashboard redirect
  // if (pathname === '/dashboard' || pathname === '/dashboard/') {
  //   return NextResponse.redirect(new URL('/dashboard/customer', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
