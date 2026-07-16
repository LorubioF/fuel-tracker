import { useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);

export default function RefuelForm({ onSave, onCancel, lastKm }) {
  const [date, setDate] = useState(today());
  const [km, setKm] = useState("");
  const [liters, setLiters] = useState("");
  const [cost, setCost] = useState("");
  const [bars, setBars] = useState("");
  const [fuelPercent, setFuelPercent] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const parse = (v) => parseFloat(String(v).replace(",", "."));

  const handleSave = async () => {
    setError("");
    const kmVal = parse(km);
    const litersVal = parse(liters);
    const costVal = cost === "" ? 0 : parse(cost);
    const barsVal = bars === "" ? null : parseInt(bars, 10);
    const pctVal = fuelPercent === "" ? null : parseInt(fuelPercent, 10);

    if (!date || isNaN(kmVal) || kmVal <= 0) {
      setError("Inserisci una data e i km totali dell'odometro.");
      return;
    }
    if (isNaN(litersVal) || litersVal <= 0) {
      setError("Inserisci i litri riforniti.");
      return;
    }
    if (lastKm && kmVal < lastKm) {
      setError(
        `I km (${kmVal}) sono inferiori all'ultimo rifornimento (${lastKm}). Controlla l'odometro.`
      );
      return;
    }
    if (barsVal != null && (isNaN(barsVal) || barsVal < 0 || barsVal > 8)) {
      setError("Le tacche devono essere tra 0 e 8.");
      return;
    }
    if (pctVal != null && (isNaN(pctVal) || pctVal < 0 || pctVal > 100)) {
      setError("La percentuale deve essere tra 0 e 100.");
      return;
    }

    setSaving(true);
    const entry = {
      date,
      km: kmVal,
      liters: litersVal,
      cost: isNaN(costVal) ? 0 : costVal,
      bars: barsVal,
      fuel_percent: pctVal,
    };

    const err = await onSave(entry);
    if (err) {
      setError(err);
      setSaving(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        borderColor: "var(--amber)",
        marginBottom: 20,
      }}
    >
      <div className="grid-2" style={{ marginBottom: 12 }}>
        <div>
          <label className="label">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Km odometro</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="es. 4580"
            value={km}
            onChange={(e) => setKm(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Litri</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="es. 22,4"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Costo €</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="es. 38,50"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
      </div>

      {/* Campi opzionali */}
      <div className="divider">
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--faint)",
            marginBottom: 8,
          }}
        >
          Livello carburante{" "}
          <span
            style={{
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            (opzionali)
          </span>
        </div>
        <div className="grid-2">
          <div>
            <label
              className="label"
              style={{ textTransform: "none", letterSpacing: 0, fontSize: 12 }}
            >
              Tacche (cruscotto)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="es. 1"
              value={bars}
              onChange={(e) => setBars(e.target.value)}
            />
          </div>
          <div>
            <label
              className="label"
              style={{ textTransform: "none", letterSpacing: 0, fontSize: 12 }}
            >
              % (app MG)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="es. 12"
              value={fuelPercent}
              onChange={(e) => setFuelPercent(e.target.value)}
            />
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--faint)",
            marginTop: 6,
          }}
        >
          Solo informativi: appaiono nello storico ma non influenzano i calcoli.
        </div>
      </div>

      {error && <div className="error-msg" style={{ marginTop: 12 }}>{error}</div>}

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ flex: 1, opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Salvataggio..." : "Salva rifornimento"}
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          Annulla
        </button>
      </div>
    </div>
  );
}
