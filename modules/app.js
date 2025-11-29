import { EntryTable } from './components/entryTable.js';
import { DiaryForm } from './components/diaryForm.js';
import { ExportButton } from './components/exportButton.js';

// Mount points from HTML
const tableContainer = document.querySelector('#entries-table');
const formContainer = document.querySelector('#diary-form-container');
const exportBtn = document.querySelector('#download-csv');

function init() {
  // Create independent components
  const table = new EntryTable(tableContainer);
  const form = new DiaryForm(formContainer);
  const exporter = new ExportButton(exportBtn);

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

