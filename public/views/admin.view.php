<?php
require_once __DIR__ . '/../includes/header.php';

// Zusaetzlicher Schutz: Nur Admins
if ($user['role'] !== 'admin') {
    header("Location: " . BASE_URL . "/");
    exit;
}
?>

<div class="view fade-in">
    <header class="view-header">
        <h1>Admin-Bereich</h1>
        <p>Nutzer und Lerninhalte verwalten.</p>
    </header>

    <!-- NEU: Tabs mit anschaulichen Icons -->
    <div class="learning-tabs" id="admin-tabs" style="margin-bottom: 2rem;">
        <button class="learning-tab active" data-target="admin-dashboard" style="display: inline-flex; align-items: center; gap: 0.5rem;"><i class="ph ph-gauge"></i> Cockpit</button>
        <button class="learning-tab" data-target="admin-users" style="display: inline-flex; align-items: center; gap: 0.5rem;"><i class="ph ph-users"></i> Nutzerverwaltung</button>
        <button class="learning-tab" data-target="admin-content" style="display: inline-flex; align-items: center; gap: 0.5rem;"><i class="ph ph-books"></i> Inhalte (Lektionen)</button>
        <button class="learning-tab" data-target="admin-audit" style="display: inline-flex; align-items: center; gap: 0.5rem;"><i class="ph ph-list-dashes"></i> Aktivitäten-Log</button>
        <button class="learning-tab" data-target="admin-system" style="display: inline-flex; align-items: center; gap: 0.5rem;"><i class="ph ph-gear"></i> System</button>
    </div>

    <div id="admin-dashboard" class="admin-panel active-panel fade-in">
        <!-- KPI Cards -->
        <div class="stats-grid" id="admin-stats-grid">
            <div class="stats-card skeleton" style="height: 120px;"></div>
            <div class="stats-card skeleton" style="height: 120px;"></div>
            <div class="stats-card skeleton" style="height: 120px;"></div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
            <!-- Popular Content -->
            <div class="content-card">
                <h3><i class="ph ph-trend-up" style="color: var(--accent-primary);"></i> Beliebteste Inhalte</h3>
                <div id="admin-popular-lessons" style="margin-top: 1rem;">
                    <div class="loader"><i class="ph ph-spinner-gap ph-spin"></i></div>
                </div>
            </div>

            <!-- System Health -->
            <div class="content-card">
                <h3><i class="ph ph-heartbeat" style="color: var(--accent-primary);"></i> System-Gesundheit</h3>
                <div id="admin-system-health" style="margin-top: 1rem;">
                    <div class="loader"><i class="ph ph-spinner-gap ph-spin"></i></div>
                </div>
            </div>
        </div>
    </div>
    
    <div id="admin-users" class="admin-panel content-card" style="display:none;">
        <div class="section-header" style="margin-bottom: 1.5rem;">
            <h2 style="margin: 0; font-size: 1.25rem; display: flex; align-items: center; gap: 0.75rem;"><i class="ph ph-users" style="color: var(--color-primary);"></i> Registrierte Nutzer</h2>
        </div>
        <div style="overflow-x: auto;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>E-Mail</th>
                        <th>Rolle</th>
                        <th style="text-align: right;">Aktionen</th>
                    </tr>
                </thead>
                <tbody id="admin-users-tbody"></tbody>
            </table>
        </div>
    </div>

    <div id="admin-content" class="admin-panel" style="display:none;">
        <div class="loader"><i class="ph ph-spinner-gap ph-spin"></i> Lade Inhalte...</div>
    </div>

    <div id="admin-audit" class="admin-panel content-card" style="display:none;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem; margin-bottom: 1rem;">
            <h2 style="margin: 0; font-size: 1.25rem; display: flex; align-items: center; gap: 0.75rem;"><i class="ph ph-list-dashes" style="color: var(--color-primary);"></i> Aktivitäten-Log</h2>
            <!-- NEU: Filter mit Icon -->
            <div style="position: relative; display: flex; align-items: center;" data-tooltip="Nach Nutzer filtern">
                <i class="ph ph-funnel" style="position: absolute; left: 10px; color: var(--text-secondary); pointer-events: none;"></i>
                <select id="audit-user-filter" class="form-control" style="width: auto; min-width: 200px; padding-left: 2.2rem;">
                    <option value="">Alle Nutzer</option>
                </select>
            </div>
        </div>
        <div class="audit-timeline" id="audit-timeline">
            <div class="loader"><i class="ph ph-spinner-gap ph-spin"></i> Lade Logs...</div>
        </div>
    </div>

    <!-- NEU: System-Einstellungen (Announcement Banner) -->
    <div id="admin-system" class="admin-panel content-card" style="display:none;">
        <div class="section-header" style="margin-bottom: 1.5rem;">
            <h2 style="margin: 0; font-size: 1.25rem; display: flex; align-items: center; gap: 0.75rem;"><i class="ph ph-megaphone" style="color: var(--color-primary);"></i> Globale Ankündigung (Banner)</h2>
        </div>
        
        <form id="announcement-form" class="fade-in">
            <div class="form-group">
                <label>Nachricht (Markdown unterstützt)</label>
                <div id="announcement-editor-container" style="min-height: 200px;"></div>
                <p class="text-muted" style="font-size: 0.8rem; margin-top: 0.5rem;">Nutze die Toolbar zum Formatieren. Markdown wie **fett**, *kursiv* oder `Code` ist erlaubt.</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem;">
                <div class="form-group">
                    <label for="announcement-type">Banner-Typ</label>
                    <select id="announcement-type" class="form-control">
                        <option value="info">Information (Blau)</option>
                        <option value="warning">Warnung (Gelb/Orange)</option>
                        <option value="danger">Kritisch (Rot)</option>
                        <option value="success">Erfolg (Grün)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <label class="switch-container" style="display: flex; align-items: center; gap: 1rem; cursor: pointer; margin-top: 0.5rem;">
                        <input type="checkbox" id="announcement-active" class="custom-checkbox">
                        <span style="font-weight: 500;">Banner aktiv anzeigen</span>
                    </label>
                </div>
            </div>

            <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-glass);">
                <button type="submit" class="btn btn-primary" id="btn-save-announcement">
                    <i class="ph ph-floppy-disk"></i> Einstellungen speichern
                </button>
            </div>
        </form>
    </div>
</div>

<?php
$pageScript = 'admin';
require_once __DIR__ . '/../includes/footer.php';
?>