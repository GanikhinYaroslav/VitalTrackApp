const CACHE_KEY = 'tagebuchFormCache';

// Die Nutzereingabe bis zum nächsten Submit im Cache speichern
// Datum der Erfassung wird nicht gecached
function cacheFormInput(entry) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(entry));  
}

// Gespeicherte Eingabe aus dem Cache holen
function getCachedEntry() {
  const cachedData = localStorage.getItem(CACHE_KEY);
  return cachedData ? JSON.parse(cachedData) : null;
}

// Cache nach dem Speichern löschen
function clearCachedInput() {
  localStorage.removeItem(CACHE_KEY);
}

export { cacheFormInput, getCachedEntry, clearCachedInput };