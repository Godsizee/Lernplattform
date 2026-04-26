<?php
require_once __DIR__ . '/includes/header.php';
?>

<div class="view fade-in">
    <header class="view-header">
        <h1>Mein Profil</h1>
        <p>Verwalte deine Daten (DSGVO-konform).</p>
    </header>
    
    <div class="content-card" style="max-width: 600px; margin-bottom: 2rem;">
        <h2>Profildaten bearbeiten</h2>
        <form id="profile-form" style="margin-top: 1.5rem;">
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="profile-name" class="form-control" value="<?= htmlspecialchars($user['name']) ?>" required>
            </div>
            <div class="form-group">
                <label>E-Mail</label>
                <!-- Email placeholder, since email isn't in session yet, we'd fetch it via JS -->
                <input type="email" id="profile-email" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Neues Passwort</label>
                <input type="password" id="profile-password" class="form-control" placeholder="Leer lassen für keine Änderung">
            </div>
            <div class="form-error" id="profile-error"></div>
            <button type="submit" class="btn btn-primary"><i class="ph ph-floppy-disk"></i> Speichern</button>
        </form>
    </div>

    <div class="content-card" style="max-width: 600px; border-color: rgba(239, 68, 68, 0.3);">
        <h2 style="color: var(--color-danger);">Gefahrenzone</h2>
        <p>Hier kannst du deine Daten exportieren oder dein Konto löschen.</p>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button id="export-data-btn" class="btn btn-success"><i class="ph ph-download-simple"></i> JSON Export</button>
            <button id="delete-account-btn" class="btn btn-danger"><i class="ph ph-trash"></i> Account löschen</button>
        </div>
    </div>
</div>

<?php
$pageScript = 'profile';
require_once __DIR__ . '/includes/footer.php';
?>
