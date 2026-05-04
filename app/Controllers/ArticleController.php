<?php
namespace App\Controllers;

use App\Core\Controller;
use Exception;

class ArticleController extends Controller {
    private $lessonRepo;
    private $auditRepo;

    public function __construct($container) {
        parent::__construct($container);
        $this->lessonRepo = $container->get('LessonRepository');
        $this->auditRepo = $container->get('AuditLogRepository');
        $this->requireAuth();
    }

    /**
     * Beitrag erstellen
     */
    public function create() {
        $userId = $_SESSION['user_id'];
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $subjectId = filter_var($input['subject_id'] ?? 0, FILTER_VALIDATE_INT);
        $title = trim($input['title'] ?? '');
        $type = in_array($input['type'] ?? '', ['article', 'quiz']) ? $input['type'] : 'article';
        $contentRaw = trim($input['content_raw'] ?? '');
        $status = in_array($input['status'] ?? '', ['draft', 'published']) ? $input['status'] : 'draft';

        if (!$subjectId || !$title || !$contentRaw) {
            return $this->json(['error' => 'Bitte alle Felder ausfüllen.'], 400);
        }

        $articleId = $this->lessonRepo->createArticle($userId, $subjectId, $title, $contentRaw, $status, $type);
        
        $statusLabel = $status === 'draft' ? 'als Entwurf ' : '';
        $this->auditRepo->log($userId, 'ARTICLE_CREATE', "Hat den Beitrag '{$title}' {$statusLabel}erstellt. {{article:{$articleId}}}");

        return $this->json(['success' => true, 'id' => $articleId]);
    }

    /**
     * Beitrag aktualisieren
     */
    public function update($articleId = null) {
        $userId = $_SESSION['user_id'];
        $isAdmin = $_SESSION['user_role'] === 'admin';
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        // Priorisiere ID aus URL (REST), Fallback auf Body (Legacy)
        $articleId = $articleId ?? filter_var($input['id'] ?? 0, FILTER_VALIDATE_INT);
        $title = trim($input['title'] ?? '');
        $type = in_array($input['type'] ?? '', ['article', 'quiz']) ? $input['type'] : 'article';
        $contentRaw = trim($input['content_raw'] ?? '');
        $status = in_array($input['status'] ?? '', ['draft', 'published']) ? $input['status'] : 'draft';

        $article = $this->lessonRepo->getArticleForEdit($articleId);
        if (!$article || (!$isAdmin && $article['author_id'] != $userId)) {
            return $this->json(['error' => 'Nicht autorisiert oder nicht gefunden.'], 403);
        }

        $success = $this->lessonRepo->updateArticle($articleId, $userId, $title, $contentRaw, $status, $isAdmin, $type);
        $this->auditRepo->log($userId, 'ARTICLE_UPDATE', "Hat den Beitrag '{$title}' bearbeitet. {{article:{$articleId}}}");

        return $this->json(['success' => $success]);
    }

    /**
     * Beitrag löschen
     */
    public function delete($articleId = null) {
        $userId = $_SESSION['user_id'];
        $isAdmin = $_SESSION['user_role'] === 'admin';
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        // Priorisiere ID aus URL (REST), Fallback auf Body (Legacy)
        $articleId = $articleId ?? filter_var($input['id'] ?? 0, FILTER_VALIDATE_INT);
        $article = $this->lessonRepo->getArticleForEdit($articleId);
        
        if (!$article || (!$isAdmin && $article['author_id'] != $userId)) {
            return $this->json(['error' => 'Nicht autorisiert.'], 403);
        }

        $this->lessonRepo->deleteArticle($articleId, $userId, $isAdmin);
        $this->auditRepo->log($userId, 'ARTICLE_DELETE', "Hat den Beitrag '{$article['title']}' gelöscht.");

        return $this->json(['success' => true]);
    }

    /**
     * Einzelnen Beitrag laden
     */
    public function get($articleId = null) {
        $userId = $_SESSION['user_id'];
        $isAdmin = $_SESSION['user_role'] === 'admin';
        
        // Priorisiere ID aus URL (REST), Fallback auf Query-Param (Legacy)
        $articleId = $articleId ?? filter_var($_GET['id'] ?? 0, FILTER_VALIDATE_INT);
        $article = $this->lessonRepo->getArticleForEdit($articleId);

        if (!$article || (!$isAdmin && $article['author_id'] != $userId && $article['status'] === 'draft')) {
            return $this->json(['error' => 'Nicht gefunden.'], 404);
        }

        if (!$isAdmin) {
            $article['author_name'] = null; // Datenschutz
        }

        // Student-Features hinzufügen
        $article['is_bookmarked'] = $this->lessonRepo->isBookmarked($userId, $articleId);
        $article['user_note'] = $this->lessonRepo->getNote($userId, $articleId);

        return $this->json($article);
    }

    /**
     * Suche nach Beiträgen
     */
    public function search() {
        $userId = $_SESSION['user_id'];
        $isAdmin = $_SESSION['user_role'] === 'admin';
        
        $query = trim($_GET['q'] ?? '');
        if (strlen($query) < 2) return $this->json([]);

        return $this->json($this->lessonRepo->searchLessons($query, $userId, $isAdmin));
    }

    /**
     * Lernfortschritt speichern
     */
    public function saveProgress() {
        $userId = $_SESSION['user_id'];
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $lessonId = filter_var($input['lesson_id'] ?? null, FILTER_VALIDATE_INT);
        $completed = $input['completed'] ?? true;
        $score = isset($input['score']) ? filter_var($input['score'], FILTER_VALIDATE_INT) : null;
        
        if (!$lessonId) return $this->json(['error' => 'Ungültige ID.'], 400);

        $this->lessonRepo->saveProgress($userId, $lessonId, $completed ? 'completed' : 'pending', $score);
        
        $lessonTitle = $this->lessonRepo->getLessonTitle($lessonId);
        $action = $completed ? 'LESSON_COMPLETED' : 'LESSON_RESET';
        $msg = "Status für '$lessonTitle' geändert.";
        if ($score !== null) $msg .= " Ergebnis: $score%.";
        
        $this->auditRepo->log($userId, $action, $msg);

        return $this->json(['success' => true]);
    }
}
