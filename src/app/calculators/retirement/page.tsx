import type { Metadata } from "next";
import Link from "next/link";
import { RetirementCalculator } from "@/components/RetirementCalculator";

export const metadata: Metadata = {
  title: "Retirement / financial freedom calculator",
  description:
    "Calculate the lumpsum needed today to start withdrawing a monthly amount immediately, with step-up at inflation rate, lasting until a chosen age.",
};

export default function RetirementCalculatorPage() {
  return (
    <div>
      <Link
        href="/calculators"
        className="text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
      >
        ← All calculators
      </Link>

      <header className="mt-5 mb-8 max-w-[680px]">
        <h1 className="font-serif text-4xl tracking-tight">Retirement & financial freedom</h1>
        <p className="mt-3 text-[var(--muted)]">
          How much lumpsum do you need today so you can start withdrawing your monthly amount
          immediately, with the withdrawal stepping up every month at the inflation rate you set,
          and the money lasting until the age you choose.
        </p>
      </header>

      <RetirementCalculator />

      <section className="mt-12 max-w-[680px] text-sm text-[var(--muted)] space-y-3">
        <h2 className="font-serif text-xl text-[var(--text)]">How this works (algorithm)</h2>
        <p>
          <strong>Goal:</strong> Find the single lumpsum amount needed today so you can begin withdrawals immediately.
        </p>
        <p>
          <strong>Step 1.</strong> Start with monthly withdrawal = your current need (e.g. ₹1,00,000).
        </p>
        <p>
          <strong>Step 2.</strong> Every month:
          <br />• Withdraw the current monthly amount at the beginning of the month,
          <br />• Let the remaining balance grow at the monthly equivalent of your expected return,
          <br />• Increase next month’s withdrawal by the monthly equivalent of your inflation / step-up rate
          (for 6% yearly this is about 0.487% each month).
        </p>
        <p>
          <strong>Step 3.</strong> The calculator searches for the smallest lumpsum that keeps the balance positive for the entire period (from your current age until the age you choose, default 90).
        </p>
        <p>
          Result: the lumpsum today that supports a starting withdrawal of ₹1 lakh per month, stepping up at 6% per annum, lasting until age 90.
        </p>
        <p>
          Change any number and the result updates instantly. These are estimates only.
        </p>
      </section>
    </div>
  );
}
