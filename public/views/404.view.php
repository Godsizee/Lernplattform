<div class="view fade-in">
    <header class="view-header">
        <h1>404 – Seite nicht gefunden</h1>
        <p>Die angeforderte Seite existiert nicht.</p>
    </header>
    
    <div class="content-card" style="max-width: 600px; text-align: center;">
        <p style="font-size: 4rem; margin-bottom: 1rem;">🔍</p>
        <p>Vielleicht hast du dich vertippt oder die Seite wurde verschoben.</p>
        <div style="margin-top: 2rem;">
            <?php if(isset($_SESSION['user_id'])): ?>
                <a href="<?= $basePath ?>" class="btn btn-primary">Zurück zum Dashboard</a>
            <?php else: ?>
                <a href="<?= $basePath ?>login" class="btn btn-primary">Zum Login</a>
            <?php endif; ?>
        </div>
    </div>
</div>
