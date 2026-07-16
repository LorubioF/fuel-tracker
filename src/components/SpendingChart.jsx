import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fmt, fmtMonth } from "../utils/calculations";

export default function SpendingChart({ stats }) {
  if (stats.monthlySpending.length === 0) return null;

  const data = stats.monthlySpending.map((m) => ({
    month: fmtMonth(m.month),
    spesa: parseFloat(m.total.toFixed(2)),
  }));

  const avgMonthly =
    stats.monthlySpending.reduce((s, m) => s + m.total, 0) /
    stats.monthlySpending.length;

  return (
    <div style={{ marginBottom: 12 }}>
      <div className="section-label">Spesa mensile</div>
      <div
        className="card"
        style={{ padding: "16px 8px 8px", overflow: "hidden" }}
      >
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#6a727b" }}
              axisLine={{ stroke: "#2c333b" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6a727b" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#1e2329",
                border: "1px solid #2c333b",
                borderRadius: 8,
                fontSize: 13,
                color: "#e9e7e2",
              }}
              formatter={(value) => [`${fmt(value, 2)} €`, "Spesa"]}
            />
            <Bar
              dataKey="spesa"
              fill="#f2a33c"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
        <div
          className="grid-2"
          style={{ marginTop: 12, padding: "0 10px" }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--faint)",
                marginBottom: 2,
              }}
            >
              Media mensile
            </div>
            <div className="mono" style={{ fontSize: 16 }}>
              {fmt(avgMonthly, 2)}{" "}
              <span style={{ fontSize: 11, color: "var(--muted)" }}>€</span>
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--faint)",
                marginBottom: 2,
              }}
            >
              Proiezione annua
            </div>
            <div className="mono" style={{ fontSize: 16 }}>
              {fmt(stats.projectedYearlyCost, 0)}{" "}
              <span style={{ fontSize: 11, color: "var(--muted)" }}>€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
