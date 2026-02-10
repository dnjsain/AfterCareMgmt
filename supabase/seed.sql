-- ============================================================
-- RecoverPath — Supabase Seed Data
-- ============================================================
-- Run this AFTER setup.sql in the Supabase SQL Editor.
-- All accounts use password: password123
-- (bcrypt hash below = "password123" with 12 rounds)
-- ============================================================

-- Password hash for "password123"
DO $$
DECLARE
    pw TEXT := '$2a$12$/f3YOQp6SGAtQY3VwSxG3OOefGaqTbCIxEwMOrV30LGJXZiPzViGS';

    -- Hospital user IDs
    h1_uid TEXT := 'usr_hosp_overlook';
    h2_uid TEXT := 'usr_hosp_apollo';
    h3_uid TEXT := 'usr_hosp_fortis';
    h4_uid TEXT := 'usr_hosp_aiims';
    h5_uid TEXT := 'usr_hosp_manipal';

    -- Hospital IDs
    h1_id TEXT := 'hosp_overlook';
    h2_id TEXT := 'hosp_apollo';
    h3_id TEXT := 'hosp_fortis';
    h4_id TEXT := 'hosp_aiims';
    h5_id TEXT := 'hosp_manipal';

    -- Patient user IDs
    p1_uid TEXT := 'usr_pat_arjun';
    p2_uid TEXT := 'usr_pat_sneha';
    p3_uid TEXT := 'usr_pat_rahul';
    p4_uid TEXT := 'usr_pat_priya';
    p5_uid TEXT := 'usr_pat_amit';
    p6_uid TEXT := 'usr_pat_kavita';
    p7_uid TEXT := 'usr_pat_vikash';
    p8_uid TEXT := 'usr_pat_ananya';
    p9_uid TEXT := 'usr_pat_deepak';
    p10_uid TEXT := 'usr_pat_ritu';

    -- Patient IDs
    p1_id TEXT := 'pat_arjun';
    p2_id TEXT := 'pat_sneha';
    p3_id TEXT := 'pat_rahul';
    p4_id TEXT := 'pat_priya';
    p5_id TEXT := 'pat_amit';
    p6_id TEXT := 'pat_kavita';
    p7_id TEXT := 'pat_vikash';
    p8_id TEXT := 'pat_ananya';
    p9_id TEXT := 'pat_deepak';
    p10_id TEXT := 'pat_ritu';

    -- Discharge plan IDs
    dp1 TEXT := 'dp_arjun';
    dp2 TEXT := 'dp_sneha';
    dp3 TEXT := 'dp_rahul';
    dp4 TEXT := 'dp_priya';
    dp5 TEXT := 'dp_amit';
    dp6 TEXT := 'dp_kavita';
    dp7 TEXT := 'dp_vikash';
    dp8 TEXT := 'dp_ananya';
    dp9 TEXT := 'dp_deepak';
    dp10 TEXT := 'dp_ritu';

BEGIN

-- ── HOSPITALS ──────────────────────────────────────────────

INSERT INTO "User" ("id","email","passwordHash","role","name","phone","createdAt","updatedAt") VALUES
(h1_uid, 'admin@overlook.med',  pw, 'HOSPITAL', 'Dr. Anika Sharma',  '+91 7012345678', now(), now()),
(h2_uid, 'admin@apollo.med',    pw, 'HOSPITAL', 'Dr. Rajesh Patel',  '+91 7112345678', now(), now()),
(h3_uid, 'admin@fortis.med',    pw, 'HOSPITAL', 'Dr. Priya Kapoor',  '+91 7212345678', now(), now()),
(h4_uid, 'admin@aiims.med',     pw, 'HOSPITAL', 'Dr. Vikram Singh',  '+91 7312345678', now(), now()),
(h5_uid, 'admin@manipal.med',   pw, 'HOSPITAL', 'Dr. Meera Rao',     '+91 7412345678', now(), now());

INSERT INTO "Hospital" ("id","name","address","userId","createdAt","updatedAt") VALUES
(h1_id, 'Overlook Medical Center',    '99 Beauvoir Ave, Summit, NJ 07901',           h1_uid, now(), now()),
(h2_id, 'Apollo Hospital Mumbai',      '21 Greams Lane, Navi Mumbai, MH 400703',     h2_uid, now(), now()),
(h3_id, 'Fortis Healthcare Delhi',     'Sector 62, Phase VIII, Mohali, Punjab',       h3_uid, now(), now()),
(h4_id, 'AIIMS New Delhi',             'Sri Aurobindo Marg, Ansari Nagar, Delhi',     h4_uid, now(), now()),
(h5_id, 'Manipal Hospital Bangalore',  '98 HAL Old Airport Rd, Bangalore 560017',    h5_uid, now(), now());

-- ── PATIENTS ───────────────────────────────────────────────

INSERT INTO "User" ("id","email","passwordHash","role","name","phone","createdAt","updatedAt") VALUES
(p1_uid,  'arjun@patient.com',  pw, 'PATIENT', 'Arjun Mehta',    '+91 9876543210', now(), now()),
(p2_uid,  'sneha@patient.com',  pw, 'PATIENT', 'Sneha Reddy',    '+91 9876543211', now(), now()),
(p3_uid,  'rahul@patient.com',  pw, 'PATIENT', 'Rahul Gupta',    '+91 9876543212', now(), now()),
(p4_uid,  'priya@patient.com',  pw, 'PATIENT', 'Priya Nair',     '+91 9876543213', now(), now()),
(p5_uid,  'amit@patient.com',   pw, 'PATIENT', 'Amit Joshi',     '+91 9876543214', now(), now()),
(p6_uid,  'kavita@patient.com', pw, 'PATIENT', 'Kavita Desai',   '+91 9876543215', now(), now()),
(p7_uid,  'vikash@patient.com', pw, 'PATIENT', 'Vikash Kumar',   '+91 9876543216', now(), now()),
(p8_uid,  'ananya@patient.com', pw, 'PATIENT', 'Ananya Iyer',    '+91 9876543217', now(), now()),
(p9_uid,  'deepak@patient.com', pw, 'PATIENT', 'Deepak Sharma',  '+91 9876543218', now(), now()),
(p10_uid, 'ritu@patient.com',   pw, 'PATIENT', 'Ritu Verma',     '+91 9876543219', now(), now());

INSERT INTO "Patient" ("id","name","dateOfBirth","phone","userId","hospitalId","createdAt","updatedAt") VALUES
(p1_id,  'Arjun Mehta',   '1985-03-15', '+91 9876543210', p1_uid,  h1_id, now(), now()),
(p2_id,  'Sneha Reddy',   '1992-07-22', '+91 9876543211', p2_uid,  h2_id, now(), now()),
(p3_id,  'Rahul Gupta',   '1978-11-08', '+91 9876543212', p3_uid,  h3_id, now(), now()),
(p4_id,  'Priya Nair',    '1990-01-30', '+91 9876543213', p4_uid,  h4_id, now(), now()),
(p5_id,  'Amit Joshi',    '1968-06-12', '+91 9876543214', p5_uid,  h5_id, now(), now()),
(p6_id,  'Kavita Desai',  '1955-09-25', '+91 9876543215', p6_uid,  h1_id, now(), now()),
(p7_id,  'Vikash Kumar',  '2000-04-18', '+91 9876543216', p7_uid,  h2_id, now(), now()),
(p8_id,  'Ananya Iyer',   '1988-12-03', '+91 9876543217', p8_uid,  h3_id, now(), now()),
(p9_id,  'Deepak Sharma', '1972-08-20', '+91 9876543218', p9_uid,  h4_id, now(), now()),
(p10_id, 'Ritu Verma',    '1995-05-11', '+91 9876543219', p10_uid, h5_id, now(), now());

-- ── DISCHARGE PLANS ────────────────────────────────────────

INSERT INTO "DischargePlan" ("id","dischargeDate","diagnosis","instructions","activityRestrictions","followUpDate","patientId","hospitalId","createdAt","updatedAt") VALUES
(dp1,  now()-interval '15 days', 'Acute Myocardial Infarction',
  'Rest for 2 weeks. Avoid heavy lifting. Follow cardiac rehab. Monitor BP twice daily. Low-sodium diet.',
  'No strenuous exercise for 6 weeks. No driving for 2 weeks.',
  now()+interval '15 days', p1_id, h1_id, now(), now()),

(dp2,  now()-interval '10 days', 'Type 2 Diabetes - Hyperglycemic Episode',
  'Monitor blood glucose 4 times daily. Follow prescribed meal plan. Stay hydrated. Walk 30 min daily.',
  'Avoid sugary foods and beverages. No fasting without supervision.',
  now()+interval '20 days', p2_id, h2_id, now(), now()),

(dp3,  now()-interval '8 days', 'Pneumonia - Community Acquired',
  'Complete full course of antibiotics. Rest adequately. Drink 2-3L water daily. Use incentive spirometer.',
  'No smoking. Avoid crowded places for 1 week.',
  now()+interval '22 days', p3_id, h3_id, now(), now()),

(dp4,  now()-interval '20 days', 'Hip Replacement Surgery - Post-Op',
  'Attend physiotherapy 3x/week. Use walker for 4 weeks. Ice surgical area 20 min, 3x daily.',
  'No bending hip past 90 degrees. No driving for 6 weeks. No lifting over 5 kg.',
  now()+interval '10 days', p4_id, h4_id, now(), now()),

(dp5,  now()-interval '12 days', 'Congestive Heart Failure Exacerbation',
  'Weigh yourself every morning. Report weight gain >1 kg/day. Restrict fluid to 1.5L/day. Low-sodium diet.',
  'No added salt. Limit physical exertion. Elevate legs when sitting.',
  now()+interval '18 days', p5_id, h5_id, now(), now()),

(dp6,  now()-interval '7 days', 'Appendectomy - Laparoscopic',
  'Keep incision sites clean. Shower after 48 hours. Gradually resume normal diet. Walk daily.',
  'No heavy lifting >10 lbs for 2 weeks. No vigorous exercise for 4 weeks.',
  now()+interval '23 days', p6_id, h1_id, now(), now()),

(dp7,  now()-interval '18 days', 'Stroke - Ischemic (Minor)',
  'Speech therapy 3x/week. Occupational therapy 2x/week. Monitor BP daily. Follow DASH diet.',
  'No driving until cleared by neurologist. Supervision on stairs.',
  now()+interval '12 days', p7_id, h2_id, now(), now()),

(dp8,  now()-interval '14 days', 'Chronic Kidney Disease - Stage 3',
  'Low-protein diet (0.8g/kg/day). Limit potassium and phosphorus. Stay hydrated. Monthly blood work.',
  'Avoid NSAIDs. No herbal supplements without doctor approval.',
  now()+interval '16 days', p8_id, h3_id, now(), now()),

(dp9,  now()-interval '6 days', 'Asthma Exacerbation - Severe',
  'Use peak flow meter twice daily. Avoid triggers. Follow asthma action plan. Rinse mouth after inhaler.',
  'No exposure to smoke or strong fumes. Avoid cold air without mask.',
  now()+interval '24 days', p9_id, h4_id, now(), now()),

(dp10, now()-interval '11 days', 'Gastric Ulcer - H. pylori Positive',
  'Complete triple therapy course. Avoid spicy food, caffeine, alcohol. Eat small frequent meals.',
  'No smoking. No alcohol for 4 weeks. Avoid late-night eating.',
  now()+interval '19 days', p10_id, h5_id, now(), now());

-- ── MEDICATIONS ────────────────────────────────────────────

-- Arjun - Heart attack meds
INSERT INTO "Medication" ("id","name","dosage","frequency","startDate","dischargePlanId","createdAt","updatedAt") VALUES
('med_01', 'Aspirin',       '81mg',  'Once daily',              now()-interval '15 days', dp1, now(), now()),
('med_02', 'Metoprolol',    '50mg',  'Twice daily',             now()-interval '15 days', dp1, now(), now()),
('med_03', 'Atorvastatin',  '40mg',  'Once daily at bedtime',   now()-interval '15 days', dp1, now(), now());

-- Sneha - Diabetes meds
INSERT INTO "Medication" ("id","name","dosage","frequency","startDate","dischargePlanId","createdAt","updatedAt") VALUES
('med_04', 'Metformin',     '500mg', 'Twice daily with meals',         now()-interval '10 days', dp2, now(), now()),
('med_05', 'Glimepiride',   '2mg',   'Once daily before breakfast',    now()-interval '10 days', dp2, now(), now());

-- Rahul - Pneumonia meds
INSERT INTO "Medication" ("id","name","dosage","frequency","startDate","dischargePlanId","createdAt","updatedAt") VALUES
('med_06', 'Amoxicillin',   '500mg',  'Three times daily',   now()-interval '8 days', dp3, now(), now()),
('med_07', 'Azithromycin',  '250mg',  'Once daily for 5 days', now()-interval '8 days', dp3, now(), now()),
('med_08', 'Paracetamol',   '500mg',  'As needed, max 4x/day', now()-interval '8 days', dp3, now(), now());

-- Priya - Hip replacement meds
INSERT INTO "Medication" ("id","name","dosage","frequency","startDate","dischargePlanId","createdAt","updatedAt") VALUES
('med_09', 'Enoxaparin',  '40mg',  'Once daily injection for 14 days', now()-interval '20 days', dp4, now(), now()),
('med_10', 'Oxycodone',   '5mg',   'Every 6 hours as needed',         now()-interval '20 days', dp4, now(), now()),
('med_11', 'Celecoxib',   '200mg', 'Once daily',                      now()-interval '20 days', dp4, now(), now());

-- Amit - Heart failure meds
INSERT INTO "Medication" ("id","name","dosage","frequency","startDate","dischargePlanId","createdAt","updatedAt") VALUES
('med_12', 'Furosemide',      '40mg',   'Once daily in morning', now()-interval '12 days', dp5, now(), now()),
('med_13', 'Lisinopril',      '10mg',   'Once daily',            now()-interval '12 days', dp5, now(), now()),
('med_14', 'Carvedilol',      '12.5mg', 'Twice daily',           now()-interval '12 days', dp5, now(), now()),
('med_15', 'Spironolactone',  '25mg',   'Once daily',            now()-interval '12 days', dp5, now(), now());

-- Kavita - Appendectomy meds
INSERT INTO "Medication" ("id","name","dosage","frequency","startDate","dischargePlanId","createdAt","updatedAt") VALUES
('med_16', 'Ibuprofen',      '400mg', 'Three times daily with food',  now()-interval '7 days', dp6, now(), now()),
('med_17', 'Ciprofloxacin',  '500mg', 'Twice daily for 7 days',      now()-interval '7 days', dp6, now(), now());

-- Vikash - Stroke meds
INSERT INTO "Medication" ("id","name","dosage","frequency","startDate","dischargePlanId","createdAt","updatedAt") VALUES
('med_18', 'Clopidogrel',   '75mg', 'Once daily',            now()-interval '18 days', dp7, now(), now()),
('med_19', 'Atorvastatin',  '80mg', 'Once daily at bedtime', now()-interval '18 days', dp7, now(), now()),
('med_20', 'Amlodipine',    '5mg',  'Once daily',            now()-interval '18 days', dp7, now(), now());

-- Ananya - Kidney disease meds
INSERT INTO "Medication" ("id","name","dosage","frequency","startDate","dischargePlanId","createdAt","updatedAt") VALUES
('med_21', 'Sodium Bicarbonate', '650mg',   'Three times daily', now()-interval '14 days', dp8, now(), now()),
('med_22', 'Calcitriol',         '0.25mcg', 'Once daily',        now()-interval '14 days', dp8, now(), now());

-- Deepak - Asthma meds
INSERT INTO "Medication" ("id","name","dosage","frequency","startDate","dischargePlanId","createdAt","updatedAt") VALUES
('med_23', 'Prednisolone',        '40mg',    'Once daily for 5 days', now()-interval '6 days', dp9, now(), now()),
('med_24', 'Salbutamol Inhaler',  '2 puffs', 'Every 4-6 hours PRN',  now()-interval '6 days', dp9, now(), now()),
('med_25', 'Fluticasone Inhaler', '250mcg',  'Twice daily',           now()-interval '6 days', dp9, now(), now());

-- Ritu - Ulcer meds
INSERT INTO "Medication" ("id","name","dosage","frequency","startDate","dischargePlanId","createdAt","updatedAt") VALUES
('med_26', 'Omeprazole',      '20mg',   'Twice daily before meals',  now()-interval '11 days', dp10, now(), now()),
('med_27', 'Amoxicillin',     '1000mg', 'Twice daily for 14 days',   now()-interval '11 days', dp10, now(), now()),
('med_28', 'Clarithromycin',  '500mg',  'Twice daily for 14 days',   now()-interval '11 days', dp10, now(), now());

-- ── VITAL LOGS (sample data for each patient) ─────────────

-- Helper: generate vitals for each patient over the last 14 days
INSERT INTO "VitalLog" ("id","date","bloodPressureSystolic","bloodPressureDiastolic","weight","glucose","temperature","notes","patientId","createdAt")
SELECT
    'vl_' || p.pid || '_' || d.day_offset,
    now() - (d.day_offset || ' days')::interval + (floor(random()*4) || ' hours')::interval,
    110 + floor(random()*40)::int,
    65 + floor(random()*25)::int,
    round((55 + random()*35)::numeric, 1),
    round((80 + random()*80)::numeric, 1),
    round((97.5 + random()*2.5)::numeric, 1),
    CASE WHEN d.day_offset = 0 THEN 'Feeling better today'
         WHEN d.day_offset = 1 THEN 'Slight headache in the morning'
         ELSE NULL END,
    p.pid,
    now()
FROM
    (VALUES (p1_id),(p2_id),(p3_id),(p4_id),(p5_id),(p6_id),(p7_id),(p8_id),(p9_id),(p10_id)) AS p(pid),
    generate_series(0, 13) AS d(day_offset)
WHERE random() < 0.75;  -- ~75% chance per day = ~10 entries per patient

-- ── MEDICATION LOGS (last 7 days for each medication) ──────

INSERT INTO "MedicationLog" ("id","date","taken","notes","patientId","medicationId","createdAt")
SELECT
    'ml_' || m."id" || '_' || d.day_offset,
    (now() - (d.day_offset || ' days')::interval)::date,
    random() < 0.8,  -- 80% taken rate
    CASE WHEN random() < 0.1 THEN 'Forgot to take on time' ELSE NULL END,
    COALESCE(m."patientId", dp."patientId"),
    m."id",
    now()
FROM "Medication" m
LEFT JOIN "DischargePlan" dp ON dp."id" = m."dischargePlanId"
CROSS JOIN generate_series(0, 6) AS d(day_offset)
WHERE COALESCE(m."patientId", dp."patientId") IS NOT NULL;

END $$;

-- ── DONE ───────────────────────────────────────────────────

SELECT 'Seed data inserted successfully!' AS status;
SELECT
    (SELECT count(*) FROM "User") AS users,
    (SELECT count(*) FROM "Hospital") AS hospitals,
    (SELECT count(*) FROM "Patient") AS patients,
    (SELECT count(*) FROM "DischargePlan") AS discharge_plans,
    (SELECT count(*) FROM "Medication") AS medications,
    (SELECT count(*) FROM "VitalLog") AS vital_logs,
    (SELECT count(*) FROM "MedicationLog") AS medication_logs;
