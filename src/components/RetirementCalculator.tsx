"use client";

import { useMemo, useState } from "react";

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function formatLakhs(value: number) {
  if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(2)} L`;
  return formatInr(value);
}

export function RetirementCalculator() {
  const [monthlyNeed, setMonthlyNeed] = useState("100000");
  const [inflation, setInflation] = useState("6");
  const [currentAge, setCurrentAge] = useState("30");
  const [lifeExpectancy, setLifeExpectancy] = useState("90");
  const [returnRate, setReturnRate] = useState("12");

  const result = useMemo(() => {
    const need = Number(monthlyNeed);
    const inf = Number(inflation) / 100;
    const ageNow = Number(currentAge);
    const ageEnd = Number(lifeExpectancy);
    const r = Number(returnRate) / 100;

    if (
      !Number.isFinite(need) ||
      !Number.isFinite(inf) ||
      !Number.isFinite(ageNow) ||
      !Number.isFinite(ageEnd) ||
      !Number.isFinite(r) ||
      need <= 0 ||
      inf < 0 ||
      ageEnd <= ageNow ||
      r < 0
    ) {
      return null;
    }

    const years = ageEnd - ageNow;
    const months = years * 12;
    const monthlyInf = Math.pow(1 + inf, 1 / 12) - 1;
    const monthlyRet = Math.pow(1 + r, 1 / 12) - 1;

    let low = 0;
    let high = need * months * 5;
    for (let i = 0; i < 45; i++) {
      const mid = (low + high) / 2;
      let bal = mid;
      let expense = need;
      let ok = true;
      for (let m = 0; m < months; m++) {
        bal -= expense;
        if (bal < 0) {
          ok = false;
          break;
        }
        bal *= 1 + monthlyRet;
        expense *= 1 + monthlyInf;
      }
      if (ok && bal >= 0) high = mid;
      else low = mid;
    }
    const lumpsumToday = (low + high) / 2;

    const yearly: { age: number; withdrawal: number; balance: number }[] = [];
    let bal = lumpsumToday;
    let expense = need;
    for (let y = 0; y <= years; y++) {
      yearly.push({
        age: ageNow + y,
        withdrawal: expense,
        balance: bal,
      });
      for (let m = 0; m < 12 && y < years; m++) {
        bal -= expense;
        if (bal < 0) bal = 0;
        bal *= 1 + monthlyRet;
        expense *= 1 + monthlyInf;
      }
    }

    return {
      years,
      months,
      lumpsumToday,
      monthlyInfPct: (monthlyInf * 100).toFixed(3),
      startMonthly: need,
      yearly,
    };
  }, [monthlyNeed, inflation, currentAge, lifeExpectancy, returnRate]);

  const quickRates = [8, 10, 12];

  const comparison = useMemo(() => {
    const need = Number(monthlyNeed);
    const inf = Number(inflation) / 100;
    const ageNow = Number(currentAge);
    const ageEnd = Number(lifeExpectancy);
    if (!Number.isFinite(need) || need <= 0 || ageEnd <= ageNow) return null;

    const years = ageEnd - ageNow;
    const months = years * 12;
    const monthlyInf = Math.pow(1 + inf, 1 / 12) - 1;

    return quickRates.map((rate) => {
      const r = rate / 100;
      const monthlyRet = Math.pow(1 + r, 1 / 12) - 1;
      let low = 0;
      let high = need * months * 5;
      for (let i = 0; i < 40; i++) {
        const mid = (low + high) / 2;
        let bal = mid;
        let expense = need;
        let ok = true;
        for (let m = 0; m < months; m++) {
          bal -= expense;
          if (bal < 0) {
            ok = false;
            break;
          }
          bal *= 1 + monthlyRet;
          expense *= 1 + monthlyInf;
        }
        if (ok && bal >= 0) high = mid;
        else low = mid;
      }
      return { rate, lumpsum: (low + high) / 2 };
    });
  }, [monthlyNeed, inflation, currentAge, lifeExpectancy]);

  const chart = useMemo(() => {
    if (!result?.yearly.length) return null;
    const data = result.yearly;
    const maxBal = Math.max(...data.map((d) => d.balance));
    const maxW = Math.max(...data.map((d) => d.withdrawal));
    const w = 600;
    const h = 220;
    const pad = 30;

    const balPoints = data
      .map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - (d.balance / maxBal) * (h - pad * 2);
        return `${x},${y}`;
      })
      .join(" ");

    const wPoints = data
      .map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - (d.withdrawal / maxW) * (h - pad * 2);
        return `${x},${y}`;
      })
      .join(" ");

    return { balPoints, wPoints, w, h };
  }, [result]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-serif text-2xl tracking-tight">Your numbers</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Change anything. Results update instantly.</p>

          <div className="mt-6 space-y-5">
            <Field
              label="Monthly withdrawal starting now (₹)"
              value={monthlyNeed}
              onChange={setMonthlyNeed}
              hint="First month’s withdrawal. Next months step up at the inflation rate."
            />
            <Field
              label="Step-up / inflation (% per year)"
              value={inflation}
              onChange={setInflation}
              hint="Withdrawal rises every month by the monthly equivalent of this yearly rate"
            />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Current age" value={currentAge} onChange={setCurrentAge} hint="" />
              <Field label="Money must last till age" value={lifeExpectancy} onChange={setLifeExpectancy} hint="" />
            </div>
            <div>
              <span className="text-sm font-medium text-[var(--text)]">Expected return on lumpsum (% per year)</span>
              <div className="mt-1.5 flex gap-2">
                {quickRates.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReturnRate(String(r))}
                    className={`rounded-full px-3 py-1 text-sm border ${
                      Number(returnRate) === r
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--line)] text-[var(--muted)]"
                    }`}
                  >
                    {r}%
                  </button>
                ))}
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={returnRate}
                  onChange={(e) => setReturnRate(e.target.value)}
                  className="w-20 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-sm outline-none focus:ring-2 ring-[var(--accent)]"
                />
              </div>
              <span className="mt-1 block text-xs text-[var(--muted)]">
                Return earned by the remaining balance after each withdrawal
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-serif text-2xl tracking-tight">Lumpsum for financial freedom</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Amount needed today so withdrawals can start immediately.</p>

          {result ? (
            <div className="mt-6 space-y-4">
              <ResultRow
                label="Lumpsum needed today"
                value={`${formatInr(result.lumpsumToday)} (${formatLakhs(result.lumpsumToday)})`}
                strong
                accent
              />
              <ResultRow label="First month withdrawal" value={formatInr(result.startMonthly)} />
              <ResultRow label="Step-up each month" value={`≈ ${result.monthlyInfPct}%`} />
              <p className="pt-3 text-xs text-[var(--muted)]">
                You invest this lumpsum today. Starting this month you withdraw {formatInr(result.startMonthly)},
                then every following month the withdrawal rises by ≈{result.monthlyInfPct}%
                (the monthly equivalent of {inflation}% per year).
                The remaining balance earns {returnRate}% per year. The money is designed to last until age {lifeExpectancy}
                ({result.years} years).
              </p>

              {comparison && (
                <div className="mt-6 border-t border-[var(--line)] pt-4">
                  <p className="text-sm font-medium text-[var(--text)]">Quick comparison (same inputs)</p>
                  <div className="mt-2 space-y-2">
                    {comparison.map((item) => (
                      <div key={item.rate} className="flex justify-between text-sm">
                        <span className="text-[var(--muted)]">{item.rate}% return</span>
                        <span className="font-serif">{formatLakhs(item.lumpsum)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[var(--muted)]">Enter valid numbers to see results.</p>
          )}
        </div>
      </div>

      {result && chart && (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-serif text-2xl tracking-tight">Balance & withdrawal over time</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Blue line = remaining balance · Red line = monthly withdrawal (scaled)
          </p>
          <div className="mt-4 overflow-x-auto">
            <svg viewBox={`0 0 ${chart.w} ${chart.h}`} className="w-full max-w-3xl" style={{ minWidth: 400 }}>
              <polyline fill="none" stroke="var(--accent)" strokeWidth="2.5" points={chart.balPoints} />
              <polyline fill="none" stroke="#dc2626" strokeWidth="2" points={chart.wPoints} />
            </svg>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-serif text-2xl tracking-tight">Year-wise snapshot</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Monthly withdrawal and remaining balance at the start of each year.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                  <th className="py-2 pr-4">Age</th>
                  <th className="py-2 pr-4">Monthly withdrawal</th>
                  <th className="py-2">Remaining balance</th>
                </tr>
              </thead>
              <tbody>
                {result.yearly.map((row) => (
                  <tr key={row.age} className="border-b border-[var(--line)]/60">
                    <td className="py-2 pr-4">{row.age}</td>
                    <td className="py-2 pr-4">{formatInr(row.withdrawal)}</td>
                    <td className="py-2 font-serif">{formatLakhs(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
      {hint && <span className="mt-1 block text-xs text-[var(--muted)]">{hint}</span>}
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
