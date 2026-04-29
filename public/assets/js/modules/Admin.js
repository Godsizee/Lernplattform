/* modules/Admin.js */
import { ApiService } from '../services/ApiService.js';
import { escapeHTML } from '../utils/Helpers.js';
import { Toast } from '../helpers/Toast.js';
import { Modal } from '../helpers/Modal.js';

export class Admin {
    constructor() { }

    async loadAdminData() {
        try {
            // Dashboard zuerst laden
            const dashboardData = await ApiService.admin.getDashboard();
            this.renderDashboard(dashboardData);

            const users = await ApiService.admin.getUsers();
            this.renderUsersTable(users);
            this.renderUserFilter(users);
            
            await this.loadAuditLogs();
        } catch (error) {
            console.error('Error loading admin data:', error);
            Toast.error('Fehler beim Laden der Admin-Daten.');
        }
    }

    renderDashboard(data) {
        const statsGrid = document.getElementById('admin-stats-grid');
        const popularList = document.getElementById('admin-popular-lessons');
        const healthContainer = document.getElementById('admin-system-health');

        if (statsGrid) {
            statsGrid.innerHTML = `
                <div class="stats-card fade-in">
                    <div class="stats-icon"><i class="ph ph-users"></i></div>
                    <div class="stats-info">
                        <span class="stats-label">Nutzer</span>
                        <span class="stats-value">${data.top_level.total_users}</span>
                    </div>
                </div>
                <div class="stats-card fade-in">
                    <div class="stats-icon"><i class="ph ph-book-open"></i></div>
                    <div class="stats-info">
                        <span class="stats-label">Lektionen</span>
                        <span class="stats-value">${data.top_level.total_lessons}</span>
                    </div>
                </div>
                <div class="stats-card fade-in">
                    <div class="stats-icon"><i class="ph ph-sign-in"></i></div>
                    <div class="stats-info">
                        <span class="stats-label">Logins (24h)</span>
                        <span class="stats-value">${data.top_level.logins_24h}</span>
                    </div>
                </div>
            `;
        }

        if (popularList) {
            if (data.popular_lessons.length === 0) {
                popularList.innerHTML = '<p class="text-muted">Noch keine Abschlüsse verzeichnet.</p>';
            } else {
                popularList.innerHTML = `
                    <ul class="popular-list">
                        ${data.popular_lessons.map((l, i) => `
                            <li class="fade-in" style="animation-delay: ${i * 0.1}s">
                                <span class="rank">#${i + 1}</span>
                                <span class="title">${escapeHTML(l.title)}</span>
                                <span class="badge">${l.completion_count} <i class="ph ph-check-circle"></i></span>
                            </li>
                        `).join('')}
                    </ul>
                `;
            }
        }

        if (healthContainer) {
            const isWarning = data.system_health.status === 'warning';
            healthContainer.innerHTML = `
                <div class="health-card ${data.system_health.status} fade-in">
                    <div class="health-status">
                        <i class="ph ${isWarning ? 'ph-warning-octagon' : 'ph-check-circle'}"></i>
                        <span>${isWarning ? 'Auffällige Aktivitäten' : 'System stabil'}</span>
                    </div>
                    <div class="health-details">
                        ${data.system_health.failed_logins_24h} fehlgeschlagene Logins in den letzten 24h.
                    </div>
                    ${isWarning ? '<p class="health-hint">Prüfe das Aktivitäten-Log auf mögliche Bruteforce-Angriffe.</p>' : ''}
                </div>
            `;
        }
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('admin-users-tbody');
        if (!tbody) return;

        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${escapeHTML(u.name)}</td>
                <td>${escapeHTML(u.email)}</td>
                <td>
                    <select class="form-control admin-role-select" data-id="${u.id}" style="padding: 0.3rem; margin:0; height:auto; background:transparent;">
                        <option value="student" ${u.role === 'student' ? 'selected' : ''}>Student</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-danger admin-del-user" data-id="${u.id}" style="padding: 0.3rem 0.6rem;"><i class="ph ph-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    renderUserFilter(users) {
        const filter = document.getElementById('audit-user-filter');
        if (!filter) return;

        const currentFilter = filter.value;
        filter.innerHTML = '<option value="">Alle Nutzer</option>' + 
            users.map(u => `<option value="${u.id}">${escapeHTML(u.name)}</option>`).join('');
        filter.value = currentFilter;
    }

    async adminSetRole(userId, role) {
        const confirmed = await Modal.confirm('Soll die Rolle dieses Nutzers wirklich geändert werden?', {
            confirmText: 'Ja, ändern',
            icon: 'ph-user-gear'
        });
        if (!confirmed) return;

        try {
            await ApiService.admin.setRole(userId, role);
            Toast.success('Rolle erfolgreich aktualisiert.');
            await this.loadAuditLogs();
        } catch (error) {
            Toast.error(error.message || 'Verbindungsfehler.');
        }
    }

    async adminDeleteUser(userId) {
        const confirmed = await Modal.confirm('Möchtest du diesen Nutzer und ALLE seine zugehörigen Daten wirklich unwiderruflich löschen?', {
            confirmText: 'Ja, Nutzer löschen',
            icon: 'ph-user-minus'
        });
        if (!confirmed) return;

        try {
            await ApiService.admin.deleteUser(userId);
            Toast.success('Nutzer wurde erfolgreich gelöscht.');
            await this.loadAdminData();
        } catch (error) {
            Toast.error(error.message || 'Verbindungsfehler.');
        }
    }

    async loadAuditLogs(userId = '') {
        const container = document.getElementById('audit-timeline');
        if (!container) return;

        container.innerHTML = `<div class="loader"><i class="ph ph-spinner-gap ph-spin"></i> Lade Logs...</div>`;

        try {
            const logs = await ApiService.admin.getAuditLogs(userId);
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

                let detailsHtml = escapeHTML(log.details).replace(
                    /\{\{article:(\d+)\}\}/g,
                    (_match, id) => `<a href="${window.BASE_URL}/learning#lesson-${id}" class="audit-article-link"><i class="ph ph-arrow-square-out"></i> Beitrag ansehen</a>`
                );

                item.innerHTML = `
                    <div class="audit-meta">
                        <span><i class="ph ph-user"></i> ${escapeHTML(log.user_name)}</span>
                        <span><i class="ph ph-clock"></i> ${date}</span>
                    </div>
                    <div class="audit-text">${detailsHtml}</div>
                `;
                container.appendChild(item);
            });

        } catch (error) {
            container.innerHTML = '<p class="form-error">Fehler beim Laden der Logs.</p>';
        }
    }
}