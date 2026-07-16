import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { fmt, fmtDate } from "../utils/calculations";

export default function ConsumptionChart({ stats }) {
  if (stats.segments.length < 2) return null;

  const data = stats.segments.map((seg, i) => ({
    date: fmtDate(seg.date),
    kmPerL: parseFloat(seg.kmPerL.toFixed(1)),
    media:
      stats.movingAvg[i]?.value != null
        ? parseFloat(stats.movingAvg[i].value.toFixed(1))
        : null,
  }));

  return (
    <div style={{ marginBottom: 12 }}>
      <div className="section-label">Trend consumo</div>
      <div
        className="card"
        style={{ padding: "16px 8px 8px", overflow: "hidden" }}
      >
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#6a727b" }}
              axisLine={{ stroke: "#2c333b" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6a727b" }}
              axisLine={false}
              tickLine={false}
              width={35}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "#1e2329",
                border: "1px solid #2c333b",
                borderRadius: 8,
                fontSize: 13,
                color: "#e9e7e2",
              }}
              formatter={(value, name) => [
                `${fmt(value, 1)} km/l`,
                name === "kmPerL" ? "Consumo" : "Media mobile",
              ]}
            />
            {stats.avgKmPerL && (
              <ReferenceLine
                y={parseFloat(stats.avgKmPerL.toFixed(1))}
                stroke="#6a727b"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}
            <Line
              type="monotone"
              dataKey="kmPerL"
              stroke="#f2a33c"
              strokeWidth={2}
              dot={{ r: 3, fill: "#f2a33c" }}
              activeDot={{ r: 5, fill: "#f2a33c" }}
            />
            <Line
              type="monotone"
              dataKey="media"
              stroke="#98a0a8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 8,
            fontSize: 11,
            color: "var(--faint)",
          }}
        >
          <span>
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 2,
                background: "var(--amber)",
                marginRight: 4,
                verticalAlign: "middle",
              }}
            />
            Consumo
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 2,
                background: "var(--muted)",
                marginRight: 4,
                verticalAlign: "middle",
                borderTop: "1px dashed var(--muted)",
              }}
            />
            Media 5
          </span>
        </div>
      </div>
    </div>
  );
}
