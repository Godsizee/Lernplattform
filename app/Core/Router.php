<?php
namespace App\Core;

class Router {
    protected $routes = [
        'GET' => [],
        'POST' => [],
        'PUT' => [],
        'DELETE' => []
    ];

    protected $container;

    public function __construct($container = null) {
        $this->container = $container;
    }

    public function get($uri, $action) {
        $this->routes['GET'][$uri] = $action;
    }

    public function post($uri, $action) {
        $this->routes['POST'][$uri] = $action;
    }

    public function put($uri, $action) {
        $this->routes['PUT'][$uri] = $action;
    }

    public function delete($uri, $action) {
        $this->routes['DELETE'][$uri] = $action;
    }

    public function dispatch($uri, $requestType) {
        // Method Spoofing unterstützen (falls POST mit _method=PUT/DELETE gesendet wird)
        if ($requestType === 'POST' && isset($_POST['_method'])) {
            $requestType = strtoupper($_POST['_method']);
        }

        foreach ($this->routes[$requestType] as $route => $action) {
            // Konvertiere {param} zu Regex Capture Groups
            // Wir erlauben Alphanumerische Zeichen und Unterstriche für Parameter-Namen
            $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $route);
            $pattern = "#^" . $pattern . "$#";

            if (preg_match($pattern, $uri, $matches)) {
                // Nur die benannten Matches extrahieren (Strings als Keys)
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                return $this->callAction($action, $params);
            }
        }

        // 404 Not Found
        http_response_code(404);
        if (file_exists(__DIR__ . '/../../public/views/404.view.php')) {
            require __DIR__ . '/../../public/views/404.view.php';
        } else {
            echo "<h1>404 Not Found</h1><p>The requested page could not be found.</p>";
        }
        exit;
    }

    protected function callAction($action, $params = []) {
        if (is_callable($action)) {
            return call_user_func_array($action, $params);
        }

        if (is_string($action)) {
            // Check if it's a Controller@action format
            if (strpos($action, '@') !== false) {
                list($controllerName, $method) = explode('@', $action);
                $fullControllerName = "\\App\\Controllers\\{$controllerName}";
                
                if (class_exists($fullControllerName)) {
                    $controller = new $fullControllerName($this->container);
                    if (method_exists($controller, $method)) {
                        return call_user_func_array([$controller, $method], $params);
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
