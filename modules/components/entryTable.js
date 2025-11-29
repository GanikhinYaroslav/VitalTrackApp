import { getEntries, getEntryAt, deleteEntry } from '../data/storage.js';

export class EntryTable {
  constructor(container) {
    this.container = container;
    this.tableBody = container.querySelector('tbody');
    this.update();
    this.bindEvents();
  }

  update() {
    const entries = getEntries();
    this.tableBody.innerHTML = entries.map((entry, index) => `
      <tr class="entry-row">
        <td>${index + 1}</td>
        <td>${new Date(entry.datum).toLocaleDateString()} 
            ${new Date(entry.datum).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
        <td>${entry.aufstehzeit}</td>
        <td>${entry.schlafenszeit}</td>
        <td>${entry.stresslevel}</td>
        <td>${entry.schlafqualitat}</td>
        <td>
          <div class="button-group">
            <button class="edit-button" data-index="${index}" title="Bearbeiten">
              <svg style="pointer-events: none;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
              </svg>
            </button>
            <button class="delete-button" data-index="${index}" title="Löschen">
              <svg style="pointer-events: none;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  bindEvents() {
    this.tableBody.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('.edit-button');
      const deleteBtn = e.target.closest('.delete-button');

      if (editBtn) {
        const index = parseInt(editBtn.dataset.index);
        const entry = getEntryAt(index);
        if (entry) entry.index = index;
        // Dispatch custom event for form to handle
        this.container.dispatchEvent(new CustomEvent('edit-entry', { 
          detail: { entry, index } 
        }));
      }

      if (deleteBtn) {
        const index = parseInt(deleteBtn.dataset.index);
        const entry = getEntryAt(index);
        try {
          await this.confirmDeleteEntry(index, entry);
          deleteEntry(index);
          document.dispatchEvent(new CustomEvent('data-changed'));
        } catch(e) {} // User cancelled - do nothing
      }
    });
  }

  confirmDeleteEntry(index, entry) {
    const date = new Date(entry.datum);
    const time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const message = `Möchten Sie den Eintrag von ${date.toLocaleDateString()} ${time} wirklich löschen?`;
    return confirm(message) ? Promise.resolve(index) : Promise.reject('Abgebrochen');
  }
}
