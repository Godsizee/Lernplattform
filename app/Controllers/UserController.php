<?php
namespace App\Controllers;

use App\Core\Controller;
use Exception;

class UserController extends Controller {
    public function __construct() {
        $this->requireAuth();
    }

    /**
     * Profil laden
     */
    public function get() {
        global $userRepo;
        $user = $userRepo->findById($_SESSION['user_id']);
        if ($user) {
            unset($user['password_hash']);
            return $this->json($user);
        }
        return $this->json(['error' => 'Nicht gefunden.'], 404);
    }

    /**
     * Profil aktualisieren
     */
    public function update() {
        global $userRepo, $auditRepo;
        $userId = $_SESSION['user_id'];
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $name = trim(htmlspecialchars($input['name'] ?? '', ENT_QUOTES, 'UTF-8'));
        $email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $bio = trim(htmlspecialchars($input['bio'] ?? '', ENT_QUOTES, 'UTF-8'));
        $password = $input['password'] ?? '';

        if (!$name || !$email) return $this->json(['error' => 'Name/E-Mail erforderlich.'], 400);

        $passwordHash = null;
        if (!empty($password)) {
            if (strlen($password) < 8 || !preg_match('/[0-9]/', $password) || !preg_match('/[^a-zA-Z0-9]/', $password)) {
                return $this->json(['error' => 'Passwort zu schwach.'], 400);
            }
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        }

        $userRepo->updateProfile($userId, $name, $email, $passwordHash, $bio, null);
        $_SESSION['user_name'] = $name;
        $auditRepo->log($userId, 'PROFILE_UPDATE', "Hat Profildaten aktualisiert.");

        return $this->json(['success' => true, 'name' => $name]);
    }

    /**
     * Theme Präferenz speichern
     */
    public function updateTheme() {
        global $userRepo;
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $theme = in_array($input['theme'] ?? '', ['light', 'dark']) ? $input['theme'] : 'dark';
        $userRepo->updateTheme($_SESSION['user_id'], $theme);
        return $this->json(['success' => true]);
    }

    /**
     * DSGVO Daten Export
     */
    public function export() {
        global $userRepo, $lessonRepo, $auditRepo;
        $userId = $_SESSION['user_id'];
        
        $auditRepo->log($userId, 'PROFILE_EXPORT', "DSGVO Export angefordert.");
        
        $user = $userRepo->findById($userId);
        unset($user['password_hash']);
        $progress = $lessonRepo->getLessonsWithProgress($userId);
        $logs = $auditRepo->getLogs($userId);
        
        return $this->json([
            'user' => $user,
            'progress' => $progress,
            'activity_logs' => $logs,
            'export_date' => date('c')
        ]);
    }

    /**
     * Aktivitäten loggen (Fire and forget)
     */
    public function logActivity() {
        global $auditRepo;
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $action = $input['action'] ?? 'UNKNOWN';
        $details = $input['details'] ?? '';
        
        $auditRepo->log($_SESSION['user_id'], $action, $details);
        return $this->json(['success' => true]);
    }
}
