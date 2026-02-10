import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, role, phone, hospitalName, hospitalAddress, dateOfBirth } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        phone: phone || null,
        ...(role === "HOSPITAL"
          ? {
              hospital: {
                create: {
                  name: hospitalName || name,
                  address: hospitalAddress || null,
                },
              },
            }
          : {
              patient: {
                create: {
                  name,
                  phone: phone || null,
                  dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                },
              },
            }),
      },
      include: {
        hospital: role === "HOSPITAL",
        patient: role === "PATIENT",
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
