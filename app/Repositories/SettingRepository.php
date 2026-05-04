<?php
namespace App\Repositories;
use PDO;

class SettingRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function get(string $key, $default = null) {
        $stmt = $this->db->prepare("SELECT setting_value FROM system_settings WHERE setting_key = ?");
        $stmt->execute([$key]);
        $val = $stmt->fetchColumn();
        return $val !== false ? $val : $default;
    }

    public function set(string $key, string $value) {
        // Postgres ON CONFLICT, MySQL ON DUPLICATE KEY UPDATE.
        // We use a simple SELECT then UPDATE/INSERT for cross-db compatibility since it's low traffic.
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM system_settings WHERE setting_key = ?");
        $stmt->execute([$key]);
        if ($stmt->fetchColumn() > 0) {
            $stmt = $this->db->prepare("UPDATE system_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?");
            $stmt->execute([$value, $key]);
        } else {
            $stmt = $this->db->prepare("INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?)");
            $stmt->execute([$key, $value]);
        }
    }
}
