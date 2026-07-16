import { fmt, fmtDate } from "../utils/calculations";

export default function RefuelList({ stats, onDelete }) {
  if (stats.sorted.length === 0) {
    return (
      <div
        style={{
          border: "1px dashed var(--border)",
          borderRadius: 12,
          padding: "28px 20px",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        Registra il tuo primo rifornimento per iniziare.
        <br />
        <span style={{ color: "var(--faint)", fontSize: 13 }}>
          Il consumo comparirà dal secondo rifornimento.
        </span>
      </div>
    );
  }

  // Mappa segmenti per id della voce di arrivo
  const segMap = {};
  stats.segments.forEach((s) => {
    segMap[s.toId] = s;
  });
  const maxKmPerL = Math.max(...stats.segments.map((s) => s.kmPerL), 1);

  return (
    <div>
      <div className="section-label">
        Rifornimenti · {stats.sorted.length}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...stats.sorted].reverse().map((e) => {
          const seg = segMap[e.id];
          return (
            <div key={e.id} className="card-soft">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div className="mono" style={{ fontSize: 15 }}>
                  {fmtDate(e.date)}
                  <span style={{ color: "var(--faint)" }}>
                    {" "}
                    · {fmt(e.km, 0)} km
                  </span>
                </div>
                <button
                  className="btn-ghost"
                  onClick={() => onDelete(e.id)}
                  aria-label="Elimina rifornimento"
                >
                  Elimina
                </button>
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                {fmt(e.liters, 1)} L
                {e.cost > 0 && <> · {fmt(e.cost, 2)} €</>}
                {e.bars != null && (
                  <span style={{ color: "var(--faint)" }}>
                    {" "}
                    · {e.bars} {e.bars === 1 ? "tacca" : "tacche"}
                  </span>
                )}
                {e.fuel_percent != null && (
                  <span style={{ color: "var(--faint)" }}>
                    {" "}
                    · {e.fuel_percent}%
                  </span>
                )}
              </div>
              {seg && (
                <div style={{ marginTop: 10 }}>
                  <div
                    className="mono"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "var(--muted)",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: "var(--amber)" }}>
                      {fmt(seg.kmPerL, 1)} km/l
                    </span>
                    <span>
                      {fmt(seg.lPer100, 1)} L/100km · {fmt(seg.kmDelta, 0)} km
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: "var(--border)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(
                          (seg.kmPerL / maxKmPerL) * 100,
                          100
                        )}%`,
                        background: "var(--amber)",
                        borderRadius: 2,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
