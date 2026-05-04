<?php
/* scripts/apply_score_migration.php */
require_once __DIR__ . '/../app/bootstrap.php';
$db = App\Core\Database::getInstance()->getConnection();

header('Content-Type: text/plain');

try {
    $db->exec("ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS score INT DEFAULT NULL");
    echo "Datenbank erfolgreich erweitert: Spalte 'score' hinzugefügt.\n";
} catch (Exception $e) {
    echo "Fehler: " . $e->getMessage();
}
