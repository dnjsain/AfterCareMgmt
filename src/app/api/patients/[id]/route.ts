import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      user: { select: { email: true } },
      hospital: { select: { name: true } },
      dischargePlans: {
        include: { medications: true },
        orderBy: { createdAt: "desc" },
      },
      vitalLogs: {
        orderBy: { date: "desc" },
        take: 30,
      },
      medicationLogs: {
        orderBy: { date: "desc" },
        take: 50,
        include: { medication: { select: { name: true } } },
      },
    },
  });

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  // Verify hospital access
  if (
    session.user.role === "HOSPITAL" &&
    patient.hospitalId !== session.user.hospitalId
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(patient);
}
