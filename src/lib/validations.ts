import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["HOSPITAL", "PATIENT"]),
  phone: z.string().optional(),
  // Hospital-specific
  hospitalName: z.string().optional(),
  hospitalAddress: z.string().optional(),
  // Patient-specific
  dateOfBirth: z.string().optional(),
});

export const dischargePlanSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  dischargeDate: z.string().min(1, "Discharge date is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  instructions: z.string().min(1, "Instructions are required"),
  activityRestrictions: z.string().optional(),
  followUpDate: z.string().optional(),
  medications: z.array(
    z.object({
      name: z.string().min(1, "Medication name is required"),
      dosage: z.string().min(1, "Dosage is required"),
      frequency: z.string().min(1, "Frequency is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
    })
  ).optional(),
});

export const vitalLogSchema = z.object({
  bloodPressureSystolic: z.coerce.number().int().positive().optional().nullable(),
  bloodPressureDiastolic: z.coerce.number().int().positive().optional().nullable(),
  weight: z.coerce.number().positive().optional().nullable(),
  glucose: z.coerce.number().positive().optional().nullable(),
  temperature: z.coerce.number().positive().optional().nullable(),
  notes: z.string().optional(),
});

export const medicationLogSchema = z.object({
  medicationId: z.string().min(1),
  taken: z.boolean(),
  notes: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type DischargePlanInput = z.infer<typeof dischargePlanSchema>;
export type VitalLogInput = z.infer<typeof vitalLogSchema>;
export type MedicationLogInput = z.infer<typeof medicationLogSchema>;
