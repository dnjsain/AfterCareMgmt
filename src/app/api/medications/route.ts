import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

// GET all medications for the current patient (both from discharge plans and self-added)
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patientId = session.user.patientId!;

  // Get patient-added medications
  const selfMeds = await prisma.medication.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(selfMeds);
}

// POST create a new patient-added medication
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = medicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const medication = await prisma.medication.create({
      data: {
        name: parsed.data.name,
        dosage: parsed.data.dosage,
        frequency: parsed.data.frequency,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        patientId: session.user.patientId!,
        dischargePlanId: null,
      },
    });

    return NextResponse.json(medication, { status: 201 });
  } catch (error) {
    console.error("Create medication error:", error);
    return NextResponse.json(
      { error: "Failed to create medication" },
      { status: 500 }
    );
  }
}
