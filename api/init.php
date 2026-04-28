<?php
// Fehler in der Produktion nicht an den Browser senden, aber loggen
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Sichere Session-Cookies
session_set_cookie_params([
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
    'httponly' => true,
    'samesite' => 'Strict'
]);
session_start();

// Simpler .env Loader, um Abhängigkeiten zu vermeiden (KISS)
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(trim($name) . '=' . trim($value));
    }
}


spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../app/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});

use App\Core\Database;
use App\Repositories\UserRepository;
use App\Repositories\LessonRepository;
use App\Repositories\AuditLogRepository;

try {
    $db = Database::getInstance()->getConnection();
    $userRepo = new UserRepository($db);
    $lessonRepo = new LessonRepository($db);
    $auditRepo = new AuditLogRepository($db);
} catch (Exception $e) {
    error_log("Database Connection Error: " . $e->getMessage());
    http_response_code(500);
    die(json_encode(['error' => 'Datenbankverbindung fehlgeschlagen.']));
}

// --- AUTO LOGIN VIA COOKIE ---
// Wenn keine Session existiert, aber ein Remember-Cookie da ist
if (!isset($_SESSION['user_id']) && isset($_COOKIE['lern_remember'])) {
    $token = $_COOKIE['lern_remember'];
    $hashedToken = hash('sha256', $token);
    
    $user = $userRepo->findByRememberToken($hashedToken);
    
    if ($user) {
        // Erfolgreicher Auto-Login
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        
        $auditRepo->log($user['id'], 'LOGIN_AUTO', "Automatischer Login via Cookie.");
    } else {
        // Ungültiger Cookie (Token in DB gelöscht oder manipuliert) -> Cookie verwerfen
        setcookie('lern_remember', '', time() - 3600, '/');
    }
}

function sendJson($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function requireAuth() {
    if (!isset($_SESSION['user_id'])) {
        sendJson(['error' => 'Nicht autorisiert. Bitte einloggen.'], 401);
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!$token || $token !== ($_SESSION['csrf_token'] ?? '')) {
            sendJson(['error' => 'Ungültiger oder fehlender CSRF-Token.'], 403);
        }
    }
    return $_SESSION['user_id'];
}

function requireAdmin() {
    requireAuth();
    if ($_SESSION['user_role'] !== 'admin') {
        sendJson(['error' => 'Forbidden'], 403);
    }
}