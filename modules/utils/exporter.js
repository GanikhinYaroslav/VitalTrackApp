import { DailyEntry } from "../data/dailyEntry.js";

// Exportdaten vorbereiten und nach dem Datum sortieren
function getSortedExportDataWithHeader(entries) {
  const header = ['Datum', 'Aufstehzeit', 'Schlafenszeit', 'Stresslevel', 'Schlafqualitat'];
  const rows = entries.map(e => {
    const entry = DailyEntry.create(e);
    if (!entry) {
      alert(`Ungültiger Eintrag ${JSON.stringify(e)} gefunden, wird übersprungen.`);
      return [];
    }
    return entry.toArray();
  });
  rows.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  return [header].concat(rows);
}

// CSV aus Array erzeugen
function arrayToCSV(rows) {
  return rows.map(r => r.map(String)
    .map(field => `"${field.replace(/"/g, '""')}"`).join(",")).join("\n");
}

// CSV herunterladen
function downloadCSV(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);  
}

export { getSortedExportDataWithHeader, arrayToCSV, downloadCSV };