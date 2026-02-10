"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

interface PatientOption {
  id: string;
  name: string;
}

interface MedEntry {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
}

export default function NewDischargePlanPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading...</div>}>
      <NewDischargePlanForm />
    </Suspense>
  );
}

function NewDischargePlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId") || "";

  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [patientId, setPatientId] = useState(preselectedPatientId);
  const [dischargeDate, setDischargeDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [diagnosis, setDiagnosis] = useState("");
  const [instructions, setInstructions] = useState("");
  const [activityRestrictions, setActivityRestrictions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [medications, setMedications] = useState<MedEntry[]>([
    { name: "", dosage: "", frequency: "", startDate: dischargeDate, endDate: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // New patient form
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientEmail, setNewPatientEmail] = useState("");
  const [newPatientPhone, setNewPatientPhone] = useState("");

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPatients(data);
      });
  }, []);

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", startDate: dischargeDate, endDate: "" },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof MedEntry, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleCreatePatient = async () => {
    if (!newPatientName || !newPatientEmail) return;
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPatientName,
          email: newPatientEmail,
          phone: newPatientPhone || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPatients([...patients, { id: data.id, name: data.name }]);
        setPatientId(data.id);
        setShowNewPatient(false);
        setNewPatientName("");
        setNewPatientEmail("");
        setNewPatientPhone("");
      }
    } catch {
      setError("Failed to create patient");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validMeds = medications.filter((m) => m.name && m.dosage && m.frequency);

    try {
      const res = await fetch("/api/discharge-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          dischargeDate,
          diagnosis,
          instructions,
          activityRestrictions: activityRestrictions || undefined,
          followUpDate: followUpDate || undefined,
          medications: validMeds.length > 0 ? validMeds : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create discharge plan");
        setLoading(false);
        return;
      }

      router.push(`/hospital/discharge/${data.id}`);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="New Discharge Plan"
        subtitle="Create a discharge plan for a patient"
        backHref="/hospital/dashboard"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Patient selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Patient</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="patient">Select Patient</Label>
              <select
                id="patient"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Choose a patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {!showNewPatient ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNewPatient(true)}
              >
                <Plus className="h-4 w-4" />
                Add New Patient
              </Button>
            ) : (
              <div className="space-y-2 rounded-lg border border-border p-3">
                <Input
                  placeholder="Patient name"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Patient email"
                  value={newPatientEmail}
                  onChange={(e) => setNewPatientEmail(e.target.value)}
                />
                <Input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={handleCreatePatient}>
                    Create Patient
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowNewPatient(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Discharge Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Discharge Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="dischargeDate">Discharge Date</Label>
              <Input
                id="dischargeDate"
                type="date"
                value={dischargeDate}
                onChange={(e) => setDischargeDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input
                id="diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Primary diagnosis"
                required
              />
            </div>
            <div>
              <Label htmlFor="instructions">Discharge Instructions</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Post-discharge care instructions..."
                required
              />
            </div>
            <div>
              <Label htmlFor="restrictions">Activity Restrictions (optional)</Label>
              <Textarea
                id="restrictions"
                value={activityRestrictions}
                onChange={(e) => setActivityRestrictions(e.target.value)}
                placeholder="Any activity restrictions..."
              />
            </div>
            <div>
              <Label htmlFor="followUp">Follow-Up Date (optional)</Label>
              <Input
                id="followUp"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Medications</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {medications.map((med, index) => (
              <div
                key={index}
                className="space-y-2 rounded-lg border border-border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Medication {index + 1}
                  </span>
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Input
                  placeholder="Medication name"
                  value={med.name}
                  onChange={(e) => updateMedication(index, "name", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Dosage (e.g. 500mg)"
                    value={med.dosage}
                    onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                  />
                  <Input
                    placeholder="Frequency (e.g. 2x daily)"
                    value={med.frequency}
                    onChange={(e) =>
                      updateMedication(index, "frequency", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Start Date</Label>
                    <Input
                      type="date"
                      value={med.startDate}
                      onChange={(e) =>
                        updateMedication(index, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">End Date (optional)</Label>
                    <Input
                      type="date"
                      value={med.endDate}
                      onChange={(e) =>
                        updateMedication(index, "endDate", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Plan...
            </>
          ) : (
            "Create Discharge Plan"
          )}
        </Button>
      </form>
    </div>
  );
}
