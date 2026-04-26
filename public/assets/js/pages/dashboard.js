import { Dashboard } from '../modules/Dashboard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const dashboard = new Dashboard();
    await dashboard.loadData();

    // Log the view
    fetch('../api/log.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'VIEW_DASHBOARD', details: 'Dashboard (Übersicht) geöffnet' })
    }).catch(() => {});
});
