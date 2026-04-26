<?php
namespace App\Repositories;

use PDO;

class UserRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function findByLogin(string $login): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :login OR name = :login");
        $stmt->execute([':login' => $login]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function create(string $name, string $email, string $passwordHash): int {
        $stmt = $this->db->prepare("INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :hash) RETURNING id");
        $stmt->execute([':name' => $name, ':email' => $email, ':hash' => $passwordHash]);
        return (int)$stmt->fetchColumn();
    }

    public function updateProfile(int $id, string $name, string $email, ?string $passwordHash, ?string $bio, ?string $theme): void {
        $query = "UPDATE users SET name = :n, email = :e, bio = :b";
        $params = [':n' => $name, ':e' => $email, ':b' => $bio, ':id' => $id];
        
        if ($passwordHash) {
            $query .= ", password_hash = :p";
            $params[':p'] = $passwordHash;
        }
        if ($theme) {
            $query .= ", theme = :t";
            $params[':t'] = $theme;
        }
        
        $query .= " WHERE id = :id";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
    }
    
    public function updateTheme(int $id, string $theme): void {
        $stmt = $this->db->prepare("UPDATE users SET theme = :theme WHERE id = :id");
        $stmt->execute([':theme' => $theme, ':id' => $id]);
    }

    public function setRole(int $userId, string $role): void {
        $stmt = $this->db->prepare("UPDATE users SET role = :role WHERE id = :id");
        $stmt->execute([':role' => $role, ':id' => $userId]);
    }

    public function delete(int $id, int $requestingUserId = null): void {
        $query = "DELETE FROM users WHERE id = :id";
        $params = [':id' => $id];
        
        if ($requestingUserId !== null) {
            $query .= " AND id != :req_id";
            $params[':req_id'] = $requestingUserId;
        }
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
    }

    public function getAllUsers(): array {
        $stmt = $this->db->query("SELECT id, name, email, role, created_at FROM users ORDER BY id DESC");
        return $stmt->fetchAll();
    }
}
