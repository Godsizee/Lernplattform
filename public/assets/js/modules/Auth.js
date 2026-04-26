export class Auth {
    constructor(app) {
        this.app = app;
    }

    async checkAuth() {
        try {
            const res = await fetch('../api/auth.php?action=me');
            const data = await res.json();
            if (data.authenticated) {
                if (data.csrf_token) localStorage.setItem('csrf_token', data.csrf_token);
                this.app.user = data.user;
                this.app.updateUIForUser();
                
                const profileRes = await fetch('../api/profile.php?action=get');
                const profileData = await profileRes.json();
                
                if (profileData.theme === 'light') {
                    document.body.classList.add('light-mode');
                    const icon = document.getElementById('theme-icon');
                    const text = document.getElementById('theme-text');
                    if (icon) {
                        icon.classList.remove('ph-moon');
                        icon.classList.add('ph-sun');
                    }
                    if (text) {
                        text.textContent = 'Light Mode';
                    }
                }
            } else {
                this.app.user = null;
                this.app.updateUIForUser();
            }
        } catch (error) {
            this.app.user = null;
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const payload = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        };
        await this.submitAuthForm(e, 'login', payload, 'login-error');
    }

    async handleRegister(e) {
        e.preventDefault();
        const payload = {
            name: document.getElementById('register-name').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value
        };
        await this.submitAuthForm(e, 'register', payload, 'register-error');
    }

    async submitAuthForm(e, action, payload, errorElementId) {
        const btn = e.target.querySelector('button');
        const origText = btn.innerHTML;
        const errorDiv = document.getElementById(errorElementId);
        
        btn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i>';
        btn.disabled = true;
        
        if (errorDiv) {
            errorDiv.textContent = '';
        }

        try {
            const res = await fetch(`../api/auth.php?action=${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                if (data.csrf_token) localStorage.setItem('csrf_token', data.csrf_token);
                this.app.user = data.user;
                this.app.updateUIForUser();
                window.history.pushState({}, '', 'dashboard');
                this.app.router();
                
                if (action === 'login') {
                    fetch('../api/log.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'LOGIN', details: 'Nutzer hat sich eingeloggt.' })
                    }).catch(() => {});
                }
            } else {
                if (errorDiv) errorDiv.textContent = data.error || 'Fehler bei der Authentifizierung.';
            }
        } catch (error) {
            if (errorDiv) errorDiv.textContent = 'Verbindungsfehler. Bitte später erneut versuchen.';
        } finally {
            if (!this.app.user) {
                btn.innerHTML = origText;
                btn.disabled = false;
            }
        }
    }

    async logout() {
        try {
            await fetch('../api/auth.php?action=logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('csrf_token');
            this.app.user = null;
            this.app.updateUIForUser();
            window.history.pushState({}, '', 'auth');
            this.app.router();
        }
    }

    switchAuthTab(btn) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        
        const target = btn.dataset.target;
        document.getElementById('login-form').style.display = target === 'login' ? 'block' : 'none';
        document.getElementById('register-form').style.display = target === 'register' ? 'block' : 'none';
    }
}
