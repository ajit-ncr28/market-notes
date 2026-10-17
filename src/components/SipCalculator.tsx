"use client";

import { useMemo, useState } from "react";

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function SipCalculator() {
  const [monthly, setMonthly] = useState("10000");
  const [years, setYears] = useState("10");
  const [rate, setRate] = useState("12");

  const result = useMemo(() => {
    const p = Number(monthly);
    const y = Number(years);
    const r = Number(rate);

    if (!Number.isFinite(p) || !Number.isFinite(y) || !Number.isFinite(r) || p < 0 || y <= 0 || r < 0) {
      return null;
    }

    const months = y * 12;
    const monthlyRate = r / 12 / 100;

    let maturity: number;
    if (monthlyRate === 0) {
      maturity = p * months;
    } else {
      maturity = p * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    }

    const invested = p * months;
    const gains = maturity - invested;

    return { invested, maturity, gains, months };
  }, [monthly, years, rate]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="font-serif text-2xl tracking-tight">Inputs</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Change any number. Result updates at once.</p>

        <div className="mt-6 space-y-5">
          <Field
            label="Monthly investment (₹)"
            value={monthly}
            onChange={setMonthly}
            hint="How much you plan to invest every month"
          />
          <Field
            label="Time period (years)"
            value={years}
            onChange={setYears}
            hint="How long you will continue the SIP"
          />
          <Field
            label="Expected return (% per year)"
            value={rate}
            onChange={setRate}
            hint="Assumed annual return. Markets vary — this is only an estimate."
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="font-serif text-2xl tracking-tight">Result</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Estimated values only. Not a promise of returns.</p>

        {result ? (
          <div className="mt-6 space-y-4">
            <ResultRow label="Total invested" value={formatInr(result.invested)} />
            <ResultRow label="Estimated gains" value={formatInr(result.gains)} accent />
            <ResultRow label="Estimated maturity value" value={formatInr(result.maturity)} strong />
            <p className="pt-2 text-xs text-[var(--muted)]">
              Based on {result.months} monthly installments. Formula uses monthly compounding.
            </p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-[var(--muted)]">Enter valid positive numbers to see a result.</p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-[1rem] outline-none ring-[var(--accent)] focus:ring-2"
      />
      <span className="mt-1 block text-xs text-[var(--muted)]">{hint}</span>
    </label>
  );
}

function ResultRow({
  label,
  value,
  accent,
  strong,
}: {
  label: string;
  value: string;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[var(--line)] pb-3 last:border-0">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <span
        className={`font-serif text-right ${
          strong ? "text-2xl text-[var(--text)]" : accent ? "text-xl text-[var(--accent)]" : "text-lg text-[var(--text)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
