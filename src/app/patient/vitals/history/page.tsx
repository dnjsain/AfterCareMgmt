"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface VitalLog {
  id: string;
  date: string;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  weight: number | null;
  glucose: number | null;
  temperature: number | null;
  notes: string | null;
}

export default function VitalsHistoryPage() {
  const [vitals, setVitals] = useState<VitalLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    weight: "",
    glucose: "",
    temperature: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVitals = () => {
    fetch("/api/vitals")
      .then((res) => res.json())
      .then((data) => {
        setVitals(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchVitals();
  }, []);

  const startEdit = (v: VitalLog) => {
    setEditingId(v.id);
    setEditForm({
      bloodPressureSystolic: v.bloodPressureSystolic?.toString() || "",
      bloodPressureDiastolic: v.bloodPressureDiastolic?.toString() || "",
      weight: v.weight?.toString() || "",
      glucose: v.glucose?.toString() || "",
      temperature: v.temperature?.toString() || "",
      notes: v.notes || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/vitals/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bloodPressureSystolic: editForm.bloodPressureSystolic
            ? parseInt(editForm.bloodPressureSystolic)
            : null,
          bloodPressureDiastolic: editForm.bloodPressureDiastolic
            ? parseInt(editForm.bloodPressureDiastolic)
            : null,
          weight: editForm.weight ? parseFloat(editForm.weight) : null,
          glucose: editForm.glucose ? parseFloat(editForm.glucose) : null,
          temperature: editForm.temperature
            ? parseFloat(editForm.temperature)
            : null,
          notes: editForm.notes || undefined,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setVitals((prev) =>
          prev.map((v) => (v.id === editingId ? updated : v))
        );
        setEditingId(null);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const deleteVital = async (id: string) => {
    if (!confirm("Delete this vital log entry?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/vitals/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVitals((prev) => prev.filter((v) => v.id !== id));
      }
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  // Prepare chart data (reversed so oldest is first)
  const chartData = [...vitals]
    .reverse()
    .map((v) => ({
      date: new Date(v.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      systolic: v.bloodPressureSystolic,
      diastolic: v.bloodPressureDiastolic,
      weight: v.weight,
      glucose: v.glucose,
    }));

  const hasBP = chartData.some((d) => d.systolic !== null);
  const hasWeight = chartData.some((d) => d.weight !== null);
  const hasGlucose = chartData.some((d) => d.glucose !== null);

  return (
    <div>
      <PageHeader
        title="Vitals History"
        subtitle="Track your health over time"
        action={
          <Link href="/patient/vitals/log">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Log
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading vitals...
        </div>
      ) : vitals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              No vitals logged yet.
            </p>
            <Link href="/patient/vitals/log">
              <Button size="sm">Log Your First Vitals</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* BP Chart */}
          {hasBP && (
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Blood Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="systolic" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} name="Systolic" connectNulls />
                      <Line type="monotone" dataKey="diastolic" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} name="Diastolic" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weight Chart */}
          {hasWeight && (
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Weight (kg)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Weight" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Glucose Chart */}
          {hasGlucose && (
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Blood Glucose (mg/dL)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="glucose" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Glucose" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Entries list with edit/delete */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">All Readings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {vitals.map((v) => {
                const isEditing = editingId === v.id;
                const isDeleting = deletingId === v.id;

                if (isEditing) {
                  return (
                    <div
                      key={v.id}
                      className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary">
                          Editing — {new Date(v.date).toLocaleDateString()}
                        </span>
                        <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Systolic</Label>
                          <Input
                            type="number"
                            placeholder="120"
                            value={editForm.bloodPressureSystolic}
                            onChange={(e) =>
                              setEditForm({ ...editForm, bloodPressureSystolic: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Diastolic</Label>
                          <Input
                            type="number"
                            placeholder="80"
                            value={editForm.bloodPressureDiastolic}
                            onChange={(e) =>
                              setEditForm({ ...editForm, bloodPressureDiastolic: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Weight (kg)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="70"
                            value={editForm.weight}
                            onChange={(e) =>
                              setEditForm({ ...editForm, weight: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Glucose</Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="100"
                            value={editForm.glucose}
                            onChange={(e) =>
                              setEditForm({ ...editForm, glucose: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Temp (°F)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="98.6"
                            value={editForm.temperature}
                            onChange={(e) =>
                              setEditForm({ ...editForm, temperature: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Notes</Label>
                        <Textarea
                          placeholder="Any notes..."
                          value={editForm.notes}
                          onChange={(e) =>
                            setEditForm({ ...editForm, notes: e.target.value })
                          }
                          className="min-h-[60px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit} disabled={saving}>
                          {saving ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={v.id}
                    className="rounded-lg border border-border p-3 hover:bg-accent/30 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {new Date(v.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(v)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteVital(v.id)}
                          disabled={isDeleting}
                          className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                          title="Delete"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">BP</span>
                        <div className="font-medium">
                          {v.bloodPressureSystolic && v.bloodPressureDiastolic
                            ? `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}`
                            : "—"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Weight</span>
                        <div className="font-medium">
                          {v.weight ? `${v.weight} kg` : "—"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Glucose</span>
                        <div className="font-medium">
                          {v.glucose ? `${v.glucose}` : "—"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Temp</span>
                        <div className="font-medium">
                          {v.temperature ? `${v.temperature}°F` : "—"}
                        </div>
                      </div>
                    </div>
                    {v.notes && (
                      <div className="mt-2 text-xs text-muted-foreground border-t border-border/50 pt-2">
                        {v.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
