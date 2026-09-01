import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Coins, Home, Smartphone, Wallet } from "lucide-react";

import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aradhi — Own a slice of rent" },
      {
        name: "description",
        content:
          "Buy fractional shares of Kenyan rental property from KES 500 with M-Pesa, and claim your rent yield anytime.",
      },
      { property: "og:title", content: "Aradhi — Own a slice of rent" },
      {
        property: "og:description",
        content: "Fractional rental property investing in Kenya, powered by M-Pesa.",
      },
    ],
  }),
  component: Index,
});

const properties = [
  {
    id: "kileleshwa",
    name: "Kileleshwa Court",
    location: "Nairobi · Residential",
    image: prop1,
    yieldPa: 19.2,
    pricePerShare: 500,
    funded: 84,
  },
  {
    id: "langata",
    name: "Lang'ata Studio Loft",
    location: "Karen · Furnished",
    image: prop2,
    yieldPa: 16.8,
    pricePerShare: 320,
    funded: 65,
  },
  {
    id: "nakuru",
    name: "Nakuru Shopfront 7",
    location: "Nakuru · Commercial",
    image: prop3,
    yieldPa: 14.5,
    pricePerShare: 850,
    funded: 89,
  },
];

const ledger = [
  { label: "Rent payout · Kileleshwa", when: "14 Feb", amount: "+ KES 4,820", positive: true },
  { label: "Investment · Lang'ata", when: "02 Feb", amount: "− KES 16,000", positive: false },
  { label: "Rent payout · Nakuru", when: "14 Jan", amount: "+ KES 3,210", positive: true },
];

const fmt = (n: number) => n.toLocaleString("en-KE");

function Index() {
  const [selected, setSelected] = useState(properties[0]!);
  const [phone, setPhone] = useState("0712 345 678");
  const [amount, setAmount] = useState(5000);
  const [status, setStatus] = useState<"idle" | "pending" | "done">("idle");
  const [claimed, setClaimed] = useState(false);

  const shares = useMemo(
    () => Math.floor(amount / selected.pricePerShare),
    [amount, selected],
  );

  function pay() {
    setStatus("pending");
    setTimeout(() => setStatus("done"), 2200);
  }

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-ivory/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground font-display text-lg">
              a
            </span>
            <span className="font-display text-xl tracking-tight">aradhi</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <span className="font-medium text-foreground">Portfolio</span>
            <span>Properties</span>
            <span>Ledger</span>
          </nav>
          <div className="flex items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-xs font-medium">
            <Wallet className="size-3.5 text-primary" />
            0x7f…A2c9
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-5 py-10">
        <section className="rise">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Micro-rent yield hub
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl leading-[1.05] tracking-tight md:text-6xl">
            Own a slice of rent, <em className="text-primary not-italic">paid monthly</em>.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Buy fractional shares of Kenyan rental property from KES 500 with M-Pesa. Rent
            lands in your wallet — claim it anytime.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Coins, label: "Total invested", value: "KES 1,087,500", note: "≈ $8,340" },
            { icon: Home, label: "Shares held", value: "23,480 KHY", note: "3 properties" },
          ].map((s, i) => (
            <article
              key={s.label}
              className="rise lift rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
              style={{ animationDelay: `${80 * i}ms` }}
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <s.icon className="size-4 text-primary" />
                {s.label}
              </div>
              <p className="mt-3 font-display text-3xl tracking-tight">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
            </article>
          ))}

          <article
            className="rise lift relative overflow-hidden rounded-3xl border border-border bg-[var(--gradient-gold)] p-6 shadow-[var(--shadow-soft)]"
            style={{ animationDelay: "160ms" }}
          >
            <div className="shine pointer-events-none absolute inset-0" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground/80">
                Unclaimed yield
              </p>
              <p className="mt-3 font-display text-3xl tracking-tight text-accent-foreground">
                {claimed ? "KES 0" : "KES 14,290"}
              </p>
              <button
                onClick={() => setClaimed(true)}
                disabled={claimed}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] disabled:opacity-60"
              >
                {claimed ? <Check className="size-4" /> : <ArrowUpRight className="size-4" />}
                {claimed ? "Claimed to wallet" : "Claim yield"}
              </button>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-4">
            <h2 className="text-2xl tracking-tight">Properties</h2>
            {properties.map((p, i) => {
              const active = p.id === selected.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`rise lift flex w-full gap-4 rounded-3xl border p-4 text-left shadow-[var(--shadow-soft)] ${
                    active ? "border-primary/45 bg-cream" : "border-border bg-card"
                  }`}
                  style={{ animationDelay: `${120 + i * 90}ms` }}
                >
                  <img
                    src={p.image}
                    alt={`${p.name} in ${p.location}`}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="hidden h-28 w-36 shrink-0 rounded-2xl object-cover sm:block"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[17px] font-semibold">{p.name}</h3>
                        <p className="text-xs text-muted-foreground">{p.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-2xl leading-none text-primary">
                          {p.yieldPa}%
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          yield p.a.
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Share price{" "}
                      <span className="font-semibold text-foreground">
                        KES {fmt(p.pricePerShare)}
                      </span>
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Funded</span>
                      <span>{p.funded}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="bar-fill h-full rounded-full bg-primary"
                        style={{ width: `${p.funded}%`, animationDelay: `${300 + i * 90}ms` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <aside className="rise space-y-4 lg:sticky lg:top-24" style={{ animationDelay: "220ms" }}>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <Smartphone className="size-4 text-primary" />
                Invest via M-Pesa
              </div>
              <h3 className="mt-2 text-xl tracking-tight">{selected.name}</h3>

              <label className="mt-5 block text-xs font-medium text-muted-foreground">
                Safaricom number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-input bg-ivory px-4 py-3 text-sm outline-none transition-shadow focus:ring-4 focus:ring-[var(--ring)]"
              />

              <label className="mt-4 block text-xs font-medium text-muted-foreground">
                Amount (KES)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="mt-1.5 w-full rounded-2xl border border-input bg-ivory px-4 py-3 text-sm outline-none transition-shadow focus:ring-4 focus:ring-[var(--ring)]"
              />
              <div className="mt-2 flex gap-2">
                {[1000, 5000, 10000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      amount === v
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {fmt(v)}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-cream px-4 py-3 text-sm">
                <span className="text-muted-foreground">You receive</span>
                <span className="font-semibold">{fmt(shares)} KHY</span>
              </div>

              <button
                onClick={pay}
                disabled={status === "pending"}
                className="mt-4 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-70"
              >
                {status === "pending" ? "Sending STK push…" : "Pay with M-Pesa"}
              </button>

              {status !== "idle" && (
                <div className="rise mt-4 flex items-center gap-3 rounded-2xl border border-border bg-ivory px-4 py-3">
                  <span
                    className={`size-2.5 rounded-full ${
                      status === "pending" ? "dot-pulse bg-gold" : "bg-primary"
                    }`}
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">
                      {status === "pending" ? "Enter your M-Pesa PIN" : "Shares issued"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {status === "pending"
                        ? `KES ${fmt(amount)} to Aradhi`
                        : `${fmt(shares)} KHY sent to your wallet`}
                    </p>
                  </div>
                </div>
              )}
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Demo interface · no live payment is sent
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Recent activity
              </p>
              <ul className="mt-3 divide-y divide-border">
                {ledger.map((l) => (
                  <li key={l.label} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium">{l.label}</p>
                      <p className="text-xs text-muted-foreground">{l.when}</p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        l.positive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {l.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        aradhi · micro-rent yield hub · prototype with mock data
      </footer>
    </div>
  );
}
