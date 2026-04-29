<?php
namespace App\Controllers;

use App\Core\Controller;
use Exception;

class AdminController extends Controller {
    private $userRepo;
    private $auditRepo;
    private $lessonRepo;

    public function __construct($container) {
        parent::__construct($container);
        $this->userRepo = $container->get('UserRepository');
        $this->auditRepo = $container->get('AuditLogRepository');
        $this->lessonRepo = $container->get('LessonRepository');
        $this->requireAdmin();
    }

    /**
     * Liste aller Nutzer
     */
    public function users() {
        return $this->json($this->userRepo->getAllUsers());
    }

    /**
     * Rolle eines Nutzers ändern
     */
    public function setRole() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $targetId = $input['user_id'] ?? 0;
        $role = $input['role'] ?? '';
        
        if (in_array($role, ['student', 'admin'])) {
            $this->userRepo->setRole($targetId, $role);
            $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_SET_ROLE', "Hat die Rolle von User ID $targetId auf $role geändert.");
            return $this->json(['success' => true]);
        }
        return $this->json(['error' => 'Ungültige Rolle'], 400);
    }

    /**
     * Nutzer löschen
     */
    public function deleteUser() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $targetId = $input['user_id'] ?? 0;
        $this->userRepo->delete($targetId, $_SESSION['user_id']);
        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_DELETE_USER', "Hat den Nutzer mit ID $targetId gelöscht.");
        return $this->json(['success' => true]);
    }

    /**
     * Audit Logs abrufen
     */
    public function audit() {
        $filterUser = filter_var($_GET['user_id'] ?? '', FILTER_VALIDATE_INT) ?: null;
        return $this->json($this->auditRepo->getLogs($filterUser));
    }

    /**
     * Dashboard Statistiken
     */
    public function dashboard() {
        $stats = [
            'top_level' => [
                'total_users' => $this->userRepo->countAll(),
                'total_lessons' => $this->lessonRepo->countPublished(),
                'logins_24h' => $this->auditRepo->countActionsInLast24h('USER_LOGIN')
            ],
            'popular_lessons' => $this->lessonRepo->getPopular(5),
            'system_health' => [
                'failed_logins_24h' => $this->auditRepo->countActionsInLast24h('LOGIN_FAILED'),
                'status' => 'ok'
            ]
        ];

        // Einfache Logik für Warnung
        if ($stats['system_health']['failed_logins_24h'] > 10) {
            $stats['system_health']['status'] = 'warning';
        }

        return $this->json($stats);
    }
}
