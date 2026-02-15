import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  // Public routes - allow access
  const publicRoutes = ["/", "/login", "/register"];
  if (publicRoutes.some((r) => pathname === r || pathname.startsWith(r + "?"))) {
    // If logged in and trying to access login/register, redirect to dashboard
    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
      const dashboardUrl =
        role === "HOSPITAL" ? "/hospital/dashboard" : "/patient/dashboard";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }
    return NextResponse.next();
  }

  // API routes for auth - always allow
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protected routes - require auth
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
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
