"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Flame,
  Star,
  Share2,
  Target,
  Award,
  Medal,
  Lock,
  Crown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const STREAK_DAYS = 12;
const NEXT_MILESTONE = 14;
const RECOVERY_POINTS = 1_240;

interface BadgeItem {
  icon: React.ElementType;
  name: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

const BADGES: BadgeItem[] = [
  {
    icon: Star,
    name: "First Steps",
    description: "Complete Day 1 of recovery",
    earned: true,
    earnedDate: "Jan 20, 2026",
  },
  {
    icon: Trophy,
    name: "Week Warrior",
    description: "7-day streak achieved",
    earned: true,
    earnedDate: "Jan 27, 2026",
  },
  {
    icon: Target,
    name: "Vital Logger",
    description: "10 vitals logged",
    earned: true,
    earnedDate: "Jan 30, 2026",
  },
  {
    icon: Award,
    name: "Med Master",
    description: "100% adherence for 5 days",
    earned: true,
    earnedDate: "Feb 1, 2026",
  },
  {
    icon: Medal,
    name: "14-Day Warrior",
    description: "14-day streak achieved",
    earned: false,
  },
  {
    icon: Crown,
    name: "30-Day Champion",
    description: "30-day streak achieved",
    earned: false,
  },
  {
    icon: Target,
    name: "Perfect Month",
    description: "30 days, 100% adherence",
    earned: false,
  },
  {
    icon: Trophy,
    name: "Health Hero",
    description: "Complete all recovery goals",
    earned: false,
  },
];

interface MilestoneItem {
  day: number;
  label: string;
  completed: boolean;
  current: boolean;
}

const MILESTONES: MilestoneItem[] = [
  { day: 1, label: "Recovery Begins", completed: true, current: false },
  { day: 7, label: "First Week Done", completed: true, current: false },
  { day: 14, label: "Two Weeks Strong", completed: false, current: true },
  { day: 21, label: "Three-Week Mark", completed: false, current: false },
  { day: 30, label: "One Month Champion", completed: false, current: false },
];

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  isYou: boolean;
}

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Sarah M.", points: 1_580, isYou: false },
  { rank: 2, name: "James K.", points: 1_340, isYou: false },
  { rank: 3, name: "You", points: 1_240, isYou: true },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function RewardsPage() {
  const [shared, setShared] = useState(false);

  const streakProgress = Math.round((STREAK_DAYS / NEXT_MILESTONE) * 100);
  const daysUntilNext = NEXT_MILESTONE - STREAK_DAYS;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rewards</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Stay motivated on your recovery journey
        </p>
      </div>

      {/* ---- Streak Counter ---- */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-orange-500/5">
        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
          {/* Pulsing flame */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20 rounded-full bg-orange-400" />
            <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-orange-500/10">
              <Flame className="h-10 w-10 text-orange-500 animate-pulse" />
            </div>
          </div>

          <div>
            <span className="text-4xl font-extrabold tracking-tight">
              {STREAK_DAYS} Day Streak
            </span>
            <span className="ml-2 text-3xl">&#x1F525;</span>
          </div>

          {/* Progress to next milestone */}
          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Day {STREAK_DAYS}</span>
              <span>Day {NEXT_MILESTONE}</span>
            </div>
            <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                style={{ width: `${streakProgress}%` }}
              />
            </div>
            <p className="text-sm font-medium text-primary">
              {daysUntilNext} day{daysUntilNext !== 1 ? "s" : ""} until{" "}
              <span className="font-semibold">14-Day Warrior</span> badge!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ---- Points Display ---- */}
      <Card>
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight">
              {RECOVERY_POINTS.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Recovery Points</p>
          </div>
        </CardContent>
      </Card>

      {/* ---- Badges Grid ---- */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <Card
                key={badge.name}
                className={
                  badge.earned
                    ? "border-primary/30 bg-primary/5 shadow-[0_0_12px_rgba(var(--primary-rgb,99,102,241),0.15)]"
                    : "opacity-60 grayscale"
                }
              >
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div
                    className={`flex items-center justify-center h-11 w-11 rounded-full ${
                      badge.earned
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    {badge.earned ? (
                      <Icon className="h-5 w-5 text-primary" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm font-medium leading-tight">
                    {badge.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {badge.description}
                  </p>
                  {badge.earned ? (
                    <Badge variant="success" className="text-[10px]">
                      {badge.earnedDate}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <Lock className="h-2.5 w-2.5" />
                      Locked
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ---- Milestones Timeline ---- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-border" />

            <div className="space-y-6">
              {MILESTONES.map((ms) => (
                <div key={ms.day} className="relative flex items-start gap-4">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      ms.completed
                        ? "border-primary bg-primary"
                        : ms.current
                        ? "border-primary bg-background"
                        : "border-muted-foreground/30 bg-background"
                    }`}
                  >
                    {ms.completed && (
                      <svg
                        className="h-3 w-3 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {ms.current && (
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium ${
                        ms.completed
                          ? "text-foreground"
                          : ms.current
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      Day {ms.day} &mdash; {ms.label}
                    </p>
                    {ms.current && (
                      <p className="text-xs text-primary mt-0.5">
                        Next milestone
                      </p>
                    )}
                    {ms.completed && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Completed
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- Social Sharing ---- */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/0">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base font-semibold">Share Your Progress</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Celebrate your {STREAK_DAYS}-day streak with friends &amp; family!
            </p>
          </div>
          <Button
            onClick={() => setShared(true)}
            className="gap-2"
            variant={shared ? "outline" : "default"}
          >
            <Share2 className="h-4 w-4" />
            {shared ? "Shared!" : "Share"}
          </Button>
        </CardContent>
      </Card>

      {/* ---- Weekly Leaderboard ---- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Weekly Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            You&apos;re <span className="font-semibold text-primary">#3</span>{" "}
            this week!
          </p>
          <div className="space-y-2">
            {LEADERBOARD.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 rounded-lg border p-3 ${
                  entry.isYou
                    ? "border-primary/30 bg-primary/5"
                    : "border-border"
                }`}
              >
                <span
                  className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${
                    entry.rank === 1
                      ? "bg-yellow-500/10 text-yellow-600"
                      : entry.rank === 2
                      ? "bg-gray-300/20 text-gray-500"
                      : "bg-orange-500/10 text-orange-600"
                  }`}
                >
                  {entry.rank === 1 ? (
                    <Crown className="h-4 w-4" />
                  ) : (
                    `#${entry.rank}`
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {entry.name}
                    {entry.isYou && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        You
                      </Badge>
                    )}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {entry.points.toLocaleString()} pts
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
