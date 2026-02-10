import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { vitalLogSchema } from "@/lib/validations";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const vital = await prisma.vitalLog.findUnique({ where: { id } });
  if (!vital) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.user.role === "PATIENT" && vital.patientId !== session.user.patientId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(vital);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.vitalLog.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.patientId !== session.user.patientId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    const updated = await prisma.vitalLog.update({
      where: { id },
      data: {
        bloodPressureSystolic: parsed.data.bloodPressureSystolic ?? null,
        bloodPressureDiastolic: parsed.data.bloodPressureDiastolic ?? null,
        weight: parsed.data.weight ?? null,
        glucose: parsed.data.glucose ?? null,
        temperature: parsed.data.temperature ?? null,
        notes: parsed.data.notes || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update vital error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.vitalLog.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.patientId !== session.user.patientId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.vitalLog.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
