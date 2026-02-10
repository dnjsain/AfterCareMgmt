import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  if (session.user.role === "HOSPITAL") {
    const patients = await prisma.patient.findMany({
      where: {
        hospitalId: session.user.hospitalId,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        user: { select: { email: true } },
        dischargePlans: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, diagnosis: true, dischargeDate: true },
        },
        _count: {
          select: { vitalLogs: true, dischargePlans: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(patients);
  }

  // Patient role - return own profile
  if (session.user.role === "PATIENT") {
    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
      include: {
        hospital: { select: { name: true } },
        user: { select: { email: true } },
      },
    });
    return NextResponse.json(patient);
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
    const { name, email, phone, dateOfBirth } = body;

    // Check if patient with this email already exists
    let patientUser = await prisma.user.findUnique({ where: { email } });

    if (patientUser) {
      // Link existing patient to this hospital
      const patient = await prisma.patient.update({
        where: { userId: patientUser.id },
        data: { hospitalId: session.user.hospitalId },
      });
      return NextResponse.json(patient);
    }

    // Create a new patient user with a temp password
    const { hash } = await import("bcryptjs");
    const tempPassword = await hash("changeme123", 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: tempPassword,
        role: "PATIENT",
        phone: phone || null,
        patient: {
          create: {
            name,
            phone: phone || null,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            hospitalId: session.user.hospitalId,
          },
        },
      },
      include: { patient: true },
    });

    return NextResponse.json(newUser.patient, { status: 201 });
  } catch (error) {
    console.error("Create patient error:", error);
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}
