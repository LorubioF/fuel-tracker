import { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabaseClient";
import { computeStats } from "./utils/calculations";
import Dashboard from "./components/Dashboard";
import ConsumptionStats from "./components/ConsumptionStats";
import ConsumptionChart from "./components/ConsumptionChart";
import SpendingChart from "./components/SpendingChart";
import UsageStats from "./components/UsageStats";
import RefuelForm from "./components/RefuelForm";
import RefuelList from "./components/RefuelList";
import Settings from "./components/Settings";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadEntries = async () => {
    const { data, error: err } = await supabase
      .from("refuels")
      .select("*")
      .order("km", { ascending: true });

    if (err) {
      setError("Errore nel caricamento: " + err.message);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const stats = useMemo(() => computeStats(entries), [entries]);

  const lastKm = entries.length
    ? Math.max(...entries.map((e) => e.km))
    : null;

  const handleSave = async (entry) => {
    const { error: err } = await supabase.from("refuels").insert([entry]);
    if (err) return "Errore nel salvataggio: " + err.message;
    await loadEntries();
    setShowForm(false);
    return null;
  };

  const handleDelete = async (id) => {
    const { error: err } = await supabase
      .from("refuels")
      .delete()
      .eq("id", id);
    if (err) {
      setError("Errore nell'eliminazione: " + err.message);
    } else {
      await loadEntries();
    }
  };

  const handleImport = async (data) => {
    await supabase.from("refuels").delete().neq("id", 0);
    const { error: err } = await supabase.from("refuels").insert(
      data.map((e) => ({
        date: e.date,
        km: e.km,
        liters: e.liters,
        cost: e.cost || 0,
        bars: e.bars ?? null,
        fuel_percent: e.fuel_percent ?? null,
      }))
    );
    if (err) {
      setError("Errore nell'importazione: " + err.message);
    } else {
      await loadEntries();
    }
  };

  const handleReset = async () => {
    await supabase.from("refuels").delete().neq("id", 0);
    setEntries([]);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted)",
        }}
      >
        Caricamento registro...
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--faint)",
            }}
          >
            MG ZS Hybrid+
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: "2px 0 0" }}>
            Registro carburante
          </h1>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(217,99,79,0.12)",
            border: "1px solid var(--danger)",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {error}
          <button
            className="btn-ghost"
            style={{ marginLeft: 8 }}
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      <Dashboard stats={stats} />
      <ConsumptionStats stats={stats} />
      <ConsumptionChart stats={stats} />
      <SpendingChart stats={stats} />
      <UsageStats stats={stats} />

      {!showForm && (
        <button
          className="btn-primary"
          onClick={() => setShowForm(true)}
          style={{ width: "100%", marginBottom: 20 }}
        >
          + Aggiungi rifornimento
        </button>
      )}

      {showForm && (
        <RefuelForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          lastKm={lastKm}
        />
      )}

      <RefuelList stats={stats} onDelete={handleDelete} />

      <Settings
        entries={entries}
        onImport={handleImport}
        onReset={handleReset}
      />
    </div>
  );
}
