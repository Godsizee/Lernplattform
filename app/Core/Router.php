<?php
namespace App\Core;

class Router {
    protected $routes = [];

    public function add($route, $view) {
        $route = rtrim($route, '/');
        if (empty($route)) {
            $route = '/';
        }
        $this->routes[$route] = $view;
    }

    public function dispatch($uri) {
        if (false !== $pos = strpos($uri, '?')) {
            $uri = substr($uri, 0, $pos);
        }
        $uri = rawurldecode($uri);

        $scriptName = dirname($_SERVER['SCRIPT_NAME']);
        $scriptName = str_replace('\\', '/', $scriptName);
        
        if ($scriptName !== '/' && strpos($uri, $scriptName) === 0) {
            $uri = substr($uri, strlen($scriptName));
        }
        
        $uri = rtrim($uri, '/');
        if (empty($uri)) {
            $uri = '/';
        }

        if (array_key_exists($uri, $this->routes)) {
            $viewPath = $this->routes[$uri];
            
            global $currentRoute;
            $currentRoute = $uri;
            
            $file = __DIR__ . '/../../public/views/' . $viewPath . '.view.php';
            if (file_exists($file)) {
                require $file;
            } else {
                $this->abort(404, "Die View-Datei wurde nicht gefunden.");
            }
        } else {
            $this->abort(404);
        }
    }

    protected function abort($code = 404, $message = null) {
        http_response_code($code);
        global $currentRoute;
        $currentRoute = '404';
        
        $file = __DIR__ . '/../../public/views/404.view.php';
        if (file_exists($file)) {
            require $file;
        } else {
            echo "<h1>404 Not Found</h1>";
            if ($message) echo "<p>$message</p>";
            echo "<a href='" . (function_exists('base_url') ? base_url('/') : '/') . "'>Zurück zur Startseite</a>";
        }
        exit;
    }
}
