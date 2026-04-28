<?php
namespace App\Controllers;

use App\Core\Controller;
use Exception;

class ContentController extends Controller {
    /**
     * Dashboard Daten für SPA
     */
    public function dashboard() {
        global $lessonRepo, $userRepo;
        $userId = $this->requireAuth();
        
        $subjects = $lessonRepo->getAllSubjects();
        $progressMap = $lessonRepo->getProgress($userId);
        $user = $userRepo->findById($userId);
        
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
        global $lessonRepo;
        $this->requireAuth();
        return $this->json($lessonRepo->getAllSubjects());
    }

    /**
     * Lektionen eines Fachs inkl. Fortschritt
     */
    public function lessons() {
        global $lessonRepo;
        $userId = $this->requireAuth();
        $isAdmin = ($_SESSION['user_role'] ?? '') === 'admin';
        
        $subjectId = filter_var($_GET['subject_id'] ?? null, FILTER_VALIDATE_INT) ?: null;
        $lessons = $lessonRepo->getLessonsWithProgress($userId, $subjectId, $isAdmin);
        
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
