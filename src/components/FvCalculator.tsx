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

export function FvCalculator() {
  const [pv, setPv] = useState("100000");
  const [annualRate, setAnnualRate] = useState("12");
  const [years, setYears] = useState("10");
  const [compounding, setCompounding] = useState("12"); // 1 = yearly, 4 = quarterly, 12 = monthly

  const quickRates = [8, 10, 12, 15];

  const result = useMemo(() => {
    const present = Number(pv);
    const r = Number(annualRate);
    const n = Number(years);
    const m = Number(compounding);

    if (
      !Number.isFinite(present) ||
      !Number.isFinite(r) ||
      !Number.isFinite(n) ||
      !Number.isFinite(m) ||
      present < 0 ||
      r < 0 ||
      n <= 0 ||
      m < 1
    ) {
      return null;
    }

    const ratePerPeriod = r / 100 / m;
    const totalPeriods = n * m;

    const fv = present * Math.pow(1 + ratePerPeriod, totalPeriods);
    const growth = fv - present;

    // Year-wise data for table + graph
    const yearly: { year: number; start: number; end: number; growth: number }[] = [];
    let current = present;
    const maxYears = Math.min(Math.ceil(n), 40); // cap display at 40 years

    for (let y = 1; y <= maxYears; y++) {
      const periodsThisYear = m;
      const next = current * Math.pow(1 + ratePerPeriod, periodsThisYear);
      yearly.push({
        year: y,
        start: current,
        end: next,
        growth: next - current,
      });
      current = next;
    }

    return {
      fv,
      growth,
      present,
      yearly,
      effectiveAnnual: (Math.pow(1 + ratePerPeriod, m) - 1) * 100,
    };
  }, [pv, annualRate, years, compounding]);

  const comparison = useMemo(() => {
    const present = Number(pv);
    const n = Number(years);
    const m = Number(compounding);
    if (!Number.isFinite(present) || present < 0 || !Number.isFinite(n) || n <= 0) return null;

    return quickRates.map((rate) => {
      const ratePerPeriod = rate / 100 / m;
      const fv = present * Math.pow(1 + ratePerPeriod, n * m);
      return { rate, fv };
    });
  }, [pv, years, compounding]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Inputs */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-serif text-2xl tracking-tight">Inputs</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Change the rate or number of years anytime. Results, table and graph update instantly.
          </p>

          <div className="mt-6 space-y-5">
            <Field
              label="Present Value (₹)"
              value={pv}
              onChange={setPv}
              hint="Starting amount today"
            />

            <div>
              <span className="text-sm font-medium text-[var(--text)]">Annual growth rate (%)</span>
              <div className="mt-1.5 flex flex-wrap gap-2 items-center">
                {quickRates.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAnnualRate(String(r))}
                    className={`rounded-full px-3 py-1 text-sm border ${
                      Number(annualRate) === r
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
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="w-24 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-sm outline-none focus:ring-2 ring-[var(--accent)]"
                />
              </div>
              <span className="mt-1 block text-xs text-[var(--muted)]">
                Rate at which the present value increases every year (you can type any rate)
              </span>
            </div>

            <Field
              label="Number of years (period)"
              value={years}
              onChange={setYears}
              hint="How many years the growth continues — change this freely"
            />

            <div>
              <span className="text-sm font-medium text-[var(--text)]">Compounding frequency</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {[
                  { value: "1", label: "Yearly" },
                  { value: "4", label: "Quarterly" },
                  { value: "12", label: "Monthly" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCompounding(opt.value)}
                    className={`rounded-full px-3 py-1 text-sm border ${
                      compounding === opt.value
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--line)] text-[var(--muted)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <span className="mt-1 block text-xs text-[var(--muted)]">
                How often the growth is applied (monthly compounding gives slightly higher result)
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-serif text-2xl tracking-tight">Future Value</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Estimated value after the growth period. Estimates only.
          </p>

          {result ? (
            <div className="mt-6 space-y-4">
              <ResultRow
                label="Future Value"
                value={`${formatInr(result.fv)} (${formatLakhs(result.fv)})`}
                strong
                accent
              />
              <ResultRow label="Starting amount" value={formatInr(result.present)} />
              <ResultRow label="Total growth" value={formatInr(result.growth)} />
              <ResultRow
                label="Effective annual rate"
                value={`${result.effectiveAnnual.toFixed(2)}%`}
              />

              <p className="pt-2 text-xs text-[var(--muted)]">
                Formula: FV = PV × (1 + r/m)^(m × n)
                <br />
                r = annual rate, m = compounding times per year, n = years.
              </p>

              {comparison && (
                <div className="mt-6 border-t border-[var(--line)] pt-4">
                  <p className="text-sm font-medium text-[var(--text)]">Quick comparison</p>
                  <div className="mt-2 space-y-1 text-sm">
                    {comparison.map((item) => (
                      <div key={item.rate} className="flex justify-between">
                        <span className="text-[var(--muted)]">{item.rate}% rate</span>
                        <span>{formatInr(item.fv)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[var(--muted)]">Enter valid numbers to see the result.</p>
          )}
        </div>
      </div>

      {/* Graph */}
      {result && result.yearly.length > 1 && (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-serif text-2xl tracking-tight">Growth graph</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            How the present value grows year by year at the rate you chose.
          </p>
          <div className="mt-4">
            <GrowthChart yearly={result.yearly} />
          </div>
        </div>
      )}

      {/* Table */}
      {result && result.yearly.length > 0 && (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-serif text-2xl tracking-tight">Year-wise table</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Detailed growth for each year (showing up to 40 years).
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                  <th className="pb-2 pr-4">Year</th>
                  <th className="pb-2 pr-4 text-right">Start of year</th>
                  <th className="pb-2 pr-4 text-right">Growth</th>
                  <th className="pb-2 text-right">End of year</th>
                </tr>
              </thead>
              <tbody>
                {result.yearly.map((row) => (
                  <tr key={row.year} className="border-b border-[var(--line)] last:border-0">
                    <td className="py-2 pr-4">{row.year}</td>
                    <td className="py-2 pr-4 text-right">{formatInr(row.start)}</td>
                    <td className="py-2 pr-4 text-right text-[var(--accent)]">{formatInr(row.growth)}</td>
                    <td className="py-2 text-right font-medium">{formatInr(row.end)}</td>
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

function GrowthChart({
  yearly,
}: {
  yearly: { year: number; end: number }[];
}) {
  if (yearly.length < 2) return null;

  const values = yearly.map((d) => d.end);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = yearly.map((d, i) => {
    const x = padding.left + (i / (yearly.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.end - minVal) / range) * chartHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Future value growth chart">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padding.top + chartHeight * (1 - t);
        return (
          <line
            key={t}
            x1={padding.left}
            y1={y}
            x2={width - padding.right}
            y2={y}
            stroke="var(--line)"
            strokeWidth="1"
          />
        );
      })}

      {/* Line */}
      <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2.5" />

      {/* Points */}
      {yearly.map((d, i) => {
        const x = padding.left + (i / (yearly.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((d.end - minVal) / range) * chartHeight;
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)" />;
      })}

      {/* X labels (every few years) */}
      {yearly.map((d, i) => {
        if (i % Math.ceil(yearly.length / 6) !== 0 && i !== yearly.length - 1) return null;
        const x = padding.left + (i / (yearly.length - 1)) * chartWidth;
        return (
          <text key={i} x={x} y={height - 8} textAnchor="middle" fontSize="11" fill="var(--muted)">
            {d.year}
          </text>
        );
      })}

      {/* Y labels */}
      {[0, 0.5, 1].map((t) => {
        const val = minVal + range * t;
        const y = padding.top + chartHeight * (1 - t);
        return (
          <text key={t} x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--muted)">
            {formatLakhs(val)}
          </text>
        );
      })}
    </svg>
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
