import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  // API routes for auth - always allow
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Public routes - always allow access (never redirect away from these)
  const isPublicRoute = pathname === "/" || pathname === "/login" || pathname.startsWith("/register");
  if (isPublicRoute) {
    // Only redirect logged-in users if we have a valid role
    // This prevents redirect loops when session is corrupted
    if (isLoggedIn && role && (pathname === "/login" || pathname.startsWith("/register"))) {
      const dashboardUrl =
        role === "HOSPITAL" ? "/hospital/dashboard" : "/patient/dashboard";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require auth with valid role
  if (!isLoggedIn || !role) {
    // Clear any stale session by redirecting to login
    const response = NextResponse.redirect(new URL("/login", req.url));
    return response;
  }

  // Role-based access
  if (pathname.startsWith("/hospital") && role !== "HOSPITAL") {
    return NextResponse.redirect(new URL("/patient/dashboard", req.url));
  }
  if (pathname.startsWith("/patient") && role !== "PATIENT") {
    return NextResponse.redirect(new URL("/hospital/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png).*)",
  ],
};
