/* components/ThemeToggle.js */
export class ThemeToggle {
    constructor() {
        this.toggles = document.querySelectorAll('.theme-toggle-js');
        this.init();
    }

    init() {
        if (this.toggles.length === 0) return;

        // Initialer UI-Status basierend auf data-theme (wird bereits im Header gesetzt)
        const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        this.updateUI(initialTheme);

        this.toggles.forEach(btn => {
            btn.addEventListener('click', () => this.toggle());
        });
    }

    toggle() {
        const root = document.documentElement;
        const currentTheme = root.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // DOM Update
        root.setAttribute('data-theme', newTheme);
        if (newTheme === 'light') {
            root.classList.add('light-mode');
        } else {
            root.classList.remove('light-mode');
        }

        // Persistence
        localStorage.setItem('lern_theme', newTheme);
        this.updateUI(newTheme);

        // Optional: An API senden, falls ApiService verfügbar und User eingeloggt
        // (Wird hier bewusst einfach gehalten, um Abhängigkeiten gering zu halten)
    }

    updateUI(theme) {
        const isLight = theme === 'light';
        document.querySelectorAll('.theme-icon-js').forEach(icon => {
            icon.className = isLight ? 'ph ph-sun theme-icon-js' : 'ph ph-moon theme-icon-js';
        });
        document.querySelectorAll('.theme-text-js').forEach(text => {
            text.textContent = isLight ? 'Light Mode' : 'Dark Mode';
        });
    }
}
