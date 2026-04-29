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
            
            // Content Manager laden
            await this.loadContentManager();

            await this.loadAuditLogs();
        } catch (error) {
            console.error('Error loading admin data:', error);
            Toast.error('Fehler beim Laden der Admin-Daten.');
        }
    }

    async loadContentManager() {
        try {
            this.contentData = await ApiService.admin.getContent();
            this.renderContentManager(this.contentData);
        } catch (error) {
            console.error('Error loading content manager:', error);
            Toast.error('Fehler beim Laden der Inhalte.');
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

    renderContentManager(data) {
        const container = document.getElementById('admin-content');
        if (!container) return;

        container.innerHTML = `
            <div class="content-manager-layout">
                <section class="subjects-section">
                    <div class="section-header">
                        <h2><i class="ph ph-folders"></i> Fächer-Manager</h2>
                        <button class="btn btn-primary btn-sm" id="btn-add-subject"><i class="ph ph-plus"></i> Fach</button>
                    </div>
                    <div class="subjects-grid" id="admin-subjects-grid">
                        ${data.subjects.map(s => `
                            <div class="subject-card-mini fade-in" style="border-left: 4px solid ${s.color}">
                                <div class="subject-info">
                                    <i class="ph ${s.icon || 'ph-book'}" style="color: ${s.color}"></i>
                                    <span class="subject-title">${escapeHTML(s.title)}</span>
                                </div>
                                <div class="subject-actions">
                                    <button class="btn-icon edit-subject" data-id="${s.id}"><i class="ph ph-pencil-simple"></i></button>
                                    <button class="btn-icon del-subject" data-id="${s.id}"><i class="ph ph-trash"></i></button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <section class="articles-section" style="margin-top: 3rem;">
                    <div class="section-header">
                        <h2><i class="ph ph-article"></i> Alle Beiträge</h2>
                        <div class="bulk-actions" id="bulk-actions-container" style="display:none;">
                            <span class="bulk-count text-muted">0 ausgewählt</span>
                            <button class="btn btn-secondary btn-sm" id="bulk-publish"><i class="ph ph-check-circle"></i> Veröffentlichen</button>
                            <button class="btn btn-secondary btn-sm" id="bulk-draft"><i class="ph ph-pencil-line"></i> Entwurf</button>
                            <button class="btn btn-danger btn-sm" id="bulk-delete"><i class="ph ph-trash"></i> Löschen</button>
                        </div>
                        <a href="${window.BASE_URL}/editor" class="btn btn-primary btn-sm"><i class="ph ph-plus"></i> Neuer Beitrag</a>
                    </div>

                    <div class="table-responsive">
                        <table class="data-table" id="admin-articles-table">
                            <thead>
                                <tr>
                                    <th width="40"><input type="checkbox" id="select-all-articles"></th>
                                    <th>Titel</th>
                                    <th>Fach</th>
                                    <th>Status</th>
                                    <th>Autor</th>
                                    <th width="120">Aktion</th>
                                </tr>
                            </thead>
                            <tbody id="admin-articles-tbody">
                                ${data.lessons.map(l => `
                                    <tr class="fade-in draggable-lesson" data-id="${l.id}" data-subject-id="${l.subject_id}">
                                        <td><input type="checkbox" class="article-select" value="${l.id}"></td>
                                        <td>
                                            <div class="lesson-drag-handle"><i class="ph ph-dots-six-vertical"></i></div>
                                            <span class="article-title">${escapeHTML(l.title)}</span>
                                        </td>
                                        <td>
                                            <span class="subject-badge" style="background: ${l.subject_color}20; color: ${l.subject_color}">
                                                ${escapeHTML(l.subject_title)}
                                            </span>
                                        </td>
                                        <td>
                                            <button class="status-toggle ${l.status}" data-id="${l.id}" data-status="${l.status}">
                                                <i class="ph ${l.status === 'published' ? 'ph-check-circle' : 'ph-pencil-line'}"></i>
                                                ${l.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                                            </button>
                                        </td>
                                        <td><span class="text-muted">${escapeHTML(l.author_name || 'System')}</span></td>
                                        <td class="actions-cell">
                                            <button class="btn-icon clone-lesson" data-id="${l.id}" title="Duplizieren"><i class="ph ph-copy"></i></button>
                                            <a href="${window.BASE_URL}/editor?id=${l.id}" class="btn-icon" title="Bearbeiten"><i class="ph ph-pencil"></i></a>
                                            <button class="btn-icon del-lesson" data-id="${l.id}" title="Löschen"><i class="ph ph-trash"></i></button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        `;

        this.initContentManagerEvents();
    }

    initContentManagerEvents() {
        // Bulk Actions
        const selectAll = document.getElementById('select-all-articles');
        const checkboxes = document.querySelectorAll('.article-select');
        const bulkContainer = document.getElementById('bulk-actions-container');
        const bulkCount = bulkContainer?.querySelector('.bulk-count');

        const updateBulkUI = () => {
            const checked = Array.from(checkboxes).filter(c => c.checked);
            if (checked.length > 0) {
                bulkContainer.style.display = 'flex';
                bulkCount.textContent = `${checked.length} ausgewählt`;
            } else {
                bulkContainer.style.display = 'none';
            }
        };

        if (selectAll) {
            selectAll.addEventListener('change', () => {
                checkboxes.forEach(c => c.checked = selectAll.checked);
                updateBulkUI();
            });
        }

        checkboxes.forEach(c => c.addEventListener('change', updateBulkUI));

        document.getElementById('bulk-publish')?.addEventListener('click', () => this.handleBulkStatus('published'));
        document.getElementById('bulk-draft')?.addEventListener('click', () => this.handleBulkStatus('draft'));
        document.getElementById('bulk-delete')?.addEventListener('click', () => this.handleBulkDelete());

        // Single Actions
        document.querySelectorAll('.status-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const newStatus = btn.dataset.status === 'published' ? 'draft' : 'published';
                this.handleBulkStatus(newStatus, [btn.dataset.id]);
            });
        });

        document.querySelectorAll('.clone-lesson').forEach(btn => {
            btn.addEventListener('click', () => this.handleCloneLesson(btn.dataset.id));
        });

        document.querySelectorAll('.del-lesson').forEach(btn => {
            btn.addEventListener('click', () => this.handleDeleteLesson(btn.dataset.id));
        });

        // Subject Manager
        document.getElementById('btn-add-subject')?.addEventListener('click', () => this.showSubjectModal());
        document.querySelectorAll('.edit-subject').forEach(btn => {
            btn.addEventListener('click', () => {
                const subject = this.contentData.subjects.find(s => s.id == btn.dataset.id);
                this.showSubjectModal(subject);
            });
        });
        document.querySelectorAll('.del-subject').forEach(btn => {
            btn.addEventListener('click', () => this.handleDeleteSubject(btn.dataset.id));
        });

        // Drag & Drop
        this.initDragAndDrop();
    }

    async handleBulkStatus(status, ids = null) {
        if (!ids) {
            ids = Array.from(document.querySelectorAll('.article-select:checked')).map(c => c.value);
        }
        if (ids.length === 0) return;

        try {
            await ApiService.admin.bulkStatus(ids, status);
            Toast.success('Status wurde aktualisiert.');
            await this.loadContentManager();
        } catch (error) {
            Toast.error(error.message);
        }
    }

    async handleBulkDelete() {
        const ids = Array.from(document.querySelectorAll('.article-select:checked')).map(c => c.value);
        if (ids.length === 0) return;

        const confirmed = await Modal.confirm(`Möchtest du diese ${ids.length} Beiträge wirklich löschen?`, {
            confirmText: 'Ja, löschen',
            variant: 'danger'
        });
        if (!confirmed) return;

        try {
            await ApiService.admin.bulkDelete(ids);
            Toast.success('Beiträge gelöscht.');
            await this.loadContentManager();
        } catch (error) {
            Toast.error(error.message);
        }
    }

    async handleDeleteLesson(id) {
        const confirmed = await Modal.confirm('Diesen Beitrag wirklich unwiderruflich löschen?', {
            confirmText: 'Löschen',
            variant: 'danger'
        });
        if (!confirmed) return;

        try {
            await ApiService.admin.bulkDelete([id]);
            Toast.success('Beitrag gelöscht.');
            await this.loadContentManager();
        } catch (error) {
            Toast.error(error.message);
        }
    }

    async handleCloneLesson(id) {
        try {
            const res = await ApiService.admin.cloneLesson(id);
            Toast.success('Beitrag wurde dupliziert.');
            await this.loadContentManager();
        } catch (error) {
            Toast.error(error.message);
        }
    }

    showSubjectModal(subject = null) {
        const title = subject ? 'Fach bearbeiten' : 'Neues Fach anlegen';
        const modalContent = `
            <div class="form-group">
                <label>Name des Fachs</label>
                <input type="text" id="subject-title" class="form-control" value="${subject ? escapeHTML(subject.title) : ''}" placeholder="z.B. Python für Fortgeschrittene">
            </div>
            <div class="form-group" style="margin-top: 1rem;">
                <label>Akzentfarbe</label>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <input type="color" id="subject-color" value="${subject ? subject.color : '#a972ff'}" style="width: 50px; height: 40px; border: none; background: none; cursor: pointer;">
                    <span class="text-muted" id="subject-color-hex">${subject ? subject.color : '#a972ff'}</span>
                </div>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
                <label>Phosphor Icon</label>
                <div class="icon-selector-grid">
                    ${['ph-database', 'ph-chart-bar', 'ph-buildings', 'ph-coffee', 'ph-code', 'ph-terminal', 'ph-books', 'ph-lightning', 'ph-brain', 'ph-rocket'].map(icon => `
                        <div class="icon-option ${subject && subject.icon === icon ? 'selected' : ''}" data-icon="${icon}">
                            <i class="ph ${icon}"></i>
                        </div>
                    `).join('')}
                </div>
                <input type="hidden" id="subject-icon" value="${subject ? subject.icon : 'ph-book'}">
            </div>
        `;

        Modal.show({
            title,
            content: modalContent,
            confirmText: 'Speichern',
            onConfirm: async () => {
                const data = {
                    id: subject ? subject.id : null,
                    title: document.getElementById('subject-title').value,
                    color: document.getElementById('subject-color').value,
                    icon: document.getElementById('subject-icon').value
                };
                try {
                    await ApiService.admin.saveSubject(data);
                    Toast.success('Fach gespeichert.');
                    await this.loadContentManager();
                    return true;
                } catch (error) {
                    Toast.error(error.message);
                    return false;
                }
            }
        });

        // Event Listeners for Modal
        document.getElementById('subject-color')?.addEventListener('input', (e) => {
            document.getElementById('subject-color-hex').textContent = e.target.value;
        });

        document.querySelectorAll('.icon-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                document.getElementById('subject-icon').value = opt.dataset.icon;
            });
        });
    }

    async handleDeleteSubject(id) {
        const confirmed = await Modal.confirm('Möchtest du dieses Fach wirklich löschen? ACHTUNG: Die zugehörigen Lektionen werden nicht gelöscht, müssen aber neu zugewiesen werden.', {
            confirmText: 'Fach löschen',
            variant: 'danger'
        });
        if (!confirmed) return;

        try {
            await ApiService.admin.deleteSubject(id);
            Toast.success('Fach wurde gelöscht.');
            await this.loadContentManager();
        } catch (error) {
            Toast.error(error.message);
        }
    }

    initDragAndDrop() {
        const tbody = document.getElementById('admin-articles-tbody');
        if (!tbody) return;

        let draggedRow = null;

        tbody.addEventListener('dragstart', (e) => {
            const row = e.target.closest('.draggable-lesson');
            if (!row) return;
            draggedRow = row;
            row.classList.add('is-dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        tbody.addEventListener('dragover', (e) => {
            e.preventDefault();
            const row = e.target.closest('.draggable-lesson');
            if (!row || row === draggedRow) return;

            const rect = row.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            
            if (e.clientY < midpoint) {
                tbody.insertBefore(draggedRow, row);
            } else {
                tbody.insertBefore(draggedRow, row.nextSibling);
            }
        });

        tbody.addEventListener('dragend', async () => {
            if (!draggedRow) return;
            draggedRow.classList.remove('is-dragging');
            
            // Neue Reihenfolge berechnen
            const rows = Array.from(tbody.querySelectorAll('.draggable-lesson'));
            const orders = rows.map((row, index) => ({
                id: row.dataset.id,
                sort_order: index
            }));

            try {
                await ApiService.admin.updateLessonOrder(orders);
                // Keine Toast-Meldung für weniger "Lärm" bei D&D
            } catch (error) {
                Toast.error('Fehler beim Speichern der Reihenfolge.');
            }
            draggedRow = null;
        });

        // Handle icons as drag handles
        document.querySelectorAll('.lesson-drag-handle').forEach(handle => {
            handle.parentElement.parentElement.setAttribute('draggable', true);
        });
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