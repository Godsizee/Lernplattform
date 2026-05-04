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
            SELECT l.id, l.subject_id, l.author_id, l.title, l.type $contentFields,
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

        $sql .= " ORDER BY s.id ASC, l.sort_order ASC, l.id ASC";
        
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

    public function createArticle(int $authorId, int $subjectId, string $title, string $contentRaw, string $status, string $type = 'article'): int {
        $stmt = $this->db->prepare("
            INSERT INTO lessons (subject_id, author_id, title, type, content, content_raw, status)
            VALUES (:s_id, :a_id, :title, :type, '', :content_raw, :status)
            RETURNING id
        ");
        $stmt->execute([
            ':s_id' => $subjectId,
            ':a_id' => $authorId,
            ':title' => $title,
            ':type' => $type,
            ':content_raw' => $contentRaw,
            ':status' => $status
        ]);
        return (int) $stmt->fetchColumn();
    }

    public function updateArticle(int $id, int $userId, string $title, string $contentRaw, string $status, bool $isAdmin, string $type = 'article'): bool {
        $sql = "UPDATE lessons SET title = :title, type = :type, content_raw = :content_raw, content = '', status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
        $params = [':title' => $title, ':type' => $type, ':content_raw' => $contentRaw, ':status' => $status, ':id' => $id];

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
            SELECT l.id, l.title, l.type, l.status, l.subject_id, s.title as subject_title, s.color as subject_color
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

    // --- BOOKMARKS ---

    public function toggleBookmark(int $userId, int $lessonId): bool {
        // Prüfen ob bereits vorhanden
        $stmt = $this->db->prepare("SELECT 1 FROM bookmarks WHERE user_id = :u_id AND lesson_id = :l_id");
        $stmt->execute([':u_id' => $userId, ':l_id' => $lessonId]);
        $exists = $stmt->fetchColumn();

        if ($exists) {
            $stmt = $this->db->prepare("DELETE FROM bookmarks WHERE user_id = :u_id AND lesson_id = :l_id");
            $stmt->execute([':u_id' => $userId, ':l_id' => $lessonId]);
            return false;
        } else {
            $stmt = $this->db->prepare("INSERT INTO bookmarks (user_id, lesson_id) VALUES (:u_id, :l_id)");
            $stmt->execute([':u_id' => $userId, ':l_id' => $lessonId]);
            return true;
        }
    }

    public function isBookmarked(int $userId, int $lessonId): bool {
        $stmt = $this->db->prepare("SELECT 1 FROM bookmarks WHERE user_id = :u_id AND lesson_id = :l_id");
        $stmt->execute([':u_id' => $userId, ':l_id' => $lessonId]);
        return (bool) $stmt->fetchColumn();
    }

    public function getBookmarkedLessons(int $userId): array {
        $stmt = $this->db->prepare("
            SELECT l.id, l.title, l.subject_id, s.title as subject_title, s.color as subject_color, b.created_at as bookmarked_at
            FROM bookmarks b
            JOIN lessons l ON b.lesson_id = l.id
            JOIN subjects s ON l.subject_id = s.id
            WHERE b.user_id = :u_id
            ORDER BY b.created_at DESC
        ");
        $stmt->execute([':u_id' => $userId]);
        return $stmt->fetchAll();
    }

    // --- NOTES ---

    public function getNote(int $userId, int $lessonId): ?string {
        $stmt = $this->db->prepare("SELECT content FROM lesson_notes WHERE user_id = :u_id AND lesson_id = :l_id");
        $stmt->execute([':u_id' => $userId, ':l_id' => $lessonId]);
        return $stmt->fetchColumn() ?: null;
    }

    public function saveNote(int $userId, int $lessonId, string $content): void {
        $stmt = $this->db->prepare("
            INSERT INTO lesson_notes (user_id, lesson_id, content, updated_at)
            VALUES (:u_id, :l_id, :content, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, lesson_id)
            DO UPDATE SET content = EXCLUDED.content, updated_at = CURRENT_TIMESTAMP
        ");
        $stmt->execute([
            ':u_id' => $userId,
            ':l_id' => $lessonId,
            ':content' => $content
        ]);
    }

    public function countPublished(): int {
        $stmt = $this->db->query("SELECT COUNT(*) FROM lessons WHERE status = 'published'");
        return (int)$stmt->fetchColumn();
    }

    public function getPopular(int $limit = 5): array {
        $stmt = $this->db->prepare("
            SELECT l.id, l.title, COUNT(up.lesson_id) as completion_count
            FROM lessons l
            LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.status = 'completed'
            GROUP BY l.id, l.title
            ORDER BY completion_count DESC, l.title ASC
            LIMIT :limit
        ");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // --- ADMIN CONTENT ENGINE ---

    public function getAllLessonsForAdmin(): array {
        $stmt = $this->db->query("
            SELECT l.id, l.title, l.type, l.status, l.subject_id, l.sort_order,
                   s.title as subject_title, s.color as subject_color,
                   u.name as author_name, l.created_at
            FROM lessons l
            JOIN subjects s ON l.subject_id = s.id
            LEFT JOIN users u ON l.author_id = u.id
            ORDER BY s.id ASC, l.sort_order ASC, l.id ASC
        ");
        return $stmt->fetchAll();
    }

    public function updateLessonOrder(array $orders): void {
        $stmt = $this->db->prepare("UPDATE lessons SET sort_order = :order WHERE id = :id");
        foreach ($orders as $item) {
            $stmt->execute([
                ':order' => $item['sort_order'],
                ':id' => $item['id']
            ]);
        }
    }

    public function cloneLesson(int $lessonId, int $authorId): int {
        $stmt = $this->db->prepare("
            INSERT INTO lessons (subject_id, author_id, title, type, content, content_raw, status, sort_order)
            SELECT subject_id, :author_id, CONCAT('Kopie von ', title), type, content, content_raw, 'draft', sort_order + 1
            FROM lessons WHERE id = :id
            RETURNING id
        ");
        $stmt->execute([':id' => $lessonId, ':author_id' => $authorId]);
        return (int) $stmt->fetchColumn();
    }

    public function bulkUpdateStatus(array $ids, string $status): void {
        if (empty($ids)) return;
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $this->db->prepare("UPDATE lessons SET status = ? WHERE id IN ($placeholders)");
        $stmt->execute(array_merge([$status], $ids));
    }

    public function bulkDelete(array $ids): void {
        if (empty($ids)) return;
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $this->db->prepare("DELETE FROM lessons WHERE id IN ($placeholders)");
        $stmt->execute($ids);
    }

    // --- SUBJECT CRUD ---

    public function createSubject(string $title, string $color, string $icon): int {
        $stmt = $this->db->prepare("INSERT INTO subjects (title, color, icon) VALUES (:title, :color, :icon) RETURNING id");
        $stmt->execute([':title' => $title, ':color' => $color, ':icon' => $icon]);
        return (int) $stmt->fetchColumn();
    }

    public function updateSubject(int $id, string $title, string $color, string $icon): void {
        $stmt = $this->db->prepare("UPDATE subjects SET title = :title, color = :color, icon = :icon WHERE id = :id");
        $stmt->execute([':title' => $title, ':color' => $color, ':icon' => $icon, ':id' => $id]);
    }

    public function deleteSubject(int $id): void {
        $stmt = $this->db->prepare("DELETE FROM subjects WHERE id = :id");
        $stmt->execute([':id' => $id]);
    }
}
