<?php
/**
 * Front-Controller & Router
 * 
 * Alle HTTP-Requests (außer statische Assets) werden durch .htaccess 
 * hierher geleitet. Der Router parst die URL, prüft die Berechtigung 
 * und lädt das passende View-Template.
 */

require_once __DIR__ . '/../api/init.php';

// ─── Basepath für Links und Assets ───────────────────────────────────
$basePath = '/files/lernplattform/public/';

// ─── Route aus der URL extrahieren ───────────────────────────────────
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH);

// Basepath entfernen, um die reine Route zu erhalten
$route = substr($path, strlen($basePath));
$route = trim($route, '/');

// Leerer String → Dashboard (Startseite)
if ($route === '' || $route === false) {
    $route = 'dashboard';
}

// ─── Legacy-Redirects (alte .php-URLs → Clean URLs) ─────────────────
$legacyRedirects = [
    'index.php'       => '',
    'login.php'       => 'login',
    'register.php'    => 'registrieren',
    'learning.php'    => 'lernen',
    'profile.php'     => 'profil',
    'admin.php'       => 'admin',
    'datenschutz.php' => 'datenschutz',
];

if (isset($legacyRedirects[$route])) {
    header("Location: {$basePath}{$legacyRedirects[$route]}", true, 301);
    exit;
}

// ─── Route-Definitionen ─────────────────────────────────────────────
// Jede Route definiert: view, pageScript, ob Sidebar sichtbar ist, 
// ob die Seite öffentlich ist, und welche Rolle nötig ist.
$routes = [
    'dashboard' => [
        'view'       => 'dashboard.view.php',
        'pageScript' => 'dashboard',
        'title'      => 'Dashboard',
        'public'     => false,
        'role'       => null,
    ],
    'login' => [
        'view'       => 'login.view.php',
        'pageScript' => 'auth',
        'title'      => 'Login',
        'public'     => true,
        'role'       => null,
    ],
    'registrieren' => [
        'view'       => 'register.view.php',
        'pageScript' => 'auth',
        'title'      => 'Registrieren',
        'public'     => true,
        'role'       => null,
    ],
    'lernen' => [
        'view'       => 'learning.view.php',
        'pageScript' => 'learning',
        'title'      => 'Lern-Bereich',
        'public'     => false,
        'role'       => null,
    ],
    'profil' => [
        'view'       => 'profile.view.php',
        'pageScript' => 'profile',
        'title'      => 'Mein Profil',
        'public'     => false,
        'role'       => null,
    ],
    'admin' => [
        'view'       => 'admin.view.php',
        'pageScript' => 'admin',
        'title'      => 'Admin-Bereich',
        'public'     => false,
        'role'       => 'admin',
    ],
    'datenschutz' => [
        'view'       => 'datenschutz.view.php',
        'pageScript' => null,
        'title'      => 'Datenschutzerklärung',
        'public'     => true,
        'role'       => null,
    ],
];

// ─── Route auflösen ─────────────────────────────────────────────────
$routeConfig = $routes[$route] ?? null;
$is404 = false;

if (!$routeConfig) {
    http_response_code(404);
    $routeConfig = [
        'view'       => '404.view.php',
        'pageScript' => null,
        'title'      => 'Seite nicht gefunden',
        'public'     => true,
        'role'       => null,
    ];
    $is404 = true;
}

// ─── Access Control ─────────────────────────────────────────────────
$isLoggedIn = isset($_SESSION['user_id']);
$isPublicPage = $routeConfig['public'];

// Nicht eingeloggt + geschützte Seite → Redirect zum Login
if (!$isLoggedIn && !$isPublicPage) {
    header("Location: {$basePath}login");
    exit;
}

// Eingeloggt + Login/Register-Seite → Redirect zum Dashboard
if ($isLoggedIn && in_array($route, ['login', 'registrieren'])) {
    header("Location: {$basePath}");
    exit;
}

// Rollenprüfung (z.B. Admin)
if ($routeConfig['role'] && $isLoggedIn) {
    $userRole = $_SESSION['user_role'] ?? 'student';
    if ($userRole !== $routeConfig['role']) {
        header("Location: {$basePath}");
        exit;
    }
}

// ─── User-Daten für die Anzeige laden ────────────────────────────────
$user = null;
if ($isLoggedIn) {
    $user = [
        'name' => $_SESSION['user_name'] ?? 'Nutzer',
        'role' => $_SESSION['user_role'] ?? 'student',
    ];
}

$hideSidebar = $isPublicPage;
$pageTitle = $routeConfig['title'];
$pageScript = $routeConfig['pageScript'];
$currentRoute = $route;

// ─── Header laden ────────────────────────────────────────────────────
require_once __DIR__ . '/includes/header.php';

// ─── View laden ──────────────────────────────────────────────────────
$viewPath = __DIR__ . '/views/' . $routeConfig['view'];
if (file_exists($viewPath)) {
    require $viewPath;
} else {
    echo '<div class="view fade-in"><p>View konnte nicht geladen werden.</p></div>';
}

// ─── Footer laden ────────────────────────────────────────────────────
require_once __DIR__ . '/includes/footer.php';
