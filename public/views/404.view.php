<?php
require_once __DIR__ . '/../includes/header.php';
?>

<div class="view fade-in" style="text-align: center; padding: 4rem 2rem;">
    <h1 style="font-size: 4rem; margin-bottom: 1rem; color: var(--primary);">404</h1>
    <h2>Seite nicht gefunden</h2>
    <p style="color: var(--text-secondary); margin-bottom: 2rem;">Die gesuchte Seite existiert nicht oder wurde verschoben.</p>
    <a href="<?= base_url('/') ?>" class="btn btn-primary">Zurück zum Dashboard</a>
</div>

<?php
$pageScript = '';
require_once __DIR__ . '/../includes/footer.php';
?>
