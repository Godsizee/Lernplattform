<?php
require_once __DIR__ . '/includes/header.php';
?>

<div class="view fade-in">
    <header class="view-header">
        <h1>Lern-Bereich</h1>
        <p>Wähle ein Fach, um die zugehörigen Lektionen zu sehen.</p>
    </header>
    <div class="learning-tabs" id="learning-tabs-container"></div>
    <div id="learning-content-container"></div>
</div>

<?php
$pageScript = 'learning';
require_once __DIR__ . '/includes/footer.php';
?>
