"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Pill,
  ClipboardList,
  Calendar,
  Phone,
  Trophy,
  Heart,
  Droplets,
  Weight,
  Wind,
  CheckCircle2,
  Circle,
  ArrowRight,
  Flame,
} from "lucide-react";

/* ─── Mock data ─── */
const HEALTH_SCORE = 78;
const RECOVERY_DAY = 12;
const RECOVERY_TOTAL = 30;
const STREAK_DAYS = 12;
const NEXT_MILESTONE = 14;

const checklist = [
  {
    id: "vitals",
    label: "Log vitals",
    href: "/patient/vitals/log",
    completed: false,
  },
  {
    id: "meds",
    label: "Take medications",
    href: "/patient/medications",
    completed: false,
  },
  {
    id: "symptoms",
    label: "Symptom check",
    href: "/patient/symptoms",
    completed: false,
  },
  {
    id: "walk",
    label: "Morning walk",
    href: "#",
    completed: true,
  },
];

const quickStats = [
  {
    label: "Blood Pressure",
    value: "128/82",
    unit: "mmHg",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    label: "Weight",
    value: "72.5",
    unit: "kg",
    icon: Weight,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Glucose",
    value: "105",
    unit: "mg/dL",
    icon: Droplets,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "O\u2082 Saturation",
    value: "97",
    unit: "%",
    icon: Wind,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

/* ─── Helpers ─── */

function getScoreInfo(score: number) {
  if (score >= 70)
    return {
      label: "Looking Good",
      stroke: "stroke-emerald-500",
      text: "text-emerald-500",
      badge: "success" as const,
    };
  if (score >= 40)
    return {
      label: "Needs Attention",
      stroke: "stroke-amber-500",
      text: "text-amber-500",
      badge: "warning" as const,
    };
  return {
    label: "Alert - Contact Care Team",
    stroke: "stroke-red-500",
    text: "text-red-500",
    badge: "destructive" as const,
  };
}

/* ─── Health Score Circle (SVG) ─── */

function HealthScoreRing({ score }: { score: number }) {
  const info = getScoreInfo(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 120 120"
          fill="none"
        >
          {/* Background ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            strokeWidth="10"
            className="stroke-secondary"
          />
          {/* Progress ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            strokeWidth="10"
            strokeLinecap="round"
            className={`${info.stroke} transition-all duration-700 ease-out`}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${info.text}`}>{score}</span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Health Score
          </span>
        </div>
      </div>
      <Badge variant={info.badge}>{info.label}</Badge>
    </div>
  );
}

/* ─── Component ─── */

export default function PatientDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Patient";
  const completedCount = checklist.filter((c) => c.completed).length;
  const streakProgress = Math.round((STREAK_DAYS / NEXT_MILESTONE) * 100);

  return (
    <div className="space-y-5">
      {/* ── Greeting + Day Counter ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Hi, {userName}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${(RECOVERY_DAY / RECOVERY_TOTAL) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs font-semibold text-primary whitespace-nowrap">
            Day {RECOVERY_DAY} of {RECOVERY_TOTAL}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Your recovery is on track. Keep it up!
        </p>
      </div>

      {/* ── Health Score Circle ── */}
      <Card>
        <CardContent className="py-6 flex justify-center">
          <HealthScoreRing score={HEALTH_SCORE} />
        </CardContent>
      </Card>

      {/* ── Daily Checklist ── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Daily Checklist</CardTitle>
            <span className="text-xs font-semibold text-primary">
              {completedCount} of {checklist.length} completed
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {checklist.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg border p-3 transition hover:bg-accent ${
                  item.completed
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-border"
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <span
                  className={`text-sm font-medium flex-1 ${
                    item.completed
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {item.label}
                </span>
                {!item.completed && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Upcoming Appointment ── */}
      <Link href="/patient/appointments">
        <Card className="border-primary/20 bg-primary/5 hover:border-primary/40 transition cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">
                Follow-up with Dr. Sharma
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Scheduled appointment
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-[10px] font-medium text-primary/70 uppercase tracking-wider">
                days
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* ── Rewards / Streak Progress ── */}
      <Link href="/patient/rewards">
        <Card className="hover:border-amber-500/30 transition cursor-pointer mt-5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-semibold">Rewards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-500">
                  Day {STREAK_DAYS} Streak
                </span>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                style={{ width: `${streakProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {NEXT_MILESTONE - STREAK_DAYS} days to next badge
              </span>
              <Badge variant="outline" className="text-[10px]">
                Day {NEXT_MILESTONE} Badge
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* ── Quick Stats (2×2) ── */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${stat.bg}`}
                    >
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">
                      {stat.unit}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Emergency Call Button ── */}
      <div className="pt-2 pb-4">
        <a href="tel:911" className="block">
          <Button
            variant="destructive"
            className="w-full h-14 text-base font-semibold gap-2 shadow-lg shadow-red-500/20"
          >
            <Phone className="h-5 w-5" />
            Emergency &mdash; Call Care Team
          </Button>
        </a>
      </div>
    </div>
  );
}
