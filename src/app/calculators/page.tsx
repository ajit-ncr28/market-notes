import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calculators",
  description: "Simple investing calculators for personal research — SIP and more.",
};

const CALCULATORS = [
  {
    href: "/calculators/sip",
    title: "SIP calculator",
    summary: "Monthly investment, years, and expected return → estimated maturity value.",
  },
];

export default function CalculatorsPage() {
  return (
    <div className="mx-auto max-w-[680px]">
      <header className="mb-8">
        <h1 className="font-serif text-4xl tracking-tight">Calculators</h1>
        <p className="mt-3 text-[var(--muted)]">
          Tools for your own research. Estimates only — not advice and not a guarantee of returns.
        </p>
      </header>

      <div className="grid gap-4">
        {CALCULATORS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/40"
          >
            <h2 className="font-serif text-xl tracking-tight">{item.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{item.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
