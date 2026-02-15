"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  Activity,
  Camera,
  PlayCircle,
  Heart,
  Droplets,
  Thermometer,
  Weight,
  Wind,
} from "lucide-react";
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
  const [oxygenSat, setOxygenSat] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showTutorial, setShowTutorial] = useState<string | null>(null);

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

      {/* Quick photo upload */}
      <Card className="mb-4 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Photo Auto-Fill</div>
              <div className="text-xs text-muted-foreground">
                Take a photo of your monitor reading — OCR will auto-fill values
              </div>
            </div>
            <Button size="sm" variant="outline" className="shrink-0">
              <Camera className="h-4 w-4" />
              Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Blood Pressure */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <CardTitle className="text-base">Blood Pressure</CardTitle>
              </div>
              <button
                type="button"
                onClick={() =>
                  setShowTutorial(showTutorial === "bp" ? null : "bp")
                }
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                How to measure
              </button>
            </div>
          </CardHeader>
          {showTutorial === "bp" && (
            <div className="mx-6 mb-3 rounded-lg bg-primary/5 p-3">
              <div className="flex items-start gap-2">
                <PlayCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">
                    Blood Pressure Tutorial
                  </p>
                  <p>1. Sit quietly for 5 minutes before measuring</p>
                  <p>
                    2. Place the cuff on your upper arm, 1 inch above the elbow
                  </p>
                  <p>3. Rest your arm on a flat surface at heart level</p>
                  <p>4. Press start and remain still until the reading is done</p>
                  <p>5. Record both numbers (systolic/diastolic)</p>
                </div>
              </div>
            </div>
          )}
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
            {systolic && diastolic && (
              <div className="mt-3 rounded-lg bg-secondary p-2 text-center">
                <span className="text-lg font-bold">
                  {systolic}/{diastolic}
                </span>
                <span className="text-xs text-muted-foreground ml-1">mmHg</span>
                {parseInt(systolic) < 120 && parseInt(diastolic) < 80 ? (
                  <span className="ml-2 text-xs text-green-600 font-medium">
                    Normal
                  </span>
                ) : parseInt(systolic) < 140 && parseInt(diastolic) < 90 ? (
                  <span className="ml-2 text-xs text-amber-600 font-medium">
                    Elevated
                  </span>
                ) : (
                  <span className="ml-2 text-xs text-red-600 font-medium">
                    High
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weight */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4 text-green-500" />
              <CardTitle className="text-base">Weight</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Blood Glucose */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-base">Blood Glucose</CardTitle>
              </div>
              <button
                type="button"
                onClick={() =>
                  setShowTutorial(showTutorial === "glucose" ? null : "glucose")
                }
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                How to measure
              </button>
            </div>
          </CardHeader>
          {showTutorial === "glucose" && (
            <div className="mx-6 mb-3 rounded-lg bg-primary/5 p-3">
              <div className="flex items-start gap-2">
                <PlayCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">
                    Glucose Testing Tutorial
                  </p>
                  <p>1. Wash and dry your hands thoroughly</p>
                  <p>2. Insert a test strip into your meter</p>
                  <p>3. Prick the side of your fingertip with the lancet</p>
                  <p>4. Touch the test strip to the blood drop</p>
                  <p>5. Wait for the reading and record the value</p>
                </div>
              </div>
            </div>
          )}
          <CardContent>
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
            {glucose && (
              <div className="mt-2 text-xs">
                {parseFloat(glucose) < 100 ? (
                  <span className="text-green-600">Normal (fasting)</span>
                ) : parseFloat(glucose) < 126 ? (
                  <span className="text-amber-600">Pre-diabetic range</span>
                ) : (
                  <span className="text-red-600">High — consult your doctor</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Temperature */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <CardTitle className="text-base">Temperature</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
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
            {temperature && (
              <div className="mt-2 text-xs">
                {parseFloat(temperature) < 100.4 ? (
                  <span className="text-green-600">Normal</span>
                ) : (
                  <span className="text-red-600">
                    Fever detected — monitor closely
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Oxygen Saturation */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-base">Oxygen Saturation</CardTitle>
              </div>
              <button
                type="button"
                onClick={() =>
                  setShowTutorial(showTutorial === "o2" ? null : "o2")
                }
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                How to measure
              </button>
            </div>
          </CardHeader>
          {showTutorial === "o2" && (
            <div className="mx-6 mb-3 rounded-lg bg-primary/5 p-3">
              <div className="flex items-start gap-2">
                <PlayCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">
                    Pulse Oximeter Tutorial
                  </p>
                  <p>1. Remove nail polish if wearing any</p>
                  <p>2. Warm your hands if they are cold</p>
                  <p>3. Clip the oximeter on your fingertip</p>
                  <p>4. Keep your hand still and at heart level</p>
                  <p>5. Wait 10 seconds for a stable reading</p>
                </div>
              </div>
            </div>
          )}
          <CardContent>
            <div className="space-y-1">
              <Label htmlFor="oxygenSat">SpO₂ (%)</Label>
              <Input
                id="oxygenSat"
                type="number"
                step="1"
                placeholder="97"
                value={oxygenSat}
                onChange={(e) => setOxygenSat(e.target.value)}
              />
            </div>
            {oxygenSat && (
              <div className="mt-2 text-xs">
                {parseInt(oxygenSat) >= 95 ? (
                  <span className="text-green-600">Normal</span>
                ) : parseInt(oxygenSat) >= 90 ? (
                  <span className="text-amber-600">
                    Low — consult your care team
                  </span>
                ) : (
                  <span className="text-red-600">
                    Critical — seek immediate medical attention
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Abnormal Alert */}
        {((systolic && parseInt(systolic) >= 140) ||
          (diastolic && parseInt(diastolic) >= 90) ||
          (glucose && parseFloat(glucose) >= 200) ||
          (temperature && parseFloat(temperature) >= 101) ||
          (oxygenSat && parseInt(oxygenSat) < 92)) && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex items-start gap-2">
              <Activity className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-red-700">
                  Abnormal Reading Detected
                </div>
                <div className="text-xs text-red-600 mt-1">
                  One or more of your readings are outside the normal range.
                  Your care team will be notified automatically. If you feel
                  unwell, please contact your doctor immediately.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
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
