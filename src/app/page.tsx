import Link from "next/link";
import { Heart, Building2, User } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">
              RecoverPath
            </span>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Post-Discharge Care,{" "}
            <span className="text-primary">Simplified</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            RecoverPath connects hospitals and patients for seamless
            post-discharge monitoring. Track vitals, manage medications, and
            prevent readmissions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/register?role=HOSPITAL"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition"
            >
              <Building2 className="h-5 w-5" />
              Hospital Sign Up
            </Link>
            <Link
              href="/register?role=PATIENT"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-accent transition"
            >
              <User className="h-5 w-5" />
              Patient Sign Up
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 px-4">
          <FeatureCard
            title="Discharge Plans"
            description="Hospitals create digital discharge plans that sync instantly to the patient's app."
            icon="clipboard"
          />
          <FeatureCard
            title="Vitals Tracking"
            description="Patients log daily vitals — blood pressure, weight, glucose, and temperature."
            icon="activity"
          />
          <FeatureCard
            title="Medication Adherence"
            description="Daily medication checklists ensure patients stay on track with their prescriptions."
            icon="pill"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} RecoverPath. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-2">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
