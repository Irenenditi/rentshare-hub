import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Coins,
  Loader2,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import propImage from "@/assets/prop-1.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kilimani Heights Tokenization Hub" },
      {
        name: "description",
        content:
          "Buy fractional shares of a Kilimani apartment block with M-Pesa and earn USDC rental yield.",
      },
      { property: "og:title", content: "Kilimani Heights Tokenization Hub" },
      {
        property: "og:description",
        content: "Micro-fractionalized rental yields powered by M-Pesa.",
      },
    ],
  }),
  component: Index,
});

const SHARE_PRICE = 500;
const MOCK_ADDRESS = "0x9522...Afe5";

const fmt = (n: number) => n.toLocaleString("en-KE");

function Index() {
  const [connected, setConnected] = useState(false);
  const [phone, setPhone] = useState("2547");
  const [amount, setAmount] = useState(2500);
  const [loading, setLoading] = useState(false);
  const [shares, setShares] = useState(0);
  const [rentDue, setRentDue] = useState(0);

  const estShares = useMemo(() => Math.floor((amount || 0) / SHARE_PRICE), [amount]);

  function buy() {
    if (!connected || loading || estShares < 1) return;
    setLoading(true);
    toast("STK Push sent to phone!", { description: `KES ${fmt(amount)} · ${phone}` });
    setTimeout(() => {
      setLoading(false);
      setShares((s) => s + estShares);
      setRentDue((r) => r + estShares * 0.0412);
      toast.success(`${estShares} KHY tokens minted`, {
        description: "Fractions added to your holdings.",
      });
    }, 2200);
  }

  function withdraw() {
    if (rentDue <= 0) return;
    toast.success(`$${rentDue.toFixed(4)} USDC sent to ${MOCK_ADDRESS}`);
    setRentDue(0);
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Building2 className="size-4.5" />
            </span>
            <span className="truncate font-display text-[15px] font-bold tracking-tight">
              Kilimani Heights Hub
            </span>
          </div>
          <button
            onClick={() => setConnected(true)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              connected
                ? "bg-accent text-accent-foreground ring-1 ring-primary/25"
                : "bg-foreground text-background hover:opacity-90"
            }`}
          >
            {connected ? (
              <>
                <span className="size-2 rounded-full bg-primary dot-pulse" />
                {MOCK_ADDRESS}
              </>
            ) : (
              <>
                <Wallet className="size-4" />
                Connect Wallet
              </>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="rise max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <ShieldCheck className="size-3.5" />
            Base L2 · Audited escrow
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Kilimani Heights Tokenization Hub
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Micro-fractionalized rental yields powered by M-Pesa.
          </p>
        </section>

        <section className="mt-8 grid items-start gap-5 lg:grid-cols-3">
          {/* Column 1 — property */}
          <article
            className="rise lift overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]"
            style={{ animationDelay: "60ms" }}
          >
            <div className="relative">
              <img
                src={propImage}
                alt="Block C Residential Complex in Kilimani, Nairobi"
                width={1024}
                height={768}
                loading="lazy"
                className="h-48 w-full object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-bold text-primary shadow-[var(--shadow-soft)] backdrop-blur">
                12.4% Target APY
              </span>
            </div>
            <div className="p-6">
              <h2 className="font-display text-xl font-bold tracking-tight">
                Block C Residential Complex
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Kilimani, Nairobi</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Premium multi-family apartment building generating consistent underlying cash
                flow. 1 Share fraction value is hard pegged to KES 500.
              </p>

              <div className="mt-6 flex items-center justify-between text-sm font-semibold">
                <span>84% Funded</span>
                <span className="text-muted-foreground">8,400 / 10,000</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="bar-fill h-full rounded-full bg-[var(--gradient-gold)]"
                  style={{ width: "84%", animationDelay: "320ms" }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Total Asset Pool: 10,000 KHY</p>
            </div>
          </article>

          {/* Column 2 — M-Pesa */}
          <article
            className="rise lift rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            style={{ animationDelay: "140ms" }}
          >
            <div className="flex items-center gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Smartphone className="size-4" />
              </span>
              <h2 className="font-display text-lg font-bold tracking-tight">Invest via M-Pesa</h2>
            </div>

            <label className="mt-6 block text-xs font-semibold text-muted-foreground">
              Phone Number
            </label>
            <input
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-4 focus:ring-[var(--ring)]"
            />

            <label className="mt-4 block text-xs font-semibold text-muted-foreground">
              Amount to Allocate (KES)
            </label>
            <input
              type="number"
              step={500}
              min={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-4 focus:ring-[var(--ring)]"
            />

            <p className="mt-3 rounded-xl bg-secondary px-4 py-3 text-sm">
              Estimated Shares:{" "}
              <span className="font-bold text-primary">{fmt(estShares)} KHY Tokens</span>
            </p>

            <button
              onClick={buy}
              disabled={!connected || loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.015] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending STK Prompt...
                </>
              ) : (
                "Process M-Pesa Purchase"
              )}
            </button>

            {!connected && (
              <p className="rise mt-3 flex items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs font-medium text-muted-foreground">
                <TriangleAlert className="size-3.5 shrink-0 text-primary" />
                Connect your browser wallet to unlock checkout.
              </p>
            )}
          </article>

          {/* Column 3 — holdings */}
          <article
            className="rise lift rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            style={{ animationDelay: "220ms" }}
          >
            <div className="flex items-center gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Coins className="size-4" />
              </span>
              <h2 className="font-display text-lg font-bold tracking-tight">
                Your Holdings Dashboard
              </h2>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Asset Fractions Owned
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight">
                {fmt(shares)} KHY
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Accumulated Rent Due
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight text-primary">
                ${rentDue.toFixed(4)} USDC
              </p>
            </div>

            <button
              onClick={withdraw}
              disabled={rentDue <= 0}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3.5 text-sm font-bold transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background"
            >
              {rentDue > 0 ? (
                <ArrowUpRight className="size-4 text-primary" />
              ) : (
                <CheckCircle2 className="size-4 text-muted-foreground" />
              )}
              Withdraw Earnings to Wallet
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Demo interface · no live payment is sent
            </p>
          </article>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Kilimani Heights Hub · prototype with mock data
      </footer>
    </div>
  );
}
