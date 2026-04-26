export class Admin {
    constructor() {}

    async loadAdminData() {
        try {
            // Fächer für Select laden
            const subRes = await fetch('../api/content.php?action=subjects');
            if (subRes.ok) {
                const subjects = await subRes.json();
                const select = document.getElementById('admin-lesson-subject');
                if (select) {
                    select.innerHTML = '<option value="">Bitte wählen...</option>';
                    subjects.forEach(s => {
                        select.innerHTML += `<option value="${s.id}">${s.title}</option>`;
                    });
                }
            }

            // Nutzer laden
            const userRes = await fetch('../api/admin.php?action=users');
            if (userRes.ok) {
                const users = await userRes.json();
                const tbody = document.getElementById('admin-users-tbody');
                const filter = document.getElementById('audit-user-filter');
                if (tbody) {
                    tbody.innerHTML = '';
                    users.forEach(u => {
                        tbody.innerHTML += `
                            <tr>
                                <td>${u.id}</td>
                                <td>${window.escapeHTML(u.name)}</td>
                                <td>${window.escapeHTML(u.email)}</td>
                                <td>
                                    <select class="form-control admin-role-select" data-id="${u.id}" style="padding: 0.3rem; margin:0; height:auto; background:transparent;">
                                        <option value="student" ${u.role === 'student' ? 'selected' : ''}>Student</option>
                                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <!-- Delete is possible for everyone via backend check (prevents self delete), but we show the button -->
                                    <button class="btn btn-danger admin-del-user" data-id="${u.id}" style="padding: 0.3rem 0.6rem;"><i class="ph ph-trash"></i></button>
                                </td>
                            </tr>
                        `;
                    });
                }
                
                if (filter) {
                    const currentFilter = filter.value;
                    filter.innerHTML = '<option value="">Alle Nutzer</option>';
                    users.forEach(u => {
                        filter.innerHTML += `<option value="${u.id}">${window.escapeHTML(u.name)}</option>`;
                    });
                    filter.value = currentFilter;
                }
            }

            // Logs laden
            await this.loadAuditLogs();

        } catch (error) {
            console.error('Error loading admin data:', error);
        }
    }

    async adminSetRole(userId, role) {
        if (!confirm('Rolle wirklich ändern?')) return;
        try {
            const res = await fetch('../api/admin.php?action=set_role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, role: role })
            });
            const data = await res.json();
            if (!data.success) alert(data.error || 'Fehler beim Ändern der Rolle.');
            this.loadAuditLogs();
        } catch (error) {
            alert('Verbindungsfehler.');
        }
    }

    async adminDeleteUser(userId) {
        if (!confirm('Nutzer und ALLE seine Daten wirklich löschen? Dies kann nicht rückgängig gemacht werden.')) return;
        try {
            const res = await fetch('../api/admin.php?action=delete_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });
            const data = await res.json();
            if (data.success) {
                this.loadAdminData();
            } else {
                alert(data.error || 'Fehler beim Löschen des Nutzers.');
            }
        } catch (error) {
            alert('Verbindungsfehler.');
        }
    }

    async adminAddLesson(e) {
        e.preventDefault();
        const payload = {
            subject_id: document.getElementById('admin-lesson-subject').value,
            title: document.getElementById('admin-lesson-title').value,
            content: document.getElementById('admin-lesson-content').value
        };

        const btn = e.target.querySelector('button');
        const origText = btn.innerHTML;
        const msgDiv = document.getElementById('admin-lesson-msg');
        
        btn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i>';
        btn.disabled = true;

        try {
            const res = await fetch('../api/admin.php?action=add_lesson', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok && data.success) {
                msgDiv.style.color = 'var(--color-success)';
                msgDiv.textContent = 'Lektion erfolgreich veröffentlicht!';
                e.target.reset();
                this.loadAuditLogs();
            } else {
                msgDiv.style.color = 'var(--color-danger)';
                msgDiv.textContent = data.error || 'Fehler beim Speichern.';
            }
        } catch (error) {
            msgDiv.style.color = 'var(--color-danger)';
            msgDiv.textContent = 'Verbindungsfehler.';
        } finally {
            btn.innerHTML = origText;
            btn.disabled = false;
            setTimeout(() => { msgDiv.textContent = ''; }, 3000);
        }
    }

    async loadAuditLogs(userId = '') {
        const container = document.getElementById('audit-timeline');
        if (!container) return;
        
        container.innerHTML = `<div class="loader"><i class="ph ph-spinner-gap ph-spin"></i> Lade Logs...</div>`;
        
        try {
            const res = await fetch(`../api/admin.php?action=logs${userId ? '&user_id='+userId : ''}`);
            if (!res.ok) return;
            const logs = await res.json();
            
            container.innerHTML = '';
            if (logs.length === 0) {
                container.innerHTML = '<p style="color:var(--text-secondary); margin-left: 1rem;">Keine Aktivitäten gefunden.</p>';
                return;
            }

            logs.forEach(log => {
                const item = document.createElement('div');
                item.className = 'audit-item fade-in';
                item.dataset.action = log.action;
                
                const date = new Date(log.created_at).toLocaleString('de-DE', { 
                    day: '2-digit', month: '2-digit', year: 'numeric', 
                    hour: '2-digit', minute: '2-digit'
                });
                
                item.innerHTML = `
                    <div class="audit-meta">
                        <span><i class="ph ph-user"></i> ${window.escapeHTML(log.user_name)}</span>
                        <span><i class="ph ph-clock"></i> ${date}</span>
                    </div>
                    <div class="audit-text">
                        ${window.escapeHTML(log.details)}
                    </div>
                `;
                container.appendChild(item);
            });
            
        } catch (error) {
            container.innerHTML = '<p class="form-error">Fehler beim Laden der Logs.</p>';
        }
    }
}
