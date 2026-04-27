<?php
require_once __DIR__ . '/init.php';

$userId = requireAuth();
$action = $_GET['action'] ?? 'dashboard';
$isAdmin = ($_SESSION['user_role'] ?? '') === 'admin';

try {
    if ($action === 'dashboard') {
        $subjects = $lessonRepo->getAllSubjects();
        $progressMap = $lessonRepo->getProgress($userId);
        $user = $userRepo->findById($userId);
        
        sendJson([
            'subjects' => $subjects,
            'progress' => $progressMap,
            'streak' => $user['streak'] ?? 0
        ]);
    }
    elseif ($action === 'subjects') {
        sendJson($lessonRepo->getAllSubjects());
    }
    elseif ($action === 'lessons') {
        $subjectId = filter_var($_GET['subject_id'] ?? null, FILTER_VALIDATE_INT) ?: null;
        $lessons = $lessonRepo->getLessonsWithProgress($userId, $subjectId, $isAdmin);
        
        $completedIds = [];
        foreach ($lessons as $l) {
            if ($l['status'] === 'completed') {
                $completedIds[] = $l['id'];
            }
        }
        
        sendJson([
            'lessons' => $lessons,
            'progress' => $completedIds,
            'current_user_id' => $userId,
            'is_admin' => $isAdmin
        ]);
    } else {
        sendJson(['error' => 'Ungültige Aktion'], 400);
    }
} catch (Exception $e) {
    error_log("Content API Error: " . $e->getMessage());
    sendJson(['error' => 'Datenbankfehler beim Laden der Inhalte.'], 500);
}
