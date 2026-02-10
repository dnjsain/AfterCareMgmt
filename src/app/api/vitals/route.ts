import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { vitalLogSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const patientId =
    session.user.role === "PATIENT"
      ? session.user.patientId
      : searchParams.get("patientId");

  if (!patientId) {
    return NextResponse.json({ error: "Patient ID required" }, { status: 400 });
  }

  const vitals = await prisma.vitalLog.findMany({
    where: { patientId },
    orderBy: { date: "desc" },
    take: 60,
  });

  return NextResponse.json(vitals);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = vitalLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const vital = await prisma.vitalLog.create({
      data: {
        patientId: session.user.patientId!,
        date: new Date(),
        bloodPressureSystolic: parsed.data.bloodPressureSystolic ?? null,
        bloodPressureDiastolic: parsed.data.bloodPressureDiastolic ?? null,
        weight: parsed.data.weight ?? null,
        glucose: parsed.data.glucose ?? null,
        temperature: parsed.data.temperature ?? null,
        notes: parsed.data.notes || null,
      },
    });

    return NextResponse.json(vital, { status: 201 });
  } catch (error) {
    console.error("Create vital log error:", error);
    return NextResponse.json(
      { error: "Failed to log vitals" },
      { status: 500 }
    );
  }
}
