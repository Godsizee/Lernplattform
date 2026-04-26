export class Auth {
    constructor() {
        // MPA Mode, no app reference needed
    }

    async handleLogin(e) {
        const payload = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        };
        return await this.submitAuthForm(e, 'login', payload, 'login-error');
    }

    async handleRegister(e) {
        const payload = {
            name: document.getElementById('register-name').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value
        };
        return await this.submitAuthForm(e, 'register', payload, 'register-error');
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
                
                if (action === 'login') {
                    fetch('../api/log.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'LOGIN', details: 'Nutzer hat sich eingeloggt.' })
                    }).catch(() => {});
                }
                return true;
            } else {
                if (errorDiv) errorDiv.textContent = data.error || 'Fehler bei der Authentifizierung.';
                return false;
            }
        } catch (error) {
            if (errorDiv) errorDiv.textContent = 'Verbindungsfehler. Bitte später erneut versuchen.';
            return false;
        } finally {
            btn.innerHTML = origText;
            btn.disabled = false;
        }
    }
}
