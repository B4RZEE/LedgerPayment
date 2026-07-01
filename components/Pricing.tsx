"use client";

import { useState } from "react";

type Currency = "GBP" | "USD" | "EUR";

const PRICES = {
  GBP: { sym: "£", proMo: 9, proYr: 7, proYrTotal: 79, maxMo: 19, maxYr: 14, maxYrTotal: 159 },
  USD: { sym: "$", proMo: 12, proYr: 9, proYrTotal: 99, maxMo: 24, maxYr: 18, maxYrTotal: 199 },
  EUR: { sym: "€", proMo: 10, proYr: 8, proYrTotal: 89, maxMo: 21, maxYr: 16, maxYrTotal: 169 },
};

const SOON = (
  <span
    className="inline-block ml-1 text-[10px] px-1.5 py-px rounded-full font-bold"
    style={{ background: "rgba(165,180,252,0.15)", color: "var(--lav-2)" }}
  >
    Soon
  </span>
);

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [cur, setCur] = useState<Currency>("GBP");

  const p = PRICES[cur];
  const proPrice = annual ? p.proYr : p.proMo;
  const maxPrice = annual ? p.maxYr : p.maxMo;

  return (
    <section id="pricing" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--jade-1)" }}
          >
            Pricing
          </p>
          <h2
            className="font-extrabold tracking-tight mb-4"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              letterSpacing: "-0.03em",
              color: "var(--text-0)",
            }}
          >
            Simple, transparent pricing
          </h2>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "var(--text-2)" }}>
            Start free. Upgrade when you&apos;re ready. No hidden fees, no lock-in.
          </p>
        </div>

        {/* Currency selector */}
        <div className="flex justify-center mb-6">
          <div
            className="inline-flex rounded-full p-1 gap-0.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}
          >
            {(["GBP", "USD", "EUR"] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCur(c)}
                className="px-5 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150"
                style={
                  cur === c
                    ? {
                        background: "var(--glass-strong)",
                        border: "1px solid var(--border-strong)",
                        color: "var(--text-0)",
                      }
                    : { color: "var(--text-3)", border: "1px solid transparent" }
                }
              >
                {c === "GBP" ? "£ GBP" : c === "USD" ? "$ USD" : "€ EUR"}
              </button>
            ))}
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span
            className="text-sm font-medium"
            style={{ color: annual ? "var(--text-3)" : "var(--text-0)" }}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual((v) => !v)}
            className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
            style={{ background: "var(--jade-2)" }}
            aria-label="Toggle annual billing"
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: annual ? "translateX(20px)" : "translateX(0)" }}
            />
          </button>
          <span
            className="text-sm font-medium"
            style={{ color: annual ? "var(--text-0)" : "var(--text-3)" }}
          >
            Annual
          </span>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
            style={{
              background: "var(--jade-glow)",
              borderColor: "rgba(52,211,153,0.25)",
              color: "var(--jade-1)",
            }}
          >
            Save 25%
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <PriceCard
            tier="Free"
            tierColor="var(--text-3)"
            price={`${p.sym}0`}
            period=" forever"
            annualNote=""
            desc="Everything you need to get started tracking your funded trading income."
            features={[
              { included: true, text: "Up to 3 prop firms" },
              { included: true, text: "50 payouts tracked" },
              { included: true, text: "Dashboard & goals" },
              { included: true, text: "Install on phone (PWA)" },
              { included: true, text: "PIN lock screen" },
              { included: false, text: "Statistics & charts" },
              { included: false, text: "Calendar & journal" },
              { included: false, text: "Cost tracking" },
              { included: false, text: "Export (CSV & JSON)" },
            ]}
            cta="Get started free"
            ctaStyle="outline"
          />
          <PriceCard
            tier="Pro"
            tierColor="var(--jade-1)"
            price={`${p.sym}${proPrice}`}
            period="/mo"
            annualNote={annual ? `Billed ${p.sym}${p.proYrTotal}/year` : ""}
            desc="For traders running multiple firms who need the full picture of their business."
            popular
            features={[
              { included: true, text: "Unlimited firms & payouts", bold: true },
              { included: true, text: "Full dashboard & statistics" },
              { included: true, text: "Calendar & trading journal" },
              { included: true, text: "Cost & expense tracking" },
              { included: true, text: "CSV & JSON export" },
              { included: true, text: "Data backup & restore" },
              { included: true, text: <>Tax estimate {SOON}</> },
              { included: true, text: "Priority email support" },
              { included: false, text: "Community benchmarks" },
            ]}
            cta="Start Pro free for 7 days"
            ctaStyle="jade"
          />
          <PriceCard
            tier="Max"
            tierColor="var(--lav-1)"
            price={`${p.sym}${maxPrice}`}
            period="/mo"
            annualNote={annual ? `Billed ${p.sym}${p.maxYrTotal}/year` : ""}
            desc="For serious funded traders who want every edge — including how they compare to peers."
            features={[
              { included: true, text: "Everything in Pro", bold: true },
              { included: true, text: <>Community benchmarking {SOON}</> },
              { included: true, text: <>Push notifications {SOON}</> },
              { included: true, text: <>Peer payout comparison {SOON}</> },
              { included: true, text: <>White-label PDF reports {SOON}</> },
              { included: true, text: <>API access {SOON}</> },
              { included: true, text: "Early feature access" },
              { included: true, text: "Priority live chat support" },
            ]}
            cta="Start Max free for 7 days"
            ctaStyle="lav"
          />
        </div>
      </div>
    </section>
  );
}

type FeatureItem = { included: boolean; text: React.ReactNode; bold?: boolean };

function PriceCard({
  tier,
  tierColor,
  price,
  period,
  annualNote,
  desc,
  popular,
  features,
  cta,
  ctaStyle,
}: {
  tier: string;
  tierColor: string;
  price: string;
  period: string;
  annualNote: string;
  desc: string;
  popular?: boolean;
  features: FeatureItem[];
  cta: string;
  ctaStyle: "outline" | "jade" | "lav";
}) {
  return (
    <div
      className="price-card relative rounded-3xl p-8"
      style={
        popular
          ? {
              background: "rgba(16,185,129,0.04)",
              border: "1px solid rgba(52,211,153,0.35)",
              boxShadow:
                "0 0 0 1px rgba(52,211,153,0.1), 0 24px 64px rgba(0,0,0,0.4), 0 0 60px rgba(16,185,129,0.08)",
            }
          : { background: "var(--glass)", border: "1px solid var(--border)" }
      }
    >
      {/* Top shine */}
      <div
        className="absolute top-0 left-0 right-0 rounded-t-3xl pointer-events-none"
        style={{
          height: 1,
          background: popular
            ? "linear-gradient(90deg, transparent, rgba(52,211,153,0.3), transparent)"
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
        }}
      />

      {popular && (
        <span
          className="absolute top-5 right-5 text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{
            background: "linear-gradient(135deg, var(--jade-1), var(--jade-2))",
            color: "#052e1d",
          }}
        >
          Most Popular
        </span>
      )}

      <p
        className="text-[12px] font-bold uppercase tracking-widest mb-4"
        style={{ color: tierColor }}
      >
        {tier}
      </p>

      <div className="flex items-start gap-0.5 mb-1">
        <span className="text-2xl font-bold mt-2" style={{ color: "var(--text-0)" }}>
          {price[0]}
        </span>
        <span
          className="font-extrabold leading-none"
          style={{ fontSize: 48, letterSpacing: "-0.04em", color: "var(--text-0)" }}
        >
          {price.slice(1)}
        </span>
        <span className="text-base font-medium self-end mb-1.5" style={{ color: "var(--text-3)" }}>
          {period}
        </span>
      </div>

      <p className="text-[12px] mb-6 min-h-[18px]" style={{ color: "var(--text-3)" }}>
        {annualNote}
      </p>

      <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-2)" }}>
        {desc}
      </p>

      <div className="mb-6" style={{ height: 1, background: "var(--hairline)" }} />

      <ul className="flex flex-col gap-2.5 mb-8">
        {features.map((f, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm"
            style={{ color: f.included ? "var(--text-1)" : "var(--text-4)" }}
          >
            <span
              className="flex-shrink-0 mt-px"
              style={{ color: f.included ? "var(--jade-1)" : "var(--text-4)" }}
            >
              {f.included ? "✓" : "–"}
            </span>
            <span className={f.bold ? "font-semibold" : ""}>{f.text}</span>
          </li>
        ))}
      </ul>

      <a
        href="/app"
        className={`block w-full text-center py-3.5 rounded-full text-[15px] font-bold ${
          ctaStyle === "jade"
            ? "btn-jade-solid"
            : ctaStyle === "lav"
            ? "btn-lav-solid"
            : "btn-outline"
        }`}
      >
        {cta}
      </a>
    </div>
  );
}
