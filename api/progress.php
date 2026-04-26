<?php
require_once __DIR__ . '/init.php';

$userId = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Nur POST-Requests erlaubt.'], 405);
}

$input = getJsonInput();
$lessonId = filter_var($input['lesson_id'] ?? null, FILTER_VALIDATE_INT);
$completed = $input['completed'] ?? true;
$status = $completed ? 'completed' : 'pending';

if (!$lessonId) {
    sendJson(['error' => 'Ungültige lesson_id.'], 400);
}

try {
    $lessonRepo->saveProgress($userId, $lessonId, $status);
    sendJson([
        'success' => true, 
        'message' => 'Lektion erfolgreich aktualisiert.'
    ]);
} catch (Exception $e) {
    error_log("Progress Save Error: " . $e->getMessage());
    sendJson(['error' => 'Interner Serverfehler.'], 500);
}
