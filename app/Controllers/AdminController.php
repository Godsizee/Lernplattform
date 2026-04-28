<?php
namespace App\Controllers;

use App\Core\Controller;
use Exception;

class AdminController extends Controller {
    public function __construct() {
        $this->requireAdmin();
    }

    /**
     * Liste aller Nutzer
     */
    public function users() {
        global $userRepo;
        return $this->json($userRepo->getAllUsers());
    }

    /**
     * Rolle eines Nutzers ändern
     */
    public function setRole() {
        global $userRepo, $auditRepo;
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $targetId = $input['user_id'] ?? 0;
        $role = $input['role'] ?? '';
        
        if (in_array($role, ['student', 'admin'])) {
            $userRepo->setRole($targetId, $role);
            $auditRepo->log($_SESSION['user_id'], 'ADMIN_SET_ROLE', "Hat die Rolle von User ID $targetId auf $role geändert.");
            return $this->json(['success' => true]);
        }
        return $this->json(['error' => 'Ungültige Rolle'], 400);
    }

    /**
     * Nutzer löschen
     */
    public function deleteUser() {
        global $userRepo, $auditRepo;
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $targetId = $input['user_id'] ?? 0;
        $userRepo->delete($targetId, $_SESSION['user_id']);
        $auditRepo->log($_SESSION['user_id'], 'ADMIN_DELETE_USER', "Hat den Nutzer mit ID $targetId gelöscht.");
        return $this->json(['success' => true]);
    }

    /**
     * Audit Logs abrufen
     */
    public function audit() {
        global $auditRepo;
        $filterUser = filter_var($_GET['user_id'] ?? '', FILTER_VALIDATE_INT) ?: null;
        return $this->json($auditRepo->getLogs($filterUser));
    }
}
