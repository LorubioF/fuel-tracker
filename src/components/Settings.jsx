import { useState, useMemo } from "react";

export default function Settings({ entries, onImport, onReset }) {
  const [showPanel, setShowPanel] = useState(false);
  const [importText, setImportText] = useState("");
  const [msg, setMsg] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const backupJson = useMemo(
    () => JSON.stringify(entries, null, 2),
    [entries]
  );

  const copyBackup = async () => {
    try {
      await navigator.clipboard.writeText(backupJson);
      setMsg("Copiato negli appunti ✓");
    } catch {
      setMsg("Copia non riuscita. Seleziona e copia il testo a mano.");
    }
  };

  const exportCsv = () => {
    const header = "data,km,litri,costo,tacche,percentuale\n";
    const rows = entries
      .sort((a, b) => a.km - b.km)
      .map(
        (e) =>
          `${e.date},${e.km},${e.liters},${e.cost || 0},${e.bars ?? ""},${e.fuel_percent ?? ""}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rifornimenti.csv";
    a.click();
    URL.revokeObjectURL(url);
    setMsg("CSV scaricato ✓");
  };

  const handleImport = () => {
    setMsg("");
    try {
      const parsed = JSON.parse(importText);
      const arr = Array.isArray(parsed) ? parsed : parsed.entries || parsed;
      if (!Array.isArray(arr)) throw new Error("formato non valido");
      const valid = arr.every(
        (e) => typeof e.km === "number" && typeof e.liters === "number"
      );
      if (!valid) throw new Error("voci non valide");
      onImport(arr);
      setImportText("");
      setMsg(`Ripristinati ${arr.length} rifornimenti ✓`);
    } catch {
      setMsg("JSON non valido. Controlla di aver copiato tutto.");
    }
  };

  if (!showPanel) {
    return (
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <button
          className="btn-ghost"
          onClick={() => {
            setShowPanel(true);
            setMsg("");
          }}
        >
          Backup e impostazioni
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 20 }}>
      <div className="section-label">Backup e impostazioni</div>
      <div className="card">
        {/* Esporta */}
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--faint)",
            marginBottom: 6,
          }}
        >
          Esporta
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
          Copia il JSON o scarica un CSV con tutto lo storico.
        </div>
        <textarea
          readOnly
          value={backupJson}
          onFocus={(e) => e.target.select()}
          style={{
            width: "100%",
            height: 80,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--muted)",
            fontSize: 11,
            fontFamily: "var(--mono)",
            padding: 8,
            resize: "vertical",
            outline: "none",
            marginBottom: 8,
          }}
        />
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <button
            onClick={copyBackup}
            style={{
              background: "var(--amber-dim)",
              border: "1px solid var(--amber)",
              borderRadius: 8,
              color: "var(--amber)",
              fontSize: 13,
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            Copia JSON
          </button>
          <button
            onClick={exportCsv}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--muted)",
              fontSize: 13,
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            Scarica CSV
          </button>
        </div>

        {/* Ripristina */}
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--faint)",
            marginBottom: 6,
          }}
        >
          Ripristina
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
          Incolla un backup JSON. Sostituisce i dati attuali.
        </div>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Incolla qui il JSON..."
          style={{
            width: "100%",
            height: 60,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--text)",
            fontSize: 11,
            fontFamily: "var(--mono)",
            padding: 8,
            resize: "vertical",
            outline: "none",
            marginBottom: 8,
          }}
        />
        <button
          onClick={handleImport}
          disabled={!importText.trim()}
          className="btn-secondary"
          style={{ opacity: importText.trim() ? 1 : 0.4, marginBottom: 18 }}
        >
          Ripristina dati
        </button>

        {/* Azzera */}
        <div className="divider">
          {!confirmReset ? (
            <button
              className="btn-ghost"
              style={{ color: "var(--danger)" }}
              onClick={() => setConfirmReset(true)}
            >
              Azzera tutti i dati
            </button>
          ) : (
            <div>
              <div style={{ fontSize: 14, marginBottom: 12 }}>
                Eliminare tutti i rifornimenti? L'operazione non è reversibile.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    onReset();
                    setConfirmReset(false);
                    setMsg("Dati eliminati ✓");
                  }}
                  style={{
                    background: "var(--danger)",
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    padding: "8px 14px",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Elimina tutto
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setConfirmReset(false)}
                >
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>

        {msg && (
          <div
            style={{
              fontSize: 12,
              color: msg.includes("✓") ? "var(--amber)" : "var(--danger)",
              marginTop: 8,
            }}
          >
            {msg}
          </div>
        )}

        <button
          className="btn-ghost"
          style={{ marginTop: 12 }}
          onClick={() => setShowPanel(false)}
        >
          Chiudi
        </button>
      </div>
    </div>
  );
}
