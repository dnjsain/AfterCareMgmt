"use client";

import { BottomNav } from "@/components/shared/bottom-nav";
import { LayoutDashboard, Users, FilePlus, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const hospitalNavItems = [
  { href: "/hospital/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hospital/patients", label: "Patients", icon: Users },
  { href: "/hospital/discharge/new", label: "Discharge", icon: FilePlus },
];

export default function HospitalLayout({
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
            RecoverPath — Hospital
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
      <BottomNav items={hospitalNavItems} />
    </div>
  );
}
