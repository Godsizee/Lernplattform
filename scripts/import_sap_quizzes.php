<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/**
 * Import-Skript für SAP-Academy Quizze in die Lernplattform.
 * Kann von der Konsole (CLI) oder über den Browser ausgeführt werden.
 */
require_once __DIR__ . '/../app/bootstrap.php';

use App\Core\Database;
use App\Repositories\LessonRepository;

$db = Database::getInstance()->getConnection();
$lessonRepo = new LessonRepository($db);

// Finde die Subject ID für SAP ERP
$stmt = $db->query("SELECT id FROM subjects WHERE title LIKE '%SAP%' LIMIT 1");
$subjectId = $stmt->fetchColumn() ?: 3; // Fallback auf 3

$adminId = 1; // Fallback Admin ID
$stmtAdmin = $db->query("SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1");
if ($adminIdFromDb = $stmtAdmin->fetchColumn()) {
    $adminId = $adminIdFromDb;
}

$sourceDir = realpath(__DIR__ . '/data');
if (!$sourceDir || !is_dir($sourceDir)) {
    die("Fehler: Quellverzeichnis $sourceDir nicht gefunden.\n");
}

$filesToProcess = [
    's4f10.json',
    's4550_quiz.json',
    'quiz_s4220.php',
    'quiz_s4500_data.php',
    'quiz_s4600.php',
    'quiz_s4h00.php'
];

$totalLessonsCreated = 0;

foreach ($filesToProcess as $filename) {
    $filePath = $sourceDir . '/' . $filename;
    if (!file_exists($filePath)) {
        echo "Warnung: Datei nicht gefunden: $filename\n";
        continue;
    }

    echo "Verarbeite $filename...\n";
    $quizQuestions = [];
    $moduleName = strtoupper(explode('.', str_replace(['quiz_', '_quiz', '_data'], '', $filename))[0]);

    if (pathinfo($filePath, PATHINFO_EXTENSION) === 'json') {
        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);
        if (isset($data['quiz']) && is_array($data['quiz'])) {
            $quizQuestions = $data['quiz'];
        }
    } elseif (pathinfo($filePath, PATHINFO_EXTENSION) === 'php') {
        // Lokaler Scope für include, um Variablenüberschreibung zu verhindern
        $getQuizData = function($path) {
            include $path;
            return isset($quizData) ? $quizData : [];
        };
        $quizQuestions = $getQuizData($filePath);
    }

    if (empty($quizQuestions)) {
        echo "  - Keine Quiz-Daten in $filename gefunden.\n";
        continue;
    }

    // Gruppieren nach Kapitel
    $groupedByChapter = [];
    foreach ($quizQuestions as $q) {
        $chap = $q['chapter'] ?? 'Unbekanntes Kapitel';
        // Wenn es "Kapitel 1" heißt, extrahiere die Zahl für den Titel, ansonsten nimm es wie es ist
        $chapName = is_numeric($chap) ? "Kapitel $chap" : $chap;
        $groupedByChapter[$chapName][] = $q;
    }

    // Für jedes Kapitel eine Lektion anlegen
    foreach ($groupedByChapter as $chapterName => $questions) {
        $title = "Quiz: $moduleName - $chapterName";
        $contentRaw = json_encode($questions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        $lessonId = $lessonRepo->createArticle($adminId, $subjectId, $title, $contentRaw, 'published', 'quiz');
        echo "  + Lektion '$title' angelegt (ID: $lessonId)\n";
        $totalLessonsCreated++;
    }
}

echo "Import abgeschlossen! Es wurden $totalLessonsCreated Quiz-Lektionen erstellt.\n";
