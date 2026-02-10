import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patientId =
    session.user.role === "PATIENT"
      ? session.user.patientId
      : new URL(req.url).searchParams.get("patientId");

  if (!patientId) {
    return NextResponse.json({ error: "Patient ID required" }, { status: 400 });
  }

  const logs = await prisma.medicationLog.findMany({
    where: { patientId },
    include: { medication: { select: { name: true, dosage: true, frequency: true } } },
    orderBy: { date: "desc" },
    take: 200,
  });

  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { medicationId, taken, notes, date } = body;

    if (!medicationId) {
      return NextResponse.json(
        { error: "Medication ID is required" },
        { status: 400 }
      );
    }

    // Use provided date or today
    let logDate: Date;
    if (date) {
      logDate = new Date(date);
      logDate.setHours(0, 0, 0, 0);
    } else {
      logDate = new Date();
      logDate.setHours(0, 0, 0, 0);
    }

    const log = await prisma.medicationLog.upsert({
      where: {
        patientId_medicationId_date: {
          patientId: session.user.patientId!,
          medicationId,
          date: logDate,
        },
      },
      update: {
        taken: taken ?? false,
        notes: notes || null,
      },
      create: {
        patientId: session.user.patientId!,
        medicationId,
        date: logDate,
        taken: taken ?? false,
        notes: notes || null,
      },
      include: { medication: { select: { name: true, dosage: true, frequency: true } } },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Create medication log error:", error);
    return NextResponse.json(
      { error: "Failed to log medication" },
      { status: 500 }
    );
  }
}
