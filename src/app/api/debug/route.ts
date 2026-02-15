import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasAuthUrl: !!process.env.AUTH_URL,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasDirectUrl: !!process.env.DIRECT_URL,
    authUrlValue: process.env.AUTH_URL || "(not set)",
    nextAuthUrlValue: process.env.NEXTAUTH_URL || "(not set)",
    nodeEnv: process.env.NODE_ENV,
  });
}
