import type { Metadata } from "next";
import Link from "next/link";
import { FvCalculator } from "@/components/FvCalculator";

export const metadata: Metadata = {
  title: "Future Value calculator",
  description:
    "Calculate the future value of a present amount that grows at a given annual rate for a certain number of years, with different compounding frequencies.",
};

export default function FvCalculatorPage() {
  return (
    <div>
      <Link
        href="/calculators"
        className="text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
      >
        ← All calculators
      </Link>

      <header className="mt-5 mb-8 max-w-[680px]">
        <h1 className="font-serif text-4xl tracking-tight">Future Value calculator</h1>
        <p className="mt-3 text-[var(--muted)]">
          See how a present amount grows over time when it increases at a rate you choose, for the number of years you set. Change the rate or period anytime — the result, table and graph update instantly.
        </p>
      </header>

      <FvCalculator />

      <section className="mt-12 max-w-[680px] text-sm text-[var(--muted)] space-y-3">
        <h2 className="font-serif text-xl text-[var(--text)]">Brief explanation</h2>
        <p>
          <strong>What this calculator does:</strong> It takes the amount you have today (Present Value) and grows it at the annual rate you enter, for the number of years you choose. The growth is compounded according to the frequency you pick (yearly, quarterly or monthly).
        </p>
        <p>
          <strong>You can freely change:</strong>
          <br />• The growth rate (type any percentage or use the quick buttons)
          <br />• The number of years (period)
          <br />• How often the growth compounds
        </p>
        <p>
          <strong>What you get:</strong>
          <br />• Final Future Value
          <br />• A year-wise table showing start, growth and end of each year
          <br />• A simple graph showing how the value rises over the years
        </p>
        <p>
          Formula: FV = PV × (1 + r/m)^(m × n)
          <br />
          Estimates only — markets do not give fixed returns.
        </p>
      </section>
    </div>
  );
}
