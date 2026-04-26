<?php
require_once __DIR__ . '/../../api/init.php';

global $currentRoute;
$route = $currentRoute ?? '/';
$publicPages = ['/login', '/register', '/datenschutz'];
$isPublicPage = in_array($route, $publicPages);

// Access Control
if (!isset($_SESSION['user_id']) && !$isPublicPage) {
    header("Location: " . base_url('/login'));
    exit;
} elseif (isset($_SESSION['user_id']) && ($route === '/login' || $route === '/register')) {
    header("Location: " . base_url('/dashboard'));
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
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code & Cash | Lernplattform</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Oswald:wght@400;600;700&display=swap" rel="stylesheet">
    <!-- Phosphor Icons -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <!-- Styles -->
    <link rel="stylesheet" href="<?= base_url('/assets/css/style.css') ?>">
    <script>
        // Theme initialisieren (bevor der Body rendert, um Flackern zu verhindern)
        const savedTheme = localStorage.getItem('lern_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        // Fallback fürs CSS
        if(savedTheme === 'light') document.documentElement.classList.add('light-mode');
    </script>
</head>
<body data-theme="dark" class="<?= $hideSidebar ? 'auth-mode' : '' ?>">
    <div id="app" class="app-layout">
        
        <?php if (!$hideSidebar): ?>
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-brand" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <img src="<?= base_url('/assets/img/logo.png') ?>" alt="Code & Cash Logo" class="brand-logo-img">
                <button id="sidebar-toggle" title="Sidebar einklappen/ausklappen" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0.5rem; border-radius: var(--radius-sm); transition: background 0.2s;">
                    <i class="ph ph-list" style="font-size: 1.5rem;"></i>
                </button>
            </div>
            
            <nav class="sidebar-nav">
                <a href="<?= base_url('/dashboard') ?>" class="nav-item <?= ($route === '/dashboard' || $route === '/') ? 'active' : '' ?>">
                    <i class="ph ph-squares-four"></i> <span class="nav-text">Dashboard</span>
                </a>
                <a href="<?= base_url('/lernen') ?>" class="nav-item <?= $route === '/lernen' ? 'active' : '' ?>">
                    <i class="ph ph-books"></i> <span class="nav-text">Lern-Bereich</span>
                </a>
                <a href="<?= base_url('/profil') ?>" class="nav-item <?= $route === '/profil' ? 'active' : '' ?>">
                    <i class="ph ph-user-circle"></i> <span class="nav-text">Mein Profil</span>
                </a>
                <?php if ($user && $user['role'] === 'admin'): ?>
                <a href="<?= base_url('/admin') ?>" class="nav-item <?= $route === '/admin' ? 'active' : '' ?>">
                    <i class="ph ph-shield-star"></i> <span class="nav-text">Admin-Bereich</span>
                </a>
                <?php endif; ?>
            </nav>
            
            <div style="margin-top: auto;">
                <button id="theme-toggle-btn" class="nav-item" style="width:100%; background:none; border:none; text-align:left; cursor:pointer; padding-top: 0.8rem; padding-bottom: 0.8rem;">
                    <i class="ph ph-moon" id="theme-icon"></i> <span class="nav-text" id="theme-text">Dark Mode</span>
                </button>
                <a href="<?= base_url('/datenschutz') ?>" class="nav-item" style="margin-bottom:1rem; padding-top: 0.8rem; padding-bottom: 0.8rem;">
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
