/* core/Router.js */
import { Sidebar } from '../components/Sidebar.js';

export class Router {
    static instance = null;

    constructor() {
        if (Router.instance) return Router.instance;
        Router.instance = this;

        this.viewContainer = document.getElementById('view-container');
        this.sidebar = null; // Will be set in app.js
        this.init();
    }

    setSidebar(sidebar) {
        this.sidebar = sidebar;
    }

    init() {
        // Intercept all link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const url = new URL(link.href);
            const isInternal = url.origin === window.location.origin;
            const isLogout = url.pathname.includes('logout');

            if (isInternal && !isLogout && !link.hasAttribute('download') && link.target !== '_blank') {
                e.preventDefault();
                this.navigate(url.pathname + url.search);
            }
        });

        // Handle back/forward buttons
        window.addEventListener('popstate', (e) => {
            this.navigate(window.location.pathname + window.location.search, false);
        });
    }

    async navigate(path, pushState = true) {
        if (!this.viewContainer) return;

        // Visual feedback (start loading)
        this.viewContainer.classList.add('loading-fade');

        try {
            const response = await fetch(window.BASE_URL + path, {
                headers: {
                    'X-Soft-Routing': 'true',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const content = await response.text();

            // Check for redirect (JSON response)
            if (content.startsWith('{')) {
                const data = JSON.parse(content);
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
            }

            // Update DOM
            this.viewContainer.innerHTML = content;
            this.viewContainer.classList.remove('loading-fade');

            // Update URL
            if (pushState) {
                window.history.pushState({}, '', window.BASE_URL + path);
            }

            // Extract metadata from the response (title, script)
            const metadataMatch = content.match(/<!-- soft-route-metadata: (.*?) -->/);
            if (metadataMatch) {
                const metadata = JSON.parse(metadataMatch[1]);
                if (metadata.title) document.title = metadata.title;
                if (metadata.pageScript) {
                    await this.loadPageScript(metadata.pageScript);
                }
            }

            // Update Sidebar active state
            if (this.sidebar && typeof this.sidebar.updateActiveLink === 'function') {
                this.sidebar.updateActiveLink(path);
            }

            // Auto-close mobile sidebar
            if (this.sidebar && typeof this.sidebar.closeMobile === 'function') {
                this.sidebar.closeMobile();
            }

            // Scroll to top
            window.scrollTo(0, 0);

        } catch (error) {
            console.error('[Router] Navigation failed:', error);
            // Fallback: Hard reload if something goes wrong
            window.location.href = window.BASE_URL + path;
        }
    }

    async loadPageScript(scriptName) {
        try {
            // Dynamically import the page script
            // Note: We use a cache-busting timestamp or check if already loaded if needed
            // But for modules, import() is usually enough.
            const module = await import(`${window.BASE_URL}/assets/js/pages/${scriptName}.js?t=${Date.now()}`);
            if (module.default && typeof module.default === 'function') {
                await module.default();
            }
        } catch (error) {
            console.error(`[Router] Failed to load page script: ${scriptName}`, error);
        }
    }
}
