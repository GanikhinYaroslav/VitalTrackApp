//#region-----------entry.js-----------
const MIN_STRESS_LEVEL = 1;
const MAX_STRESS_LEVEL = 10;
const MIN_SLEEP_QUALITY = 1;
const MAX_SLEEP_QUALITY = 10;

const ENTRY_TABLE_HEADER = ['Datum', 'Aufstehzeit', 'Schlafenszeit', 'Stresslevel', 'Schlafqualitat'];
const ENTRY_LIST_KEY = 'tagebuchEntries';

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

// Validierung des Eintrags
function isValidEntry(entry) {
  return isValidInputScore(entry.stresslevel, MIN_STRESS_LEVEL, MAX_STRESS_LEVEL) 
      && isValidInputScore(entry.schlafqualitat, MIN_SLEEP_QUALITY, MAX_SLEEP_QUALITY);
}

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
function addEntryData(entry) {
  const entries = getEntries();
  entries.push(entry);
  localStorage.setItem(ENTRY_LIST_KEY, JSON.stringify(entries));
}

//Bestehenden Eintrag bearbeiten
function replaceEntryData(entry, index) {
  const entries = getEntries();
  if (index >= 0 && index < entries.length) {
    entries[index] = entry;
    localStorage.setItem(ENTRY_LIST_KEY, JSON.stringify(entries));
  }
}

function deleteEntryData(index) {
  const entries = getEntries();
  entries.splice(index, 1);
  localStorage.setItem(ENTRY_LIST_KEY, JSON.stringify(entries));
}
//#endregion

//#region-----------cache.js-----------
const CACHE_KEY = 'tagebuchFormCache';

//Eingabe bis zum nächsten Submit im Cache speichern
// Datum der Erfassung wird nicht gecached
function cacheFormInput(form, entryIndex) {
  if (!form || !entryIndex) return;
  // Beim Bearbeiten der bestehenden Einträgen nicht cachen
  if (entryIndex !== '') {
    return;
  }
  const entry = {
    aufstehzeit: form.aufstehzeit.value,
    schlafenszeit: form.schlafenszeit.value,
    stresslevel: form.stresslevel.value,
    schlafqualitat: form.schlafqualitat.value
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(entry));  
}

// Beim Laden der Seite zwischengespeicherte Daten wiederherstellen
function restoreCachedInput(form) {
  if (!form) return;
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const entry = JSON.parse(cachedData);
    form.aufstehzeit.value = entry.aufstehzeit || '';
    form.schlafenszeit.value = entry.schlafenszeit || '';
    form.stresslevel.value = entry.stresslevel || '';
    form.schlafqualitat.value = entry.schlafqualitat || '';
  }
}

// Cache nach dem Speichern löschen
function clearCachedInput() {
  localStorage.removeItem(CACHE_KEY);
}
//#endregion--------------------

//#region-----------export.js-----------
// Exportdaten vorbereiten und nach dem Datum sortieren
function getSortedExportData(header, entries) {
  const rows = entries.map(e => [e.datum, e.aufstehzeit, e.schlafenszeit, Number(e.stresslevel), Number(e.schlafqualitat)]);
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
//#endregion--------------------

//#region-----------entryContainer.js-----------
// Liste der Einträge aktualisieren
function updateEntryContainer(entryContainer) {
  if (!entryContainer) return;
  const entries = getEntries();
  entryContainer.innerHTML = '';
  entries.forEach((entry, entryIndex) => {
    const row = document.createElement('tr');
    row.classList.add('entry-row');
    row.innerHTML = `
      <td>${entryIndex + 1}</td>
      <td>${new Date(entry.datum).toLocaleDateString()} \n
          ${new Date(entry.datum).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
      <td>${entry.aufstehzeit}</td>
      <td>${entry.schlafenszeit}</td>
      <td>${entry.stresslevel}</td>
      <td>${entry.schlafqualitat}</td>
      <td>
      <div class="button-group">
        <button class="edit-button" data-index="${entryIndex}" title="Bearbeiten">
            <svg style="pointer-events: none;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
            </svg>
            </button>
        <button class="delete-button" data-index="${entryIndex}" title="Löschen">
            <svg style="pointer-events: none;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
          </svg>
        </button>
      </div>
      </td>
    `;
    entryContainer.appendChild(row);
  });
}
//#endregion--------------------

//#region-----------ratingButtons.js-----------
// Bewertungsbuttons erstellen
function createRatingButtons(minValue, maxValue, buttonContainer, hiddenInput, entryForm) {
  if (!buttonContainer || !hiddenInput || !entryForm) return;
  // Function to update button highlight based on hidden input value
  function updateButtonSelection() {
    const currentValue = hiddenInput.value;
    Array.from(buttonContainer.children).forEach(btn => {
      btn.classList.toggle('selected', btn.value === currentValue);
    });
  }  
  // Create buttons
  for (let i = minValue; i <= maxValue; i++) {
    const button = document.createElement('button');
    button.type = 'button';   
    button.textContent = i;
    button.value = i;
    button.className = 'rating-btn';
    button.addEventListener('click', () => {
      hiddenInput.value = button.value;
      hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
      updateButtonSelection();
    });
    buttonContainer.appendChild(button);
  }
  // Update button selection on form reset
  entryForm.addEventListener('reset', () => {
    updateButtonSelection();
  });
  // Initialize hidden input
  hiddenInput.value = '';
  hiddenInput.required = true;
  // Call initially to synchronize buttons with hidden input's initial value
  updateButtonSelection();
  // Update button selection on hidden input change
  const observer = new MutationObserver(updateButtonSelection);
  observer.observe(hiddenInput, { attributes: true, attributeFilter: ['value'] });
}
//#endregion--------------------

//#region-----------form.js-----------
// Aktuelles Datum im Format YYYY-MM-DD:MM einbinden
function updateDateField(dateInput){
  if (!dateInput) return;
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - (offset * 60 * 1000));
  dateInput.value = local.toISOString().slice(0,16);
}

// Formulareingaben validieren
function validateFormInput(formData) {
  return formData.stresslevel && formData.schlafqualitat;
}

// Formularübermittlung verarbeiten
function handleFormSubmission(formData, entryIndex, onSuccess, onError) {
  const isValidInput = validateFormInput(formData);
  if (!isValidInput) {
    onError('Bitte wählen Sie Stress und Schlafqualität aus.');
    return;
  }
  // Eingabe korrekt
  if (isValidEntry(formData)) {
    // Neueintrag hinzufügen wenn es kein Index zum Bearbeiten gibt
    // sonst wird der bestendende Eintrag aktualisiert
    if (entryIndex === '') {
      addEntryData(formData);
      clearCachedInput();
      onSuccess('Eintrag gespeichert.');
    } else {
      replaceEntryData(formData, parseInt(entryIndex));
      onSuccess('Eintrag geändert.');
    }
  } else {
    onError('Fehler beim Speichern des Eintrags. Bitte überprüfen Sie die Eingabedaten.');
  }
}

// Formular zurücksetzen
function resetForm({
  formElement, 
  stressInput, 
  qualityInput, 
  indexInput, 
  saveButton, 
  cancelButton, 
  messageElement 
}) {
  formElement.reset();
  stressInput.value = '';
  qualityInput.value = '';
  indexInput.value = '';
  saveButton.textContent = 'Speichern';
  cancelButton.style.display = 'none';
  messageElement.textContent = '';
}
//#endregion--------------------

//#region-----------app.js-----------
// DOM-Elemente
const DOM = {
  entryForm: document.getElementById('entry-form'),
  entryIndexInput: document.getElementById('entry-index'),
  dateInput: document.getElementById('datum'),
  entryContainer: document.getElementById('entries-table-body'),
  stressLevelButtonContainer: document.getElementById('rating-buttons-stresslevel'),
  stressLevelHiddenInput: document.getElementById('stresslevel'),
  sleepQualityButtonContainer: document.getElementById('rating-buttons-schlafqualitat'),
  sleepQualityHiddenInput: document.getElementById('schlafqualitat'),
  saveButton: document.getElementById('save-button'),
  cancelButton: document.getElementById('cancel-button'),
  messageElement: document.getElementById('message'),
  downloadButton: document.getElementById('download-csv')
};

// Formularelemente
const formElements = {
  formElement: DOM.entryForm,
  indexInput: DOM.entryIndexInput,
  dateInput: DOM.dateInput,
  wakeTimeInput: DOM.entryForm.querySelector('#aufstehzeit'),
  sleepTimeInput: DOM.entryForm.querySelector('#schlafenszeit'),
  stressInput: DOM.stressLevelHiddenInput,
  qualityInput: DOM.sleepQualityHiddenInput,
  saveButton: DOM.saveButton,
  cancelButton: DOM.cancelButton,
  messageElement: DOM.messageElement
};

// Formulardaten extrahieren
function extractFormData(form) {
  return {
    datum: form.datum.value,
    aufstehzeit: form.aufstehzeit.value,
    schlafenszeit: form.schlafenszeit.value,
    stresslevel: form.stresslevel.value,
    schlafqualitat: form.schlafqualitat.value
  };
}

// Formular mit Eintragsdaten füllen
function populateFormWithEntry(entry, {  indexInput,  dateInput,  
  wakeTimeInput,  sleepTimeInput,  stressInput,  qualityInput,
  saveButton,  cancelButton
}) {
  indexInput.value = entry.index;
  dateInput.value = entry.datum;
  wakeTimeInput.value = entry.aufstehzeit;
  sleepTimeInput.value = entry.schlafenszeit;
  stressInput.value = entry.stresslevel;
  qualityInput.value = entry.schlafqualitat;
  saveButton.textContent = 'Ändern';
  cancelButton.style.display = 'inline-block';
}

// Löschbestätigung anzeigen
function confirmAndDeleteEntry(index, entry) {
  const date = new Date(entry.datum);
  const time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const message = `Möchten Sie den Eintrag von ${date.toLocaleDateString()} ${time} wirklich löschen?`;
  return confirm(message) ? Promise.resolve(index) : Promise.reject('Abgebrochen');
}

// Initialisierung der Seite
function initialize() {
  createRatingButtons(MIN_STRESS_LEVEL, MAX_STRESS_LEVEL, 
    DOM.stressLevelButtonContainer, DOM.stressLevelHiddenInput, DOM.entryForm);
  createRatingButtons(MIN_SLEEP_QUALITY, MAX_SLEEP_QUALITY, 
    DOM.sleepQualityButtonContainer, DOM.sleepQualityHiddenInput, DOM.entryForm);
  resetForm(formElements);
  updateView();
}

// Ansicht aktualisieren
function updateView() {
  updateDateField(DOM.dateInput);
  restoreCachedInput(DOM.entryForm);
  updateEntryContainer(DOM.entryContainer);
}

window.addEventListener('load', initialize);

// Event delegation for table actions (ONE listener for ALL rows)
DOM.entryContainer.addEventListener('click', async (e) => {
  const editBtn = e.target.closest('.edit-button');
  const deleteBtn = e.target.closest('.delete-button');
  // Edit button clicked
  if (editBtn) {
    const index = parseInt(editBtn.dataset.index);
    const entry = getEntryAt(index);
    if (entry) {
      // Add index for reference
      entry.index = index;
      resetForm(formElements);
      populateFormWithEntry(entry, formElements);
    }
    return;
  }  
  // Delete button clicked
  else if (deleteBtn) {
    const index = parseInt(deleteBtn.dataset.index);
    const entry = getEntryAt(index);
    try {
      await confirmAndDeleteEntry(index, entry);
      deleteEntryData(index);
      updateView();
    } catch(e) {} // User cancelled - do nothing
  }
});

// Form submission
DOM.entryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = extractFormData(DOM.entryForm);
  const entryIndex = DOM.entryIndexInput.value;
  handleFormSubmission(formData, entryIndex, 
    (message) => {
      alert(message);
      resetForm(formElements);
      updateView();
    },
    (error) => alert(error)
  );
});

// Cache input
DOM.entryForm.addEventListener('input', () => {
  cacheFormInput(DOM.entryForm, DOM.entryIndexInput.value);
});

// Cancel button
DOM.cancelButton.addEventListener('click', () => {
  resetForm(formElements);
  updateView();
});

// CSV-Download
DOM.downloadButton.addEventListener('click', () => {
  const header = ENTRY_TABLE_HEADER;
  const entries = getEntries();
  if (entries.length === 0) {
    alert('Keine Daten zum Exportieren.');
    return;
  }
  const content = getSortedExportData(header, entries);
  if (content) {
    const csvContent = arrayToCSV(content);
    downloadCSV(`tagebuch-${new Date().toISOString().slice(0,16)}.csv`, csvContent);
  }
});

// Service Worker registrieren
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registriert', reg))
      .catch(err => console.error('Service Worker Registrierung fehlgeschlagen', err));
  });
}

//#endregion--------------------