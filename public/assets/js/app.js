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
    new Search('global-search-input', 'search-results-dropdown');
    new Search('mobile-search-input', 'mobile-search-results-dropdown');

    // Mobile Search Overlay Toggle
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    const mobileSearchOverlay = document.getElementById('mobile-search-overlay');
    const mobileSearchClose = document.getElementById('mobile-search-close');
    const mobileSearchInput = document.getElementById('mobile-search-input');

    if (mobileSearchToggle && mobileSearchOverlay) {
        mobileSearchToggle.addEventListener('click', () => {
            mobileSearchOverlay.classList.add('active');
            if (mobileSearchInput) {
                setTimeout(() => mobileSearchInput.focus(), 100);
            }
        });
    }

    if (mobileSearchClose && mobileSearchOverlay) {
        mobileSearchClose.addEventListener('click', () => {
            mobileSearchOverlay.classList.remove('active');
            if (mobileSearchInput) {
                mobileSearchInput.value = '';
                // Trigger event to clear search
                mobileSearchInput.dispatchEvent(new Event('input'));
            }
        });
    }

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

    // System-Banner Dismissal
    const closeBannerBtn = document.getElementById('close-system-banner');
    if (closeBannerBtn) {
        closeBannerBtn.addEventListener('click', () => {
            const banner = document.getElementById('system-banner');
            if (banner) {
                localStorage.setItem('dismissed_announcement', banner.dataset.announcementId);
                banner.style.display = 'none';
                Toast.info('Ankündigung wurde ausgeblendet.');
            }
        });
    }
});