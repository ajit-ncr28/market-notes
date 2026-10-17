import type { Metadata } from "next";
import Link from "next/link";
import { SipCalculator } from "@/components/SipCalculator";

export const metadata: Metadata = {
  title: "SIP calculator",
  description: "Estimate SIP maturity value from monthly amount, years, and expected annual return.",
};

export default function SipCalculatorPage() {
  return (
    <div>
      <Link
        href="/calculators"
        className="text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
      >
        ← All calculators
      </Link>

      <header className="mt-5 mb-8 max-w-[680px]">
        <h1 className="font-serif text-4xl tracking-tight">SIP calculator</h1>
        <p className="mt-3 text-[var(--muted)]">
          Enter monthly amount, years, and an assumed annual return. The result is an estimate for
          your own notes — not a recommendation.
        </p>
      </header>

      <SipCalculator />
    </div>
  );
}
