import { DailyEntryTable } from './components/dailyEntryTable.js';
import { DiaryForm } from './components/diaryForm.js';
import { ExportButton } from './components/exportButton.js';

const DAILY_ENTRY_LIST_KEY = 'tagebuchEntries';
const CACHE_KEY = 'tagebuchFormCache';

const STRESS_ENTRY_LIST_KEY = 'stressEntries';

// Mount points from HTML
const tableContainer = document.querySelector('#entries-table');
const formContainer = document.querySelector('#diary-form-container');
const exportBtn = document.querySelector('#download-csv');

function init() {
  // Create independent components
  // Daily Entry Block
  const table = new DailyEntryTable(tableContainer, DAILY_ENTRY_LIST_KEY);
  const form = new DiaryForm(formContainer, DAILY_ENTRY_LIST_KEY, CACHE_KEY);
  const exporter = new ExportButton(exportBtn, DAILY_ENTRY_LIST_KEY);

  // Connect table -> form
  form.connectTable(tableContainer);

  // Expose update method
  document.addEventListener('data-changed', () => {
    table.update();
    form.update();
  }, { once: false }); 
}

window.addEventListener('load', init);

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/modules/service-worker.js')
      .then(reg => console.log('Service Worker registriert', reg))
      .catch(err => console.error('Service Worker Registrierung fehlgeschlagen', err));
  });
}

