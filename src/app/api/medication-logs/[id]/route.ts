import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.medicationLog.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.patientId !== session.user.patientId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { taken, notes } = body;

    const updated = await prisma.medicationLog.update({
      where: { id },
      data: {
        ...(taken !== undefined && { taken }),
        ...(notes !== undefined && { notes: notes || null }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update medication log error:", error);
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

  const existing = await prisma.medicationLog.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.patientId !== session.user.patientId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.medicationLog.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
