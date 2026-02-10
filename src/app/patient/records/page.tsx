"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";

interface DischargePlan {
  id: string;
  dischargeDate: string;
  diagnosis: string;
  followUpDate: string | null;
  hospital: { name: string };
  medications: { id: string; name: string }[];
}

export default function RecordsPage() {
  const [plans, setPlans] = useState<DischargePlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/discharge-plans")
      .then((res) => res.json())
      .then((data) => {
        setPlans(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="My Records" subtitle="Your discharge plans and medical records" />

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading records...
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No discharge records yet. Your hospital will add them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <Link key={plan.id} href={`/patient/records/${plan.id}`}>
              <Card className="hover:border-primary/30 transition cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{plan.diagnosis}</div>
                      <div className="text-xs text-muted-foreground">
                        {plan.hospital.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Discharged:{" "}
                        {new Date(plan.dischargeDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {plan.medications.length} med
                      {plan.medications.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  {plan.followUpDate && (
                    <div className="mt-2 text-xs border-t border-border pt-2 text-muted-foreground">
                      Follow-up:{" "}
                      {new Date(plan.followUpDate).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
