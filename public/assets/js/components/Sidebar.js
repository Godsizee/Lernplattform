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
            this.sidebar.classList.toggle('collapsed');
        }
    }

    openMobile() {
        this.sidebar.classList.add('mobile-open');
    }

    closeMobile() {
        this.sidebar.classList.remove('mobile-open');
    }
}
