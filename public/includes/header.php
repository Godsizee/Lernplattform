<?php
/**
 * Header Template
 * 
 * Wird vom Front-Controller (index.php) geladen.
 * Erwartet die Variablen: $user, $hideSidebar, $currentRoute, $pageTitle, $basePath
 */
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle ?? 'Lernplattform') ?> | Code &amp; Cash</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Oswald:wght@400;600;700&display=swap" rel="stylesheet">
    <!-- Phosphor Icons -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <!-- Styles -->
    <link rel="stylesheet" href="<?= $basePath ?>assets/css/style.css">
    <script>
        // Theme initialisieren (bevor der Body rendert, um Flackern zu verhindern)
        const savedTheme = localStorage.getItem('lern_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if(savedTheme === 'light') document.documentElement.classList.add('light-mode');

        // Basepath als globale JS-Variable für Module
        window.APP_BASE = '<?= $basePath ?>';
    </script>
</head>
<body data-theme="dark" class="<?= $hideSidebar ? 'auth-mode' : '' ?>">
    <div id="app" class="app-layout">
        
        <?php if (!$hideSidebar): ?>
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-brand" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <img src="<?= $basePath ?>assets/img/logo.png" alt="Code &amp; Cash Logo" class="brand-logo-img">
                <button id="sidebar-toggle" title="Sidebar einklappen/ausklappen" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0.5rem; border-radius: var(--radius-sm); transition: background 0.2s;">
                    <i class="ph ph-list" style="font-size: 1.5rem;"></i>
                </button>
            </div>
            
            <nav class="sidebar-nav">
                <a href="<?= $basePath ?>" class="nav-item <?= $currentRoute === 'dashboard' ? 'active' : '' ?>">
                    <i class="ph ph-squares-four"></i> <span class="nav-text">Dashboard</span>
                </a>
                <a href="<?= $basePath ?>lernen" class="nav-item <?= $currentRoute === 'lernen' ? 'active' : '' ?>">
                    <i class="ph ph-books"></i> <span class="nav-text">Lern-Bereich</span>
                </a>
                <a href="<?= $basePath ?>profil" class="nav-item <?= $currentRoute === 'profil' ? 'active' : '' ?>">
                    <i class="ph ph-user-circle"></i> <span class="nav-text">Mein Profil</span>
                </a>
                <?php if ($user && $user['role'] === 'admin'): ?>
                <a href="<?= $basePath ?>admin" class="nav-item <?= $currentRoute === 'admin' ? 'active' : '' ?>">
                    <i class="ph ph-shield-star"></i> <span class="nav-text">Admin-Bereich</span>
                </a>
                <?php endif; ?>
            </nav>
            
            <div style="margin-top: auto;">
                <button id="theme-toggle-btn" class="nav-item" style="width:100%; background:none; border:none; text-align:left; cursor:pointer; padding-top: 0.8rem; padding-bottom: 0.8rem;">
                    <i class="ph ph-moon" id="theme-icon"></i> <span class="nav-text" id="theme-text">Dark Mode</span>
                </button>
                <a href="<?= $basePath ?>datenschutz" class="nav-item" style="margin-bottom:1rem; padding-top: 0.8rem; padding-bottom: 0.8rem;">
                    <i class="ph ph-shield-check"></i> <span class="nav-text">Datenschutz</span>
                </a>
            </div>

            <div class="sidebar-footer">
                <div class="user-profile">
                    <div class="user-avatar">
                        <i class="ph-fill ph-user"></i>
                    </div>
                    <div class="user-info">
                        <span class="user-name"><?= htmlspecialchars($user['name']) ?></span>
                        <span class="user-role"><?= $user['role'] === 'admin' ? 'Administrator' : 'Student' ?></span>
                    </div>
                </div>
                <button id="logout-btn" class="icon-btn" title="Logout">
                    <i class="ph ph-sign-out"></i>
                </button>
            </div>
        </aside>
        <?php endif; ?>

        <!-- Main Content -->
        <main class="main-content">
            
            <?php if (!$hideSidebar): ?>
            <!-- Topbar -->
            <header class="topbar">
                <div class="topbar-left" style="display: flex; align-items: center; gap: 1rem;">
                    <button id="mobile-nav-toggle" class="mobile-nav-toggle" title="Menü öffnen" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0.5rem; border-radius: var(--radius-sm); transition: background 0.2s;">
                        <i class="ph ph-list" style="font-size: 1.5rem;"></i>
                    </button>
                    <div class="user-greeting" style="font-weight: 500; color: var(--text-secondary);">
                        Schön dich hier zu haben, <strong style="color: var(--text-primary);"><?= htmlspecialchars($user['name']) ?></strong>!
                    </div>
                </div>
                <div class="topbar-right">
                    <div class="global-progress">
                        <div class="progress-info">
                            <span>Gesamtfortschritt</span>
                            <strong id="global-progress-text">0%</strong>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" id="global-progress-bar" style="width: 0%;"></div>
                        </div>
                    </div>
                </div>
            </header>
            <?php endif; ?>

            <!-- View Container -->
            <div id="view-container" class="view-container">
