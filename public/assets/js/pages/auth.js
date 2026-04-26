import { Auth } from '../modules/Auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const base = window.APP_BASE || '/files/lernplattform/public/';
    const authModule = new Auth();
    
    // Form Events anbinden
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const success = await authModule.handleLogin(e);
            if (success) {
                window.location.href = base;
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const success = await authModule.handleRegister(e);
            if (success) {
                window.location.href = base;
            }
        });
    }
});
