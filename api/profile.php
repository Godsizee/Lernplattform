<?php
require_once __DIR__ . '/init.php';

$userId = requireAuth();
$action = $_GET['action'] ?? null;
$input = getJsonInput();

try {
    switch ($action) {
        case 'get':
            $user = $userRepo->findById($userId);
            if ($user) {
                // Filter sensitive data
                unset($user['password_hash']);
                sendJson($user);
            }
            sendJson(['error' => 'Nutzer nicht gefunden'], 404);
            break;

        case 'update':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
            
            $name = trim(htmlspecialchars($input['name'] ?? '', ENT_QUOTES, 'UTF-8'));
            $email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
            $bio = trim(htmlspecialchars($input['bio'] ?? '', ENT_QUOTES, 'UTF-8'));
            $password = $input['password'] ?? '';
            
            if (!$name || !$email) {
                sendJson(['error' => 'Name und E-Mail sind Pflichtfelder.'], 400);
            }
            
            $passwordHash = null;
            if (!empty($password)) {
                if (strlen($password) < 8 || !preg_match('/[0-9]/', $password) || !preg_match('/[^a-zA-Z0-9]/', $password)) {
                    sendJson(['error' => 'Passwort zu schwach.'], 400);
                }
                $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            }

            $userRepo->updateProfile($userId, $name, $email, $passwordHash, $bio, null);
            $_SESSION['user_name'] = $name;
            
            sendJson(['success' => true, 'name' => $name]);
            break;

        case 'update_theme':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
            $theme = in_array($input['theme'] ?? '', ['light', 'dark']) ? $input['theme'] : 'dark';
            $userRepo->updateTheme($userId, $theme);
            sendJson(['success' => true]);
            break;

        case 'delete':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
            $userRepo->delete($userId);
            session_destroy();
            sendJson(['success' => true]);
            break;

        case 'export':
            // DSGVO Export
            $user = $userRepo->findById($userId);
            unset($user['password_hash']);
            $progress = $lessonRepo->getLessonsWithProgress($userId);
            $logs = $auditRepo->getLogs($userId);
            
            sendJson([
                'user' => $user,
                'progress' => $progress,
                'activity_logs' => $logs,
                'export_date' => date('c')
            ]);
            break;

        default:
            sendJson(['error' => 'Ungültige Aktion.'], 400);
    }
} catch (Exception $e) {
    error_log("Profile API Error: " . $e->getMessage());
    sendJson(['error' => 'Interner Serverfehler.'], 500);
}
