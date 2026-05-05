<?php
// scripts/debug_lesson_72.php
require_once __DIR__ . '/../app/bootstrap.php';

use App\Core\Database;

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("SELECT id, title, content_raw, content FROM lessons WHERE id = :id");
    $stmt->execute(['id' => 72]);
    $lesson = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($lesson) {
        echo "LESSON ID: " . $lesson['id'] . "\n";
        echo "TITLE: " . $lesson['title'] . "\n";
        echo "--- RAW CONTENT (Markdown) ---\n";
        echo $lesson['content_raw'] . "\n";
        echo "--- RENDERED CONTENT (HTML) ---\n";
        echo $lesson['content'] . "\n";
    } else {
        echo "Lektion 72 nicht gefunden.\n";
    }

} catch (Exception $e) {
    echo "Fehler: " . $e->getMessage() . "\n";
}
