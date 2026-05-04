/* modules/Admin.js */
import { ApiService } from '../services/ApiService.js';
import { escapeHTML } from '../utils/Helpers.js';
import { Toast } from '../helpers/Toast.js';
import { Modal } from '../helpers/Modal.js';
import { Editor } from './Editor.js';

export class Admin {
    constructor() {
        this.injectTooltipStyles();
    }

    injectTooltipStyles() {
        if (document.getElementById('admin-tooltip-styles')) return;
        const style = document.createElement('style');
        style.id = 'admin-tooltip-styles';
        style.innerHTML = `
            [data-tooltip] {
                position: relative;
            }
            [data-tooltip]::after {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%) translateY(0);
                background: var(--bg-surface);
                color: var(--text-primary);
                padding: 0.4rem 0.8rem;
                border-radius: var(--radius-sm);
                font-size: 0.75rem;
                font-weight: 600;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid var(--border-glass);
                box-shadow: 0 10px 25px rgba(0,0,0,0.4);
                z-index: 1000;
                margin-bottom: 8px;
            }
            [data-tooltip]:hover::after {
                opacity: 1;
                visibility: visible;
                transform: translateX(-50%) translateY(-5px);
            }
            
            /* Responsive Tooltip Positionierung für die Elemente ganz rechts */
            .actions-cell [data-tooltip]:last-child::after,
            .header-actions [data-tooltip]:last-child::after,
            .subject-actions [data-tooltip]:last-child::after {
                left: auto;
                right: 0;
                transform: translateX(0) translateY(0);
            }
            .actions-cell [data-tooltip]:last-child:hover::after,
            .header-actions [data-tooltip]:last-child:hover::after,
            .subject-actions [data-tooltip]:last-child:hover::after {
                transform: translateX(0) translateY(-5px);
            }
            
            /* Spezielles Light Mode Styling für maximalen Kontrast */
            .light-mode [data-tooltip]::after {
                background: #1e293b;
                color: #fff;
                border-color: #0f172a;
            }
        `;
        document.head.appendChild(style);
    }

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
            await this.loadAnnouncementSettings();
        } catch (error) {
            console.error('Error loading admin data:', error);
            Toast.error('Fehler beim Laden der Admin-Daten.');
        }
    }

    async loadAnnouncementSettings() {
        const container = document.getElementById('announcement-editor-container');
        if (!container) return;

        try {
            const announcement = await ApiService.admin.getAnnouncement();
            
            // Editor initialisieren
            this.announcementEditor = new Editor('announcement-editor-container');
            this.announcementEditor.render(announcement.message || '');
            
            // Styling für Kompaktheit anpassen
            const editorEl = container.querySelector('.wiki-editor');
            if (editorEl) {
                editorEl.style.minHeight = '300px';
                container.querySelector('.editor-textarea').style.minHeight = '200px';
            }

            document.getElementById('announcement-type').value = announcement.type || 'info';
            document.getElementById('announcement-active').checked = !!announcement.is_active;

            this.initAnnouncementEvents();
        } catch (error) {
            console.error('Error loading announcement settings:', error);
        }
    }

    initAnnouncementEvents() {
        const form = document.getElementById('announcement-form');
        if (!form || form.dataset.initialized) return;

        form.dataset.initialized = "true";
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('btn-save-announcement');
            const originalContent = btn.innerHTML;
            
            btn.disabled = true;
            btn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i> Speichere...';

            const data = {
                message: this.announcementEditor.getValue(),
                type: document.getElementById('announcement-type').value,
                is_active: document.getElementById('announcement-active').checked
            };

            try {
                await ApiService.admin.saveAnnouncement(data);
                Toast.success('System-Einstellungen wurden erfolgreich gespeichert.');
                
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                Toast.error(error.message || 'Fehler beim Speichern.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalContent;
            }
        });

        // Vorschau-Logik
        document.getElementById('btn-preview-announcement').addEventListener('click', () => {
            const message = this.announcementEditor.getValue();
            const type = document.getElementById('announcement-type').value;
            const active = document.getElementById('announcement-active').checked;

            if (!message) {
                Toast.error('Bitte gib eine Nachricht für die Vorschau ein.');
                return;
            }

            // Bestehenden Banner suchen oder erstellen (temporär)
            let banner = document.getElementById('system-banner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'system-banner';
                banner.className = 'system-broadcast-banner';
                document.body.prepend(banner);
            }

            banner.className = `system-broadcast-banner banner-${type}`;
            banner.style.display = active ? 'flex' : 'none';
            banner.innerHTML = `
                <div class="banner-content">
                    <div class="banner-icon-wrapper">
                        <i class="ph-bold ph-megaphone"></i>
                    </div>
                    <div class="banner-text">${this.announcementEditor.parser.parse(message)}</div>
                    <button class="banner-close" onclick="this.parentElement.parentElement.style.display='none'"><i class="ph ph-x"></i></button>
                </div>
            `;
            
            Toast.info('Vorschau wird oben angezeigt.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Reset Dismissal
        document.getElementById('btn-reset-announcement-dismissal').addEventListener('click', () => {
            localStorage.removeItem('dismissed_announcement');
            Toast.success('Ausblend-Status zurückgesetzt. Der Banner erscheint beim nächsten Laden wieder.');
            
            // Sofort versuchen anzuzeigen, falls er existiert
            const banner = document.getElementById('system-banner');
            if (banner) banner.style.display = 'flex';
        });
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
                                <span class="badge" data-tooltip="Abschlüsse"><i class="ph ph-check-circle"></i> ${l.completion_count}</span>
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
            <tr class="${u.is_banned ? 'banned-row' : ''}">
                <td data-label="ID">#${u.id}</td>
                <td data-label="Name">
                    <strong>${escapeHTML(u.name)}</strong>
                    ${u.is_banned ? '<span class="badge" style="background:rgba(248, 81, 73, 0.1); color:var(--color-danger); font-size:0.7rem; padding: 2px 6px; margin-left: 0.5rem;" data-tooltip="Nutzer hat keinen Zugriff"><i class="ph ph-prohibit"></i> Gesperrt</span>' : ''}
                </td>
                <td data-label="E-Mail">${escapeHTML(u.email)}</td>
                <td data-label="Rolle">
                    <div style="position: relative; display: inline-flex; align-items: center;" data-tooltip="Benutzerrolle anpassen">
                        <i class="ph ph-shield" style="position: absolute; left: 10px; color: var(--text-secondary); pointer-events: none;"></i>
                        <select class="form-control admin-role-select" data-id="${u.id}" style="padding: 0.4rem 0.8rem 0.4rem 2.2rem; margin:0; height:auto; background:var(--bg-surface); border-color: var(--border-glass);" ${u.is_banned ? 'disabled' : ''}>
                            <option value="student" ${u.role === 'student' ? 'selected' : ''}>Student</option>
                            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </div>
                </td>
                <td data-label="Aktionen" class="actions-cell">
                    <div class="action-btn-group">
                        <button class="btn-icon-admin impersonate-user" data-id="${u.id}" data-tooltip="Als dieser Nutzer einloggen" ${u.role === 'admin' ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}><i class="ph ph-mask-happy"></i></button>
                        <button class="btn-icon-admin toggle-ban-user ${u.is_banned ? 'delete' : ''}" data-id="${u.id}" data-banned="${u.is_banned}" data-tooltip="${u.is_banned ? 'Sperre aufheben' : 'Nutzer sperren'}"><i class="ph ph-prohibit"></i></button>
                        <button class="btn-icon-admin delete admin-del-user" data-id="${u.id}" data-tooltip="Unwiderruflich löschen"><i class="ph ph-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.initUserEvents();
    }

    initUserEvents() {
        const usersTable = document.getElementById('admin-users');
        if (!usersTable) return;

        const newTable = usersTable.cloneNode(true);
        usersTable.parentNode.replaceChild(newTable, usersTable);

        newTable.addEventListener('change', (e) => {
            if (e.target.classList.contains('admin-role-select')) {
                this.adminSetRole(e.target.dataset.id, e.target.value);
            }
        });

        newTable.addEventListener('click', (e) => {
            const btnDelete = e.target.closest('.admin-del-user');
            const btnBan = e.target.closest('.toggle-ban-user');
            const btnImpersonate = e.target.closest('.impersonate-user');

            if (btnDelete) this.adminDeleteUser(btnDelete.dataset.id);
            if (btnBan) this.adminToggleBan(btnBan.dataset.id, btnBan.dataset.banned === 'true');
            if (btnImpersonate) this.adminImpersonate(btnImpersonate.dataset.id);
        });
    }

    async adminToggleBan(userId, isCurrentlyBanned) {
        const actionText = isCurrentlyBanned ? 'entsperren' : 'sperren';
        const confirmed = await Modal.confirm(`Möchtest du diesen Nutzer wirklich ${actionText}?`, {
            confirmText: `Ja, ${actionText}`,
            icon: 'ph-prohibit',
            variant: isCurrentlyBanned ? 'primary' : 'danger'
        });
        
        if (!confirmed) return;

        try {
            await ApiService.admin.toggleBan(userId, !isCurrentlyBanned);
            Toast.success(`Nutzer wurde erfolgreich ${actionText}.`);
            await this.loadAdminData();
        } catch (error) {
            Toast.error(error.message || 'Verbindungsfehler.');
        }
    }

    async adminImpersonate(userId) {
        const confirmed = await Modal.confirm('Möchtest du die Sitzung dieses Nutzers temporär übernehmen? Du kannst als dieser Nutzer agieren.', {
            title: 'Sitzung übernehmen?',
            confirmText: 'Ja, als Nutzer einloggen',
            icon: 'ph-mask-happy'
        });
        
        if (!confirmed) return;

        try {
            const res = await ApiService.admin.impersonate(userId);
            if (res.success) {
                window.location.href = window.BASE_URL + '/';
            }
        } catch (error) {
            Toast.error(error.message || 'Fehler beim Sitzungswechsel.');
        }
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
                        <h2><i class="ph ph-folders" style="color: var(--color-primary);"></i> Fächer verwalten</h2>
                        <button class="btn btn-primary btn-sm" id="btn-add-subject" style="padding: 0.6rem 1.2rem; display: none;"><i class="ph ph-plus"></i> Neues Fach</button>
                    </div>
                    <div class="subjects-grid" id="admin-subjects-grid">
                        ${data.subjects.map(s => `
                            <div class="subject-card-mini fade-in" style="border-left: 4px solid ${s.color}">
                                <div class="subject-info">
                                    <div class="subject-icon-wrapper" style="background: ${s.color}15; color: ${s.color};">
                                        <i class="ph ${s.icon || 'ph-book'}"></i>
                                    </div>
                                    <span class="subject-title">${escapeHTML(s.title)}</span>
                                </div>
                                <div class="subject-actions">
                                    <button class="btn-icon-admin edit-subject" data-id="${s.id}" data-tooltip="Fach bearbeiten"><i class="ph ph-pencil-simple"></i></button>
                                    <button class="btn-icon-admin delete del-subject" data-id="${s.id}" data-tooltip="Fach löschen"><i class="ph ph-trash"></i></button>
                                </div>
                            </div>
                        `).join('')}
                        
                        <div class="subject-card-mini fade-in" id="card-add-subject" data-tooltip="Ein neues Fach zum Lehrplan hinzufügen" style="border: 2px dashed var(--border-glass); cursor: pointer; justify-content: center; background: transparent; transition: all 0.2s;">
                            <div class="subject-info" style="color: var(--color-primary);">
                                <i class="ph ph-plus-circle" style="font-size: 1.5rem;"></i>
                                <span class="subject-title" style="font-weight: 600;">Neues Fach anlegen</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="articles-section" style="margin-top: 4rem;">
                    <div class="section-header">
                        <h2><i class="ph ph-article" style="color: var(--color-primary);"></i> Lektionen & Inhalte</h2>
                        
                        <div class="header-actions">
                            <div style="position: relative; display: flex; align-items: center;" data-tooltip="Tabelle nach Fach filtern">
                                <i class="ph ph-funnel" style="position: absolute; left: 10px; color: var(--text-secondary); pointer-events: none;"></i>
                                <select id="filter-lessons-subject" class="form-control" style="width: auto; padding: 0.4rem 0.8rem 0.4rem 2.2rem; height: 36px; border-radius: 8px; font-size: 0.85rem; background: var(--bg-surface);">
                                    <option value="">Alle Fächer anzeigen</option>
                                    ${data.subjects.map(s => `<option value="${s.id}">${escapeHTML(s.title)}</option>`).join('')}
                                </select>
                            </div>

                            <div class="bulk-actions" id="bulk-actions-container" style="display:none;">
                                <span class="bulk-count text-muted">0 gewählt</span>
                                <button class="btn-icon-admin" id="bulk-publish" data-tooltip="Ausgewählte veröffentlichen"><i class="ph ph-check-circle" style="color: var(--color-success);"></i></button>
                                <button class="btn-icon-admin" id="bulk-draft" data-tooltip="Ausgewählte auf Entwurf"><i class="ph ph-pencil-line" style="color: var(--color-warning);"></i></button>
                                <button class="btn-icon-admin delete" id="bulk-delete" data-tooltip="Ausgewählte löschen"><i class="ph ph-trash"></i></button>
                            </div>
                            <a href="${window.BASE_URL}/editor" class="btn btn-success btn-sm" style="padding: 0.6rem 1.2rem;" data-tooltip="Neuen Beitrag im Editor verfassen"><i class="ph ph-plus-circle"></i> Beitrag schreiben</a>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="data-table" id="admin-articles-table">
                            <thead>
                                <tr>
                                    <th width="50" style="text-align: center;"><input type="checkbox" id="select-all-articles" class="custom-checkbox" data-tooltip="Alle auswählen"></th>
                                    <th>Titel der Lektion</th>
                                    <th>Fach</th>
                                    <th>Status</th>
                                    <th>Autor</th>
                                    <th width="140" style="text-align: right;">Aktionen</th>
                                </tr>
                            </thead>
                            <tbody id="admin-articles-tbody">
                                ${data.lessons.map(l => `
                                    <tr class="fade-in draggable-lesson" data-id="${l.id}" data-subject-id="${l.subject_id}">
                                        <td class="checkbox-cell">
                                            <div class="drag-checkbox-wrapper">
                                                <div class="lesson-drag-handle" data-tooltip="Greifen & verschieben"><i class="ph ph-dots-six-vertical"></i></div>
                                                <input type="checkbox" class="article-select custom-checkbox" value="${l.id}">
                                            </div>
                                        </td>
                                        <td data-label="Titel">
                                            <span class="article-title">${escapeHTML(l.title)}</span>
                                        </td>
                                        <td data-label="Fach">
                                            <span class="subject-badge" style="background: ${l.subject_color}15; color: ${l.subject_color}; border: 1px solid ${l.subject_color}30;" data-tooltip="Zugehöriges Fach">
                                                <i class="ph ph-folder"></i> ${escapeHTML(l.subject_title)}
                                            </span>
                                        </td>
                                        <td data-label="Status">
                                            <button class="status-toggle ${l.status}" data-id="${l.id}" data-status="${l.status}" data-tooltip="Klicken für Statuswechsel">
                                                <i class="ph ${l.status === 'published' ? 'ph-check-circle' : 'ph-clock'}"></i>
                                                <span>${l.status === 'published' ? 'Online' : 'Entwurf'}</span>
                                            </button>
                                        </td>
                                        <td data-label="Autor"><span class="text-muted" data-tooltip="Ersteller"><i class="ph ph-user"></i> ${escapeHTML(l.author_name || 'System')}</span></td>
                                        <td class="actions-cell" data-label="Aktionen">
                                            <div class="action-btn-group">
                                                <button class="btn-icon-admin clone-lesson" data-id="${l.id}" data-tooltip="Lektion duplizieren"><i class="ph ph-copy"></i></button>
                                                <a href="${window.BASE_URL}/editor?id=${l.id}" class="btn-icon-admin" data-tooltip="Im Editor öffnen"><i class="ph ph-pencil-simple"></i></a>
                                                <button class="btn-icon-admin delete del-lesson" data-id="${l.id}" data-tooltip="Unwiderruflich löschen"><i class="ph ph-trash"></i></button>
                                            </div>
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
            const checked = Array.from(checkboxes).filter(c => c.checked && c.closest('.draggable-lesson').style.display !== 'none');
            if (checked.length > 0) {
                bulkContainer.style.display = 'flex';
                bulkCount.textContent = `${checked.length} ausgewählt`;
            } else {
                bulkContainer.style.display = 'none';
            }
        };

        if (selectAll) {
            selectAll.addEventListener('change', () => {
                checkboxes.forEach(c => {
                    if(c.closest('.draggable-lesson').style.display !== 'none') {
                        c.checked = selectAll.checked;
                    }
                });
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
        document.getElementById('card-add-subject')?.addEventListener('click', () => this.showSubjectModal());
        
        const addCard = document.getElementById('card-add-subject');
        if(addCard) {
            addCard.addEventListener('mouseenter', () => { addCard.style.borderColor = 'var(--color-primary)'; addCard.style.background = 'rgba(169, 114, 255, 0.05)'; });
            addCard.addEventListener('mouseleave', () => { addCard.style.borderColor = 'var(--border-glass)'; addCard.style.background = 'transparent'; });
        }

        document.querySelectorAll('.edit-subject').forEach(btn => {
            btn.addEventListener('click', () => {
                const subject = this.contentData.subjects.find(s => s.id == btn.dataset.id);
                this.showSubjectModal(subject);
            });
        });
        document.querySelectorAll('.del-subject').forEach(btn => {
            btn.addEventListener('click', () => this.handleDeleteSubject(btn.dataset.id));
        });

        // Lesson Filter
        const filterLessons = document.getElementById('filter-lessons-subject');
        if (filterLessons) {
            filterLessons.addEventListener('change', (e) => {
                const selectedSubjectId = e.target.value;
                const rows = document.querySelectorAll('.draggable-lesson');
                
                rows.forEach(row => {
                    if (!selectedSubjectId || row.dataset.subjectId === selectedSubjectId) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                        const cb = row.querySelector('.article-select');
                        if(cb) cb.checked = false;
                    }
                });
                
                if(selectAll) selectAll.checked = false;
                updateBulkUI();
            });
        }

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
            
            const rows = Array.from(tbody.querySelectorAll('.draggable-lesson')).filter(row => row.style.display !== 'none');
            
            const orders = rows.map((row, index) => ({
                id: row.dataset.id,
                sort_order: index
            }));

            try {
                await ApiService.admin.updateLessonOrder(orders);
            } catch (error) {
                Toast.error('Fehler beim Speichern der Reihenfolge.');
            }
            draggedRow = null;
        });

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