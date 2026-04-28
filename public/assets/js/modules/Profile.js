/* modules/Profile.js */
import { ApiService } from '../services/ApiService.js';
import { Auth } from './Auth.js';
import { Toast } from '../helpers/Toast.js';
import { Modal } from '../helpers/Modal.js';

export class Profile {
    constructor() {
        this.form = document.getElementById('profile-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleUpdate(e));
        }
    }

    async loadData() {
        try {
            const data = await ApiService.profile.get();
            
            const fields = {
                'profile-name': data.name,
                'profile-email': data.email,
                'profile-bio': data.bio
            };

            Object.entries(fields).forEach(([id, val]) => {
                const el = document.getElementById(id);
                if (el) el.value = val || '';
            });
        } catch (error) {
            console.error('Error loading profile data:', error);
            Toast.error('Fehler beim Laden der Profil-Daten.');
        }
    }

    async handleUpdate(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const err = document.getElementById('profile-error');
        const origHtml = btn.innerHTML;
        
        this.setLoading(btn, true);
        if (err) err.textContent = '';

        try {
            const payload = {
                name: document.getElementById('profile-name').value,
                email: document.getElementById('profile-email').value,
                password: document.getElementById('profile-password').value,
                bio: document.getElementById('profile-bio').value
            };

            const data = await ApiService.profile.update(payload);
            
            if (data.success) {
                document.getElementById('profile-password').value = '';
                btn.innerHTML = '<i class="ph ph-check"></i> Gespeichert';
                Toast.success('Profil erfolgreich aktualisiert.');
                setTimeout(() => this.setLoading(btn, false, origHtml), 2000);
            } else {
                throw new Error(data.error || 'Fehler beim Speichern.');
            }
        } catch (error) {
            if (err) err.textContent = error.message;
            Toast.error(error.message || 'Fehler beim Speichern.');
            this.setLoading(btn, false, origHtml);
        }
    }

    setLoading(btn, isLoading, originalText = '') {
        if (isLoading) {
            btn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i> Speichere...';
            btn.disabled = true;
        } else {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async deleteAccount() {
        const confirmed = await Modal.confirm('Achtung! Dies löscht dein Konto unwiderruflich! Bist du sicher?', {
            confirmText: 'Ja, Konto löschen',
            icon: 'ph-warning'
        });
        if (!confirmed) return;
        
        try {
            await ApiService.request('profile.php?action=delete', { method: 'POST' });
            Toast.success('Konto erfolgreich gelöscht. Auf Wiedersehen!');
            setTimeout(() => Auth.logout(), 2000);
        } catch (error) {
            Toast.error('Fehler beim Löschen des Accounts.');
        }
    }

    async exportData() {
        try {
            const data = await ApiService.request('profile.php?action=export');
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `Code_Cash_Export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            Toast.success('Daten erfolgreich exportiert.');
        } catch (error) {
            Toast.error('Fehler beim Exportieren der Daten.');
        }
    }
}
