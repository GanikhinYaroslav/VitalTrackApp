// Daten aus localStorage lesen oder neu initialisieren
function getEntries(entryListKey) {
  const data = localStorage.getItem(entryListKey);
  return data ? JSON.parse(data) : [];
}

// Eintrag mit einem Index laden
function getEntryAt(entryListKey, index) {
  const entries = getEntries(entryListKey);
  return entries[index];
}

// Neuer Eintrag speichern
function addEntry(entryListKey, entry) {
  const entries = getEntries(entryListKey);
  entries.push(entry);
  localStorage.setItem(entryListKey, JSON.stringify(entries));
}

//Bestehenden Eintrag bearbeiten
function replaceEntry(entryListKey, entry, index) {
  const entries = getEntries(entryListKey);
  if (index >= 0 && index < entries.length) {
    entries[index] = entry;
    localStorage.setItem(entryListKey, JSON.stringify(entries));
  }
}

// Eintrag löschen
function deleteEntry(entryListKey, index) {
  const entries = getEntries(entryListKey);
  entries.splice(index, 1);
  localStorage.setItem(entryListKey, JSON.stringify(entries));
}

export { getEntries, getEntryAt, addEntry, replaceEntry, deleteEntry };