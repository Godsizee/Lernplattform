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

    <div class="learning-tabs" id="admin-tabs" style="margin-bottom: 2rem;">
        <button class="learning-tab active" data-target="admin-dashboard">Cockpit</button>
        <button class="learning-tab" data-target="admin-users">Nutzerverwaltung</button>
        <button class="learning-tab" data-target="admin-content">Inhalte (Lektionen)</button>
        <button class="learning-tab" data-target="admin-audit">Aktivitäten-Log</button>
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
        <h2>Registrierte Nutzer</h2>
        <div style="overflow-x: auto; margin-top: 1.5rem;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>E-Mail</th>
                        <th>Rolle</th>
                        <th>Aktion</th>
                    </tr>
                </thead>
                <tbody id="admin-users-tbody"></tbody>
            </table>
        </div>
    </div>

    <div id="admin-content" class="admin-panel content-card" style="display:none;">
        <h2>Inhalte verwalten</h2>
        <p style="margin-top: 1rem; color: var(--text-secondary); line-height: 1.6; max-width: 800px;">
            Um neue Lektionen und Beiträge zu erstellen, nutze bitte den globalen Editor. 
            Dort stehen dir alle Formatierungsmöglichkeiten (Markdown, Code-Blöcke, Live-Vorschau) zur Verfügung. 
            So garantieren wir ein einheitliches Schreib- und Leseerlebnis für alle Nutzer.
        </p>
        <div style="margin-top: 2rem;">
            <a href="<?= BASE_URL ?>/editor" class="btn btn-primary">
                <i class="ph ph-article"></i> Zum vollwertigen Editor wechseln
            </a>
        </div>
    </div>

    <div id="admin-audit" class="admin-panel content-card" style="display:none;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <h2>Aktivitäten-Log</h2>
            <select id="audit-user-filter" class="form-control" style="width: auto; min-width: 200px;">
                <option value="">Alle Nutzer</option>
            </select>
        </div>
        <div class="audit-timeline" id="audit-timeline">
            <div class="loader"><i class="ph ph-spinner-gap ph-spin"></i> Lade Logs...</div>
        </div>
    </div>
</div>

<?php
$pageScript = 'admin';
require_once __DIR__ . '/../includes/footer.php';
?>
