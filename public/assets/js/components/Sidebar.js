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

    /**
     * Updates the active state of navigation items based on the given path
     * @param {string} path 
     */
    updateActiveLink(path) {
        const navItems = this.sidebar.querySelectorAll('.nav-item');
        const cleanPath = path.split('?')[0]; // Ignore query params for active state
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (!href) return;

            // Check if href matches the current path
            // We need to handle BASE_URL correctly
            const cleanHref = href.replace(window.BASE_URL, '') || '/';
            
            if (cleanHref === cleanPath) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}
