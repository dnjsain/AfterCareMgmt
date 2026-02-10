"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Activity,
  Pill,
  Calendar,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";

interface DischargePlan {
  id: string;
  diagnosis: string;
  followUpDate: string | null;
  medications: { id: string; name: string; dosage: string; frequency: string }[];
}

interface VitalLog {
  id: string;
  date: string;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  weight: number | null;
  glucose: number | null;
  temperature: number | null;
}

interface MedLog {
  id: string;
  medicationId: string;
  taken: boolean;
  date: string;
  medication: { name: string; dosage: string; frequency: string };
}

export default function PatientDashboard() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<DischargePlan[]>([]);
  const [vitals, setVitals] = useState<VitalLog[]>([]);
  const [medLogs, setMedLogs] = useState<MedLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/discharge-plans").then((r) => r.json()),
      fetch("/api/vitals").then((r) => r.json()),
      fetch("/api/medication-logs").then((r) => r.json()),
    ])
      .then(([plansData, vitalsData, medLogsData]) => {
        setPlans(Array.isArray(plansData) ? plansData : []);
        setVitals(Array.isArray(vitalsData) ? vitalsData : []);
        setMedLogs(Array.isArray(medLogsData) ? medLogsData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const latestVital = vitals[0];
  const allMedications = plans.flatMap((p) => p.medications);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayLogs = medLogs.filter(
    (l) => l.date.split("T")[0] === todayStr
  );

  const upcomingFollowUp = plans
    .filter((p) => p.followUpDate && new Date(p.followUpDate) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime()
    )[0];

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Hi, ${session?.user?.name || "Patient"}`}
        subtitle="Your recovery dashboard"
      />

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/patient/vitals/log">
          <Card className="hover:border-primary/30 transition cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Log Vitals</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/medications">
          <Card className="hover:border-primary/30 transition cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Pill className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Medications</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Upcoming follow-up */}
      {upcomingFollowUp && (
        <Card className="mb-4 border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium">Upcoming Follow-Up</div>
              <div className="text-xs text-muted-foreground">
                {new Date(upcomingFollowUp.followUpDate!).toLocaleDateString(
                  "en-US",
                  { weekday: "long", month: "long", day: "numeric" }
                )}{" "}
                — {upcomingFollowUp.diagnosis}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's medication checklist */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Today&apos;s Medications</CardTitle>
            <Link
              href="/patient/medications"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {allMedications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No medications prescribed yet.
            </p>
          ) : (
            <div className="space-y-2">
              {allMedications.map((med) => {
                const todayLog = todayLogs.find(
                  (l) => l.medicationId === med.id
                );
                return (
                  <div
                    key={med.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <div className="text-sm font-medium">{med.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {med.dosage} &middot; {med.frequency}
                      </div>
                    </div>
                    {todayLog ? (
                      todayLog.taken ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Taken
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Missed
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest Vitals */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Latest Vitals</CardTitle>
            <Link
              href="/patient/vitals/history"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              History <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!latestVital ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">
                No vitals logged yet.
              </p>
              <Link href="/patient/vitals/log">
                <Button size="sm" variant="outline">
                  Log Your First Vitals
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {latestVital.bloodPressureSystolic && (
                <div className="rounded-lg bg-secondary p-3">
                  <div className="text-xs text-muted-foreground">Blood Pressure</div>
                  <div className="text-lg font-bold">
                    {latestVital.bloodPressureSystolic}/
                    {latestVital.bloodPressureDiastolic}
                  </div>
                  <div className="text-xs text-muted-foreground">mmHg</div>
                </div>
              )}
              {latestVital.weight && (
                <div className="rounded-lg bg-secondary p-3">
                  <div className="text-xs text-muted-foreground">Weight</div>
                  <div className="text-lg font-bold">{latestVital.weight}</div>
                  <div className="text-xs text-muted-foreground">kg</div>
                </div>
              )}
              {latestVital.glucose && (
                <div className="rounded-lg bg-secondary p-3">
                  <div className="text-xs text-muted-foreground">Glucose</div>
                  <div className="text-lg font-bold">{latestVital.glucose}</div>
                  <div className="text-xs text-muted-foreground">mg/dL</div>
                </div>
              )}
              {latestVital.temperature && (
                <div className="rounded-lg bg-secondary p-3">
                  <div className="text-xs text-muted-foreground">Temperature</div>
                  <div className="text-lg font-bold">{latestVital.temperature}</div>
                  <div className="text-xs text-muted-foreground">°F</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent records */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Discharge Records</CardTitle>
            <Link
              href="/patient/records"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No discharge records yet.
            </p>
          ) : (
            <div className="space-y-2">
              {plans.slice(0, 3).map((plan) => (
                <Link
                  key={plan.id}
                  href={`/patient/records/${plan.id}`}
                  className="block rounded-lg border border-border p-3 hover:bg-accent transition"
                >
                  <div className="font-medium text-sm">{plan.diagnosis}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {plan.medications.length} medication
                    {plan.medications.length !== 1 ? "s" : ""}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
