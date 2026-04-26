export class Profile {
    constructor() {}

    async loadData() {
        try {
            const res = await fetch('../api/profile.php?action=get');
            if (!res.ok) return;
            const data = await res.json();
            
            const nameEl = document.getElementById('profile-name');
            const emailEl = document.getElementById('profile-email');
            const bioEl = document.getElementById('profile-bio');
            
            if (nameEl) nameEl.value = data.name || '';
            if (emailEl) emailEl.value = data.email || '';
            if (bioEl) bioEl.value = data.bio || '';
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    }

    async handleUpdate(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const err = document.getElementById('profile-error');
        const origHtml = btn.innerHTML;
        
        btn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i> Speichere...';
        btn.disabled = true;
        
        if (err) err.textContent = '';

        try {
            const payload = {
                name: document.getElementById('profile-name').value,
                email: document.getElementById('profile-email').value,
                password: document.getElementById('profile-password').value,
                bio: document.getElementById('profile-bio')?.value || ''
            };

            const res = await fetch('../api/profile.php?action=update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                document.getElementById('profile-password').value = '';

                btn.innerHTML = '<i class="ph ph-check"></i> Gespeichert';
                setTimeout(() => {
                    btn.innerHTML = origHtml;
                    btn.disabled = false;
                }, 2000);
            } else {
                if (err) err.textContent = data.error || 'Fehler beim Speichern.';
                btn.innerHTML = origHtml;
                btn.disabled = false;
            }
        } catch (error) {
            if (err) err.textContent = 'Verbindungsfehler.';
            btn.innerHTML = origHtml;
            btn.disabled = false;
        }
    }

    async deleteAccount() {
        if (!confirm('Achtung! Dies löscht dein Konto unwiderruflich! Bist du sicher?')) return;
        
        const base = window.APP_BASE || '/files/lernplattform/public/';
        
        try {
            const res = await fetch('../api/profile.php?action=delete', { method: 'POST' });
            if (res.ok) {
                localStorage.removeItem('csrf_token');
                window.location.href = base + 'login';
            } else {
                alert('Fehler beim Löschen des Accounts.');
            }
        } catch (error) {
            alert('Verbindungsfehler beim Löschen des Accounts.');
        }
    }

    async exportData() {
        try {
            const res = await fetch('../api/profile.php?action=export');
            if (!res.ok) throw new Error('Export failed');
            
            const data = await res.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `Code_Cash_Export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Fehler beim Exportieren der Daten.');
        }
    }
}
