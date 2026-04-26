import { Auth } from './modules/Auth.js';
import { Admin } from './modules/Admin.js';
import { Dashboard } from './modules/Dashboard.js';
import { Learning } from './modules/Learning.js';
import { Profile } from './modules/Profile.js';
import { UI } from './modules/UI.js';

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

class App {
    constructor() {
        this.container = document.getElementById('view-container');
        this.navItems = document.querySelectorAll('.nav-item');
        this.user = null;

        // Initialize modules
        this.ui = new UI(this);
        this.auth = new Auth(this);
        this.admin = new Admin(this);
        this.dashboard = new Dashboard(this);
        this.learning = new Learning(this);
        this.profile = new Profile(this);

        this.init();
    }

    async init() {
        await this.auth.checkAuth();
        this.setupEventListeners();
        
        window.addEventListener('popstate', () => this.router());
        
        // Initial route setup
        let currentPath = window.location.pathname.replace(/\/$/, '').split('/').pop();
        if (!currentPath || currentPath === 'public' || currentPath === 'index.html') {
            const defaultRoute = this.user ? 'dashboard' : 'auth';
            window.history.replaceState({}, '', defaultRoute);
            this.router();
        } else {
            this.router();
        }
    }

    setupEventListeners() {
        // Global click delegation
        document.body.addEventListener('click', (e) => {
            // Navigation
            const navLink = e.target.closest('a.nav-item');
            if (navLink && navLink.dataset.route) {
                e.preventDefault();
                window.history.pushState({}, '', navLink.dataset.route);
                this.router();
                return;
            }

            // Theme toggle
            const themeToggleBtn = e.target.closest('#theme-toggle-btn');
            if (themeToggleBtn) {
                this.ui.toggleTheme();
                return;
            }

            // Sidebar toggle
            const sidebarToggleBtn = e.target.closest('#sidebar-toggle');
            if (sidebarToggleBtn) {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) sidebar.classList.toggle('collapsed');
                return;
            }

            // Logout
            const logoutBtn = e.target.closest('#logout-btn');
            if (logoutBtn) {
                this.auth.logout();
                return;
            }
        });

        // View container click delegation
        this.container.addEventListener('click', (e) => {
            // Auth tabs
            const tabBtn = e.target.closest('.auth-tab');
            if (tabBtn) this.auth.switchAuthTab(tabBtn);

            // Learning/Admin tabs
            const learnTab = e.target.closest('.learning-tab');
            if (learnTab) {
                if (learnTab.dataset.target) {
                    // Admin tabs
                    document.querySelectorAll('#admin-tabs .learning-tab').forEach(t => t.classList.remove('active'));
                    learnTab.classList.add('active');
                    document.querySelectorAll('.admin-panel').forEach(p => p.style.display = 'none');
                    const targetPanel = document.getElementById(learnTab.dataset.target);
                    if (targetPanel) targetPanel.style.display = 'block';
                } else {
                    // Learning subject tabs
                    this.learning.switchTab(learnTab.dataset.subjectId, learnTab.textContent);
                }
            }

            // Profile actions
            if (e.target.closest('#export-data-btn')) this.profile.exportData();
            if (e.target.closest('#delete-account-btn')) this.profile.deleteAccount();

            // Admin actions
            const delUserBtn = e.target.closest('.admin-del-user');
            if (delUserBtn) this.admin.adminDeleteUser(delUserBtn.dataset.id);
        });

        // Change delegation
        this.container.addEventListener('change', (e) => {
            if (e.target.classList.contains('admin-role-select')) {
                this.admin.adminSetRole(e.target.dataset.id, e.target.value);
            }
            if (e.target.id === 'audit-user-filter') {
                this.admin.loadAuditLogs(e.target.value);
            }
        });

        // Submit delegation
        this.container.addEventListener('submit', (e) => {
            if (e.target.id === 'login-form') this.auth.handleLogin(e);
            if (e.target.id === 'register-form') this.auth.handleRegister(e);
            if (e.target.id === 'profile-form') this.profile.handleUpdate(e);
            if (e.target.id === 'admin-lesson-form') this.admin.adminAddLesson(e);
        });
    }

    updateUIForUser() {
        if (!this.user) return;
        
        const nameEl = document.querySelector('.user-name');
        const roleEl = document.querySelector('.user-role');
        const adminNav = document.getElementById('admin-nav-item');
        
        if (nameEl) nameEl.textContent = this.user.name;
        if (roleEl) roleEl.textContent = this.user.role === 'admin' ? 'Administrator' : 'Student';
        if (adminNav) adminNav.style.display = this.user.role === 'admin' ? 'flex' : 'none';
        
        this.ui.refreshGlobalTopBar();
    }

    router() {
        let route = window.location.pathname.replace(/\/$/, '').split('/').pop();
        if (!route || route === 'public' || route === 'index.html') {
            const hash = window.location.hash.substring(1);
            route = hash ? hash : 'dashboard';
        }

        // Access control
        if (!this.user && route !== 'auth') {
            window.history.replaceState({}, '', 'auth');
            route = 'auth';
        } else if (this.user && route === 'auth') {
            window.history.replaceState({}, '', 'dashboard');
            route = 'dashboard';
        } else if (route === 'admin' && this.user.role !== 'admin') {
            window.history.replaceState({}, '', 'dashboard');
            route = 'dashboard';
        }

        // Apply auth mode class if needed
        if (route === 'auth') {
            document.body.classList.add('auth-mode');
        } else {
            document.body.classList.remove('auth-mode');
        }

        // Update active nav item
        this.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.route === route) item.classList.add('active');
        });

        this.renderView(route);
    }

    async renderView(route) {
        this.container.innerHTML = `<div class="loader"><i class="ph ph-spinner-gap ph-spin"></i> Lade Bereich...</div>`;
        const template = document.getElementById(`tpl-${route}`);
        
        if (template) {
            this.container.innerHTML = '';
            this.container.appendChild(template.content.cloneNode(true));
            
            // Route specific initialization
            switch (route) {
                case 'dashboard':
                    await this.dashboard.loadData();
                    fetch('../api/log.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'VIEW_DASHBOARD', details: 'Dashboard (Übersicht) geöffnet' })
                    }).catch(() => {});
                    break;
                case 'learning':
                    await this.learning.loadData();
                    break;
                case 'profile':
                    await this.profile.loadData();
                    break;
                case 'admin':
                    await this.admin.loadAdminData();
                    break;
            }
        } else {
            this.container.innerHTML = `
                <div class="view fade-in">
                    <header class="view-header">
                        <h1>404 - Nicht gefunden</h1>
                        <p>Die angeforderte Seite existiert nicht.</p>
                    </header>
                </div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.appInstance = new App();
});
