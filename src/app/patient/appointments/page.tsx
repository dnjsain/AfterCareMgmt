"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import {
  Calendar,
  MapPin,
  Car,
  Bell,
  Plus,
  CheckCircle2,
  Circle,
  Star,
  Clock,
  Navigation,
} from "lucide-react";

/* ────────────────────────── Mock Data ────────────────────────── */

interface Appointment {
  id: string;
  title: string;
  specialty: string;
  date: string; // ISO
  time: string;
  location: string;
  daysUntil: number;
}

const upcomingAppointments: Appointment[] = [
  {
    id: "1",
    title: "Physiotherapy Session",
    specialty: "Rehab",
    date: "2026-02-11",
    time: "2:00 PM",
    location: "Fortis Rehab",
    daysUntil: 3,
  },
  {
    id: "2",
    title: "Follow-up with Dr. Anika Sharma",
    specialty: "Cardiology",
    date: "2026-02-15",
    time: "10:00 AM",
    location: "Overlook Medical Center",
    daysUntil: 7,
  },
  {
    id: "3",
    title: "Blood Work - Lab Test",
    specialty: "Pathology",
    date: "2026-02-20",
    time: "8:30 AM",
    location: "Apollo Diagnostics",
    daysUntil: 12,
  },
];

interface PastAppointment {
  id: string;
  title: string;
  specialty: string;
  date: string;
  location: string;
}

const pastAppointments: PastAppointment[] = [
  {
    id: "p1",
    title: "Post-Surgery Review with Dr. Mehra",
    specialty: "Orthopedics",
    date: "2026-01-28",
    location: "City Hospital",
  },
  {
    id: "p2",
    title: "Cardiac Stress Test",
    specialty: "Cardiology",
    date: "2026-01-15",
    location: "Overlook Medical Center",
  },
];

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

const initialChecklist: ChecklistItem[] = [
  { id: "c1", label: "Bring ID and insurance card", checked: false },
  { id: "c2", label: "List of current medications", checked: false },
  { id: "c3", label: "Fast for 8 hours (if blood work)", checked: true },
  { id: "c4", label: "Prepare questions for doctor", checked: false },
  { id: "c5", label: "Bring previous test reports", checked: false },
];

/* ────────────────────────── Helpers ────────────────────────── */

function urgencyBadge(daysUntil: number) {
  if (daysUntil <= 3) {
    return (
      <Badge variant="destructive" className="text-[11px]">
        In {daysUntil} days
      </Badge>
    );
  }
  if (daysUntil <= 7) {
    return (
      <Badge variant="warning" className="text-[11px]">
        In {daysUntil} days
      </Badge>
    );
  }
  return (
    <Badge variant="success" className="text-[11px]">
      In {daysUntil} days
    </Badge>
  );
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ────────────────────────── Component ────────────────────────── */

export default function AppointmentsPage() {
  // Reminder toggles
  const [reminders, setReminders] = useState({
    sevenDays: true,
    threeDays: true,
    oneDay: false,
  });

  // Checklist state
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);

  const toggleReminder = (key: keyof typeof reminders) => {
    setReminders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Sort upcoming by urgency (nearest first)
  const sorted = [...upcomingAppointments].sort(
    (a, b) => a.daysUntil - b.daysUntil
  );

  return (
    <div className="pb-24">
      <PageHeader
        title="Appointments"
        subtitle="Manage your follow-up visits"
      />

      {/* ── Upcoming Appointments ── */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Upcoming Appointments
        </h2>

        <div className="space-y-3">
          {sorted.map((apt) => (
            <Card key={apt.id} className="overflow-hidden">
              <CardContent className="p-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm leading-snug">
                      {apt.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {apt.specialty}
                    </p>
                  </div>
                  {urgencyBadge(apt.daysUntil)}
                </div>

                {/* Date & Location */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {formatDate(apt.date)} &middot; {apt.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{apt.location}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Navigation className="h-3.5 w-3.5" />
                    Get Directions
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1">
                    <Car className="h-3.5 w-3.5" />
                    Book Transport
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Reminder Settings ── */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Reminder Settings
        </h2>

        <Card>
          <CardContent className="p-4 space-y-3">
            {(
              [
                { key: "sevenDays" as const, label: "7 days before" },
                { key: "threeDays" as const, label: "3 days before" },
                { key: "oneDay" as const, label: "1 day before" },
              ] as const
            ).map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Reminder: {label}</span>
                </div>
                <button
                  onClick={() => toggleReminder(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    reminders[key] ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      reminders[key] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ── Pre-Appointment Checklist ── */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Pre-Appointment Checklist
        </h2>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              For: {sorted[0]?.title ?? "Next Appointment"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className="flex items-center gap-3 w-full text-left py-1.5 rounded-md hover:bg-accent/50 transition px-1 -mx-1"
              >
                {item.checked ? (
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    item.checked
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ── Past Appointments ── */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Past Appointments
        </h2>

        <div className="space-y-3">
          {pastAppointments.map((apt) => (
            <Card key={apt.id} className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm leading-snug">
                      {apt.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {apt.specialty}
                    </p>
                  </div>
                  <Badge variant="success">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>{formatDate(apt.date)}</span>
                  <span className="mx-1">&middot;</span>
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{apt.location}</span>
                </div>

                <Button size="sm" variant="outline" className="w-full">
                  <Star className="h-3.5 w-3.5" />
                  Leave Feedback
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Floating Add Appointment Button ── */}
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          size="lg"
          className="rounded-full shadow-lg h-14 px-6 gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Appointment
        </Button>
      </div>
    </div>
  );
}
