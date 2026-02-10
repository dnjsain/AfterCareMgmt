"use client";

import { BottomNav } from "@/components/shared/bottom-nav";
import { LayoutDashboard, FileText, Activity, Pill, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const patientNavItems = [
  { href: "/patient/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/patient/records", label: "Records", icon: FileText },
  { href: "/patient/vitals/log", label: "Vitals", icon: Activity },
  { href: "/patient/medications", label: "Meds", icon: Pill },
];

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <span className="text-sm font-semibold text-primary">
            RecoverPath
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="px-4 py-6 pb-24 max-w-5xl mx-auto">{children}</main>

      {/* Bottom nav */}
      <BottomNav items={patientNavItems} />
    </div>
  );
}
