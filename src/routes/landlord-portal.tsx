import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CircleDashed,
  Clock,
  FileCheck,
  FileText,
  FileUp,
  Lock,
  MapPin,
  ShieldCheck,
  Upload,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/landlord-portal")({
  head: () => ({
    meta: [
      { title: "Landlord Portal — Aradhi" },
      {
        name: "description",
        content:
          "List and verify property assets on Aradhi before opening them to retail M-Pesa investors.",
      },
      { property: "og:title", content: "Landlord Portal — Aradhi" },
      {
        property: "og:description",
        content:
          "List and verify property assets on Aradhi before opening them to retail M-Pesa investors.",
      },
    ],
  }),
  component: LandlordPortal,
});

type VerificationStage = {
  id: string;
  label: string;
  description: string;
  status: "complete" | "processing" | "pending";
};

const fmt = (n: number) => n.toLocaleString("en-KE");

function LandlordPortal() {
  const [form, setForm] = useState({
    name: "Block C Residential Complex",
    location: "Kilimani, Nairobi",
    deed: "IR/123456/2026",
    goal: 5000000,
    rent: 150000,
  });

  const [files, setFiles] = useState<Record<string, boolean>>({
    title: false,
    kra: false,
    valuation: false,
  });

  const [stages, setStages] = useState<VerificationStage[]>([
    {
      id: "ardhisasa",
      label: "ArdhiSasa Title Search Verified",
      description: "Ministry of Lands digital deed verification check match successful.",
      status: "complete",
    },
    {
      id: "spv",
      label: "SPV Corporate Structure Formed",
      description: "Registered Private Limited Company ledger active.",
      status: "complete",
    },
    {
      id: "geo",
      label: "Physical On-Site Geo-Audit",
      description: "Ground surveyor dispatched to verify structural integrity.",
      status: "processing",
    },
    {
      id: "escrow",
      label: "Escrow Rent Account Connected",
      description: "Awaiting connection to corporate bank clearing partner.",
      status: "pending",
    },
  ]);

  const allComplete = useMemo(
    () => stages.every((s) => s.status === "complete"),
    [stages]
  );

  const handleFileToggle = (key: string) => {
    setFiles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (next[key]) {
        toast.success("Document uploaded", {
          description: "This is a simulated upload for the prototype.",
        });
      }
      return next;
    });
  };

  const simulateCompletion = () => {
    setStages((prev) =>
      prev.map((s) =>
        s.status === "pending" || s.status === "processing"
          ? { ...s, status: "complete" }
          : s
      )
    );
    toast.success("All verification checks passed", {
      description: "You can now publish the asset to the public pool.",
    });
  };

  const publish = () => {
    if (!allComplete) return;
    toast.success("Asset submitted for public listing", {
      description: "Pending final Aradhi compliance review.",
    });
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Building2 className="size-4.5" />
            </span>
            <span className="truncate font-display text-[15px] font-bold tracking-tight">
              Aradhi
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-input transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="rise max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <ShieldCheck className="size-3.5" />
            Back-office portal
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Landlord Verification & Listing Portal
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            List a property, upload legal documents, and track verification status before
            opening the asset to retail M-Pesa investors.
          </p>
        </section>

        <div className="mt-8 grid items-start gap-5 lg:grid-cols-3">
          {/* Left column: form + uploads */}
          <div className="rise space-y-5 lg:col-span-2" style={{ animationDelay: "80ms" }}>
            {/* Submission form */}
            <article className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <FileText className="size-4" />
                </span>
                <h2 className="font-display text-lg font-bold tracking-tight">
                  Submit a New Property Asset
                </h2>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Property Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Block C Residential Complex"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-4 focus:ring-[var(--ring)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Location / Neighborhood
                  </label>
                  <div className="relative mt-1.5">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Kilimani, Nairobi"
                      className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none transition-shadow focus:ring-4 focus:ring-[var(--ring)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    ArdhiSasa Title Deed Number
                  </label>
                  <input
                    value={form.deed}
                    onChange={(e) => setForm({ ...form, deed: e.target.value })}
                    placeholder="IR/123456/2026"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-4 focus:ring-[var(--ring)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Target Funding Goal (KES)
                  </label>
                  <input
                    type="number"
                    value={form.goal}
                    onChange={(e) =>
                      setForm({ ...form, goal: Number(e.target.value) || 0 })
                    }
                    placeholder="5,000,000"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-4 focus:ring-[var(--ring)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Current Monthly Rent Revenue (KES)
                  </label>
                  <input
                    type="number"
                    value={form.rent}
                    onChange={(e) =>
                      setForm({ ...form, rent: Number(e.target.value) || 0 })
                    }
                    placeholder="150,000"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-4 focus:ring-[var(--ring)]"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-surface p-4">
                <p className="text-sm text-muted-foreground">
                  Estimated listing capacity:{" "}
                  <span className="font-bold text-primary">
                    {fmt(Math.floor(form.goal / 500))} KHY shares
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  1 KHY = KES 500 · projected monthly yield pool KES {fmt(form.rent)}
                </p>
              </div>
            </article>

            {/* Document upload zones */}
            <article className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <FileUp className="size-4" />
                </span>
                <h2 className="font-display text-lg font-bold tracking-tight">
                  Document Upload & Compliance
                </h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <UploadZone
                  label="Digital Title Copy (PDF)"
                  done={files.title}
                  onClick={() => handleFileToggle("title")}
                />
                <UploadZone
                  label="KRA PIN & ID Document"
                  done={files.kra}
                  onClick={() => handleFileToggle("kra")}
                />
                <UploadZone
                  label="Certified Valuation Report (ISK Approved)"
                  done={files.valuation}
                  onClick={() => handleFileToggle("valuation")}
                />
              </div>
            </article>
          </div>

          {/* Right column: verification radar */}
          <aside
            className="rise rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            style={{ animationDelay: "160ms" }}
          >
            <div className="flex items-center gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Clock className="size-4" />
              </span>
              <h2 className="font-display text-lg font-bold tracking-tight">
                Asset Verification Progress
              </h2>
            </div>

            <div className="relative mt-6 pl-4">
              <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />
              <div className="space-y-6">
                {stages.map((stage) => (
                  <StageItem key={stage.id} stage={stage} />
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-surface p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Verification is performed by Aradhi&apos;s compliance partners. Each stage
                must be complete before the asset can be published to retail investors.
              </p>
            </div>

            <button
              onClick={simulateCompletion}
              className="mt-4 w-full rounded-xl border border-border bg-background py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary"
            >
              Simulate remaining checks pass
            </button>
          </aside>
        </div>

        {/* CTA */}
        <section
          className="rise mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
          style={{ animationDelay: "240ms" }}
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight">
                Ready to list this asset?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Once published, the property will be visible to all Aradhi retail investors.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <button
                onClick={publish}
                disabled={!allComplete}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:scale-[1.015] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
              >
                <Wallet className="size-4" />
                Publish Asset to Public M-Pesa Pool
              </button>
            </div>
          </div>
          {!allComplete && (
            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <CircleDashed className="size-4 shrink-0 text-amber-500" />
              <span>
                ⚠️ All 4 verification stages must be complete before listing goes live.
              </span>
            </p>
          )}
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Aradhi · Fractional real estate for Kenya · Demo prototype
      </footer>
    </div>
  );
}

function UploadZone({
  label,
  done,
  onClick,
}: {
  label: string;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-5 text-center transition-all hover:bg-surface ${
        done
          ? "border-primary/40 bg-emerald-soft/30"
          : "border-input bg-surface/50"
      }`}
    >
      <span
        className={`grid size-10 place-items-center rounded-full ${
          done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
        }`}
      >
        {done ? <FileCheck className="size-5" /> : <Upload className="size-5" />}
      </span>
      <span className="text-xs font-semibold leading-snug text-foreground">{label}</span>
      {done && (
        <span className="flex items-center gap-1 text-xs font-semibold text-primary">
          <CheckCircle2 className="size-3.5" />
          Uploaded
        </span>
      )}
    </button>
  );
}

function StageItem({ stage }: { stage: VerificationStage }) {
  const icon =
    stage.status === "complete" ? (
      <CheckCircle2 className="size-4 text-primary" />
    ) : stage.status === "processing" ? (
      <Clock className="size-4 text-amber-500" />
    ) : (
      <Lock className="size-4 text-muted-foreground" />
    );

  const ringColor =
    stage.status === "complete"
      ? "ring-primary/30 bg-primary"
      : stage.status === "processing"
        ? "ring-amber-500/30 bg-amber-500"
        : "ring-muted-foreground/20 bg-muted-foreground";

  return (
    <div className="relative flex gap-4">
      <span
        className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full ring-4 ${ringColor} text-primary-foreground`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-display text-sm font-bold tracking-tight text-foreground">
          {stage.label}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {stage.description}
        </p>
        <span
          className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            stage.status === "complete"
              ? "bg-emerald-soft/40 text-primary"
              : stage.status === "processing"
                ? "bg-amber-100 text-amber-700"
                : "bg-secondary text-muted-foreground"
          }`}
        >
          {stage.status === "complete" && <CheckCircle2 className="size-3" />}
          {stage.status === "processing" && <Clock className="size-3" />}
          {stage.status === "pending" && <Lock className="size-3" />}
          {stage.status}
        </span>
      </div>
    </div>
  );
}
