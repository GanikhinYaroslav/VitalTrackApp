// Die Nutzereingabe bis zum nächsten Submit im Cache speichern
// Datum der Erfassung wird nicht gecached
function save(cacheKey, entry) {
  localStorage.setItem(cacheKey, JSON.stringify(entry));  
}

// Gespeicherte Eingabe aus dem Cache holen
function getCachedData(cacheKey) {
  const cachedData = localStorage.getItem(cacheKey);
  return cachedData ? JSON.parse(cachedData) : null;
}

// Cache nach dem Speichern löschen
function clear(cacheKey) {
  localStorage.removeItem(cacheKey);
}

export { save, getCachedData, clear };