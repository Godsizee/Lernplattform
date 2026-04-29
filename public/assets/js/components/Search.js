/* components/Search.js */
import { ApiService } from '../services/ApiService.js';

export class Search {
    constructor() {
        this.input = document.getElementById('global-search-input');
        this.resultsDropdown = document.getElementById('search-results-dropdown');
        this.debounceTimer = null;
        this.selectedIndex = -1;
        this.results = [];
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

        // Tastatur-Navigation
        this.input.addEventListener('keydown', (e) => {
            const items = this.resultsDropdown.querySelectorAll('.search-result-item');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex + 1) % items.length;
                this.updateFocus(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length;
                this.updateFocus(items);
            } else if (e.key === 'Enter') {
                if (this.selectedIndex > -1 && items[this.selectedIndex]) {
                    e.preventDefault();
                    items[this.selectedIndex].click();
                }
            } else if (e.key === 'Escape') {
                this.hideResults();
            }
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

    updateFocus(items) {
        items.forEach((item, index) => {
            item.classList.toggle('keyboard-focus', index === this.selectedIndex);
            if (index === this.selectedIndex) {
                item.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    async performSearch(query) {
        try {
            const data = await ApiService.content.search(query);
            this.results = data;
            this.selectedIndex = -1;
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
            data.forEach((item, index) => {
                const a = document.createElement('a');
                a.href = `${window.BASE_URL}/learning?subject=${item.subject_id}&lesson=${item.id}`;
                a.className = 'search-result-item';
                a.innerHTML = `
                    <span class="search-result-title">${window.escapeHTML(item.title)}</span>
                    <span class="search-result-meta"><i class="ph ph-folder"></i> ${window.escapeHTML(item.subject_title)}</span>
                `;
                
                a.addEventListener('click', () => {
                    localStorage.setItem('active_subject', item.subject_id);
                    this.hideResults();
                    this.input.value = '';
                });

                // Mouseover setzt den Tastatur-Fokus zurück oder synchronisiert ihn
                a.addEventListener('mouseenter', () => {
                    this.selectedIndex = index;
                    const items = this.resultsDropdown.querySelectorAll('.search-result-item');
                    this.updateFocus(items);
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
        this.selectedIndex = -1;
    }
}