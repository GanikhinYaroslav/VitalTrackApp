import { getEntries } from '../data/storage.js';
import { getSortedExportDataWithHeader, arrayToCSV, downloadCSV } from '../utils/exporter.js';

export class ExportButton {
  constructor(button) {
    this.button = button;
    this.button.addEventListener('click', () => this.export());
  }

  export() {
    const entries = getEntries();
    if (entries.length === 0) {
      alert('Keine Daten zum Exportieren.');
      return;
    }
    const content = getSortedExportDataWithHeader(entries);
    const csvContent = arrayToCSV(content);
    downloadCSV(`tagebuch-${new Date().toISOString().slice(0,16)}.csv`, csvContent);
  }
}

