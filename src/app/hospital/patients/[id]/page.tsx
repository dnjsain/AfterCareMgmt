"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { FileText, Activity, Pill, Plus } from "lucide-react";

interface PatientDetail {
  id: string;
  name: string;
  phone: string | null;
  dateOfBirth: string | null;
  user: { email: string };
  hospital: { name: string } | null;
  dischargePlans: {
    id: string;
    diagnosis: string;
    dischargeDate: string;
    instructions: string;
    medications: { id: string; name: string; dosage: string; frequency: string }[];
  }[];
  vitalLogs: {
    id: string;
    date: string;
    bloodPressureSystolic: number | null;
    bloodPressureDiastolic: number | null;
    weight: number | null;
    glucose: number | null;
    temperature: number | null;
  }[];
  medicationLogs: {
    id: string;
    date: string;
    taken: boolean;
    medication: { name: string };
  }[];
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/patients/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPatient(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Loading patient details...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Patient not found.
      </div>
    );
  }

  const recentLogs = patient.medicationLogs.slice(0, 10);
  const adherenceRate =
    recentLogs.length > 0
      ? Math.round(
          (recentLogs.filter((l) => l.taken).length / recentLogs.length) * 100
        )
      : 0;

  return (
    <div>
      <PageHeader
        title={patient.name}
        subtitle={patient.user.email}
        backHref="/hospital/patients"
        action={
          <Link href={`/hospital/discharge/new?patientId=${patient.id}`}>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Discharge
            </Button>
          </Link>
        }
      />

      {/* Patient info */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card>
          <CardContent className="p-3 text-center">
            <FileText className="h-4 w-4 mx-auto text-primary mb-1" />
            <div className="text-lg font-bold">{patient.dischargePlans.length}</div>
            <div className="text-xs text-muted-foreground">Plans</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Activity className="h-4 w-4 mx-auto text-primary mb-1" />
            <div className="text-lg font-bold">{patient.vitalLogs.length}</div>
            <div className="text-xs text-muted-foreground">Vitals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Pill className="h-4 w-4 mx-auto text-primary mb-1" />
            <div className="text-lg font-bold">{adherenceRate}%</div>
            <div className="text-xs text-muted-foreground">Adherence</div>
          </CardContent>
        </Card>
      </div>

      {/* Discharge Plans */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Discharge Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {patient.dischargePlans.length === 0 ? (
            <p className="text-sm text-muted-foreground">No discharge plans yet.</p>
          ) : (
            <div className="space-y-3">
              {patient.dischargePlans.map((plan) => (
                <Link
                  key={plan.id}
                  href={`/hospital/discharge/${plan.id}`}
                  className="block rounded-lg border border-border p-3 hover:bg-accent transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm">{plan.diagnosis}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Discharged: {new Date(plan.dischargeDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {plan.medications.length} med{plan.medications.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Vitals */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          {patient.vitalLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No vitals logged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 pr-3">Date</th>
                    <th className="text-left py-2 pr-3">BP</th>
                    <th className="text-left py-2 pr-3">Weight</th>
                    <th className="text-left py-2 pr-3">Glucose</th>
                    <th className="text-left py-2">Temp</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.vitalLogs.slice(0, 10).map((v) => (
                    <tr key={v.id} className="border-b border-border/50">
                      <td className="py-2 pr-3">
                        {new Date(v.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 pr-3">
                        {v.bloodPressureSystolic && v.bloodPressureDiastolic
                          ? `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}`
                          : "—"}
                      </td>
                      <td className="py-2 pr-3">
                        {v.weight ? `${v.weight} kg` : "—"}
                      </td>
                      <td className="py-2 pr-3">
                        {v.glucose ? `${v.glucose} mg/dL` : "—"}
                      </td>
                      <td className="py-2">
                        {v.temperature ? `${v.temperature}°F` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medication Adherence */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Medication Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {patient.medicationLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No medication logs yet.</p>
          ) : (
            <div className="space-y-2">
              {patient.medicationLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between text-sm border-b border-border/50 pb-2"
                >
                  <div>
                    <span className="font-medium">{log.medication.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {new Date(log.date).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant={log.taken ? "success" : "destructive"}>
                    {log.taken ? "Taken" : "Missed"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
