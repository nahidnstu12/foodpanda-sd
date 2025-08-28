import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { dashboardRoutes, publicRoutes } from "./helpers/route";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Redirect to login if no session
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/login", request.url));
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
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return NextResponse.redirect(new URL("/dashboard/customer", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
