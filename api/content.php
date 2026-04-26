<?php
require_once __DIR__ . '/init.php';

$userId = requireAuth();
$action = $_GET['action'] ?? 'dashboard';

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
    elseif ($action === 'lessons') {
        sendJson($lessonRepo->getLessonsWithProgress($userId));
    } else {
        sendJson(['error' => 'Ungültige Aktion'], 400);
    }
} catch (Exception $e) {
    error_log("Content API Error: " . $e->getMessage());
    sendJson(['error' => 'Datenbankfehler beim Laden der Inhalte.'], 500);
}
