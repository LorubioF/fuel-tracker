import { fmt } from "../utils/calculations";

export default function ConsumptionStats({ stats }) {
  if (stats.segments.length === 0) return null;

  return (
    <div style={{ marginBottom: 12 }}>
      <div className="section-label">Consumo</div>
      <div className="grid-2">
        <StatCard
          label="Costo per km"
          value={stats.costPerKm != null ? fmt(stats.costPerKm * 100, 1) : "—"}
          unit="cent/km"
        />
        <StatCard
          label="Prezzo medio"
          value={fmt(stats.avgPricePerL, 3)}
          unit="€/L"
        />
        <StatCard
          label="Migliore"
          value={fmt(stats.bestKmPerL, 1)}
          unit="km/l"
          color="var(--success)"
        />
        <StatCard
          label="Peggiore"
          value={fmt(stats.worstKmPerL, 1)}
          unit="km/l"
          color="var(--danger)"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, color }) {
  return (
    <div className="card-soft">
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--faint)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        className="mono"
        style={{ fontSize: 20, color: color || "var(--text)" }}
      >
        {value}{" "}
        <span style={{ fontSize: 11, color: "var(--muted)" }}>{unit}</span>
      </div>
    </div>
  );
}
