import type { Metadata } from "next";
import Link from "next/link";
import { LoanEmiCalculator } from "@/components/LoanEmiCalculator";

export const metadata: Metadata = {
  title: "EMI / loan calculator",
  description:
    "Calculate monthly EMI, total interest, and installment-wise principal and interest for a loan.",
};

export default function EmiCalculatorPage() {
  return (
    <div>
      <Link
        href="/calculators"
        className="text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
      >
        ← All calculators
      </Link>

      <header className="mb-8 mt-5 max-w-[680px]">
        <h1 className="font-serif text-4xl tracking-tight">EMI / loan calculator</h1>
        <p className="mt-3 text-[var(--muted)]">
          Enter loan amount, annual interest rate, and tenure. See monthly EMI, total interest, and
          a full schedule of principal and interest paid in each installment.
        </p>
      </header>

      <LoanEmiCalculator />
    </div>
  );
}
