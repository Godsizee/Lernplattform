/* pages/profile.js */
import { Profile } from '../modules/Profile.js';

export default async function init() {
    const profile = new Profile();
    await profile.loadData();

    // Event-Bindung für zusätzliche Aktionen
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => profile.exportData());
    }

    const deleteBtn = document.getElementById('delete-account-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => profile.deleteAccount());
    }
}
