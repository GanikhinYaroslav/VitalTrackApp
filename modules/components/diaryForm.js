import { 
  MIN_STRESS_LEVEL, MAX_STRESS_LEVEL, MIN_SLEEP_QUALITY, MAX_SLEEP_QUALITY 
} from '../data/constants.js';
import { addEntry, replaceEntry } from '../data/storage.js';
import { DailyEntry } from '../data/dailyEntry.js';
import { createRatingButtons } from './ratingButtons.js';
import * as cache from '../utils/cache.js';

export class DiaryForm {
  constructor(container, entryListKey, cacheKey) {
    this.container = container;
    this.form = container.querySelector('#entry-form');
    this.entryIndexInput = this.form.querySelector('#entry-index');
    this.dateInput = this.form.querySelector('#datum');
    this.wakeTimeInput = this.form.querySelector('#aufstehzeit');
    this.sleepTimeInput = this.form.querySelector('#schlafenszeit');
    this.stressContainer = this.form.querySelector('#rating-buttons-stresslevel');
    this.stressInput = this.form.querySelector('#stresslevel');
    this.sleepQualityContainer = this.form.querySelector('#rating-buttons-schlafqualitat');
    this.sleepQualityInput = this.form.querySelector('#schlafqualitat');
    this.saveBtn = this.form.querySelector('#save-button');
    this.cancelBtn = this.form.querySelector('#cancel-button');
    this.messageElement = this.form.querySelector('#message');

    this.entryListKey = entryListKey;
    this.cacheKey = cacheKey;

    this.init();
  }

  init() {
    createRatingButtons(MIN_STRESS_LEVEL, MAX_STRESS_LEVEL, 
      this.stressContainer, this.stressInput, this.form);
    createRatingButtons(MIN_SLEEP_QUALITY, MAX_SLEEP_QUALITY, 
      this.sleepQualityContainer, this.sleepQualityInput, this.form);

    this.bindEvents();
    this.update();
  }

  update()
  {
    this.resetInputs();
    this.updateDateField();
    this.restoreCache();
  }

  bindEvents() {
    // Form submit
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = this.getFormData();
      const entryIndex = this.entryIndexInput.value;
      this.handleFormSubmission(formData, entryIndex, 
        (message) => {
          alert(message);
          document.dispatchEvent(new CustomEvent('data-changed'));
        },
        (error) => alert(error)
      );
    });

    // Cache on input (only for new entries)
    this.form.addEventListener('input', () => {
      if (this.entryIndexInput.value !== '') return;
      const entry = {
        aufstehzeit: this.wakeTimeInput.value,
        schlafenszeit: this.sleepTimeInput.value,
        stresslevel: this.stressInput.value,
        schlafqualitat: this.sleepQualityInput.value
      };
      cache.save(this.cacheKey, entry);
    });

    // Cancel
    this.cancelBtn.addEventListener('click', () => { 
      this.update();
    });
  }

  updateDateField(){
    if (!this.dateInput) return;
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - (offset * 60 * 1000));
    this.dateInput.value = local.toISOString().slice(0,16);
  }

  restoreCache() {
    const cached = cache.getCachedData(this.cacheKey);
    if (cached) {
      this.form.aufstehzeit.value = cached.aufstehzeit || '';
      this.form.schlafenszeit.value = cached.schlafenszeit || '';
      this.stressInput.value = cached.stresslevel || '';
      this.sleepQualityInput.value = cached.schlafqualitat || '';
    }
  }

  loadEntry(entry) {
    this.populateFormWithEntry(entry, this.formElements);
  }

  // Formular zurücksetzen
  resetInputs() {
    this.form.reset();
    this.stressInput.value = '';
    this.sleepQualityInput.value = '';
    this.entryIndexInput.value = '';
    this.saveBtn.textContent = 'Speichern';
    this.cancelBtn.style.display = 'none';
    this.messageElement.textContent = '';
  }

  // Formular mit Eintragsdaten füllen
  populateFormWithEntry(entry) {
    this.entryIndexInput.value = entry.index;
    this.dateInput.value = entry.datum;
    this.wakeTimeInput.value = entry.aufstehzeit;
    this.sleepTimeInput.value = entry.schlafenszeit;
    this.stressInput.value = entry.stresslevel;
    this.sleepQualityInput.value = entry.schlafqualitat;
    this.saveBtn.textContent = 'Ändern';
    this.cancelBtn.style.display = 'inline-block';
  }

  // Formulardaten extrahieren
  getFormData() {
    return {
      datum: this.dateInput.value,
      aufstehzeit: this.wakeTimeInput.value,
      schlafenszeit: this.sleepTimeInput.value,
      stresslevel: this.stressInput.value,
      schlafqualitat: this.sleepQualityInput.value
    };
  }

  
  // Vergleichsfunktion für Zeiten im Format "HH:MM"
  isFirstTimeBeforeOrEqualSecond(first, second) {
    const [h1, m1] = first.split(':').map(Number);
    const [h2, m2] = second.split(':').map(Number);
    return h1 < h2 || (h1 === h2 && m1 <= m2);
  }

  // Formulareingaben validieren
  validateFormInput(formData) {
    return formData.stresslevel && formData.schlafqualitat;
  }

  // Formularübermittlung verarbeiten
  handleFormSubmission(formData, entryIndex, onSuccess, onError) {
    const isValidInput = this.validateFormInput(formData);
    if (!isValidInput) {
      onError('Bitte wählen Sie Stress und Schlafqualität aus.');
      return;
    }
    const entry = DailyEntry.create(formData);
    // Eingabe korrekt
    if (entry) {
      // Neueintrag hinzufügen wenn es kein Index zum Bearbeiten gibt
      // sonst wird der bestendende Eintrag aktualisiert
      if (entryIndex === '') {
        addEntry(this.entryListKey, entry);
        cache.clear(this.cacheKey);
        onSuccess('Eintrag gespeichert.');
      } else {
        replaceEntry(this.entryListKey, entry, parseInt(entryIndex));
        onSuccess('Eintrag geändert.');
      }
    } else {
      onError('Fehler beim Speichern des Eintrags. Bitte überprüfen Sie die Eingabedaten.');
    }
  }

  // Listen for edit events from table
  connectTable(tableContainer) {
    tableContainer.addEventListener('edit-entry', (e) => {
      this.loadEntry(e.detail.entry);
    });
  }
}
