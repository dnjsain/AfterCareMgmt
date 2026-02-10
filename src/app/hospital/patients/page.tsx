"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";

interface Patient {
  id: string;
  name: string;
  phone: string | null;
  user: { email: string };
  dischargePlans: { id: string; diagnosis: string; dischargeDate: string }[];
  _count: { vitalLogs: number; dischargePlans: number };
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/patients?search=${encodeURIComponent(search)}`)
        .then((res) => res.json())
        .then((data) => {
          setPatients(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div>
      <PageHeader
        title="Patients"
        subtitle="Manage your patient records"
        action={
          <Link href="/hospital/discharge/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </Link>
        }
      />

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Patient list */}
      {loading ? (
        <div className="text-sm text-muted-foreground py-12 text-center">
          Loading patients...
        </div>
      ) : patients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {search ? "No patients match your search." : "No patients yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {patients.map((patient) => (
            <Link
              key={patient.id}
              href={`/hospital/patients/${patient.id}`}
            >
              <Card className="hover:border-primary/30 transition cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {patient.user.email}
                      </div>
                      {patient.phone && (
                        <div className="text-xs text-muted-foreground">
                          {patient.phone}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {patient._count.dischargePlans} plan{patient._count.dischargePlans !== 1 ? "s" : ""}
                      </Badge>
                      <Badge variant="outline">
                        {patient._count.vitalLogs} vitals
                      </Badge>
                    </div>
                  </div>
                  {patient.dischargePlans[0] && (
                    <div className="mt-2 text-xs text-muted-foreground border-t border-border pt-2">
                      Latest: {patient.dischargePlans[0].diagnosis} —{" "}
                      {new Date(patient.dischargePlans[0].dischargeDate).toLocaleDateString()}
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
