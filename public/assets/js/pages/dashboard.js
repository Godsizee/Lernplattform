/* pages/dashboard.js */
import { Dashboard } from '../modules/Dashboard.js';
import { ApiService } from '../services/ApiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const dashboard = new Dashboard();
    await dashboard.loadData();

    // Log the view via ApiService
    ApiService.log.add('VIEW_DASHBOARD', 'Dashboard (Übersicht) geöffnet');
});
