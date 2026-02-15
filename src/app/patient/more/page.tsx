"use client";

import Link from "next/link";
import {
  Calendar,
  Trophy,
  Brain,
  FileText,
  Activity,
  History,
  Phone,
  Settings,
  HelpCircle,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

const menuItems = [
  {
    label: "Health & Tracking",
    items: [
      {
        href: "/patient/vitals/history",
        label: "Vitals History",
        subtitle: "View trends and past readings",
        icon: History,
        color: "text-blue-500",
        bg: "bg-blue-50",
      },
      {
        href: "/patient/appointments",
        label: "Appointments",
        subtitle: "Manage follow-up visits",
        icon: Calendar,
        color: "text-purple-500",
        bg: "bg-purple-50",
      },
      {
        href: "/patient/ai-insights",
        label: "AI Health Insights",
        subtitle: "Risk score & predictions",
        icon: Brain,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
      },
    ],
  },
  {
    label: "Progress",
    items: [
      {
        href: "/patient/rewards",
        label: "Rewards & Badges",
        subtitle: "Track streaks and milestones",
        icon: Trophy,
        color: "text-amber-500",
        bg: "bg-amber-50",
      },
      {
        href: "/patient/records",
        label: "Discharge Records",
        subtitle: "View hospital discharge plans",
        icon: FileText,
        color: "text-slate-500",
        bg: "bg-slate-50",
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        href: "tel:911",
        label: "Emergency - Call Care Team",
        subtitle: "Immediate assistance",
        icon: Phone,
        color: "text-red-500",
        bg: "bg-red-50",
      },
      {
        href: "#",
        label: "Help & FAQ",
        subtitle: "Common questions and guides",
        icon: HelpCircle,
        color: "text-blue-500",
        bg: "bg-blue-50",
      },
      {
        href: "#",
        label: "Privacy & Data",
        subtitle: "Your data security settings",
        icon: Shield,
        color: "text-green-500",
        bg: "bg-green-50",
      },
      {
        href: "#",
        label: "Settings",
        subtitle: "Notifications, language, units",
        icon: Settings,
        color: "text-gray-500",
        bg: "bg-gray-50",
      },
    ],
  },
];

export default function MorePage() {
  return (
    <div>
      <PageHeader title="More" subtitle="All features and settings" />

      {/* Quick action cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link href="/patient/ai-insights">
          <Card className="hover:border-primary/30 transition">
            <CardContent className="p-3 flex flex-col items-center gap-1.5">
              <div className="rounded-full bg-emerald-50 p-2.5">
                <Brain className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-xs font-medium text-center">AI Score</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/rewards">
          <Card className="hover:border-primary/30 transition">
            <CardContent className="p-3 flex flex-col items-center gap-1.5">
              <div className="rounded-full bg-amber-50 p-2.5">
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              <span className="text-xs font-medium text-center">Rewards</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/appointments">
          <Card className="hover:border-primary/30 transition">
            <CardContent className="p-3 flex flex-col items-center gap-1.5">
              <div className="rounded-full bg-purple-50 p-2.5">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-xs font-medium text-center">Appts</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Menu sections */}
      <div className="space-y-6">
        {menuItems.map((section) => (
          <div key={section.label}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.label}
            </h3>
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 p-4 hover:bg-accent/50 transition"
                  >
                    <div className={`rounded-lg ${item.bg} p-2.5 shrink-0`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.subtitle}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* App version */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>RecoverPath v1.0.0</p>
        <p className="mt-1">Your health companion for recovery</p>
      </div>
    </div>
  );
}
