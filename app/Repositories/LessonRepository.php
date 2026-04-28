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
            LEFT JOIN lessons l ON s.id = l.subject_id AND (l.status = 'published' OR l.author_id = :uid_filter)
            LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = :user_id AND up.status = 'completed'
            GROUP BY s.id
        ");
        $stmt->execute([':user_id' => $userId, ':uid_filter' => $userId]);
        
        $progressMap = [];
        foreach ($stmt->fetchAll() as $row) {
            $progressMap[$row['subject_id']] = $row;
        }
        return $progressMap;
    }

    public function getLessonsWithProgress(int $userId, ?int $subjectId = null, bool $isAdmin = false, bool $includeContent = true): array {
        $contentFields = $includeContent ? ", l.content, l.content_raw" : "";
        $sql = "
            SELECT l.id, l.subject_id, l.author_id, l.title $contentFields,
                   l.status as article_status, l.created_at, l.updated_at,
                   s.title as subject_title, s.color as subject_color,
                   up.status,
                   u.name as author_name
            FROM lessons l
            JOIN subjects s ON l.subject_id = s.id
            LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = :user_id
            LEFT JOIN users u ON l.author_id = u.id
        ";

        $params = [':user_id' => $userId];

        $conditions = [];
        if ($subjectId) {
            $conditions[] = "l.subject_id = :subject_id";
            $params[':subject_id'] = $subjectId;
        }

        if (!$isAdmin) {
            $conditions[] = "(l.status = 'published' OR l.author_id = :author_filter)";
            $params[':author_filter'] = $userId;
        }

        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
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

    public function getLessonTitle(int $lessonId): string {
        $stmt = $this->db->prepare("SELECT title FROM lessons WHERE id = :id");
        $stmt->execute([':id' => $lessonId]);
        return $stmt->fetchColumn() ?: 'Unbekannte Lektion';
    }

    public function createArticle(int $authorId, int $subjectId, string $title, string $contentRaw, string $status): int {
        $stmt = $this->db->prepare("
            INSERT INTO lessons (subject_id, author_id, title, content, content_raw, status)
            VALUES (:s_id, :a_id, :title, '', :content_raw, :status)
            RETURNING id
        ");
        $stmt->execute([
            ':s_id' => $subjectId,
            ':a_id' => $authorId,
            ':title' => $title,
            ':content_raw' => $contentRaw,
            ':status' => $status
        ]);
        return (int) $stmt->fetchColumn();
    }

    public function updateArticle(int $id, int $userId, string $title, string $contentRaw, string $status, bool $isAdmin): bool {
        $sql = "UPDATE lessons SET title = :title, content_raw = :content_raw, content = '', status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
        $params = [':title' => $title, ':content_raw' => $contentRaw, ':status' => $status, ':id' => $id];

        if (!$isAdmin) {
            $sql .= " AND author_id = :author_id";
            $params[':author_id'] = $userId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function deleteArticle(int $id, int $userId, bool $isAdmin): bool {
        $sql = "DELETE FROM lessons WHERE id = :id";
        $params = [':id' => $id];

        if (!$isAdmin) {
            $sql .= " AND author_id = :author_id";
            $params[':author_id'] = $userId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function getArticleForEdit(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT l.*, s.title as subject_title, u.name as author_name 
            FROM lessons l 
            JOIN subjects s ON l.subject_id = s.id 
            LEFT JOIN users u ON l.author_id = u.id
            WHERE l.id = :id
        ");
        $stmt->execute([':id' => $id]);
        $article = $stmt->fetch();
        return $article ?: null;
    }

    public function searchLessons(string $query, int $userId, bool $isAdmin = false): array {
        $sql = "
            SELECT l.id, l.title, l.status, l.subject_id, s.title as subject_title, s.color as subject_color
            FROM lessons l
            JOIN subjects s ON l.subject_id = s.id
            WHERE (l.title ILIKE :query OR l.content_raw ILIKE :query OR l.content ILIKE :query)
        ";

        $params = [':query' => '%' . $query . '%'];

        if (!$isAdmin) {
            $sql .= " AND (l.status = 'published' OR l.author_id = :user_id)";
            $params[':user_id'] = $userId;
        }

        $sql .= " ORDER BY l.title ASC LIMIT 10";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}
