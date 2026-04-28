// Globales XSS Escaping
window.escapeHTML = function (str) {
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
window.fetch = async function () {
    let [resource, config] = arguments;
    if (config && config.method && config.method.toUpperCase() !== 'GET') {
        config.headers = config.headers || {};
        const token = localStorage.getItem('csrf_token');
        if (token) config.headers['X-CSRF-Token'] = token;
    }
    return originalFetch(resource, config);
};

document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const updateThemeUI = (theme) => {
        const isLight = theme === 'light';
        document.querySelectorAll('.theme-icon-js').forEach(icon => {
            icon.className = isLight ? 'ph ph-sun theme-icon-js' : 'ph ph-moon theme-icon-js';
        });
        document.querySelectorAll('.theme-text-js').forEach(text => {
            text.textContent = isLight ? 'Light Mode' : 'Dark Mode';
        });
    };

    // Initial UI Update
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateThemeUI(initialTheme);

    // Add Listeners to all toggle buttons
    document.querySelectorAll('.theme-toggle-js').forEach(btn => {
        btn.addEventListener('click', () => {
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
            updateThemeUI(newTheme);
        });
    });

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

    // --- Global Search ---
    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        let debounceTimer;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const query = e.target.value.trim();

            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            // Debounce Request (300ms warten, bevor API aufgerufen wird)
            debounceTimer = setTimeout(async () => {
                try {
                    const res = await fetch(`${window.BASE_URL}/api/search.php?q=${encodeURIComponent(query)}`);
                    if (!res.ok) return;
                    const data = await res.json();

                    searchResults.innerHTML = '';
                    if (data.length === 0) {
                        searchResults.innerHTML = '<div style="padding: 1rem 1.2rem; color: var(--text-secondary);">Keine passenden Lektionen gefunden.</div>';
                    } else {
                        data.forEach(item => {
                            const a = document.createElement('a');
                            a.href = `${window.BASE_URL}/learning#lesson-${item.id}`;
                            a.className = 'search-result-item';
                            a.innerHTML = `
                                <span class="search-result-title">${window.escapeHTML(item.title)}</span>
                                <span class="search-result-meta"><i class="ph ph-folder"></i> ${window.escapeHTML(item.subject_title)}</span>
                            `;
                            a.addEventListener('click', () => {
                                // Setze das aktive Fach, damit der richtige Tab im Learning-Bereich öffnet
                                localStorage.setItem('active_subject', item.subject_id);
                                searchResults.style.display = 'none';
                                searchInput.value = '';

                                // Falls wir schon auf der Learning-Page sind -> Neuladen für Tab-Switch
                                if (window.location.pathname.includes('/learning')) {
                                    window.location.reload();
                                }
                            });
                            searchResults.appendChild(a);
                        });
                    }
                    searchResults.style.display = 'block';
                } catch (error) {
                    console.error('Search error:', error);
                }
            }, 300);
        });

        // Dropdown schließen, wenn außerhalb geklickt wird
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
});