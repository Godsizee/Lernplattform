/* app.js */
import { ThemeToggle } from './components/ThemeToggle.js';
import { Sidebar } from './components/Sidebar.js';
import { Search } from './components/Search.js';
import { Router } from './core/Router.js';
import { Auth } from './modules/Auth.js';
import { escapeHTML } from './utils/Helpers.js';

// Global verfügbar machen für Legacy-Kompatibilität in anderen Modulen
window.escapeHTML = escapeHTML;

document.addEventListener('DOMContentLoaded', () => {
    // Globale UI-Komponenten initialisieren
    new ThemeToggle();
    const sidebar = new Sidebar();
    new Search();

    // Soft-Router initialisieren
    const router = new Router();
    router.setSidebar(sidebar);
    
    // Globaler Zugriff für programmgesteuerte Navigation
    window.Router = router;

    // Initialen Seiten-Skript laden
    if (window.CURRENT_PAGE_SCRIPT) {
        router.loadPageScript(window.CURRENT_PAGE_SCRIPT);
    }

    // Logout-Handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => Auth.logout());
    }
});