-- ============================================================
-- RecoverPath — Supabase Database Setup Script
-- ============================================================
-- Run this in the Supabase SQL Editor:
--   Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- 1. CREATE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS "User" (
    "id"           TEXT PRIMARY KEY,
    "email"        TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "role"         TEXT NOT NULL,  -- 'HOSPITAL' or 'PATIENT'
    "name"         TEXT NOT NULL,
    "phone"        TEXT,
    "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Hospital" (
    "id"        TEXT PRIMARY KEY,
    "name"      TEXT NOT NULL,
    "address"   TEXT,
    "userId"    TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "Hospital_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Patient" (
    "id"          TEXT PRIMARY KEY,
    "name"        TEXT NOT NULL,
    "dateOfBirth" TIMESTAMPTZ,
    "phone"       TEXT,
    "userId"      TEXT NOT NULL UNIQUE,
    "hospitalId"  TEXT,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Patient_hospitalId_fkey" FOREIGN KEY ("hospitalId")
        REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "DischargePlan" (
    "id"                   TEXT PRIMARY KEY,
    "dischargeDate"        TIMESTAMPTZ NOT NULL,
    "diagnosis"            TEXT NOT NULL,
    "instructions"         TEXT NOT NULL,
    "activityRestrictions" TEXT,
    "followUpDate"         TIMESTAMPTZ,
    "patientId"            TEXT NOT NULL,
    "hospitalId"           TEXT NOT NULL,
    "createdAt"            TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"            TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "DischargePlan_patientId_fkey" FOREIGN KEY ("patientId")
        REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DischargePlan_hospitalId_fkey" FOREIGN KEY ("hospitalId")
        REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Medication" (
    "id"              TEXT PRIMARY KEY,
    "name"            TEXT NOT NULL,
    "dosage"          TEXT NOT NULL,
    "frequency"       TEXT NOT NULL,
    "startDate"       TIMESTAMPTZ NOT NULL,
    "endDate"         TIMESTAMPTZ,
    "dischargePlanId" TEXT,
    "patientId"       TEXT,
    "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "Medication_dischargePlanId_fkey" FOREIGN KEY ("dischargePlanId")
        REFERENCES "DischargePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Medication_patientId_fkey" FOREIGN KEY ("patientId")
        REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "VitalLog" (
    "id"                     TEXT PRIMARY KEY,
    "date"                   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "bloodPressureSystolic"  INTEGER,
    "bloodPressureDiastolic" INTEGER,
    "weight"                 DOUBLE PRECISION,
    "glucose"                DOUBLE PRECISION,
    "temperature"            DOUBLE PRECISION,
    "notes"                  TEXT,
    "patientId"              TEXT NOT NULL,
    "createdAt"              TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "VitalLog_patientId_fkey" FOREIGN KEY ("patientId")
        REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "MedicationLog" (
    "id"           TEXT PRIMARY KEY,
    "date"         TIMESTAMPTZ NOT NULL DEFAULT now(),
    "taken"        BOOLEAN NOT NULL DEFAULT false,
    "notes"        TEXT,
    "patientId"    TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "MedicationLog_patientId_fkey" FOREIGN KEY ("patientId")
        REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MedicationLog_medicationId_fkey" FOREIGN KEY ("medicationId")
        REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MedicationLog_patientId_medicationId_date_key"
        UNIQUE ("patientId", "medicationId", "date")
);

-- 2. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS "Hospital_userId_idx" ON "Hospital"("userId");
CREATE INDEX IF NOT EXISTS "Patient_userId_idx" ON "Patient"("userId");
CREATE INDEX IF NOT EXISTS "Patient_hospitalId_idx" ON "Patient"("hospitalId");
CREATE INDEX IF NOT EXISTS "DischargePlan_patientId_idx" ON "DischargePlan"("patientId");
CREATE INDEX IF NOT EXISTS "DischargePlan_hospitalId_idx" ON "DischargePlan"("hospitalId");
CREATE INDEX IF NOT EXISTS "Medication_dischargePlanId_idx" ON "Medication"("dischargePlanId");
CREATE INDEX IF NOT EXISTS "Medication_patientId_idx" ON "Medication"("patientId");
CREATE INDEX IF NOT EXISTS "VitalLog_patientId_idx" ON "VitalLog"("patientId");
CREATE INDEX IF NOT EXISTS "VitalLog_date_idx" ON "VitalLog"("date");
CREATE INDEX IF NOT EXISTS "MedicationLog_patientId_idx" ON "MedicationLog"("patientId");
CREATE INDEX IF NOT EXISTS "MedicationLog_medicationId_idx" ON "MedicationLog"("medicationId");
CREATE INDEX IF NOT EXISTS "MedicationLog_date_idx" ON "MedicationLog"("date");

SELECT 'Tables and indexes created successfully!' AS status;
