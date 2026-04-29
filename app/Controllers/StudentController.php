<?php
namespace App\Controllers;

use App\Core\Controller;
use Exception;

class StudentController extends Controller {
    private $lessonRepo;
    private $auditRepo;

    public function __construct($container) {
        parent::__construct($container);
        $this->lessonRepo = $container->get('LessonRepository');
        $this->auditRepo = $container->get('AuditLogRepository');
        $this->requireAuth();
    }

    /**
     * Lesezeichen umschalten
     */
    public function toggleBookmark() {
        $userId = $_SESSION['user_id'];
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $lessonId = filter_var($input['lesson_id'] ?? 0, FILTER_VALIDATE_INT);

        if (!$lessonId) {
            return $this->json(['error' => 'Ungültige Lektions-ID.'], 400);
        }

        $isBookmarked = $this->lessonRepo->toggleBookmark($userId, $lessonId);
        $lessonTitle = $this->lessonRepo->getLessonTitle($lessonId);

        $action = $isBookmarked ? 'BOOKMARK_ADD' : 'BOOKMARK_REMOVE';
        $details = $isBookmarked ? "Hat Lesezeichen für '{$lessonTitle}' gesetzt." : "Hat Lesezeichen für '{$lessonTitle}' entfernt.";
        $this->auditRepo->log($userId, $action, $details);

        return $this->json(['success' => true, 'is_bookmarked' => $isBookmarked]);
    }

    /**
     * Alle Lesezeichen des Nutzers abrufen
     */
    public function getBookmarks() {
        $userId = $_SESSION['user_id'];
        $bookmarks = $this->lessonRepo->getBookmarkedLessons($userId);
        return $this->json($bookmarks);
    }

    /**
     * Notiz abrufen
     */
    public function getNote($lessonId) {
        $userId = $_SESSION['user_id'];
        $lessonId = filter_var($lessonId, FILTER_VALIDATE_INT);
        
        if (!$lessonId) {
            return $this->json(['error' => 'Ungültige Lektions-ID.'], 400);
        }

        $note = $this->lessonRepo->getNote($userId, $lessonId);
        return $this->json(['content' => $note]);
    }

    /**
     * Notiz speichern
     */
    public function saveNote() {
        $userId = $_SESSION['user_id'];
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $lessonId = filter_var($input['lesson_id'] ?? 0, FILTER_VALIDATE_INT);
        $content = $input['content'] ?? '';

        if (!$lessonId) {
            return $this->json(['error' => 'Ungültige Lektions-ID.'], 400);
        }

        $this->lessonRepo->saveNote($userId, $lessonId, $content);
        return $this->json(['success' => true]);
    }
}
