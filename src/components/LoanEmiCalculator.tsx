"use client";

import { useMemo, useState } from "react";

type ScheduleRow = {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
};

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function formatInrExact(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState("500000");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const p = Number(principal);
    const annualRate = Number(rate);
    const y = Number(years);

    if (
      !Number.isFinite(p) ||
      !Number.isFinite(annualRate) ||
      !Number.isFinite(y) ||
      p <= 0 ||
      annualRate < 0 ||
      y <= 0
    ) {
      return null;
    }

    const n = Math.round(y * 12);
    const r = annualRate / 12 / 100;

    let emi: number;
    if (r === 0) {
      emi = p / n;
    } else {
      emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const schedule: ScheduleRow[] = [];
    let balance = p;
    let totalInterest = 0;
    let totalPrincipal = 0;

    for (let month = 1; month <= n; month++) {
      const interest = balance * r;
      let principalPart = emi - interest;

      // Last installment adjustment for rounding
      if (month === n) {
        principalPart = balance;
        emi = principalPart + interest;
      }

      balance = Math.max(0, balance - principalPart);
      totalInterest += interest;
      totalPrincipal += principalPart;

      schedule.push({
        month,
        emi,
        principal: principalPart,
        interest,
        balance,
      });
    }

    return {
      emi: schedule[0]?.emi ?? emi,
      months: n,
      totalInterest,
      totalPrincipal,
      totalPayment: totalPrincipal + totalInterest,
      schedule,
    };
  }, [principal, rate, years]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-serif text-2xl tracking-tight">Loan details</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Change any number. Results update at once.</p>

          <div className="mt-6 space-y-5">
            <Field
              label="Loan amount (₹)"
              value={principal}
              onChange={setPrincipal}
              hint="Principal amount borrowed"
            />
            <Field
              label="Interest rate (% per year)"
              value={rate}
              onChange={setRate}
              hint="Annual interest rate charged by the lender"
            />
            <Field
              label="Tenure (years)"
              value={years}
              onChange={setYears}
              hint="How many years you will repay the loan"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-serif text-2xl tracking-tight">Summary</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Estimates for your own notes. Not a bank quote.</p>

          {result ? (
            <div className="mt-6 space-y-4">
              <ResultRow label="Monthly EMI" value={formatInrExact(result.emi)} strong />
              <ResultRow label="Total principal" value={formatInr(result.totalPrincipal)} />
              <ResultRow label="Total interest paid" value={formatInr(result.totalInterest)} accent />
              <ResultRow label="Total amount paid" value={formatInr(result.totalPayment)} />
              <p className="pt-2 text-xs text-[var(--muted)]">
                {result.months} installments · reducing-balance method
              </p>
            </div>
          ) : (
            <p className="mt-6 text-sm text-[var(--muted)]">Enter valid loan amount, rate, and years.</p>
          )}
        </div>
      </div>

      {result ? (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-serif text-2xl tracking-tight">Installment schedule</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Each row shows EMI, interest, principal, and remaining balance for that month.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                  <th className="py-2 pr-3 font-medium">Month</th>
                  <th className="py-2 pr-3 font-medium">EMI</th>
                  <th className="py-2 pr-3 font-medium">Principal</th>
                  <th className="py-2 pr-3 font-medium">Interest</th>
                  <th className="py-2 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month} className="border-b border-[var(--line)]/70">
                    <td className="py-2 pr-3">{row.month}</td>
                    <td className="py-2 pr-3">{formatInrExact(row.emi)}</td>
                    <td className="py-2 pr-3">{formatInrExact(row.principal)}</td>
                    <td className="py-2 pr-3">{formatInrExact(row.interest)}</td>
                    <td className="py-2">{formatInrExact(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
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
