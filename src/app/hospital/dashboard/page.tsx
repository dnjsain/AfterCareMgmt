"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Users, FileText, Plus, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";

interface PatientSummary {
  id: string;
  name: string;
  dischargePlans: { id: string; diagnosis: string; dischargeDate: string }[];
  _count: { vitalLogs: number; dischargePlans: number };
}

export default function HospitalDashboard() {
  const { data: session } = useSession();
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPatients = patients.length;
  const totalPlans = patients.reduce((sum, p) => sum + p._count.dischargePlans, 0);
  const totalVitals = patients.reduce((sum, p) => sum + p._count.vitalLogs, 0);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${session?.user?.name || "Doctor"}`}
        subtitle="Hospital Dashboard"
        action={
          <Link href="/hospital/discharge/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Discharge
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto text-primary mb-1" />
            <div className="text-2xl font-bold">{totalPatients}</div>
            <div className="text-xs text-muted-foreground">Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-5 w-5 mx-auto text-primary mb-1" />
            <div className="text-2xl font-bold">{totalPlans}</div>
            <div className="text-xs text-muted-foreground">Plans</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-5 w-5 mx-auto text-primary mb-1" />
            <div className="text-2xl font-bold">{totalVitals}</div>
            <div className="text-xs text-muted-foreground">Vital Logs</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Patients */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Patients</CardTitle>
            <Link
              href="/hospital/patients"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground py-8 text-center">
              Loading...
            </div>
          ) : patients.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">
              No patients yet. Create a discharge plan to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {patients.slice(0, 5).map((patient) => (
                <Link
                  key={patient.id}
                  href={`/hospital/patients/${patient.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent transition"
                >
                  <div>
                    <div className="font-medium text-sm">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {patient.dischargePlans[0]?.diagnosis || "No diagnosis yet"}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {patient._count.dischargePlans} plan
                    {patient._count.dischargePlans !== 1 ? "s" : ""}
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
