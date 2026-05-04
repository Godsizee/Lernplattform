<?php
/* scripts/setup_quiz_center.php */
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/../app/bootstrap.php';
$db = App\Core\Database::getInstance()->getConnection();

header('Content-Type: text/plain');

try {
    $db->beginTransaction();

    // 1. Prüfen ob Fach schon existiert
    $stmt = $db->prepare("SELECT id FROM subjects WHERE title = 'SAP Academy Quiz Center'");
    $stmt->execute();
    $subjectId = $stmt->fetchColumn();

    if (!$subjectId) {
        // Fach anlegen
        $stmt = $db->prepare("INSERT INTO subjects (title, color, description) VALUES (?, ?, ?)");
        $stmt->execute(['SAP Academy Quiz Center', '#3b82f6', 'Alle interaktiven Quizze aus den SAP Academy Unterlagen gesammelt an einem Ort.']);
        $subjectId = $db->lastInsertId();
        echo "Neues Fach 'SAP Academy Quiz Center' angelegt (ID: $subjectId)\n";
    } else {
        echo "Fach 'SAP Academy Quiz Center' existiert bereits (ID: $subjectId)\n";
    }

    // 2. Alle Quiz-Lektionen dorthin verschieben
    $stmt = $db->prepare("UPDATE lessons SET subject_id = ? WHERE type = 'quiz'");
    $stmt->execute([$subjectId]);
    $affected = $stmt->rowCount();
    
    echo "$affected Quiz-Lektionen wurden in das neue Fach verschoben.\n";

    $db->commit();
    echo "\nSetup erfolgreich abgeschlossen!";
} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    echo "Fehler: " . $e->getMessage();
}
