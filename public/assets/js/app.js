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
            
            // Update Icon & Text
            const icon = document.getElementById('theme-icon');
            const text = document.getElementById('theme-text');
            if (icon && text) {
                if (newTheme === 'dark') {
                    icon.className = 'ph ph-moon';
                    text.textContent = 'Dark Mode';
                } else {
                    icon.className = 'ph ph-sun';
                    text.textContent = 'Light Mode';
                }
            }
        });
    }

    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                sidebar.classList.toggle('mobile-open');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('../api/auth.php?action=logout');
                localStorage.removeItem('csrf_token');
                window.location.href = 'login.php';
            } catch (e) {
                console.error('Logout error', e);
            }
        });
    }
});
