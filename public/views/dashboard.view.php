<?php
require_once __DIR__ . '/../includes/header.php';
?>

<div class="view fade-in">
    <header class="view-header">
        <h1>Willkommen zurück! 👋</h1>
        <p>Setze dein Training fort und maximiere deinen Fortschritt.</p>
    </header>
    
    <div class="subject-grid" id="dashboard-subjects-container">
        <!-- Dynamically injected via pages/dashboard.js -->
    </div>

    <div class="bookmarks-section">
        <h2><i class="ph ph-bookmarks"></i> Meine markierten Lektionen</h2>
        <div id="dashboard-bookmarks-container" class="bookmark-grid">
            <!-- Dynamically injected -->
        </div>
    </div>
</div>

<?php
$pageScript = 'dashboard';
require_once __DIR__ . '/../includes/footer.php';
?>
