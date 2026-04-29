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

    /**
     * Alle Inhalte für den Content-Manager abrufen
     */
    public function content() {
        return $this->json([
            'lessons' => $this->lessonRepo->getAllLessonsForAdmin(),
            'subjects' => $this->lessonRepo->getAllSubjects()
        ]);
    }

    /**
     * Lektionen-Reihenfolge aktualisieren
     */
    public function updateLessonOrder() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (!isset($input['orders'])) return $this->json(['error' => 'Fehlende Daten'], 400);

        $this->lessonRepo->updateLessonOrder($input['orders']);
        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_CONTENT_REORDER', "Hat die Reihenfolge der Lektionen angepasst.");
        return $this->json(['success' => true]);
    }

    /**
     * Lektion duplizieren
     */
    public function cloneLesson() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $lessonId = $input['lesson_id'] ?? 0;

        if (!$lessonId) return $this->json(['error' => 'ID fehlt'], 400);

        $newId = $this->lessonRepo->cloneLesson($lessonId, $_SESSION['user_id']);
        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_CONTENT_CLONE', "Hat Lektion ID $lessonId geklont (Neu: ID $newId).");
        
        return $this->json(['success' => true, 'id' => $newId]);
    }

    /**
     * Bulk Status Update
     */
    public function bulkStatus() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $ids = $input['ids'] ?? [];
        $status = $input['status'] ?? 'draft';

        if (empty($ids)) return $this->json(['error' => 'Keine IDs gewählt'], 400);

        $this->lessonRepo->bulkUpdateStatus($ids, $status);
        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_CONTENT_BULK_STATUS', "Hat den Status von " . count($ids) . " Beiträgen auf '$status' gesetzt.");
        
        return $this->json(['success' => true]);
    }

    /**
     * Bulk Delete
     */
    public function bulkDelete() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $ids = $input['ids'] ?? [];

        if (empty($ids)) return $this->json(['error' => 'Keine IDs gewählt'], 400);

        $this->lessonRepo->bulkDelete($ids);
        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_CONTENT_BULK_DELETE', "Hat " . count($ids) . " Beiträge gelöscht.");
        
        return $this->json(['success' => true]);
    }

    /**
     * Fach erstellen oder aktualisieren
     */
    public function saveSubject() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = $input['id'] ?? null;
        $title = trim($input['title'] ?? '');
        $color = trim($input['color'] ?? '#a972ff');
        $icon = trim($input['icon'] ?? 'ph-book');

        if (!$title) return $this->json(['error' => 'Titel erforderlich'], 400);

        if ($id) {
            $this->lessonRepo->updateSubject($id, $title, $color, $icon);
            $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_SUBJECT_UPDATE', "Hat das Fach '$title' (ID: $id) aktualisiert.");
        } else {
            $id = $this->lessonRepo->createSubject($title, $color, $icon);
            $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_SUBJECT_CREATE', "Hat ein neues Fach '$title' (ID: $id) erstellt.");
        }

        return $this->json(['success' => true, 'id' => $id]);
    }

    /**
     * Fach löschen
     */
    public function deleteSubject() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = $input['id'] ?? 0;

        if (!$id) return $this->json(['error' => 'ID fehlt'], 400);

        $this->lessonRepo->deleteSubject($id);
        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_SUBJECT_DELETE', "Hat das Fach mit ID $id gelöscht.");
        
        return $this->json(['success' => true]);
    }
}
