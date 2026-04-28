/* components/Search.js */
import { ApiService } from '../services/ApiService.js';

export class Search {
    constructor() {
        this.input = document.getElementById('global-search-input');
        this.resultsDropdown = document.getElementById('search-results-dropdown');
        this.debounceTimer = null;
        this.init();
    }

    init() {
        if (!this.input || !this.resultsDropdown) return;

        this.input.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            const query = e.target.value.trim();

            if (query.length < 2) {
                this.hideResults();
                return;
            }

            this.debounceTimer = setTimeout(() => this.performSearch(query), 300);
        });

        // Schließen bei Klick außerhalb
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.resultsDropdown.contains(e.target)) {
                this.hideResults();
            }
        });

        // Keyboard Shortcut (Alt + S)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                this.input.focus();
            }
        });
    }

    async performSearch(query) {
        try {
            const data = await ApiService.content.search(query);
            this.renderResults(data);
        } catch (error) {
            console.error('Search failed:', error);
        }
    }

    renderResults(data) {
        this.resultsDropdown.innerHTML = '';
        
        if (data.length === 0) {
            this.resultsDropdown.innerHTML = '<div style="padding: 1rem 1.2rem; color: var(--text-secondary);">Keine Treffer gefunden.</div>';
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
                    localStorage.setItem('active_subject', item.subject_id);
                    this.hideResults();
                    this.input.value = '';
                    
                    if (window.location.pathname.includes('/learning')) {
                        window.location.reload();
                    }
                });
                
                this.resultsDropdown.appendChild(a);
            });
        }
        
        this.showResults();
    }

    showResults() {
        this.resultsDropdown.classList.add('active');
        this.resultsDropdown.style.display = 'block';
    }

    hideResults() {
        this.resultsDropdown.classList.remove('active');
        this.resultsDropdown.style.display = 'none';
    }
}
