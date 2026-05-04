<?php
require_once __DIR__ . '/app/bootstrap.php';
use App\Core\Database;

try {
    $db = Database::getInstance()->getConnection();
    $sql = "ALTER TABLE lessons ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'article' CHECK (type IN ('article', 'quiz'));";
    $db->exec($sql);
    
    $sql2 = "UPDATE lessons SET type = 'article' WHERE type IS NULL;";
    $db->exec($sql2);
    
    echo "Migration erfolgreich.\n";
} catch (Exception $e) {
    echo "Fehler: " . $e->getMessage() . "\n";
}
