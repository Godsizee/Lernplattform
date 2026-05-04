<?php
require_once __DIR__ . '/../../app/bootstrap.php';

if (!defined('BASE_URL')) {
    define('BASE_URL', '');
}
$currentRoute = $GLOBALS['currentRoute'] ?? '/';
$publicRoutes = ['/login', '/register', '/datenschutz'];
$isPublicPage = in_array($currentRoute, $publicRoutes);

// Soft-Routing Detection
$isSoftRoute = isset($_SERVER['HTTP_X_SOFT_ROUTING']) && $_SERVER['HTTP_X_SOFT_ROUTING'] === 'true';

// Access Control
if (!isset($_SESSION['user_id']) && !$isPublicPage) {
    if ($isSoftRoute) {
        header('Content-Type: application/json');
        echo json_encode(['redirect' => BASE_URL . '/login']);
        exit;
    }
    header("Location: " . BASE_URL . "/login");
    exit;
} elseif (isset($_SESSION['user_id']) && ($currentRoute === '/login' || $currentRoute === '/register')) {
    if ($isSoftRoute) {
        header('Content-Type: application/json');
        echo json_encode(['redirect' => BASE_URL . '/']);
        exit;
    }
    header("Location: " . BASE_URL . "/");
    exit;
}

// User-Daten für die Anzeige laden
$user = null;
if (isset($_SESSION['user_id'])) {
    $user = [
        'name' => $_SESSION['user_name'] ?? 'Nutzer',
        'role' => $_SESSION['user_role'] ?? 'student',
    ];
}

$hideSidebar = $isPublicPage; // Sidebar auf öffentlichen Seiten verstecken

// If soft-routing, stop here and only output content
if ($isSoftRoute) {
    return;
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code & Cash | Lernplattform</title>
    <!-- Phosphor Icons -->
    <link rel="stylesheet" href="<?= BASE_URL ?>/assets/icons/phosphor/style.css">
    <!-- Styles -->
    <link rel="stylesheet" href="<?= BASE_URL ?>/assets/css/style.css">
    <meta name="csrf-token" content="<?= $_SESSION['csrf_token'] ?? '' ?>">
    
    <!-- PWA Support -->
    <link rel="manifest" href="<?= BASE_URL ?>/manifest.json">
    <meta name="theme-color" content="#0b0e14">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="apple-touch-icon" href="<?= BASE_URL ?>/assets/img/logo.png">

    <script>
        // Theme initialisieren (bevor der Body rendert, um Flackern zu verhindern)
        const savedTheme = localStorage.getItem('lern_theme') || 'dark';
        const root = document.documentElement;
        
        root.setAttribute('data-theme', savedTheme);
        if(savedTheme === 'light') {
            root.classList.add('light-mode');
        } else {
            root.classList.remove('light-mode');
        }
        
        // Globale BASE_URL für JavaScript
        window.BASE_URL = '<?= BASE_URL ?>';

        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('<?= BASE_URL ?>/service-worker.js')
                    .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
                    .catch(err => console.log('[PWA] Service Worker registration failed:', err));
            });
        }
    </script>
</head>
<body class="<?= $hideSidebar ? 'auth-mode' : '' ?>">
    
    <?php
    $settingRepo = $GLOBALS['container']->get('SettingRepository');
    $announcementJson = $settingRepo->get('global_announcement');
    $announcement = $announcementJson ? json_decode($announcementJson, true) : null;
    
    if ($announcement && !empty($announcement['is_active']) && !empty($announcement['message'])):
        $parsedown = new Parsedown();
        $parsedown->setSafeMode(true);
        $formattedMessage = $parsedown->text($announcement['message']);
        
        // Eindeutiger Hash für diese Nachricht (damit sie bei Änderungen wieder erscheint)
        $announcementId = md5($announcement['message'] . ($announcement['type'] ?? 'info'));
    ?>
    <div id="system-banner" class="system-broadcast-banner banner-<?= htmlspecialchars($announcement['type']) ?>" data-announcement-id="<?= $announcementId ?>" style="display: none;">
        <div class="banner-content">
            <i class="ph ph-bell banner-main-icon"></i>
            <div class="banner-text">
                <?= $formattedMessage ?>
            </div>
            <button id="close-system-banner" class="banner-close" title="Dauerhaft ausblenden">
                <i class="ph ph-x-circle"></i>
            </button>
        </div>
    </div>
    <script>
        // Sofortige Prüfung vor dem Rendering (Vermeidung von Flackern)
        (function() {
            const dismissedId = localStorage.getItem('dismissed_announcement');
            const banner = document.getElementById('system-banner');
            if (banner && dismissedId !== banner.dataset.announcementId) {
                banner.style.display = 'flex';
            }
        })();
    </script>
    <?php endif; ?>

    <!-- God-Mode Banner (User Impersonation) -->
    <?php if (isset($_SESSION['admin_id'])): ?>
    <div style="background: var(--color-danger); color: white; text-align: center; padding: 0.6rem 1rem; font-size: 0.95rem; z-index: 10001; position: sticky; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: center; gap: 1rem; box-shadow: 0 4px 15px rgba(248, 81, 73, 0.4);">
        <span><i class="ph-bold ph-mask-happy"></i> <strong>God-Mode:</strong> Eingeloggt als <?= htmlspecialchars($user['name']) ?></span>
        <button onclick="fetch('<?= BASE_URL ?>/api/auth/stop-impersonation', {method:'POST', headers:{'X-CSRF-Token':'<?= $_SESSION['csrf_token'] ?>', 'Content-Type': 'application/json'}}).then(r=>r.json()).then(d=>{if(d.success) window.location.href='<?= BASE_URL ?>/admin';})" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); color: white; border-radius: var(--radius-sm); padding: 0.25rem 0.8rem; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s;">
            <i class="ph-bold ph-arrow-u-up-left"></i> Zurück zum Admin
        </button>
    </div>
    <?php endif; ?>

    <div id="app" class="app-layout">
        
        <?php if (!$hideSidebar): ?>
        <!-- Sidebar -->
        <aside class="sidebar">
            <script>
                if (localStorage.getItem('lern_sidebar_collapsed') === 'true' && window.innerWidth >= 768) {
                    document.currentScript.parentElement.classList.add('collapsed');
                }
            </script>
            <div class="sidebar-brand" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <img src="<?= BASE_URL ?>/assets/img/logo.png" alt="Code & Cash Logo" class="brand-logo-img">
                <button id="sidebar-toggle" title="Sidebar einklappen/ausklappen" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0.5rem; border-radius: var(--radius-sm); transition: background 0.2s;">
                    <i class="ph ph-list" style="font-size: 1.5rem;"></i>
                </button>
            </div>
            
            <nav class="sidebar-nav">
                <a href="<?= BASE_URL ?>/" class="nav-item <?= $currentRoute === '/' ? 'active' : '' ?>">
                    <i class="ph ph-squares-four"></i> <span class="nav-text">Dashboard</span>
                </a>
                <a href="<?= BASE_URL ?>/learning" class="nav-item <?= $currentRoute === '/learning' ? 'active' : '' ?>">
                    <i class="ph ph-books"></i> <span class="nav-text">Lern-Bereich</span>
                </a>
                <a href="<?= BASE_URL ?>/editor" class="nav-item <?= $currentRoute === '/editor' ? 'active' : '' ?>">
                    <i class="ph ph-article"></i> <span class="nav-text">Beitrag erstellen</span>
                </a>
                <a href="<?= BASE_URL ?>/profile" class="nav-item <?= $currentRoute === '/profile' ? 'active' : '' ?>">
                    <i class="ph ph-user-circle"></i> <span class="nav-text">Mein Profil</span>
                </a>
                <?php if ($user && $user['role'] === 'admin'): ?>
                <a href="<?= BASE_URL ?>/admin" class="nav-item <?= $currentRoute === '/admin' ? 'active' : '' ?>">
                    <i class="ph ph-shield-star"></i> <span class="nav-text">Admin-Bereich</span>
                </a>
                <?php endif; ?>
            </nav>
            
            <div style="margin-top: auto;">
                <button class="nav-item theme-toggle-js" style="width:100%; background:none; border:none; text-align:left; cursor:pointer; padding-top: 0.8rem; padding-bottom: 0.8rem;">
                    <i class="ph ph-moon theme-icon-js"></i> <span class="nav-text theme-text-js">Dark Mode</span>
                </button>
                <a href="<?= BASE_URL ?>/datenschutz" class="nav-item" style="margin-bottom:1rem; padding-top: 0.8rem; padding-bottom: 0.8rem;">
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
                <button id="mobile-nav-toggle" class="mobile-nav-toggle" title="Menü öffnen">
                    <i class="ph ph-list"></i>
                </button>
                
                <div class="topbar-content">
                    <!-- Global Search -->
                    <div class="global-search-container" id="global-search-container">
                        <div class="search-input-wrapper">
                            <i class="ph ph-magnifying-glass search-icon"></i>
                            <input type="text" id="global-search-input" placeholder="Suchen..." autocomplete="off">
                            <div class="search-shortcut">Alt + S</div>
                        </div>
                        <div class="search-results-dropdown" id="search-results-dropdown"></div>
                    </div>

                    <div class="user-greeting">
                        Schön dich hier zu haben, <strong><?= htmlspecialchars($user['name']) ?></strong>!
                    </div>
                </div>
            </header>
            <?php endif; ?>

            <?php if ($hideSidebar): ?>
            <!-- Floating Theme Toggle for Auth Pages -->
            <button class="theme-toggle-js floating-theme-toggle" title="Theme wechseln">
                <i class="ph ph-moon theme-icon-js"></i>
                <span class="theme-text-js" style="display: none;">Dark Mode</span>
            </button>
            <?php endif; ?>

            <!-- View Container -->
            <div id="view-container" class="view-container">