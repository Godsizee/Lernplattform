/**
 * Global Search Component
 * Handles live search functionality for the learning platform.
 */
export class Search {
    constructor() {
        this.container = document.getElementById('global-search-container');
        this.input = document.getElementById('global-search-input');
        this.resultsDropdown = document.getElementById('search-results-dropdown');
        
        if (!this.container || !this.input || !this.resultsDropdown) return;

        this.timeout = null;
        this.init();
    }

    init() {
        // Search as you type with debounce
        this.input.addEventListener('input', () => {
            clearTimeout(this.timeout);
            const query = this.input.value.trim();

            if (query.length < 2) {
                this.closeResults();
                return;
            }

            this.timeout = setTimeout(() => this.performSearch(query), 300);
        });

        // Close on blur (delayed to allow clicks)
        this.input.addEventListener('blur', () => {
            setTimeout(() => this.closeResults(), 200);
        });

        // Open on focus if query exists
        this.input.addEventListener('focus', () => {
            if (this.input.value.trim().length >= 2) {
                this.resultsDropdown.classList.add('active');
            }
        });

        // Keyboard Shortcut: Alt + S to focus
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                this.input.focus();
            }
            
            // ESC to close
            if (e.key === 'Escape' && this.resultsDropdown.classList.contains('active')) {
                this.closeResults();
            }
        });
    }

    async performSearch(query) {
        try {
            const response = await fetch(`${window.BASE_URL}/api/articles.php?action=search&q=${encodeURIComponent(query)}`);
            const results = await response.json();
            
            this.renderResults(results);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    renderResults(results) {
        if (!results || results.length === 0) {
            this.resultsDropdown.innerHTML = '<div class="search-no-results">Keine Treffer gefunden...</div>';
        } else {
            this.resultsDropdown.innerHTML = results.map(item => `
                <a href="${window.BASE_URL}/learning?subject=${item.subject_id}&lesson=${item.id}" class="search-result-item">
                    <div class="result-title">${window.escapeHTML(item.title)}</div>
                    <div class="result-meta">
                        <span class="result-badge" style="background: ${item.subject_color}20; color: ${item.subject_color}">
                            ${window.escapeHTML(item.subject_title)}
                        </span>
                        ${item.status === 'draft' ? '<span class="result-badge" style="background:rgba(255,255,255,0.1); color:var(--text-secondary)">Entwurf</span>' : ''}
                    </div>
                </a>
            `).join('');
        }
        
        this.resultsDropdown.classList.add('active');
    }

    closeResults() {
        this.resultsDropdown.classList.remove('active');
    }
}
