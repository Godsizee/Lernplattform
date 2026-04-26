import { Auth } from '../modules/Auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Da wir die MPA Architektur haben, instanziieren wir Auth direkt
    const authModule = new Auth({
        // Mock App Container für das Modul
        container: document.querySelector('.auth-wrapper')
    });
    
    // Form Events anbinden
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Wir nutzen die Logik aus Auth.js, müssen aber den Redirect anpassen
            const success = await authModule.handleLogin(e);
            if (success) {
                window.location.href = 'index.php';
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const success = await authModule.handleRegister(e);
            if (success) {
                window.location.href = 'index.php';
            }
        });
    }
});
