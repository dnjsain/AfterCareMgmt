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

  const plan = await prisma.dischargePlan.findUnique({
    where: { id },
    include: {
      patient: { select: { id: true, name: true, phone: true } },
      hospital: { select: { name: true } },
      medications: true,
    },
  });

  if (!plan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Verify access
  if (
    session.user.role === "HOSPITAL" &&
    plan.hospitalId !== session.user.hospitalId
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (
    session.user.role === "PATIENT" &&
    plan.patientId !== session.user.patientId
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(plan);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "HOSPITAL") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { diagnosis, instructions, activityRestrictions, followUpDate } = body;

    const plan = await prisma.dischargePlan.update({
      where: { id, hospitalId: session.user.hospitalId! },
      data: {
        ...(diagnosis && { diagnosis }),
        ...(instructions && { instructions }),
        ...(activityRestrictions !== undefined && { activityRestrictions }),
        ...(followUpDate !== undefined && {
          followUpDate: followUpDate ? new Date(followUpDate) : null,
        }),
      },
      include: { medications: true, patient: true },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Update discharge plan error:", error);
    return NextResponse.json(
      { error: "Failed to update discharge plan" },
      { status: 500 }
    );
  }
}
