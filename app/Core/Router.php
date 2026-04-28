<?php
namespace App\Core;

class Router {
    protected $routes = [
        'GET' => [],
        'POST' => []
    ];

    public function get($uri, $action) {
        $this->routes['GET'][$uri] = $action;
    }

    public function post($uri, $action) {
        $this->routes['POST'][$uri] = $action;
    }

    public function dispatch($uri, $requestType) {
        $requestType = strtoupper($requestType);
        if (array_key_exists($uri, $this->routes[$requestType])) {
            $action = $this->routes[$requestType][$uri];
            return $this->callAction($action);
        }

        // Debug-Logging (optional, kann in bootstrap.php konfiguriert werden)
        error_log("Router 404: No route found for [{$requestType}] {$uri}");

        // 404 Not Found
        http_response_code(404);
        if (file_exists(__DIR__ . '/../../public/views/404.view.php')) {
            require __DIR__ . '/../../public/views/404.view.php';
        } else {
            echo "<h1>404 Not Found</h1><p>The requested page could not be found.</p>";
        }
        exit;
    }

    protected function callAction($action) {
        if (is_callable($action)) {
            return call_user_func($action);
        }

        if (is_string($action)) {
            // Check if it's a Controller@action format
            if (strpos($action, '@') !== false) {
                list($controllerName, $method) = explode('@', $action);
                $fullControllerName = "\\App\\Controllers\\{$controllerName}";
                
                if (class_exists($fullControllerName)) {
                    $controller = new $fullControllerName();
                    if (method_exists($controller, $method)) {
                        return $controller->$method();
                    }
                }
                throw new \Exception("Controller oder Methode nicht gefunden: {$action}");
            }

            // Fallback: Die Ansicht direkt laden
            $viewPath = __DIR__ . "/../../public/views/{$action}.view.php";
            if (file_exists($viewPath)) {
                require $viewPath;
                return;
            }
        }
    }
}
