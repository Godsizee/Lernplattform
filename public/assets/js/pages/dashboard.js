/* pages/dashboard.js */
import { Dashboard } from '../modules/Dashboard.js';
import { ApiService } from '../services/ApiService.js';

export default async function init() {
    const dashboard = new Dashboard();
    await dashboard.loadData();

    // Log the view via ApiService
    ApiService.log.add('VIEW_DASHBOARD', 'Dashboard (Übersicht) geöffnet');
}

// Initialer Aufruf für den Fall, dass die Seite direkt geladen wird
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}
