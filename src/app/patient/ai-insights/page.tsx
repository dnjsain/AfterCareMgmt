"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  Pill,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const RISK_SCORE = 32;
const RISK_LABEL = "Low Risk";
const LAST_UPDATED = "2 minutes ago";

const RISK_TREND_DATA = [
  { day: "Feb 1", score: 55 },
  { day: "Feb 2", score: 52 },
  { day: "Feb 3", score: 50 },
  { day: "Feb 4", score: 48 },
  { day: "Feb 5", score: 47 },
  { day: "Feb 6", score: 44 },
  { day: "Feb 7", score: 42 },
  { day: "Feb 8", score: 40 },
  { day: "Feb 9", score: 39 },
  { day: "Feb 10", score: 38 },
  { day: "Feb 11", score: 36 },
  { day: "Feb 12", score: 35 },
  { day: "Feb 13", score: 34 },
  { day: "Feb 14", score: 32 },
];

interface RiskFactor {
  label: string;
  status: string;
  color: "green" | "yellow" | "red";
  detail: string;
  icon: React.ElementType;
}

const RISK_FACTORS: RiskFactor[] = [
  {
    label: "Vital Signs",
    status: "Stable",
    color: "green",
    detail: "BP and weight within normal range",
    icon: Heart,
  },
  {
    label: "Medication Adherence",
    status: "87%",
    color: "yellow",
    detail: "2 missed doses this week",
    icon: Pill,
  },
  {
    label: "Symptom Severity",
    status: "Low",
    color: "green",
    detail: "No concerning patterns detected",
    icon: ShieldCheck,
  },
  {
    label: "Activity Level",
    status: "Moderate",
    color: "yellow",
    detail: "Below recommended 30 min/day",
    icon: Activity,
  },
];

interface AIAlert {
  type: "green" | "yellow";
  message: string;
}

const AI_ALERTS: AIAlert[] = [
  {
    type: "green",
    message:
      "Your recovery is progressing well. Keep up consistent medication adherence.",
  },
  {
    type: "yellow",
    message: "Consider increasing daily walk duration to 30 minutes.",
  },
];

const CONTRIBUTING_FACTORS = [
  { factor: "Medication Adherence", percentage: 35 },
  { factor: "Vital Sign Trends", percentage: 30 },
  { factor: "Activity Level", percentage: 20 },
];

const PREDICTION_24H = { score: 30, trend: "stable" as const };
const PREDICTION_48H = { score: 28, trend: "improving" as const };

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function riskColor(score: number) {
  if (score < 40) return { stroke: "#22c55e", bg: "text-green-500" };
  if (score < 70) return { stroke: "#eab308", bg: "text-yellow-500" };
  return { stroke: "#ef4444", bg: "text-red-500" };
}

function factorDot(color: "green" | "yellow" | "red") {
  const map = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };
  return map[color];
}

/* ------------------------------------------------------------------ */
/*  SVG Circular Gauge                                                */
/* ------------------------------------------------------------------ */

function RiskGauge({ score }: { score: number }) {
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = (score / 100) * circumference;
  const { stroke: gaugeColor, bg: textColor } = riskColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        {/* Background track */}
        <circle
          stroke="currentColor"
          className="text-muted/30"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress arc */}
        <circle
          stroke={gaugeColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference - progress}`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-700"
        />
      </svg>
      {/* Center text overlay */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-4xl font-extrabold ${textColor}`}>{score}</span>
        <span className="text-xs text-muted-foreground font-medium">/100</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function AIInsightsPage() {
  const [explainOpen, setExplainOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Predictive analytics for your recovery
        </p>
      </div>

      {/* ---- Risk Score Gauge ---- */}
      <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-background">
        <CardContent className="p-6 flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center">
            <RiskGauge score={RISK_SCORE} />
          </div>

          <Badge variant="success" className="text-sm px-3 py-1 gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            {RISK_LABEL}
          </Badge>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last updated: {LAST_UPDATED}
          </p>
        </CardContent>
      </Card>

      {/* ---- Risk Trend Chart ---- */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-green-500" />
            Risk Score Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">Last 14 days</p>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={RISK_TREND_DATA}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    fontSize: "12px",
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#riskGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ---- Risk Factors Breakdown ---- */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Risk Factors</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {RISK_FACTORS.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.label}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${
                      f.color === "green"
                        ? "bg-green-500/10"
                        : f.color === "yellow"
                        ? "bg-yellow-500/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        f.color === "green"
                          ? "text-green-500"
                          : f.color === "yellow"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{f.label}</p>
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${factorDot(
                          f.color
                        )}`}
                      />
                    </div>
                    <p className="text-sm font-semibold mt-0.5">{f.status}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {f.detail}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ---- AI Alerts ---- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {AI_ALERTS.map((alert, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 rounded-lg border p-3 ${
                alert.type === "green"
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-yellow-500/20 bg-yellow-500/5"
              }`}
            >
              <div
                className={`flex items-center justify-center h-7 w-7 rounded-full shrink-0 mt-0.5 ${
                  alert.type === "green"
                    ? "bg-green-500/10"
                    : "bg-yellow-500/10"
                }`}
              >
                {alert.type === "green" ? (
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <p className="text-sm leading-relaxed">{alert.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ---- Explainable AI ---- */}
      <Card>
        <CardContent className="p-0">
          <button
            onClick={() => setExplainOpen(!explainOpen)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Why this score?</span>
            </div>
            {explainOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {explainOpen && (
            <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Top contributing factors to your risk score:
              </p>
              {CONTRIBUTING_FACTORS.map((cf) => (
                <div key={cf.factor} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{cf.factor}</span>
                    <span className="font-semibold">{cf.percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${cf.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground pt-1">
                Remaining 15% from sleep patterns, diet logs, and other signals.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---- Care Team Alert Threshold ---- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Care Team Alert Threshold</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Score &gt; 70 triggers care team intervention within{" "}
            <span className="font-semibold text-foreground">2 hours</span>.
          </p>

          {/* Scale bar */}
          <div className="relative">
            <div className="h-4 w-full rounded-full overflow-hidden flex">
              <div className="h-full bg-green-500/70" style={{ width: "40%" }} />
              <div
                className="h-full bg-yellow-500/70"
                style={{ width: "30%" }}
              />
              <div className="h-full bg-red-500/70" style={{ width: "30%" }} />
            </div>

            {/* Markers */}
            <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
              <span>0</span>
              <span className="absolute left-[40%] -translate-x-1/2 text-yellow-600 font-medium">
                40
              </span>
              <span className="absolute left-[70%] -translate-x-1/2 text-red-600 font-medium">
                70
              </span>
              <span>100</span>
            </div>

            {/* Current score indicator */}
            <div
              className="absolute -top-1 h-6 w-0.5 bg-foreground rounded-full"
              style={{ left: `${RISK_SCORE}%` }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded">
                {RISK_SCORE}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Low (0–39)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              Moderate (40–69)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              High (70–100)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ---- 24-48 Hour Predictions ---- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Predicted Risk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {/* 24h */}
            <div className="rounded-lg border border-border p-4 text-center space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                In 24 hours
              </p>
              <p className="text-2xl font-bold text-green-500">
                {PREDICTION_24H.score}
              </p>
              <Badge variant="outline" className="gap-1 text-[10px]">
                {PREDICTION_24H.trend === "stable" ? (
                  <>
                    <TrendingUp className="h-2.5 w-2.5" />
                    Stable
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-2.5 w-2.5" />
                    Improving
                  </>
                )}
              </Badge>
            </div>

            {/* 48h */}
            <div className="rounded-lg border border-border p-4 text-center space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                In 48 hours
              </p>
              <p className="text-2xl font-bold text-green-500">
                {PREDICTION_48H.score}
              </p>
              <Badge variant="success" className="gap-1 text-[10px]">
                <TrendingDown className="h-2.5 w-2.5" />
                Improving
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
