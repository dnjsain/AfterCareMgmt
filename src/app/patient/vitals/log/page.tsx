"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

export default function LogVitalsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <LogVitalsForm />
    </Suspense>
  );
}

function LogVitalsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [weight, setWeight] = useState("");
  const [glucose, setGlucose] = useState("");
  const [temperature, setTemperature] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load existing vital if editing
  useEffect(() => {
    if (editId) {
      fetch(`/api/vitals/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setSystolic(data.bloodPressureSystolic?.toString() || "");
            setDiastolic(data.bloodPressureDiastolic?.toString() || "");
            setWeight(data.weight?.toString() || "");
            setGlucose(data.glucose?.toString() || "");
            setTemperature(data.temperature?.toString() || "");
            setNotes(data.notes || "");
          }
          setFetching(false);
        })
        .catch(() => setFetching(false));
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      bloodPressureSystolic: systolic ? parseInt(systolic) : null,
      bloodPressureDiastolic: diastolic ? parseInt(diastolic) : null,
      weight: weight ? parseFloat(weight) : null,
      glucose: glucose ? parseFloat(glucose) : null,
      temperature: temperature ? parseFloat(temperature) : null,
      notes: notes || undefined,
    };

    try {
      const url = editId ? `/api/vitals/${editId}` : "/api/vitals";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save vitals");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/patient/vitals/history"), 1500);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Loading vital data...
      </div>
    );
  }

  if (success) {
    return (
      <div className="py-16 text-center">
        <Activity className="h-12 w-12 text-success mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-2">
          {editId ? "Vitals Updated!" : "Vitals Logged!"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Redirecting to your vitals history...
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={editId ? "Edit Vitals" : "Log Vitals"}
        subtitle={
          editId
            ? "Update your health measurements"
            : "Record your daily health measurements"
        }
        backHref="/patient/vitals/history"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Blood Pressure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="systolic">Systolic (top)</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="120"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="diastolic">Diastolic (bottom)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  placeholder="80"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Other Measurements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="glucose">Blood Glucose (mg/dL)</Label>
              <Input
                id="glucose"
                type="number"
                step="0.1"
                placeholder="100"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="temperature">Temperature (°F)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="98.6"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="How are you feeling today? Any symptoms?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : editId ? (
            "Update Vitals"
          ) : (
            "Save Vitals"
          )}
        </Button>
      </form>
    </div>
  );
}
