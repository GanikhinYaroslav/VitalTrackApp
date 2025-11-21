

// Daten aus localStorage lesen oder neu initialisieren
function loadEntries() {
  const data = localStorage.getItem('tagebuchEntries');
  return data ? JSON.parse(data) : [];
}

// Formular zurücksetzen
function resetForm() {
  document.getElementById('entry-form').reset();
  document.getElementById('stresslevel').value = '';
  document.getElementById('schlafqualitat').value = '';
  document.getElementById('entry-index').value = '';
  document.getElementById('save-button').textContent = 'Speichern';
  document.getElementById('cancel-button').style.display = 'none';
  document.getElementById('message').textContent = '';
}

function validateEntry(entry) {
  return isValidInputScore(entry.stresslevel, 1, 10) && isValidInputScore(entry.schlafqualitat, 1, 10);
}

// Eintrag speichern
function saveEntry(entry) {
  if (!validateEntry(entry)) {
    return false;
  }
  const entries = loadEntries();
  // Neueintrag hinzufügen wenn es kein Index zum Bearbeiten gibt
  // sonst wird der bestendende Eintrag aktualisiert
  const index = document.getElementById('entry-index').value;
  if (index === '') {
    entries.push(entry);
  } else if (index >= 0 && index < entries.length) {
    entries[index] = entry;
  }else {
    console.error('Ungültiger Eintragsindex:', index);
    return false;
  }
  localStorage.setItem('tagebuchEntries', JSON.stringify(entries));
  return true;
}

//Aktuelles Datum im Format YYYY-MM-DD:MM einbinden
function updateDateField(){
  const input = document.getElementById('datum');
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - (offset * 60 * 1000));
  input.value = local.toISOString().slice(0,16);
}

// Vergleichsfunktion für Zeiten im Format "HH:MM"
function isFirstTimeBeforeOrEqualSecond(first, second) {
  const [h1, m1] = first.split(':').map(Number);
  const [h2, m2] = second.split(':').map(Number);
  return h1 < h2 || (h1 === h2 && m1 <= m2);
}

// Validierung der Score-Werte
function isValidInputScore(value, minValue, maxValue) {
  const num = Number(value);
  return Number.isInteger(num) && num >= minValue && num <= maxValue;
}

// Eintragdaten anhand des Index laden
function loadEntryData(index) {
  const entries = loadEntries();
  return entries[index];
}

function loadEntryToForm(event) {
  resetForm();
  document.getElementById('save-button').textContent = 'Ändern';
  document.getElementById('cancel-button').style.display = 'inline-block';
  const index = event.target.dataset.index;
  const entry = loadEntryData(index);
  if (entry) {
    document.getElementById('entry-index').value = index;
    document.getElementById('datum').value = entry.datum;
    document.getElementById('aufstehzeit').value = entry.aufstehzeit;
    document.getElementById('schlafenszeit').value = entry.schlafenszeit;
    document.getElementById('stresslevel').value = entry.stresslevel;
    document.getElementById('schlafqualitat').value = entry.schlafqualitat;
  }
}

function cancelEntryEdit() {
  resetForm();
  updateView();
}

function deleteEntryData(event) {
  resetForm();
  updateView();
  const index = event.target.dataset.index;
  const entry = loadEntryData(index);
  const date = new Date(entry.datum);
  const time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  if (confirm(`Möchten Sie den Eintrag von ${date.toLocaleDateString()} ${time} wirklich löschen?`)) {
    const entries = loadEntries();
    entries.splice(index, 1);
    localStorage.setItem('tagebuchEntries', JSON.stringify(entries));
    updateView();
  }
}


// Einträge im HTML anzeigen
function displayEntries() {
  const entries = loadEntries();
  const container = document.getElementById('entries-table-body');
  container.innerHTML = '';
  entries.forEach(entry => {
    const row = document.createElement('tr');
    row.classList.add('entry-row');
    row.innerHTML = `
      <td>${entries.indexOf(entry) + 1}</td>
      <td>${new Date(entry.datum).toLocaleDateString()} \n
          ${new Date(entry.datum).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
      <td>${entry.aufstehzeit}</td>
      <td>${entry.schlafenszeit}</td>
      <td>${entry.stresslevel}</td>
      <td>${entry.schlafqualitat}</td>
      <td>
      <div class="button-group">
        <button class="edit-button" onclick="loadEntryToForm(event)" data-index="${entries.indexOf(entry)}">
            <svg style="pointer-events: none;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
            </svg>
            </button>
        <button class="delete-button" onclick="deleteEntryData(event)" data-index="${entries.indexOf(entry)}">
            <svg style="pointer-events: none;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
          </svg>
        </button>
      </div>
      </td>
    `;
    container.appendChild(row);
  });
}

function updateView() {
  updateDateField();
  displayEntries();
}

function createRatingButtons(minValue, maxValue, containerId, hiddenInputId) {
  const container = document.getElementById(containerId);
  const hiddenInput = document.getElementById(hiddenInputId);
  const entryForm = document.getElementById('entry-form');
  if (!container || !hiddenInput || !entryForm) return;

  // Function to update button highlight based on hidden input value
  function updateButtonSelection() {
    const currentValue = hiddenInput.value;
    Array.from(container.children).forEach(btn => {
      btn.classList.toggle('selected', btn.value === currentValue);
    });
  }  

  for (let i = minValue; i <= maxValue; i++) {
    const button = document.createElement('button');
    button.type = 'button';   
    button.textContent = i;
    button.value = i;
    button.className = 'rating-btn';
    button.addEventListener('click', () => {
      hiddenInput.value = button.value;
      updateButtonSelection();
    });

  container.appendChild(button);
  // Update button selection on form reset
  entryForm.addEventListener('reset', () => {
    updateButtonSelection();
  });

  hiddenInput.value = '';
  hiddenInput.required = true;
  // Call initially to synchronize buttons with hidden input's initial value
  updateButtonSelection();

  // Optional: Observe changes to hidden input value done programmatically using MutationObserver
  const observer = new MutationObserver(updateButtonSelection);
  observer.observe(hiddenInput, { attributes: true, attributeFilter: ['value'] });
  }
}
function initialize() {
  createRatingButtons(1, 10, 'rating-buttons-stresslevel', 'stresslevel');
  createRatingButtons(1, 10, 'rating-buttons-schlafqualitat', 'schlafqualitat');
  resetForm();
  updateView();
}

window.addEventListener('load', initialize);

// Formulareinreichung verarbeiten
document.getElementById('entry-form').addEventListener('submit', e => {
  e.preventDefault();
  const wakeUp = e.target.aufstehzeit.value;
  const sleep = e.target.schlafenszeit.value;
  if (!stresslevel.value || !schlafqualitat.value) {
    e.preventDefault();
    alert('Bitte wählen Sie Stress und Schlafqualität aus.'); 
  }
  const entry = {
      datum: e.target.datum.value,
      aufstehzeit: e.target.aufstehzeit.value,
      schlafenszeit: e.target.schlafenszeit.value,
      stresslevel: e.target.stresslevel.value,
      schlafqualitat: e.target.schlafqualitat.value
    };
  let success = saveEntry(entry);
  if (success) {
    alert('Eintrag gespeichert.');
    resetForm();
    updateView();
  } else {
    console.error('Fehler beim Speichern des Eintrags. Bitte überprüfen Sie die Eingabedaten.');
  }
});

// CSV herunterladen
document.getElementById('download-csv').addEventListener('click', () => {
  const entries = loadEntries();
  if (entries.length === 0) {
    alert('Keine Daten zum Exportieren.');
    return;
  }
  // Einträge nach Datum sortieren
  entries.sort((a, b) => new Date(a.datum) - new Date(b.datum));

  const header = ['Datum', 'Aufstehzeit', 'Schlafenszeit', 'Stresslevel', 'Schlafqualitaet'];
  const rows = [header].concat(entries.map(e => [e.datum, e.aufstehzeit, e.schlafenszeit, e.stresslevel, e.schlafqualitat]));
  const csvContent = arrayToCSV(rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tagebuch-${new Date().toISOString().slice(0,16)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

// Hilfsfunktion: CSV aus Array erzeugen
function arrayToCSV(rows) {
  return rows.map(r => r.map(String)
    .map(field => `"${field.replace(/"/g, '""')}"`).join(",")).join("\n");
}

// Service Worker registrieren
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/VitalTrackApp/service-worker.js')
      .then(reg => console.log('Service Worker registriert', reg))
      .catch(err => console.error('Service Worker Registrierung fehlgeschlagen', err));
  });
}

