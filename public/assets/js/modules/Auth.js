/* modules/Auth.js */
import { ApiService } from '../services/ApiService.js';

export class Auth {
    constructor() {
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.init();
    }

    init() {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const payload = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value,
            remember: document.getElementById('login-remember')?.checked || false
        };
        
        const success = await this.submitAuthForm(e, 'login', payload, 'login-error');
        if (success) {
            ApiService.log.add('LOGIN', 'Nutzer hat sich eingeloggt.');
            window.location.href = `${window.BASE_URL}/`;
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const payload = {
            name: document.getElementById('register-name').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value
        };
        
        const success = await this.submitAuthForm(e, 'register', payload, 'register-error');
        if (success) {
            window.location.href = `${window.BASE_URL}/login?registered=1`;
        }
    }

    async submitAuthForm(e, type, payload, errorElementId) {
        const btn = e.target.querySelector('button');
        const origText = btn.innerHTML;
        const errorDiv = document.getElementById(errorElementId);

        this.setLoading(btn, true);
        if (errorDiv) errorDiv.textContent = '';

        try {
            const data = await (type === 'login' 
                ? ApiService.auth.login(payload) 
                : ApiService.auth.register(payload));

            if (data.success) {
                if (data.csrf_token) localStorage.setItem('csrf_token', data.csrf_token);
                return true;
            } else {
                throw new Error(data.error || 'Fehler bei der Authentifizierung.');
            }
        } catch (error) {
            if (errorDiv) errorDiv.textContent = error.message;
            return false;
        } finally {
            this.setLoading(btn, false, origText);
        }
    }

    setLoading(btn, isLoading, originalText = '') {
        if (isLoading) {
            btn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i>';
            btn.disabled = true;
        } else {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    static async logout() {
        try {
            await ApiService.auth.logout();
            localStorage.removeItem('csrf_token');
            window.location.href = `${window.BASE_URL}/login`;
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
}