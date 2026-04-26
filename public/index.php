<?php
require_once __DIR__ . '/../api/init.php';
require_once __DIR__ . '/../app/Core/Router.php';

$router = new \App\Core\Router();

// Routen definieren
$router->add('/', 'dashboard');
$router->add('/dashboard', 'dashboard');
$router->add('/login', 'login');
$router->add('/register', 'register');
$router->add('/lernen', 'learning');
$router->add('/profil', 'profile');
$router->add('/admin', 'admin');
$router->add('/datenschutz', 'datenschutz');

// Request weiterleiten
$router->dispatch($_SERVER['REQUEST_URI']);
