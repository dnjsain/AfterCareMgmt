"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Calendar, Pill, FileText, AlertTriangle } from "lucide-react";

interface DischargePlanDetail {
  id: string;
  dischargeDate: string;
  diagnosis: string;
  instructions: string;
  activityRestrictions: string | null;
  followUpDate: string | null;
  hospital: { name: string };
  medications: {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string | null;
  }[];
}

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<DischargePlanDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/discharge-plans/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlan(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Loading record...
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Record not found.
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={plan.diagnosis}
        subtitle={plan.hospital.name}
        backHref="/patient/records"
      />

      {/* Instructions */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm whitespace-pre-wrap">{plan.instructions}</div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Discharged</div>
              <div className="text-sm font-medium">
                {new Date(plan.dischargeDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Follow-Up</div>
              <div className="text-sm font-medium">
                {plan.followUpDate
                  ? new Date(plan.followUpDate).toLocaleDateString()
                  : "Not scheduled"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Restrictions */}
      {plan.activityRestrictions && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Activity Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm whitespace-pre-wrap">
              {plan.activityRestrictions}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Pill className="h-4 w-4 text-primary" />
            Medications ({plan.medications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {plan.medications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No medications prescribed.
            </p>
          ) : (
            <div className="space-y-3">
              {plan.medications.map((med) => (
                <div
                  key={med.id}
                  className="rounded-lg border border-border p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{med.name}</span>
                    <Badge variant="secondary">{med.dosage}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {med.frequency}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(med.startDate).toLocaleDateString()} —{" "}
                    {med.endDate
                      ? new Date(med.endDate).toLocaleDateString()
                      : "Ongoing"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
