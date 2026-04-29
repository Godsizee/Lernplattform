<?php
namespace App\Repositories;

use PDO;

class AuditLogRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
        $this->initTable();
    }
    
    private function initTable() {
        $this->db->exec("CREATE TABLE IF NOT EXISTS audit_logs (id SERIAL PRIMARY KEY, user_id INT NOT NULL, action VARCHAR(255) NOT NULL, details TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)");
    }

    public function log(int $userId, string $action, string $details): void {
        $stmt = $this->db->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (:user_id, :action, :details)");
        $stmt->execute([
            ':user_id' => $userId,
            ':action' => $action,
            ':details' => $details
        ]);
    }

    public function getLogs(?int $userId = null, int $limit = 100): array {
        $sql = "SELECT a.*, u.name as user_name FROM audit_logs a JOIN users u ON a.user_id = u.id";
        $params = [];
        
        if ($userId) {
            $sql .= " WHERE a.user_id = :uid";
            $params[':uid'] = $userId;
        }
        
        $sql .= " ORDER BY a.created_at DESC LIMIT " . (int)$limit;
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function countActionsInLast24h(string $action): int {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM audit_logs WHERE action = :action AND created_at >= NOW() - INTERVAL '24 hours'");
        $stmt->execute([':action' => $action]);
        return (int)$stmt->fetchColumn();
    }
}
