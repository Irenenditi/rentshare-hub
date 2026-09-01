import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Coins,
  Info,
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
      { title: "Aradhi — Fractional Real Estate" },
      {
        name: "description",
        content:
          "Invest in premium Kenyan real estate from KES 500. Earn rental yield in USDC through M-Pesa.",
      },
      { property: "og:title", content: "Aradhi — Fractional Real Estate" },
      {
        property: "og:description",
        content: "Invest in premium Kenyan real estate from KES 500. Earn rental yield in USDC through M-Pesa.",
      },
    ],
  }),
  component: Index,
});

const SHARE_PRICE = 500;

// Local bridge backend. When testing the M-Pesa STK push on a real handset,
// swap this for your ngrok tunnel, e.g. "https://<id>.ngrok-free.app".
const BACKEND_URL = "http://localhost:5000";

const fmt = (n: number) => n.toLocaleString("en-KE");

function Index() {
  const [userAddress, setUserAddress] = useState("");
  const [phone, setPhone] = useState("2547");
  const [amount, setAmount] = useState(2500);
  const [loading, setLoading] = useState(false);
  const [shares, setShares] = useState(0);
  const [rentDue, setRentDue] = useState(0);

  const connected = Boolean(userAddress);
  const shortAddress = userAddress
    ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
    : "";
  const estShares = useMemo(() => Math.floor((amount || 0) / SHARE_PRICE), [amount]);

  async function connectWallet() {
    try {
      const injected = (window as unknown as {
        ethereum?: { request: (a: { method: string }) => Promise<string[]> };
      }).ethereum;
      if (!injected) {
        setUserAddress("0x9522000000000000000000000000000000000Afe5");
        toast("Demo wallet connected", {
          description: "No browser wallet detected — using a simulated address.",
        });
        return;
      }
      const accounts = await injected.request({ method: "eth_requestAccounts" });
      if (accounts?.[0]) setUserAddress(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      toast.error("Could not connect your wallet.");
    }
  }

  // Web3 direct read: refresh on-chain balances whenever the address changes.
  useEffect(() => {
    if (!userAddress) return;
    let cancelled = false;
    (async () => {
      try {
        const { readOnChainBalances } = await import("@/lib/aradhi-chain");
        const balances = await readOnChainBalances(userAddress);
        if (!balances || cancelled) return;
        setShares(balances.shares);
        setRentDue(balances.pendingRent);
      } catch (error) {
        console.error("On-chain balance read failed:", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userAddress]);

  async function buy(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!connected) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (estShares < 1) {
      toast.error(`Minimum investment is KES ${fmt(SHARE_PRICE)}.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/invest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone,
          amount: Number(amount),
          walletAddress: userAddress,
        }),
      });

      const payload = (await res.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!res.ok) {
        console.error("Invest request failed:", res.status, payload);
        toast.error(payload.error ?? `Payment failed (HTTP ${res.status})`);
        return;
      }

      toast.success(payload.message ?? "Aradhi Payment Initiated! Check handset for PIN prompt", {
        description: `KES ${fmt(amount)} · ${phone}`,
      });
      setShares((s) => s + estShares);
      setRentDue((r) => r + estShares * 0.0412);
    } catch (error) {
      console.error("Backend unreachable:", error);
      toast.error("Cannot reach the Aradhi server on port 5000.", {
        description: "Make sure the local bridge backend is running, then try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function withdraw() {
    if (rentDue <= 0) return;
    toast.success(`$${rentDue.toFixed(4)} USDC sent to ${shortAddress}`, {
      description: "Your rental earnings are on the way.",
    });
    setRentDue(0);
  }


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
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/landlord-portal"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-foreground ring-1 ring-input transition-colors hover:bg-secondary sm:inline-flex"
            >
              <ShieldCheck className="size-4" />
              Landlord Portal
            </Link>
            <button
              onClick={() => void connectWallet()}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                connected
                  ? "bg-accent text-accent-foreground ring-1 ring-primary/25"
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              {connected ? (
                <>
                  <span className="size-2 rounded-full bg-primary dot-pulse" />
                  {shortAddress}

                </>
              ) : (
                <>
                  <Wallet className="size-4" />
                  Connect Wallet
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="rise max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <ShieldCheck className="size-3.5" />
            Base L2 · Audited escrow
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Invest in Kenyan real estate, one fraction at a time
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Aradhi lets you buy shares of premium rental properties from KES 500,
            pay with M-Pesa, and receive rental yield in USDC.
          </p>
        </section>

        <section className="mt-8 grid items-start gap-5 lg:grid-cols-3">
          {/* Property showcase */}
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
                A premium multi-family apartment building with steady rental income.
                Each share is pegged to KES 500 and earns a share of monthly rent.
              </p>

              <div className="mt-6 flex items-center justify-between text-sm font-semibold">
                <span>84% Funded</span>
                <span className="text-muted-foreground">8,400 / 10,000 shares</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="bar-fill h-full rounded-full bg-primary"
                  style={{ width: "84%", animationDelay: "320ms" }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Total pool: 10,000 KHY tokens · 1 KHY = 1 share
              </p>
            </div>
          </article>

          {/* M-Pesa investment */}
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

            <p className="mt-3 text-sm text-muted-foreground">
              Enter your M-Pesa number and how much you would like to invest. We will
              send an STK push to complete payment.
            </p>

            <form onSubmit={buy}>
              <label className="mt-5 block text-xs font-semibold text-muted-foreground">
                M-Pesa Phone Number
              </label>
              <input
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="2547XX XXX XXX"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-4 focus:ring-[var(--ring)]"
              />

              <label className="mt-4 block text-xs font-semibold text-muted-foreground">
                Amount to Invest (KES)
              </label>
              <input
                type="number"
                step={500}
                min={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-4 focus:ring-[var(--ring)]"
              />

              <div className="mt-4 rounded-xl bg-secondary px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  You will receive{" "}
                  <span className="font-bold text-primary">{fmt(estShares)} KHY tokens</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  1 KHY = KES {fmt(SHARE_PRICE)}
                </p>
              </div>

              <button
                type="submit"
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
            </form>


            {!connected && (
              <p className="rise mt-3 flex items-start gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs font-medium text-muted-foreground">
                <TriangleAlert className="size-3.5 shrink-0 text-primary" />
                Connect your wallet above to unlock checkout.
              </p>
            )}
          </article>

          {/* Holdings */}
          <article
            className="rise lift rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            style={{ animationDelay: "220ms" }}
          >
            <div className="flex items-center gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Coins className="size-4" />
              </span>
              <h2 className="font-display text-lg font-bold tracking-tight">
                Your Holdings
              </h2>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Property Shares Owned
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight">
                {fmt(shares)} KHY
              </p>
              {shares === 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  No shares yet. Make your first investment to get started.
                </p>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Rental Earnings Available
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight text-primary">
                ${rentDue.toFixed(4)} USDC
              </p>
              {rentDue === 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Earnings appear here after each monthly rent payout.
                </p>
              )}
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

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-accent/40 px-3 py-2.5">
              <Info className="size-3.5 shrink-0 text-accent-foreground" />
              <p className="text-xs text-accent-foreground">
                This is a demo interface. No real payments are processed.
              </p>
            </div>
          </article>
        </section>

        {/* How it works */}
        <section className="rise mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8" style={{ animationDelay: "300ms" }}>
          <h3 className="font-display text-lg font-bold tracking-tight">How Aradhi works</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-surface p-5">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                1
              </span>
              <p className="mt-3 font-semibold text-sm">Connect your wallet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Link any browser wallet to receive your tokenized shares.
              </p>
            </div>
            <div className="rounded-2xl bg-surface p-5">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                2
              </span>
              <p className="mt-3 font-semibold text-sm">Pay with M-Pesa</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter an amount and approve the STK push on your phone.
              </p>
            </div>
            <div className="rounded-2xl bg-surface p-5">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                3
              </span>
              <p className="mt-3 font-semibold text-sm">Earn rental yield</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Receive your share of rent payouts in USDC, withdraw anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Aradhi · Fractional real estate for Kenya · Demo prototype
      </footer>
    </div>
  );
}
