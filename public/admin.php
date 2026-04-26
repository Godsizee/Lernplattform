<?php
require_once __DIR__ . '/includes/header.php';

// Zusaetzlicher Schutz: Nur Admins
if ($user['role'] !== 'admin') {
    header("Location: index.php");
    exit;
}
?>

<div class="view fade-in">
    <header class="view-header">
        <h1>Admin-Bereich</h1>
        <p>Nutzer und Lerninhalte verwalten.</p>
    </header>

    <div class="learning-tabs" id="admin-tabs" style="margin-bottom: 2rem;">
        <button class="learning-tab active" data-target="admin-users">Nutzerverwaltung</button>
        <button class="learning-tab" data-target="admin-content">Inhalte (Lektionen)</button>
        <button class="learning-tab" data-target="admin-audit">Aktivitäten-Log</button>
    </div>
    
    <div id="admin-users" class="admin-panel active-panel content-card">
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
        <h2>Neue Lektion anlegen</h2>
        <form id="admin-lesson-form" style="margin-top: 1.5rem; max-width: 800px;">
            <div class="form-group">
                <label>Fach wählen</label>
                <select id="admin-lesson-subject" class="form-control" required></select>
            </div>
            <div class="form-group">
                <label>Titel der Lektion</label>
                <input type="text" id="admin-lesson-title" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Inhalt (HTML erlaubt)</label>
                <textarea id="admin-lesson-content" class="form-control" rows="8" placeholder="<p>Dein Text hier...</p>" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary"><i class="ph ph-plus-circle"></i> Lektion veröffentlichen</button>
            <div id="admin-lesson-msg" style="margin-top: 1rem; font-weight: bold;"></div>
        </form>
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
require_once __DIR__ . '/includes/footer.php';
?>
