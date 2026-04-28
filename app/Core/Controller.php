<?php
namespace App\Core;

abstract class Controller {
    /**
     * Rendert eine View-Datei und übergibt Daten
     */
    protected function render($view, $data = []) {
        // Daten in den lokalen Scope extrahieren, damit die View darauf zugreifen kann
        extract($data);
        
        // Globale Repositories und User-Daten für Views bereitstellen (Kompatibilität)
        global $userRepo, $lessonRepo, $auditRepo;
        $user = null;
        if (isset($_SESSION['user_id'])) {
            $user = [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name'],
                'role' => $_SESSION['user_role']
            ];
        }

        $viewPath = __DIR__ . "/../../public/views/{$view}.view.php";
        
        if (file_exists($viewPath)) {
            require $viewPath;
        } else {
            throw new \Exception("View {$view} nicht gefunden.");
        }
    }

    /**
     * Sendet eine JSON-Antwort
     */
    protected function json($data, $status = 200) {
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode($data);
        exit;
    }

    /**
     * Prüft Authentifizierung
     */
    protected function requireAuth() {
        if (!isset($_SESSION['user_id'])) {
            if ($this->isApiRequest()) {
                $this->json(['error' => 'Nicht autorisiert.'], 401);
            }
            header('Location: ' . BASE_URL . '/login');
            exit;
        }
        
        // CSRF Check für POST/PUT/DELETE
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
            if (!$token || $token !== ($_SESSION['csrf_token'] ?? '')) {
                $this->json(['error' => 'CSRF Token ungültig.'], 403);
            }
        }
        
        return $_SESSION['user_id'];
    }

    /**
     * Prüft Admin-Rechte
     */
    protected function requireAdmin() {
        $this->requireAuth();
        if ($_SESSION['user_role'] !== 'admin') {
            if ($this->isApiRequest()) {
                $this->json(['error' => 'Admin-Rechte erforderlich.'], 403);
            }
            header('Location: ' . BASE_URL . '/');
            exit;
        }
    }

    private function isApiRequest() {
        return (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') 
            || strpos($_SERVER['REQUEST_URI'], '/api/') !== false;
    }
}
