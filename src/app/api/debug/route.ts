import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const check = searchParams.get("check");

  if (check === "users") {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true },
        take: 5,
      });
      
      // Test password for first user
      let passwordTest = "no users found";
      if (users.length > 0) {
        const fullUser = await prisma.user.findUnique({
          where: { email: users[0].email },
        });
        if (fullUser) {
          const match = await compare("password123", fullUser.passwordHash);
          passwordTest = match ? "password123 MATCHES" : "password123 DOES NOT match";
        }
      }
      
      return NextResponse.json({ users, passwordTest, totalUsers: users.length });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ error: msg });
    }
  }

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
