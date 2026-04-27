<?php
require_once __DIR__ . '/init.php';

$userId = requireAuth();
$action = $_GET['action'] ?? '';
$input = getJsonInput();
$isAdmin = ($_SESSION['user_role'] ?? '') === 'admin';

try {
    switch ($action) {
        case 'create':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendJson(['error' => 'Method not allowed'], 405);

            $subjectId = filter_var($input['subject_id'] ?? 0, FILTER_VALIDATE_INT);
            $title = trim($input['title'] ?? '');
            $contentRaw = trim($input['content_raw'] ?? '');
            $status = in_array($input['status'] ?? '', ['draft', 'published']) ? $input['status'] : 'draft';

            if (!$subjectId || !$title || !$contentRaw) {
                sendJson(['error' => 'Bitte Fach, Titel und Inhalt ausfüllen.'], 400);
            }

            $articleId = $lessonRepo->createArticle($userId, $subjectId, $title, $contentRaw, $status);

            global $auditRepo;
            $statusLabel = $status === 'draft' ? 'als Entwurf ' : '';
            $auditRepo->log($userId, 'ARTICLE_CREATE', "Hat den Beitrag '{$title}' {$statusLabel}erstellt. {{article:{$articleId}}}");

            sendJson(['success' => true, 'id' => $articleId]);
            break;

        case 'update':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendJson(['error' => 'Method not allowed'], 405);

            $articleId = filter_var($input['id'] ?? 0, FILTER_VALIDATE_INT);
            $title = trim($input['title'] ?? '');
            $contentRaw = trim($input['content_raw'] ?? '');
            $status = in_array($input['status'] ?? '', ['draft', 'published']) ? $input['status'] : 'draft';

            if (!$articleId || !$title || !$contentRaw) {
                sendJson(['error' => 'Ungültige Daten.'], 400);
            }

            $article = $lessonRepo->getArticleForEdit($articleId);
            if (!$article) {
                sendJson(['error' => 'Beitrag nicht gefunden.'], 404);
            }
            if (!$isAdmin && $article['author_id'] != $userId) {
                sendJson(['error' => 'Keine Berechtigung.'], 403);
            }

            $success = $lessonRepo->updateArticle($articleId, $userId, $title, $contentRaw, $status, $isAdmin);

            global $auditRepo;
            $auditRepo->log($userId, 'ARTICLE_UPDATE', "Hat den Beitrag '{$title}' bearbeitet. {{article:{$articleId}}}");

            sendJson(['success' => $success]);
            break;

        case 'delete':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendJson(['error' => 'Method not allowed'], 405);

            $articleId = filter_var($input['id'] ?? 0, FILTER_VALIDATE_INT);
            if (!$articleId) {
                sendJson(['error' => 'Ungültige ID.'], 400);
            }

            $article = $lessonRepo->getArticleForEdit($articleId);
            if (!$article) {
                sendJson(['error' => 'Beitrag nicht gefunden.'], 404);
            }
            if (!$isAdmin && $article['author_id'] != $userId) {
                sendJson(['error' => 'Keine Berechtigung.'], 403);
            }

            $title = $article['title'];
            $success = $lessonRepo->deleteArticle($articleId, $userId, $isAdmin);

            global $auditRepo;
            $auditRepo->log($userId, 'ARTICLE_DELETE', "Hat den Beitrag '{$title}' gelöscht.");

            sendJson(['success' => $success]);
            break;

        case 'get':
            $articleId = filter_var($_GET['id'] ?? 0, FILTER_VALIDATE_INT);
            if (!$articleId) {
                sendJson(['error' => 'Ungültige ID.'], 400);
            }

            $article = $lessonRepo->getArticleForEdit($articleId);
            if (!$article) {
                sendJson(['error' => 'Beitrag nicht gefunden.'], 404);
            }
            if (!$isAdmin && $article['author_id'] != $userId && $article['status'] === 'draft') {
                sendJson(['error' => 'Keine Berechtigung.'], 403);
            }

            sendJson($article);
            break;

        case 'search':
            $query = trim($_GET['q'] ?? '');
            if (strlen($query) < 2) {
                sendJson([]);
            }

            $results = $lessonRepo->searchLessons($query, $userId, $isAdmin);
            sendJson($results);
            break;

        default:
            sendJson(['error' => 'Ungültige Aktion.'], 400);
    }
} catch (Exception $e) {
    error_log("Articles API Error: " . $e->getMessage());
    sendJson(['error' => 'Interner Serverfehler.'], 500);
}
