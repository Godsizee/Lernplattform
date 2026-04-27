<?php
require_once __DIR__ . '/../includes/header.php';
?>

<div class="view fade-in">
    <header class="view-header">
        <h1 id="editor-page-title">Neuen Beitrag erstellen</h1>
        <p id="editor-page-subtitle">Wähle ein Fach und teile dein Wissen mit deinen Kommilitonen.</p>
    </header>

    <div class="editor-page-form">
        <div class="editor-form-row">
            <div class="form-group">
                <label for="article-subject">Fach</label>
                <select id="article-subject" class="form-control" required>
                    <option value="">Bitte wählen...</option>
                </select>
            </div>
            <div class="form-group">
                <label for="article-title">Titel</label>
                <input type="text" id="article-title" class="form-control" placeholder="z.B. SQL Joins einfach erklärt" required>
            </div>
        </div>

        <div class="form-group">
            <label>Inhalt</label>
            <div id="article-editor-container"></div>
        </div>

        <div class="editor-form-actions">
            <button type="button" id="article-save-btn" class="btn btn-primary">
                <i class="ph ph-floppy-disk"></i> <span>Veröffentlichen</span>
            </button>
            <div class="status-toggle">
                <span id="status-label">Entwurf</span>
                <button type="button" id="status-toggle-switch" class="status-toggle-switch" aria-label="Status umschalten" title="Zwischen Entwurf und Veröffentlicht wechseln"></button>
            </div>
            <a href="<?= BASE_URL ?>/learning" class="btn btn-secondary" style="margin-left: auto;">
                <i class="ph ph-arrow-left"></i> Zurück
            </a>
        </div>

        <div id="article-message" style="margin-top: 1rem; font-weight: 500;"></div>
    </div>
</div>

<?php
$pageScript = 'editor';
require_once __DIR__ . '/../includes/footer.php';
?>
