import { fmt } from "../utils/calculations";

export default function UsageStats({ stats }) {
  if (stats.segments.length === 0) return null;

  // Media km al mese
  const avgKmMonth =
    stats.monthlyKm.length > 0
      ? stats.monthlyKm.reduce((s, m) => s + m.km, 0) / stats.monthlyKm.length
      : null;

  return (
    <div style={{ marginBottom: 12 }}>
      <div className="section-label">Utilizzo</div>
      <div className="grid-2">
        <StatCard
          label="Km al mese"
          value={fmt(avgKmMonth, 0)}
          unit="km"
        />
        <StatCard
          label="Giorni tra rifornimenti"
          value={fmt(stats.avgDaysBetween, 0)}
          unit="gg"
        />
      </div>
      {stats.estimatedKmRemaining && (
        <div
          className="card-soft"
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--faint)",
                marginBottom: 2,
              }}
            >
              Stima km al prossimo rifornimento
            </div>
            <div style={{ fontSize: 12, color: "var(--faint)" }}>
              Basata su consumo medio × litri ultimo rifornimento
            </div>
          </div>
          <div
            className="mono"
            style={{ fontSize: 22, color: "var(--amber)", whiteSpace: "nowrap", marginLeft: 12 }}
          >
            ~{fmt(stats.estimatedKmRemaining, 0)}{" "}
            <span style={{ fontSize: 11, color: "var(--muted)" }}>km</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, unit }) {
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
      <div className="mono" style={{ fontSize: 20, color: "var(--text)" }}>
        {value}{" "}
        <span style={{ fontSize: 11, color: "var(--muted)" }}>{unit}</span>
      </div>
    </div>
  );
}
