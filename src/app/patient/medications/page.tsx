"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import {
  CheckCircle2,
  Circle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MessageSquare,
  X,
  Plus,
  Pencil,
  Building2,
  User,
  Bell,
  Camera,
  AlertTriangle,
  MapPin,
  Clock,
  Package,
} from "lucide-react";

interface DischargePlan {
  id: string;
  diagnosis: string;
  medications: {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string | null;
  }[];
}

interface SelfMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  patientId: string;
}

interface MedLog {
  id: string;
  medicationId: string;
  taken: boolean;
  date: string;
  notes: string | null;
  medication: { name: string; dosage: string; frequency: string };
}

interface MedItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  source: "hospital" | "self";
  diagnosis?: string;
}

function formatDateLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff === -1) return "Tomorrow";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function MedicationsPage() {
  const [plans, setPlans] = useState<DischargePlan[]>([]);
  const [selfMeds, setSelfMeds] = useState<SelfMedication[]>([]);
  const [allLogs, setAllLogs] = useState<MedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notesOpen, setNotesOpen] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Add / Edit medication form
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [medForm, setMedForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });
  const [savingMed, setSavingMed] = useState(false);
  const [deletingMedId, setDeletingMedId] = useState<string | null>(null);

  // Day navigation
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  const goDay = (offset: number) => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + offset);
      return d;
    });
  };

  const isToday = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate.getTime() === today.getTime();
  })();

  const fetchData = useCallback(async () => {
    try {
      const [plansRes, selfMedsRes, logsRes] = await Promise.all([
        fetch("/api/discharge-plans").then((r) => r.json()),
        fetch("/api/medications").then((r) => r.json()),
        fetch("/api/medication-logs").then((r) => r.json()),
      ]);

      setPlans(Array.isArray(plansRes) ? plansRes : []);
      setSelfMeds(Array.isArray(selfMedsRes) ? selfMedsRes : []);
      setAllLogs(Array.isArray(logsRes) ? logsRes : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Merge hospital meds + patient-added meds
  const hospitalMeds: MedItem[] = plans.flatMap((p) =>
    p.medications.map((m) => ({
      ...m,
      source: "hospital" as const,
      diagnosis: p.diagnosis,
    }))
  );

  const patientMeds: MedItem[] = selfMeds.map((m) => ({
    ...m,
    source: "self" as const,
  }));

  const allMedications = [...hospitalMeds, ...patientMeds];

  const activeMedications = allMedications.filter(
    (m) => !m.endDate || new Date(m.endDate) >= selectedDate
  );

  // Logs for selected day
  const dayLogs = allLogs.filter(
    (l) => l.date.split("T")[0] === selectedDateStr
  );
  const dayLogMap: Record<string, MedLog> = {};
  dayLogs.forEach((l) => {
    dayLogMap[l.medicationId] = l;
  });

  const takenCount = activeMedications.filter(
    (m) => dayLogMap[m.id]?.taken === true
  ).length;

  const toggleMedication = async (medicationId: string) => {
    setToggling(medicationId);
    const existingLog = dayLogMap[medicationId];
    const newState = !(existingLog?.taken ?? false);

    try {
      if (existingLog) {
        const res = await fetch(`/api/medication-logs/${existingLog.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taken: newState }),
        });
        if (res.ok) {
          setAllLogs((prev) =>
            prev.map((l) =>
              l.id === existingLog.id ? { ...l, taken: newState } : l
            )
          );
        }
      } else {
        const res = await fetch("/api/medication-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medicationId,
            taken: newState,
            date: selectedDateStr,
          }),
        });
        if (res.ok) {
          await fetchData();
        }
      }
    } catch {
      // ignore
    } finally {
      setToggling(null);
    }
  };

  const deleteLog = async (logId: string) => {
    if (!confirm("Delete this medication log entry?")) return;
    setDeletingId(logId);
    try {
      const res = await fetch(`/api/medication-logs/${logId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAllLogs((prev) => prev.filter((l) => l.id !== logId));
      }
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  const openNotes = (medId: string) => {
    const log = dayLogMap[medId];
    setNotesOpen(medId);
    setNoteText(log?.notes || "");
  };

  const saveNote = async () => {
    if (!notesOpen) return;
    setSavingNote(true);
    const existingLog = dayLogMap[notesOpen];
    try {
      if (existingLog) {
        const res = await fetch(`/api/medication-logs/${existingLog.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: noteText }),
        });
        if (res.ok) {
          setAllLogs((prev) =>
            prev.map((l) =>
              l.id === existingLog.id ? { ...l, notes: noteText || null } : l
            )
          );
        }
      } else {
        const res = await fetch("/api/medication-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medicationId: notesOpen,
            taken: false,
            notes: noteText,
            date: selectedDateStr,
          }),
        });
        if (res.ok) {
          await fetchData();
        }
      }
      setNotesOpen(null);
    } catch {
      // ignore
    } finally {
      setSavingNote(false);
    }
  };

  // ── Add / Edit medication handlers ──

  const resetMedForm = () => {
    setMedForm({
      name: "",
      dosage: "",
      frequency: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    });
    setEditingMedId(null);
    setShowAddForm(false);
  };

  const startEditMed = (med: MedItem) => {
    setEditingMedId(med.id);
    setShowAddForm(true);
    setMedForm({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      startDate: med.startDate.split("T")[0],
      endDate: med.endDate ? med.endDate.split("T")[0] : "",
    });
  };

  const saveMedication = async () => {
    if (!medForm.name || !medForm.dosage || !medForm.frequency) return;
    setSavingMed(true);

    try {
      if (editingMedId) {
        const res = await fetch(`/api/medications/${editingMedId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: medForm.name,
            dosage: medForm.dosage,
            frequency: medForm.frequency,
            startDate: medForm.startDate,
            endDate: medForm.endDate || null,
          }),
        });
        if (res.ok) {
          await fetchData();
          resetMedForm();
        }
      } else {
        const res = await fetch("/api/medications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: medForm.name,
            dosage: medForm.dosage,
            frequency: medForm.frequency,
            startDate: medForm.startDate,
            endDate: medForm.endDate || undefined,
          }),
        });
        if (res.ok) {
          await fetchData();
          resetMedForm();
        }
      }
    } catch {
      // ignore
    } finally {
      setSavingMed(false);
    }
  };

  const deleteMedication = async (medId: string) => {
    if (!confirm("Delete this medication and all its logs?")) return;
    setDeletingMedId(medId);
    try {
      const res = await fetch(`/api/medications/${medId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchData();
      }
    } catch {
      // ignore
    } finally {
      setDeletingMedId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Medications"
        subtitle="Track your daily medication adherence"
        action={
          !showAddForm ? (
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4" />
              Add Med
            </Button>
          ) : undefined
        }
      />

      {/* Smart Reminder Banner */}
      <Card className="mb-4 border-amber-200 bg-amber-50">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-2">
              <Bell className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-amber-800">
                Next dose in 28 min
              </div>
              <div className="text-xs text-amber-600">
                Metoprolol 50mg — Evening dose at 8:00 PM
              </div>
            </div>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Soon
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Refill Alert */}
      <Card className="mb-4 border-red-200 bg-red-50">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-red-800">
                Refill Needed — 3 days left
              </div>
              <div className="text-xs text-red-600">
                Atorvastatin 40mg is running low
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-red-200 text-red-700 hover:bg-red-100 text-xs"
            >
              <Package className="h-3 w-3" />
              Refill
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Photo Pill Confirmation + Pharmacy */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="hover:border-primary/30 transition cursor-pointer">
          <CardContent className="p-3 flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-center">
              Verify Pill
            </span>
            <span className="text-[10px] text-muted-foreground text-center">
              AI pill recognition
            </span>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/30 transition cursor-pointer">
          <CardContent className="p-3 flex flex-col items-center gap-2">
            <div className="rounded-full bg-green-50 p-2">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-center">
              Find Pharmacy
            </span>
            <span className="text-[10px] text-muted-foreground text-center">
              Nearby & delivery
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit medication form */}
      {showAddForm && (
        <Card className="mb-4 border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {editingMedId ? "Edit Medication" : "Add Medication"}
              </CardTitle>
              <button
                onClick={resetMedForm}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Medication Name</Label>
              <Input
                placeholder="e.g. Aspirin"
                value={medForm.name}
                onChange={(e) =>
                  setMedForm({ ...medForm, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Dosage</Label>
                <Input
                  placeholder="e.g. 500mg"
                  value={medForm.dosage}
                  onChange={(e) =>
                    setMedForm({ ...medForm, dosage: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Frequency</Label>
                <Input
                  placeholder="e.g. Twice daily"
                  value={medForm.frequency}
                  onChange={(e) =>
                    setMedForm({ ...medForm, frequency: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Start Date</Label>
                <Input
                  type="date"
                  value={medForm.startDate}
                  onChange={(e) =>
                    setMedForm({ ...medForm, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">End Date (optional)</Label>
                <Input
                  type="date"
                  value={medForm.endDate}
                  onChange={(e) =>
                    setMedForm({ ...medForm, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={saveMedication}
                disabled={
                  savingMed ||
                  !medForm.name ||
                  !medForm.dosage ||
                  !medForm.frequency
                }
              >
                {savingMed ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : null}
                {editingMedId ? "Update" : "Add Medication"}
              </Button>
              <Button size="sm" variant="ghost" onClick={resetMedForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day navigator */}
      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => goDay(-1)}
              className="rounded-lg p-2 hover:bg-accent transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="text-sm font-semibold">
                {formatDateLabel(selectedDate)}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            <button
              onClick={() => goDay(1)}
              className="rounded-lg p-2 hover:bg-accent transition"
              disabled={isToday}
            >
              <ChevronRight
                className={`h-5 w-5 ${isToday ? "text-muted-foreground/30" : ""}`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading medications...
        </div>
      ) : activeMedications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              No active medications for this date.
            </p>
            <Button
              size="sm"
              onClick={() => setShowAddForm(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Add Your Own Medication
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {formatDateLabel(selectedDate)}&apos;s Progress
                </span>
                <span className="text-sm font-bold text-primary">
                  {takenCount}/{activeMedications.length}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all"
                  style={{
                    width: `${
                      activeMedications.length > 0
                        ? (takenCount / activeMedications.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes modal */}
          {notesOpen && (
            <Card className="mb-4 border-primary/30 bg-primary/5">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Add Note for{" "}
                    {activeMedications.find((m) => m.id === notesOpen)?.name}
                  </span>
                  <button
                    onClick={() => setNotesOpen(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Input
                  placeholder="e.g. Took with food, felt nauseous..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveNote} disabled={savingNote}>
                    {savingNote ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : null}
                    Save Note
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setNotesOpen(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medication list */}
          <div className="space-y-3">
            {activeMedications.map((med) => {
              const log = dayLogMap[med.id];
              const isTaken = log?.taken === true;
              const isToggling = toggling === med.id;
              const isDeleting = deletingId === log?.id;
              const isSelf = med.source === "self";
              const isDeletingMed = deletingMedId === med.id;

              return (
                <Card
                  key={med.id}
                  className={`transition ${
                    isTaken ? "border-success/30 bg-success/5" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Toggle button */}
                      <button
                        className="shrink-0 mt-0.5"
                        onClick={() =>
                          !isToggling && toggleMedication(med.id)
                        }
                        disabled={isToggling}
                      >
                        {isToggling ? (
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : isTaken ? (
                          <CheckCircle2 className="h-6 w-6 text-success" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-medium text-sm ${
                              isTaken
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {med.name}
                          </span>
                          {isSelf ? (
                            <User className="h-3 w-3 text-primary shrink-0" />
                          ) : (
                            <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {med.dosage} &middot; {med.frequency}
                        </div>
                        {med.diagnosis && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            For: {med.diagnosis}
                          </div>
                        )}
                        {isSelf && (
                          <div className="text-xs text-primary/70 mt-0.5">
                            Self-added
                          </div>
                        )}
                        {log?.notes && (
                          <div className="text-xs text-primary mt-1 italic">
                            Note: {log.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => openNotes(med.id)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition"
                          title="Add note"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </button>
                        {isSelf && (
                          <>
                            <button
                              onClick={() => startEditMed(med)}
                              className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition"
                              title="Edit medication"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteMedication(med.id)}
                              disabled={isDeletingMed}
                              className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                              title="Delete medication"
                            >
                              {isDeletingMed ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </>
                        )}
                        {log && !isSelf && (
                          <button
                            onClick={() => deleteLog(log.id)}
                            disabled={isDeleting}
                            className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                            title="Delete log"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                        <Badge
                          variant={
                            isTaken
                              ? "success"
                              : log
                              ? "destructive"
                              : "outline"
                          }
                          className="ml-1"
                        >
                          {isTaken ? "Done" : log ? "Missed" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
