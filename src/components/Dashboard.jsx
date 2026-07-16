import { fmt, fmtDateFull } from "../utils/calculations";

export default function Dashboard({ stats }) {
  return (
    <div className="card" style={{ textAlign: "center", marginBottom: 12 }}>
      {stats.firstDate && (
        <div style={{ fontSize: 12, color: "var(--faint)", marginBottom: 12 }}>
          Dal {fmtDateFull(stats.firstDate)}
        </div>
      )}

      {/* Consumo medio grande */}
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--faint)",
          marginBottom: 6,
        }}
      >
        Consumo medio
      </div>
      <div
        className="mono"
        style={{
          fontSize: 52,
          lineHeight: 1,
          fontWeight: 500,
          color: "var(--amber)",
          textShadow: "0 0 24px rgba(242,163,60,0.35)",
        }}
      >
        {fmt(stats.avgKmPerL, 1)}
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
        km/l
        {stats.avgLPer100 != null && (
          <span style={{ color: "var(--faint)" }}>
            {" "}
            · {fmt(stats.avgLPer100, 1)} L/100km
          </span>
        )}
      </div>

      {/* Griglia statistiche */}
      <div className="grid-2" style={{ marginTop: 16 }}>
        <StatBox label="Km tracciati" value={fmt(stats.trackedKm, 0)} unit="km" />
        <StatBox
          label="Rifornimenti"
          value={stats.refuelCount}
          unit=""
        />
        <StatBox label="Spesa totale" value={fmt(stats.totalSpent, 2)} unit="€" />
        <StatBox
          label="Litri totali"
          value={fmt(stats.totalLiters, 1)}
          unit="L"
        />
      </div>
    </div>
  );
}

function StatBox({ label, value, unit }) {
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
