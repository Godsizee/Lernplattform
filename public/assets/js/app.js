import { Search } from './components/Search.js';

// Globales XSS Escaping
window.escapeHTML = function(str) {
    if (str === null || str === undefined) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// Globaler fetch-Wrapper für automatische CSRF-Tokens
const originalFetch = window.fetch;
window.fetch = async function() {
    let [resource, config] = arguments;
    if (config && config.method && config.method.toUpperCase() !== 'GET') {
        config.headers = config.headers || {};
        const token = localStorage.getItem('csrf_token');
        if (token) config.headers['X-CSRF-Token'] = token;
    }
    return originalFetch(resource, config);
};

document.addEventListener('DOMContentLoaded', () => {
    // Search initialisieren
    try {
        new Search();
    } catch (e) {
        console.warn('Search component not initialized:', e);
    }

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const root = document.documentElement;
            const currentTheme = root.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            root.setAttribute('data-theme', newTheme);
            if (newTheme === 'light') {
                root.classList.add('light-mode');
            } else {
                root.classList.remove('light-mode');
            }
            
            localStorage.setItem('lern_theme', newTheme);
            
            // Update Icon & Text (individuell prüfen, falls einer fehlt)
            const icon = document.getElementById('theme-icon');
            const text = document.getElementById('theme-text');
            
            if (icon) {
                icon.className = newTheme === 'dark' ? 'ph ph-moon' : 'ph ph-sun';
            }
            
            if (text) {
                text.textContent = newTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
            }
        });
    }

    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                sidebar.classList.remove('mobile-open');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });
    }

    if (mobileNavToggle && sidebar) {
        mobileNavToggle.addEventListener('click', () => {
            sidebar.classList.add('mobile-open');
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('../api/auth.php?action=logout');
                localStorage.removeItem('csrf_token');
                window.location.href = window.BASE_URL + '/login';
            } catch (e) {
                console.error('Logout error', e);
            }
        });
    }
});
