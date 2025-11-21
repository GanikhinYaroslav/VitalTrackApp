// Hilfsfunktion: CSV aus Array erzeugen
function arrayToCSV(rows) {
  return rows.map(r => r.map(String)
    .map(field => `"${field.replace(/"/g, '""')}"`).join(",")).join("\n");
}

// Daten aus localStorage lesen oder neu initialisieren
function loadEntries() {
  const data = localStorage.getItem('tagebuchEntries');
  return data ? JSON.parse(data) : [];
}

// Eintrag speichern
function saveEntry(entry) {
  const entries = loadEntries();
  entries.push(entry);
  localStorage.setItem('tagebuchEntries', JSON.stringify(entries));
}

// Formulareinreichung verarbeiten
document.getElementById('entry-form').addEventListener('submit', e => {
  e.preventDefault();
  const entry = {
    datum: new Date().toLocaleDateString(),
    aufstehzeit: e.target.aufstehzeit.value,
    schlafenszeit: e.target.schlafenszeit.value,
    stresslevel: e.target.stresslevel.value,
    schlafqualitat: e.target.schlafqualitat.value
  };
  saveEntry(entry);
  document.getElementById('message').textContent = 'Eintrag gespeichert!';
  e.target.reset();
});

// CSV herunterladen
document.getElementById('download-csv').addEventListener('click', () => {
  const entries = loadEntries();
  if (entries.length === 0) {
    alert('Keine Daten zum Exportieren.');
    return;
  }
  const header = ['Datum', 'Aufstehzeit', 'Schlafenszeit', 'Stresslevel', 'Schlafqualitaet'];
  const rows = [header].concat(entries.map(e => [e.datum, e.aufstehzeit, e.schlafenszeit, e.stresslevel, e.schlafqualitat]));
  const csvContent = arrayToCSV(rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tagebuch.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// Service Worker registrieren
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registriert', reg))
      .catch(err => console.error('Service Worker Registrierung fehlgeschlagen', err));
  });
}
