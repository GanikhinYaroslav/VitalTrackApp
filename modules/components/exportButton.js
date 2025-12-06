import { getEntries } from '../data/storage.js';
import { getSortedExportDataWithHeader, arrayToCSV, downloadCSV } from '../utils/exporter.js';

export class ExportButton {
  constructor(button, entryListKey) {
    this.button = button;
    this.button.addEventListener('click', () => this.export(entryListKey));
  }

  export(tableKey) {
    const entries = getEntries(tableKey);
    if (entries.length === 0) {
      alert('Keine Daten zum Exportieren.');
      return;
    }
    const content = getSortedExportDataWithHeader(entries);
    const csvContent = arrayToCSV(content);
    downloadCSV(`${tableKey}-${new Date().toISOString().slice(0,16)}.csv`, csvContent);
  }
}

