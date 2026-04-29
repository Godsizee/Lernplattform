/* components/Sidebar.js */
export class Sidebar {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.desktopToggle = document.getElementById('sidebar-toggle');
        this.mobileToggle = document.getElementById('mobile-nav-toggle');
        this.init();
    }

    init() {
        if (!this.sidebar) return;

        // Zustand aus localStorage laden
        const isCollapsed = localStorage.getItem('lern_sidebar_collapsed') === 'true';
        if (isCollapsed && window.innerWidth >= 768) {
            this.sidebar.classList.add('collapsed');
        }

        if (this.desktopToggle) {
            this.desktopToggle.addEventListener('click', () => this.toggleDesktop());
        }

        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.openMobile());
        }

        // Schließen bei Klick außerhalb (auf Mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 768 && 
                this.sidebar.classList.contains('mobile-open') && 
                !this.sidebar.contains(e.target) && 
                !this.mobileToggle?.contains(e.target)) {
                this.closeMobile();
            }
        });
    }

    toggleDesktop() {
        if (window.innerWidth < 768) {
            this.sidebar.classList.remove('mobile-open');
        } else {
            const isCollapsed = this.sidebar.classList.toggle('collapsed');
            localStorage.setItem('lern_sidebar_collapsed', isCollapsed);
        }
    }

    openMobile() {
        this.sidebar.classList.add('mobile-open');
    }

    closeMobile() {
        this.sidebar.classList.remove('mobile-open');
    }
}
