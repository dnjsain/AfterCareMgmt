import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const password = await hash("password123", 12);

  // ── 5 Hospitals ──────────────────────────────────────────────────
  const hospitals = await Promise.all(
    [
      { name: "Overlook Medical Center", address: "99 Beauvoir Ave, Summit, NJ 07901", email: "admin@overlook.med", userName: "Dr. Anika Sharma" },
      { name: "Apollo Hospital Mumbai", address: "21 Greams Lane, Navi Mumbai, MH 400703", email: "admin@apollo.med", userName: "Dr. Rajesh Patel" },
      { name: "Fortis Healthcare Delhi", address: "Sector 62, Phase VIII, Mohali, Punjab", email: "admin@fortis.med", userName: "Dr. Priya Kapoor" },
      { name: "AIIMS New Delhi", address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029", email: "admin@aiims.med", userName: "Dr. Vikram Singh" },
      { name: "Manipal Hospital Bangalore", address: "98 HAL Old Airport Rd, Bangalore 560017", email: "admin@manipal.med", userName: "Dr. Meera Rao" },
    ].map(async (h) => {
      const user = await prisma.user.create({
        data: {
          email: h.email,
          passwordHash: password,
          role: "HOSPITAL",
          name: h.userName,
          phone: "+91 " + Math.floor(7000000000 + Math.random() * 2999999999),
          hospital: {
            create: {
              name: h.name,
              address: h.address,
            },
          },
        },
        include: { hospital: true },
      });
      console.log(`  Hospital: ${h.name} (login: ${h.email})`);
      return user;
    })
  );

  const hospitalIds = hospitals.map((h) => h.hospital!.id);

  // ── 10 Patients ──────────────────────────────────────────────────
  const patientData = [
    { name: "Arjun Mehta", email: "arjun@patient.com", phone: "+91 9876543210", dob: "1985-03-15" },
    { name: "Sneha Reddy", email: "sneha@patient.com", phone: "+91 9876543211", dob: "1992-07-22" },
    { name: "Rahul Gupta", email: "rahul@patient.com", phone: "+91 9876543212", dob: "1978-11-08" },
    { name: "Priya Nair", email: "priya@patient.com", phone: "+91 9876543213", dob: "1990-01-30" },
    { name: "Amit Joshi", email: "amit@patient.com", phone: "+91 9876543214", dob: "1968-06-12" },
    { name: "Kavita Desai", email: "kavita@patient.com", phone: "+91 9876543215", dob: "1955-09-25" },
    { name: "Vikash Kumar", email: "vikash@patient.com", phone: "+91 9876543216", dob: "2000-04-18" },
    { name: "Ananya Iyer", email: "ananya@patient.com", phone: "+91 9876543217", dob: "1988-12-03" },
    { name: "Deepak Sharma", email: "deepak@patient.com", phone: "+91 9876543218", dob: "1972-08-20" },
    { name: "Ritu Verma", email: "ritu@patient.com", phone: "+91 9876543219", dob: "1995-05-11" },
  ];

  const patients = await Promise.all(
    patientData.map(async (p, i) => {
      const user = await prisma.user.create({
        data: {
          email: p.email,
          passwordHash: password,
          role: "PATIENT",
          name: p.name,
          phone: p.phone,
          patient: {
            create: {
              name: p.name,
              phone: p.phone,
              dateOfBirth: new Date(p.dob),
              hospitalId: hospitalIds[i % hospitalIds.length], // distribute across hospitals
            },
          },
        },
        include: { patient: true },
      });
      console.log(`  Patient: ${p.name} (login: ${p.email}) → Hospital #${(i % 5) + 1}`);
      return user;
    })
  );

  // ── Discharge Plans with Medications ─────────────────────────────
  const diagnoses = [
    {
      diagnosis: "Acute Myocardial Infarction",
      instructions: "Rest for 2 weeks. Avoid heavy lifting. Follow cardiac rehabilitation program. Monitor blood pressure twice daily. Low-sodium diet recommended.",
      restrictions: "No strenuous exercise for 6 weeks. No driving for 2 weeks. Avoid climbing stairs excessively.",
      meds: [
        { name: "Aspirin", dosage: "81mg", frequency: "Once daily" },
        { name: "Metoprolol", dosage: "50mg", frequency: "Twice daily" },
        { name: "Atorvastatin", dosage: "40mg", frequency: "Once daily at bedtime" },
      ],
    },
    {
      diagnosis: "Type 2 Diabetes - Hyperglycemic Episode",
      instructions: "Monitor blood glucose 4 times daily. Follow prescribed meal plan. Stay hydrated. Walk 30 minutes daily after meals.",
      restrictions: "Avoid sugary foods and beverages. No fasting without medical supervision.",
      meds: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily with meals" },
        { name: "Glimepiride", dosage: "2mg", frequency: "Once daily before breakfast" },
      ],
    },
    {
      diagnosis: "Pneumonia - Community Acquired",
      instructions: "Complete full course of antibiotics. Rest adequately. Drink 2-3 liters of water daily. Use incentive spirometer 10 times hourly while awake.",
      restrictions: "No smoking. Avoid crowded places for 1 week. No swimming for 2 weeks.",
      meds: [
        { name: "Amoxicillin", dosage: "500mg", frequency: "Three times daily" },
        { name: "Azithromycin", dosage: "250mg", frequency: "Once daily for 5 days" },
        { name: "Paracetamol", dosage: "500mg", frequency: "As needed, max 4 times daily" },
      ],
    },
    {
      diagnosis: "Hip Replacement Surgery - Post-Op",
      instructions: "Attend physiotherapy sessions 3x/week. Use walker for first 4 weeks. Ice the surgical area 20 min, 3x daily. Keep incision clean and dry.",
      restrictions: "No bending hip past 90 degrees. No crossing legs. No driving for 6 weeks. No lifting over 5 kg.",
      meds: [
        { name: "Enoxaparin", dosage: "40mg", frequency: "Once daily injection for 14 days" },
        { name: "Oxycodone", dosage: "5mg", frequency: "Every 6 hours as needed for pain" },
        { name: "Celecoxib", dosage: "200mg", frequency: "Once daily" },
      ],
    },
    {
      diagnosis: "Congestive Heart Failure Exacerbation",
      instructions: "Weigh yourself every morning before breakfast. Report weight gain >1 kg in a day. Restrict fluid intake to 1.5L/day. Low-sodium diet strictly.",
      restrictions: "No added salt. Limit physical exertion. Elevate legs when sitting.",
      meds: [
        { name: "Furosemide", dosage: "40mg", frequency: "Once daily in morning" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
        { name: "Carvedilol", dosage: "12.5mg", frequency: "Twice daily" },
        { name: "Spironolactone", dosage: "25mg", frequency: "Once daily" },
      ],
    },
    {
      diagnosis: "Appendectomy - Laparoscopic",
      instructions: "Keep incision sites clean. Shower after 48 hours but no bathing/swimming for 2 weeks. Gradually resume normal diet. Walk daily.",
      restrictions: "No heavy lifting >10 lbs for 2 weeks. No vigorous exercise for 4 weeks.",
      meds: [
        { name: "Ibuprofen", dosage: "400mg", frequency: "Three times daily with food" },
        { name: "Ciprofloxacin", dosage: "500mg", frequency: "Twice daily for 7 days" },
      ],
    },
    {
      diagnosis: "Stroke - Ischemic (Minor)",
      instructions: "Speech therapy 3x/week. Occupational therapy 2x/week. Monitor blood pressure daily. Follow DASH diet. No alcohol.",
      restrictions: "No driving until cleared by neurologist. Supervision when using stairs. Fall precautions at home.",
      meds: [
        { name: "Clopidogrel", dosage: "75mg", frequency: "Once daily" },
        { name: "Atorvastatin", dosage: "80mg", frequency: "Once daily at bedtime" },
        { name: "Amlodipine", dosage: "5mg", frequency: "Once daily" },
      ],
    },
    {
      diagnosis: "Chronic Kidney Disease - Stage 3",
      instructions: "Low-protein diet (0.8g/kg/day). Limit potassium and phosphorus intake. Stay hydrated but don't overdrink. Monthly blood work required.",
      restrictions: "Avoid NSAIDs (ibuprofen, naproxen). No herbal supplements without doctor approval.",
      meds: [
        { name: "Sodium Bicarbonate", dosage: "650mg", frequency: "Three times daily" },
        { name: "Calcitriol", dosage: "0.25mcg", frequency: "Once daily" },
      ],
    },
    {
      diagnosis: "Asthma Exacerbation - Severe",
      instructions: "Use peak flow meter twice daily. Avoid known triggers (dust, pollen, smoke). Follow asthma action plan. Rinse mouth after inhaler use.",
      restrictions: "No exposure to smoke or strong fumes. Avoid cold air without mask.",
      meds: [
        { name: "Prednisolone", dosage: "40mg", frequency: "Once daily for 5 days" },
        { name: "Salbutamol Inhaler", dosage: "2 puffs", frequency: "Every 4-6 hours as needed" },
        { name: "Fluticasone Inhaler", dosage: "250mcg", frequency: "Twice daily" },
      ],
    },
    {
      diagnosis: "Gastric Ulcer - H. pylori Positive",
      instructions: "Complete full course of triple therapy. Avoid spicy food, caffeine, alcohol. Eat small frequent meals. No aspirin or NSAIDs.",
      restrictions: "No smoking. No alcohol for 4 weeks. Avoid late-night eating.",
      meds: [
        { name: "Omeprazole", dosage: "20mg", frequency: "Twice daily before meals" },
        { name: "Amoxicillin", dosage: "1000mg", frequency: "Twice daily for 14 days" },
        { name: "Clarithromycin", dosage: "500mg", frequency: "Twice daily for 14 days" },
      ],
    },
  ];

  const allMedications: { id: string; patientId: string }[] = [];

  for (let i = 0; i < patients.length; i++) {
    const patient = patients[i].patient!;
    const d = diagnoses[i];
    const hospIdx = i % hospitalIds.length;
    const daysAgo = Math.floor(Math.random() * 20) + 5; // discharged 5-25 days ago
    const dischargeDate = new Date();
    dischargeDate.setDate(dischargeDate.getDate() - daysAgo);
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + Math.floor(Math.random() * 20) + 5);

    const plan = await prisma.dischargePlan.create({
      data: {
        patientId: patient.id,
        hospitalId: hospitalIds[hospIdx],
        dischargeDate,
        diagnosis: d.diagnosis,
        instructions: d.instructions,
        activityRestrictions: d.restrictions,
        followUpDate,
        medications: {
          create: d.meds.map((m) => ({
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency,
            startDate: dischargeDate,
            endDate: null,
          })),
        },
      },
      include: { medications: true },
    });

    for (const med of plan.medications) {
      allMedications.push({ id: med.id, patientId: patient.id });
    }

    console.log(`  Discharge plan: ${d.diagnosis} → ${patientData[i].name}`);
  }

  // ── Vital Logs (5-15 per patient over the last 2 weeks) ──────────
  console.log("\nGenerating vital logs...");

  for (const p of patients) {
    const patient = p.patient!;
    const numEntries = Math.floor(Math.random() * 11) + 5; // 5-15 entries

    for (let j = 0; j < numEntries; j++) {
      const daysAgo = Math.floor(Math.random() * 14);
      const logDate = new Date();
      logDate.setDate(logDate.getDate() - daysAgo);
      logDate.setHours(8 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60));

      await prisma.vitalLog.create({
        data: {
          patientId: patient.id,
          date: logDate,
          bloodPressureSystolic: 110 + Math.floor(Math.random() * 40),  // 110-150
          bloodPressureDiastolic: 65 + Math.floor(Math.random() * 25),  // 65-90
          weight: parseFloat((55 + Math.random() * 35).toFixed(1)),     // 55-90 kg
          glucose: parseFloat((80 + Math.random() * 80).toFixed(1)),    // 80-160 mg/dL
          temperature: parseFloat((97.5 + Math.random() * 2.5).toFixed(1)), // 97.5-100°F
          notes: j === 0 ? "Feeling better today" : j === 1 ? "Slight headache in the morning" : null,
        },
      });
    }
    console.log(`  ${numEntries} vital logs → ${patientData[patients.indexOf(p)].name}`);
  }

  // ── Medication Logs (per patient, last 7 days) ───────────────────
  console.log("\nGenerating medication logs...");

  for (const p of patients) {
    const patient = p.patient!;
    const patientMeds = allMedications.filter((m) => m.patientId === patient.id);

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const logDate = new Date();
      logDate.setDate(logDate.getDate() - dayOffset);
      logDate.setHours(0, 0, 0, 0);

      for (const med of patientMeds) {
        // 80% chance of taken, 20% missed
        const taken = Math.random() < 0.8;
        await prisma.medicationLog.create({
          data: {
            patientId: patient.id,
            medicationId: med.id,
            date: logDate,
            taken,
            notes: !taken && dayOffset === 0 ? "Forgot to take" : null,
          },
        });
      }
    }
    console.log(`  7 days of med logs (${patientMeds.length} meds) → ${patientData[patients.indexOf(p)].name}`);
  }

  console.log("\n✅ Seeding complete!");
  console.log("\n── Login Credentials ────────────────────────────");
  console.log("Password for ALL accounts: password123\n");
  console.log("HOSPITALS:");
  hospitals.forEach((h) => {
    console.log(`  ${h.hospital!.name}: ${h.email}`);
  });
  console.log("\nPATIENTS:");
  patientData.forEach((p) => {
    console.log(`  ${p.name}: ${p.email}`);
  });
  console.log("─────────────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
