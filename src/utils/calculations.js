// Capacità serbatoio MG ZS Hybrid+
export const TANK_CAPACITY = 41;

/**
 * Calcola tutte le statistiche dai rifornimenti.
 *
 * Metodo "livello costante":
 * consumo del tratto = km percorsi ÷ litri del rifornimento PRECEDENTE.
 * Funziona perché si rifornisce quasi sempre allo stesso livello.
 */
export function computeStats(entries) {
  const sorted = [...entries].sort((a, b) => a.km - b.km);
  const segments = [];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    const kmDelta = cur.km - prev.km;
    const liters = prev.liters;

    if (kmDelta > 0 && liters > 0) {
      segments.push({
        fromId: prev.id,
        toId: cur.id,
        date: cur.date,
        kmDelta,
        liters,
        cost: prev.cost || 0,
        kmPerL: kmDelta / liters,
        lPer100: (liters / kmDelta) * 100,
      });
    }
  }

  // Medie ponderate su tutti i segmenti
  const totKm = segments.reduce((s, x) => s + x.kmDelta, 0);
  const totL = segments.reduce((s, x) => s + x.liters, 0);
  const totCost = segments.reduce((s, x) => s + x.cost, 0);

  // Totali assoluti (includono anche il primo rifornimento)
  const totalSpent = sorted.reduce((s, x) => s + (x.cost || 0), 0);
  const totalLiters = sorted.reduce((s, x) => s + x.liters, 0);

  // Miglior / peggior consumo
  const consumptions = segments.map((s) => s.kmPerL);
  const bestKmPerL = consumptions.length ? Math.max(...consumptions) : null;
  const worstKmPerL = consumptions.length ? Math.min(...consumptions) : null;

  // Media mobile (ultimi 5 segmenti)
  const movingAvg = computeMovingAverage(segments, 5);

  // Spesa per mese
  const monthlySpending = computeMonthlySpending(sorted);

  // Km per mese
  const monthlyKm = computeMonthlyKm(sorted);

  // Giorni medi tra rifornimenti
  const avgDaysBetween = computeAvgDaysBetween(sorted);

  // Stima km rimasti (media consumo × litri ultimo rifornimento)
  const avgKmPerL = totL > 0 ? totKm / totL : null;
  const lastEntry = sorted.length ? sorted[sorted.length - 1] : null;
  const estimatedKmRemaining =
    avgKmPerL && lastEntry ? avgKmPerL * lastEntry.liters : null;

  // Proiezione spesa annua
  const projectedYearlyCost = computeProjectedYearlyCost(monthlySpending);

  // Data primo rifornimento
  const firstDate = sorted.length ? sorted[0].date : null;

  return {
    sorted,
    segments,
    avgKmPerL,
    avgLPer100: totKm > 0 ? (totL / totKm) * 100 : null,
    costPerKm: totKm > 0 ? totCost / totKm : null,
    trackedKm: totKm,
    totalSpent,
    totalLiters,
    avgPricePerL: totalLiters > 0 ? totalSpent / totalLiters : null,
    bestKmPerL,
    worstKmPerL,
    movingAvg,
    monthlySpending,
    monthlyKm,
    avgDaysBetween,
    estimatedKmRemaining,
    projectedYearlyCost,
    firstDate,
    refuelCount: sorted.length,
  };
}

/**
 * Media mobile sugli ultimi `window` segmenti.
 * Restituisce un array con un valore per ogni segmento.
 */
function computeMovingAverage(segments, window) {
  return segments.map((seg, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = segments.slice(start, i + 1);
    const totalKm = slice.reduce((s, x) => s + x.kmDelta, 0);
    const totalL = slice.reduce((s, x) => s + x.liters, 0);
    return {
      date: seg.date,
      value: totalL > 0 ? totalKm / totalL : null,
    };
  });
}

/**
 * Raggruppa la spesa per mese (YYYY-MM).
 */
function computeMonthlySpending(sorted) {
  const map = {};
  sorted.forEach((e) => {
    const month = e.date.slice(0, 7); // "YYYY-MM"
    map[month] = (map[month] || 0) + (e.cost || 0);
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));
}

/**
 * Calcola i km percorsi per mese.
 */
function computeMonthlyKm(sorted) {
  if (sorted.length < 2) return [];

  const map = {};
  for (let i = 1; i < sorted.length; i++) {
    const month = sorted[i].date.slice(0, 7);
    const kmDelta = sorted[i].km - sorted[i - 1].km;
    map[month] = (map[month] || 0) + kmDelta;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, km]) => ({ month, km }));
}

/**
 * Giorni medi tra un rifornimento e il successivo.
 */
function computeAvgDaysBetween(sorted) {
  if (sorted.length < 2) return null;
  const first = new Date(sorted[0].date);
  const last = new Date(sorted[sorted.length - 1].date);
  const totalDays = (last - first) / (1000 * 60 * 60 * 24);
  return totalDays / (sorted.length - 1);
}

/**
 * Proiezione spesa annua: media spesa mensile × 12.
 */
function computeProjectedYearlyCost(monthlySpending) {
  if (monthlySpending.length === 0) return null;
  const avg =
    monthlySpending.reduce((s, m) => s + m.total, 0) / monthlySpending.length;
  return avg * 12;
}

/**
 * Formattazione numeri in italiano.
 */
export function fmt(n, decimals = 2) {
  if (n == null || isNaN(n)) return "—";
  return n.toLocaleString("it-IT", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formatta data ISO in DD/MM/YY.
 */
export function fmtDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

/**
 * Formatta data ISO in DD/MM/YYYY.
 */
export function fmtDateFull(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Formatta mese YYYY-MM in "Lug 2026".
 */
export function fmtMonth(yyyymm) {
  const [y, m] = yyyymm.split("-");
  const months = [
    "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
    "Lug", "Ago", "Set", "Ott", "Nov", "Dic",
  ];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}
