<?php
require_once __DIR__ . '/init.php';

requireAdmin();

$action = $_GET['action'] ?? '';
$input = getJsonInput();

try {
    if ($action === 'users') {
        sendJson($userRepo->getAllUsers());
    }
    elseif ($action === 'set_role') {
        $targetId = $input['user_id'] ?? 0;
        $role = $input['role'] ?? '';
        if (in_array($role, ['student', 'admin'])) {
            $userRepo->setRole($targetId, $role);
            sendJson(['success' => true]);
        }
        sendJson(['error' => 'Invalid role'], 400);
    }
    elseif ($action === 'delete_user') {
        $targetId = $input['user_id'] ?? 0;
        $userRepo->delete($targetId, $_SESSION['user_id']);
        sendJson(['success' => true]);
    }
    elseif ($action === 'add_lesson') {
        $subjectId = filter_var($input['subject_id'] ?? 0, FILTER_VALIDATE_INT);
        $title = trim(htmlspecialchars($input['title'] ?? ''));
        $content = trim($input['content'] ?? '');

        if (!$subjectId || !$title || !$content) {
            sendJson(['error' => 'Alle Felder ausfüllen.'], 400);
        }

        $lessonRepo->addLesson($subjectId, $title, $content);
        sendJson(['success' => true]);
    }
    elseif ($action === 'audit') {
        $filterUser = filter_var($_GET['user_id'] ?? '', FILTER_VALIDATE_INT) ?: null;
        sendJson($auditRepo->getLogs($filterUser));
    } else {
        sendJson(['error' => 'Ungültige Aktion'], 400);
    }
} catch (Exception $e) {
    error_log("Admin API Error: " . $e->getMessage());
    sendJson(['error' => 'Fehler im Admin-Bereich.'], 500);
}
