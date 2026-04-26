<?php
require_once __DIR__ . '/init.php';

$userId = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Nur POST-Requests erlaubt.'], 405);
}

$input = getJsonInput();
$action = htmlspecialchars($input['action'] ?? '');
$details = htmlspecialchars($input['details'] ?? '');

if ($action) {
    try {
        $auditRepo->log($userId, $action, $details);
        sendJson(['success' => true]);
    } catch (Exception $e) {
        error_log("Audit Log Error: " . $e->getMessage());
        sendJson(['error' => 'Fehler beim Loggen.'], 500);
    }
}

sendJson(['error' => 'Missing action'], 400);
