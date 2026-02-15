"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Wind,
  Heart,
  Droplets,
  Thermometer,
  Battery,
  RotateCcw,
  Frown,
  Volume2,
  Brain,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

type Severity = "none" | "mild" | "moderate" | "severe";

interface SymptomDef {
  id: string;
  name: string;
  icon: React.ElementType;
}

const SYMPTOMS: SymptomDef[] = [
  { id: "breathlessness", name: "Breathlessness", icon: Wind },
  { id: "chest-pain", name: "Chest Pain", icon: Heart },
  { id: "swelling", name: "Swelling", icon: Droplets },
  { id: "fever", name: "Fever", icon: Thermometer },
  { id: "fatigue", name: "Fatigue", icon: Battery },
  { id: "dizziness", name: "Dizziness", icon: RotateCcw },
  { id: "nausea", name: "Nausea", icon: Frown },
  { id: "cough", name: "Cough", icon: Volume2 },
];

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: "none", label: "None" },
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
];

const severityColor: Record<Severity, string> = {
  none: "bg-muted text-muted-foreground",
  mild: "bg-green-500/15 text-green-600 border-green-500/30",
  moderate: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  severe: "bg-red-500/15 text-red-600 border-red-500/30",
};

const severityActiveRing: Record<Severity, string> = {
  none: "ring-2 ring-muted-foreground/40",
  mild: "ring-2 ring-green-500",
  moderate: "ring-2 ring-amber-500",
  severe: "ring-2 ring-red-500",
};

/* ------------------------------------------------------------------ */
/*  Mock previous check-ins                                            */
/* ------------------------------------------------------------------ */

interface PreviousCheckin {
  date: string;
  summary: string;
}

const PREVIOUS_CHECKINS: PreviousCheckin[] = [
  { date: "Feb 14, 2026", summary: "1 moderate, 2 mild symptoms" },
  { date: "Feb 13, 2026", summary: "3 mild symptoms" },
  { date: "Feb 12, 2026", summary: "1 severe, 1 moderate symptom" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SymptomsPage() {
  const [severities, setSeverities] = useState<Record<string, Severity>>(
    () => {
      const init: Record<string, Severity> = {};
      SYMPTOMS.forEach((s) => (init[s.id] = "none"));
      return init;
    }
  );

  const [notes, setNotes] = useState("");
  const [expandedCheckin, setExpandedCheckin] = useState<number | null>(null);

  const setSeverity = (symptomId: string, severity: Severity) => {
    setSeverities((prev) => ({ ...prev, [symptomId]: severity }));
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Symptom Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Daily symptom check-in
        </p>
      </div>

      {/* ── Date Display ── */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ClipboardCheck className="h-4 w-4 text-primary" />
        <span>{today}</span>
      </div>

      {/* ── Risk Level Banner ── */}
      <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2.5">
        <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
        <span className="text-sm font-medium text-green-700">
          Current Symptom Risk: Low
        </span>
      </div>

      {/* ── Symptom Checklist ── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">How are you feeling?</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {SYMPTOMS.map((symptom) => {
            const Icon = symptom.icon;
            const current = severities[symptom.id];

            return (
              <Card key={symptom.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  {/* Symptom label */}
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{symptom.name}</span>
                  </div>

                  {/* Severity pills */}
                  <div className="flex gap-1.5">
                    {SEVERITY_OPTIONS.map((opt) => {
                      const isActive = current === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setSeverity(symptom.id, opt.value)}
                          className={`
                            flex-1 rounded-full border px-2 py-1 text-xs font-medium transition-all
                            ${severityColor[opt.value]}
                            ${isActive ? severityActiveRing[opt.value] : "opacity-60 hover:opacity-90"}
                          `}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Free-text Notes ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Additional notes about how you're feeling today..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* ── AI Pattern Recognition ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">AI Pattern Alert</h2>
        </div>

        {/* Warning alert */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-700">
                  Increasing Fatigue Detected
                </p>
                <p className="text-xs text-amber-600/80 mt-1">
                  Fatigue has been increasing over the past 3 days. Consider
                  discussing with your care team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Positive alert */}
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-700">
                  Breathlessness Improving
                </p>
                <p className="text-xs text-green-600/80 mt-1">
                  Breathlessness has improved since Day 8. Keep up the good
                  work!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Submit Button ── */}
      <Button className="w-full" size="lg">
        <CheckCircle2 className="h-4 w-4" />
        Submit Today&apos;s Check-in
      </Button>

      {/* ── Previous Check-ins ── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Previous Check-ins</h2>

        {PREVIOUS_CHECKINS.map((checkin, idx) => (
          <Card key={idx}>
            <button
              className="w-full text-left"
              onClick={() =>
                setExpandedCheckin(expandedCheckin === idx ? null : idx)
              }
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{checkin.date}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {checkin.summary}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      expandedCheckin === idx ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {expandedCheckin === idx && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Breathlessness
                      </span>
                      <Badge variant="success">Mild</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Fatigue</span>
                      <Badge variant="warning">Moderate</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Chest Pain</span>
                      <Badge variant="success">Mild</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground italic pt-1">
                      &quot;Felt tired in the afternoon but managed a short
                      walk.&quot;
                    </p>
                  </div>
                )}
              </CardContent>
            </button>
          </Card>
        ))}
      </section>
    </div>
  );
}
