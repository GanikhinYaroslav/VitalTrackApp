export const ENTRY_LIST_KEY = 'tagebuchEntries';

// Daten aus localStorage lesen oder neu initialisieren
function getEntries() {
  const data = localStorage.getItem(ENTRY_LIST_KEY);
  return data ? JSON.parse(data) : [];
}

// Eintrag mit einem Index laden
function getEntryAt(index) {
  const entries = getEntries();
  return entries[index];
}

// Neuer Eintrag speichern
function addEntry(entry) {
  const entries = getEntries();
  entries.push(entry);
  localStorage.setItem(ENTRY_LIST_KEY, JSON.stringify(entries));
}

//Bestehenden Eintrag bearbeiten
function replaceEntry(entry, index) {
  const entries = getEntries();
  if (index >= 0 && index < entries.length) {
    entries[index] = entry;
    localStorage.setItem(ENTRY_LIST_KEY, JSON.stringify(entries));
  }
}

// Eintrag löschen
function deleteEntry(index) {
  const entries = getEntries();
  entries.splice(index, 1);
  localStorage.setItem(ENTRY_LIST_KEY, JSON.stringify(entries));
}

export { getEntries, getEntryAt, addEntry, replaceEntry, deleteEntry };