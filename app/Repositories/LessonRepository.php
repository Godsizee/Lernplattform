<?php
namespace App\Repositories;

use PDO;

class LessonRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAllSubjects(): array {
        $stmt = $this->db->query("SELECT * FROM subjects ORDER BY id ASC");
        return $stmt->fetchAll();
    }

    public function getProgress(int $userId): array {
        $stmt = $this->db->prepare("
            SELECT 
                s.id as subject_id,
                COUNT(l.id) as total_lessons,
                COUNT(up.lesson_id) as completed_lessons
            FROM subjects s
            LEFT JOIN lessons l ON s.id = l.subject_id
            LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = :user_id AND up.status = 'completed'
            GROUP BY s.id
        ");
        $stmt->execute([':user_id' => $userId]);
        
        $progressMap = [];
        foreach ($stmt->fetchAll() as $row) {
            $progressMap[$row['subject_id']] = $row;
        }
        return $progressMap;
    }

    public function getLessonsWithProgress(int $userId, ?int $subjectId = null): array {
        $sql = "
            SELECT l.id, l.subject_id, l.title, l.content, s.title as subject_title, s.color as subject_color, up.status
            FROM lessons l
            JOIN subjects s ON l.subject_id = s.id
            LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = :user_id
        ";
        $params = [':user_id' => $userId];
        
        if ($subjectId) {
            $sql .= " WHERE l.subject_id = :subject_id ";
            $params[':subject_id'] = $subjectId;
        }
        
        $sql .= " ORDER BY s.id ASC, l.id ASC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function saveProgress(int $userId, int $lessonId, string $status): void {
        $stmt = $this->db->prepare("
            INSERT INTO user_progress (user_id, lesson_id, status) 
            VALUES (:user_id, :lesson_id, :status)
            ON CONFLICT (user_id, lesson_id) 
            DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
        ");
        $stmt->execute([
            ':user_id' => $userId,
            ':lesson_id' => $lessonId,
            ':status' => $status
        ]);
    }

    public function addLesson(int $subjectId, string $title, string $content): void {
        $stmt = $this->db->prepare("INSERT INTO lessons (subject_id, title, content) VALUES (:s_id, :title, :content)");
        $stmt->execute([':s_id' => $subjectId, ':title' => $title, ':content' => $content]);
    }
}
