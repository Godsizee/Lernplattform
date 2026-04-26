export class Admin {
    constructor(app) {
        this.app = app;
    }

    async loadAdminData() {
        try {
            const res = await fetch('../api/admin.php?action=users');
            const users = await res.json();
            const tbody = document.getElementById('admin-users-tbody');
            const filterSel = document.getElementById('audit-user-filter');
            
            if(tbody) {
                tbody.innerHTML = users.map(u => `
                    <tr>
                        <td>${u.id}</td>
                        <td>${window.escapeHTML(u.name)}</td>
                        <td>${window.escapeHTML(u.email)}</td>
                        <td>
                            <select class="form-control admin-role-select" data-id="${u.id}" style="padding: 0.3rem; height: auto;">
                                <option value="student" ${u.role==='student'?'selected':''}>Student</option>
                                <option value="admin" ${u.role==='admin'?'selected':''}>Admin</option>
                            </select>
                        </td>
                        <td>
                            ${u.id != this.app.user.id ? `<button class="btn btn-danger admin-del-user" data-id="${u.id}" style="padding: 0.3rem 0.6rem;"><i class="ph ph-trash"></i></button>` : `<span class="badge" style="background:var(--color-primary);color:white;">Du</span>`}
                        </td>
                    </tr>
                `).join('');
            }

            if(filterSel && users.length > 0 && filterSel.options.length === 1) {
                filterSel.innerHTML = '<option value="">Alle Nutzer</option>' + users.map(u => `<option value="${u.id}">${window.escapeHTML(u.name)}</option>`).join('');
            }

            const sRes = await fetch('../api/content.php?action=dashboard');
            const sData = await sRes.json();
            const sel = document.getElementById('admin-lesson-subject');
            if(sel && sData.subjects) {
                sel.innerHTML = sData.subjects.map(s => `<option value="${s.id}">${window.escapeHTML(s.title)}</option>`).join('');
            }

            await this.loadAuditLogs();

        } catch(e){}
    }

    async loadAuditLogs(userId = '') {
        try {
            const tl = document.getElementById('audit-timeline');
            if(tl) tl.innerHTML = '<div class="loader"><i class="ph ph-spinner-gap ph-spin"></i> Lade Logs...</div>';
            
            const res = await fetch(`../api/admin.php?action=audit&user_id=${userId}`);
            const logs = await res.json();
            
            if(!tl) return;
            
            if(logs.length === 0 || logs.error) {
                tl.innerHTML = '<p style="color:var(--text-secondary)">Keine Aktivitäten gefunden.</p>';
                return;
            }

            tl.innerHTML = logs.map(l => {
                const date = new Date(l.created_at).toLocaleString('de-DE');
                let iconStr = '<i class="ph ph-activity"></i>';
                if(l.action === 'LOGIN') iconStr = '<i class="ph ph-sign-in" style="color:var(--color-warning)"></i>';
                else if(l.action === 'LESSON_COMPLETED') iconStr = '<i class="ph ph-check-circle" style="color:var(--color-success)"></i>';
                else if(l.action === 'LESSON_RESET') iconStr = '<i class="ph ph-arrow-counter-clockwise" style="color:var(--color-danger)"></i>';
                else if(l.action === 'VIEW_SUBJECT') iconStr = '<i class="ph ph-book-open" style="color:var(--color-primary)"></i>';
                else if(l.action === 'VIEW_DASHBOARD') iconStr = '<i class="ph ph-squares-four" style="color:var(--color-primary)"></i>';
                
                return `
                    <div class="audit-item" data-action="${l.action}">
                        <div class="audit-meta">
                            <span><strong>${window.escapeHTML(l.user_name)}</strong></span>
                            <span>${date}</span>
                        </div>
                        <div class="audit-text">
                            ${iconStr} ${window.escapeHTML(l.details)}
                        </div>
                    </div>
                `;
            }).join('');
        } catch(e) {}
    }

    async adminSetRole(userId, newRole) {
        try {
            await fetch('../api/admin.php?action=set_role', {
                method: 'POST', body: JSON.stringify({user_id: userId, role: newRole})
            });
        } catch(e) { alert('Fehler'); }
    }

    async adminDeleteUser(userId) {
        if (!confirm('Nutzer endgültig löschen?')) return;
        try {
            const res = await fetch('../api/admin.php?action=delete_user', {
                method: 'POST', body: JSON.stringify({user_id: userId})
            });
            if(res.ok) this.loadAdminData();
        } catch(e) { alert('Fehler'); }
    }

    async adminAddLesson(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const msg = document.getElementById('admin-lesson-msg');
        const orig = btn.innerHTML; btn.innerHTML = 'Speichere...'; btn.disabled = true; msg.textContent = '';
        
        try {
            const res = await fetch('../api/admin.php?action=add_lesson', {
                method: 'POST', body: JSON.stringify({
                    subject_id: document.getElementById('admin-lesson-subject').value,
                    title: document.getElementById('admin-lesson-title').value,
                    content: document.getElementById('admin-lesson-content').value
                })
            });
            if(res.ok) {
                msg.style.color = 'var(--brand-accent)';
                msg.textContent = 'Lektion erfolgreich hinzugefügt!';
                e.target.reset();
            } else { msg.style.color = 'var(--color-java)'; msg.textContent = 'Fehler beim Speichern.'; }
        } catch(e) { msg.style.color = 'var(--color-java)'; msg.textContent = 'Fehler.'; }
        finally { btn.innerHTML = orig; btn.disabled = false; }
    }
}
