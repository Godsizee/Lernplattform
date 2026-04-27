<?php
require_once __DIR__ . '/../api/init.php';

use App\Core\Router;

$router = new Router();

// Routen definieren
$router->get('/', 'dashboard');
$router->get('/login', 'login');
$router->get('/register', 'register');
$router->get('/datenschutz', 'datenschutz');
$router->get('/learning', 'learning');
$router->get('/profile', 'profile');
$router->get('/admin', 'admin');
$router->get('/editor', 'editor');

// Request URI bereinigen und Base-Path extrahieren (falls in einem Unterordner wie z.B. /files/lernplattform/public)
$baseDir = dirname($_SERVER['SCRIPT_NAME']);
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($baseDir !== '/' && $baseDir !== '\\') {
    if (strpos($requestUri, $baseDir) === 0) {
        $requestUri = substr($requestUri, strlen($baseDir));
    }
}

// Define BASE_URL for views and assets
define('BASE_URL', ($baseDir === '/' || $baseDir === '\\') ? '' : $baseDir);

$requestUri = '/' . ltrim($requestUri, '/');
if ($requestUri === '') {
    $requestUri = '/';
}

// Dem Header die aktuelle Route mitteilen
$GLOBALS['currentRoute'] = $requestUri;

// Dispatchen
$router->dispatch($requestUri, $_SERVER['REQUEST_METHOD']);
