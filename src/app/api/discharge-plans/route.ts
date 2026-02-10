import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dischargePlanSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");

  if (session.user.role === "HOSPITAL") {
    const plans = await prisma.dischargePlan.findMany({
      where: {
        hospitalId: session.user.hospitalId!,
        ...(patientId ? { patientId } : {}),
      },
      include: {
        patient: { select: { name: true, phone: true } },
        medications: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(plans);
  }

  if (session.user.role === "PATIENT") {
    const plans = await prisma.dischargePlan.findMany({
      where: { patientId: session.user.patientId! },
      include: {
        hospital: { select: { name: true } },
        medications: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(plans);
  }

  return NextResponse.json({ error: "Invalid role" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "HOSPITAL") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = dischargePlanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      patientId,
      dischargeDate,
      diagnosis,
      instructions,
      activityRestrictions,
      followUpDate,
      medications,
    } = parsed.data;

    const plan = await prisma.dischargePlan.create({
      data: {
        patientId,
        hospitalId: session.user.hospitalId!,
        dischargeDate: new Date(dischargeDate),
        diagnosis,
        instructions,
        activityRestrictions: activityRestrictions || null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        medications: medications
          ? {
              create: medications.map((med) => ({
                name: med.name,
                dosage: med.dosage,
                frequency: med.frequency,
                startDate: new Date(med.startDate),
                endDate: med.endDate ? new Date(med.endDate) : null,
              })),
            }
          : undefined,
      },
      include: { medications: true, patient: true },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Create discharge plan error:", error);
    return NextResponse.json(
      { error: "Failed to create discharge plan" },
      { status: 500 }
    );
  }
}
