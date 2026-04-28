<?php
namespace App\Controllers;

use App\Core\Controller;
use Exception;

class ContentController extends Controller {
    private $lessonRepo;
    private $userRepo;

    public function __construct($container) {
        parent::__construct($container);
        $this->lessonRepo = $container->get('LessonRepository');
        $this->userRepo = $container->get('UserRepository');
    }

    /**
     * Dashboard Daten für SPA
     */
    public function dashboard() {
        $userId = $this->requireAuth();
        
        $subjects = $this->lessonRepo->getAllSubjects();
        $progressMap = $this->lessonRepo->getProgress($userId);
        $user = $this->userRepo->findById($userId);
        
        return $this->json([
            'subjects' => $subjects,
            'progress' => $progressMap,
            'streak' => $user['streak'] ?? 0
        ]);
    }

    /**
     * Liste aller Fächer
     */
    public function subjects() {
        $this->requireAuth();
        return $this->json($this->lessonRepo->getAllSubjects());
    }

    /**
     * Lektionen eines Fachs inkl. Fortschritt
     */
    public function lessons() {
        $userId = $this->requireAuth();
        $isAdmin = ($_SESSION['user_role'] ?? '') === 'admin';
        
        $subjectId = filter_var($_GET['subject_id'] ?? null, FILTER_VALIDATE_INT) ?: null;
        $listOnly = isset($_GET['list_only']) && $_GET['list_only'] == '1';
        $lessons = $this->lessonRepo->getLessonsWithProgress($userId, $subjectId, $isAdmin, !$listOnly);
        
        $completedIds = [];
        foreach ($lessons as &$l) {
            if ($l['status'] === 'completed') {
                $completedIds[] = $l['id'];
            }
            if (!$isAdmin) {
                $l['author_name'] = null; // Datenschutz: Autorennamen für Studenten ausblenden
            }
        }
        unset($l);
        
        return $this->json([
            'lessons' => $lessons,
            'progress' => $completedIds,
            'current_user_id' => $userId,
            'is_admin' => $isAdmin
        ]);
    }
}
