<?php
require_once __DIR__ . '/../app/bootstrap.php';

use App\Core\Router;

$router = new Router();

// Routen definieren
// Routen definieren (MVC Style)
// --- SEITEN ROUTEN ---
$router->get('/', 'PageController@dashboard');
$router->get('/login', 'PageController@login');
$router->get('/register', 'PageController@register');
$router->get('/datenschutz', 'PageController@datenschutz');
$router->get('/learning', 'PageController@learning');
$router->get('/profile', 'PageController@profile');
$router->get('/admin', 'PageController@admin');
$router->get('/editor', 'PageController@editor');

// --- API ROUTEN ---
// Auth
$router->post('/api/auth/login', 'AuthController@login');
$router->post('/api/auth/register', 'AuthController@register');
$router->get('/api/auth/logout', 'AuthController@logout');

// Content & Progress
$router->get('/api/content/subjects', 'ContentController@subjects');
$router->get('/api/content/lessons', 'ContentController@lessons');
$router->get('/api/content/dashboard', 'ContentController@dashboard');
$router->post('/api/progress/toggle', 'ArticleController@saveProgress');
$router->get('/api/search', 'ArticleController@search');

// Articles
$router->get('/api/articles/get', 'ArticleController@get');
$router->post('/api/articles/save', 'ArticleController@create'); // Create
$router->post('/api/articles/update', 'ArticleController@update'); // Update
$router->post('/api/articles/delete', 'ArticleController@delete');

// Profile
$router->get('/api/profile/get', 'UserController@get');
$router->post('/api/profile/update', 'UserController@update');
$router->post('/api/profile/theme', 'UserController@updateTheme');
$router->get('/api/profile/export', 'UserController@export');

// Admin
$router->get('/api/admin/users', 'AdminController@users');
$router->post('/api/admin/set-role', 'AdminController@setRole');
$router->post('/api/admin/delete-user', 'AdminController@deleteUser');
$router->get('/api/admin/audit', 'AdminController@audit');

// Logs
$router->post('/api/log', 'UserController@logActivity');

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
