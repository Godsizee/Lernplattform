<?php
namespace App\Controllers;

use App\Core\Controller;
use Exception;

class ArticleController extends Controller {
    public function __construct() {
        $this->requireAuth();
    }

    /**
     * Beitrag erstellen
     */
    public function create() {
        global $lessonRepo, $auditRepo;
        $userId = $_SESSION['user_id'];
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $subjectId = filter_var($input['subject_id'] ?? 0, FILTER_VALIDATE_INT);
        $title = trim($input['title'] ?? '');
        $contentRaw = trim($input['content_raw'] ?? '');
        $status = in_array($input['status'] ?? '', ['draft', 'published']) ? $input['status'] : 'draft';

        if (!$subjectId || !$title || !$contentRaw) {
            return $this->json(['error' => 'Bitte alle Felder ausfüllen.'], 400);
        }

        $articleId = $lessonRepo->createArticle($userId, $subjectId, $title, $contentRaw, $status);
        
        $statusLabel = $status === 'draft' ? 'als Entwurf ' : '';
        $auditRepo->log($userId, 'ARTICLE_CREATE', "Hat den Beitrag '{$title}' {$statusLabel}erstellt. {{article:{$articleId}}}");

        return $this->json(['success' => true, 'id' => $articleId]);
    }

    /**
     * Beitrag aktualisieren
     */
    public function update() {
        global $lessonRepo, $auditRepo;
        $userId = $_SESSION['user_id'];
        $isAdmin = $_SESSION['user_role'] === 'admin';
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $articleId = filter_var($input['id'] ?? 0, FILTER_VALIDATE_INT);
        $title = trim($input['title'] ?? '');
        $contentRaw = trim($input['content_raw'] ?? '');
        $status = in_array($input['status'] ?? '', ['draft', 'published']) ? $input['status'] : 'draft';

        $article = $lessonRepo->getArticleForEdit($articleId);
        if (!$article || (!$isAdmin && $article['author_id'] != $userId)) {
            return $this->json(['error' => 'Nicht autorisiert oder nicht gefunden.'], 403);
        }

        $success = $lessonRepo->updateArticle($articleId, $userId, $title, $contentRaw, $status, $isAdmin);
        $auditRepo->log($userId, 'ARTICLE_UPDATE', "Hat den Beitrag '{$title}' bearbeitet. {{article:{$articleId}}}");

        return $this->json(['success' => $success]);
    }

    /**
     * Beitrag löschen
     */
    public function delete() {
        global $lessonRepo, $auditRepo;
        $userId = $_SESSION['user_id'];
        $isAdmin = $_SESSION['user_role'] === 'admin';
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $articleId = filter_var($input['id'] ?? 0, FILTER_VALIDATE_INT);
        $article = $lessonRepo->getArticleForEdit($articleId);
        
        if (!$article || (!$isAdmin && $article['author_id'] != $userId)) {
            return $this->json(['error' => 'Nicht autorisiert.'], 403);
        }

        $lessonRepo->deleteArticle($articleId, $userId, $isAdmin);
        $auditRepo->log($userId, 'ARTICLE_DELETE', "Hat den Beitrag '{$article['title']}' gelöscht.");

        return $this->json(['success' => true]);
    }

    /**
     * Einzelnen Beitrag laden
     */
    public function get() {
        global $lessonRepo;
        $userId = $_SESSION['user_id'];
        $isAdmin = $_SESSION['user_role'] === 'admin';
        
        $articleId = filter_var($_GET['id'] ?? 0, FILTER_VALIDATE_INT);
        $article = $lessonRepo->getArticleForEdit($articleId);

        if (!$article || (!$isAdmin && $article['author_id'] != $userId && $article['status'] === 'draft')) {
            return $this->json(['error' => 'Nicht gefunden.'], 404);
        }

        return $this->json($article);
    }

    /**
     * Suche nach Beiträgen
     */
    public function search() {
        global $lessonRepo;
        $userId = $_SESSION['user_id'];
        $isAdmin = $_SESSION['user_role'] === 'admin';
        
        $query = trim($_GET['q'] ?? '');
        if (strlen($query) < 2) return $this->json([]);

        return $this->json($lessonRepo->searchLessons($query, $userId, $isAdmin));
    }

    /**
     * Lernfortschritt speichern
     */
    public function saveProgress() {
        global $lessonRepo, $auditRepo;
        $userId = $_SESSION['user_id'];
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $lessonId = filter_var($input['lesson_id'] ?? null, FILTER_VALIDATE_INT);
        $completed = $input['completed'] ?? true;
        
        if (!$lessonId) return $this->json(['error' => 'Ungültige ID.'], 400);

        $lessonRepo->saveProgress($userId, $lessonId, $completed ? 'completed' : 'pending');
        
        $lessonTitle = $lessonRepo->getLessonTitle($lessonId);
        $action = $completed ? 'LESSON_COMPLETED' : 'LESSON_RESET';
        $auditRepo->log($userId, $action, "Status für '$lessonTitle' geändert.");

        return $this->json(['success' => true]);
    }
}
