/* app.js */
import { ThemeToggle } from './components/ThemeToggle.js';
import { Sidebar } from './components/Sidebar.js';
import { Search } from './components/Search.js';
import { Auth } from './modules/Auth.js';
import { escapeHTML } from './utils/Helpers.js';

// Global verfügbar machen für Legacy-Kompatibilität in anderen Modulen
window.escapeHTML = escapeHTML;

document.addEventListener('DOMContentLoaded', () => {
    // Globale UI-Komponenten initialisieren
    new ThemeToggle();
    new Sidebar();
    new Search();

    // Logout-Handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => Auth.logout());
    }
});