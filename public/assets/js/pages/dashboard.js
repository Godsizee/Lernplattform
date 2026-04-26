import { Dashboard } from '../modules/Dashboard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const dashboard = new Dashboard({
        // Mock the app object so Dashboard can work standalone
        container: document.getElementById('view-container'),
        router: () => window.location.href = 'learning.php',
        learning: {
            switchTab: (subjectId) => {
                // When clicking a subject on dashboard, go to learning.php?subject=...
                // (Since we are MPA now, we can pass query params, or save to localStorage)
                localStorage.setItem('active_subject', subjectId);
                window.location.href = 'learning.php';
            }
        }
    });

    await dashboard.loadData();

    // Log the view
    fetch('../api/log.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'VIEW_DASHBOARD', details: 'Dashboard (Übersicht) geöffnet' })
    }).catch(() => {});
});
