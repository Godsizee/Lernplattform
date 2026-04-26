import { Profile } from '../modules/Profile.js';

document.addEventListener('DOMContentLoaded', async () => {
    const profile = new Profile();
    await profile.loadData();

    // Profil Aktionen
    document.getElementById('profile-form').addEventListener('submit', (e) => {
        profile.handleUpdate(e);
    });

    document.getElementById('export-data-btn').addEventListener('click', () => {
        profile.exportData();
    });

    document.getElementById('delete-account-btn').addEventListener('click', () => {
        profile.deleteAccount();
    });
});
