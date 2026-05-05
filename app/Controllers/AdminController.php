<?php
namespace App\Controllers;

use App\Core\Controller;
use Exception;

class AdminController extends Controller {
    private $userRepo;
    private $auditRepo;
    private $lessonRepo;
    protected $db;

    public function __construct($container) {
        parent::__construct($container);
        $this->userRepo = $container->get('UserRepository');
        $this->auditRepo = $container->get('AuditLogRepository');
        $this->lessonRepo = $container->get('LessonRepository');
        $this->db = \App\Core\Database::getInstance()->getConnection();
        $this->requireAdmin();
    }

    /**
     * Liste aller Nutzer
     */
    public function users() {
        return $this->json($this->userRepo->getAllUsers());
    }

    /**
     * Rolle eines Nutzers ändern
     */
    public function setRole() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $targetId = $input['user_id'] ?? 0;
        $role = $input['role'] ?? '';
        
        if (in_array($role, ['student', 'admin'])) {
            $this->userRepo->setRole($targetId, $role);
            $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_SET_ROLE', "Hat die Rolle von User ID $targetId auf $role geändert.");
            return $this->json(['success' => true]);
        }
        return $this->json(['error' => 'Ungültige Rolle'], 400);
    }

    /**
     * Nutzer sperren / entsperren (Soft Ban)
     */
    public function toggleBan() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $targetId = filter_var($input['user_id'] ?? 0, FILTER_VALIDATE_INT);
        $status = (bool)($input['status'] ?? false);
        
        if ($targetId == $_SESSION['user_id']) {
            return $this->json(['error' => 'Du kannst dich nicht selbst sperren.'], 400);
        }
        
        $this->userRepo->toggleBan($targetId, $status);
        $action = $status ? 'ADMIN_BAN_USER' : 'ADMIN_UNBAN_USER';
        $details = "Hat den Nutzer mit ID $targetId " . ($status ? 'gesperrt' : 'entsperrt') . ".";
        
        $this->auditRepo->log($_SESSION['user_id'], $action, $details);
        return $this->json(['success' => true]);
    }

    /**
     * Login als anderer Nutzer (Impersonation)
     */
    public function impersonate() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $targetId = filter_var($input['user_id'] ?? 0, FILTER_VALIDATE_INT);
        $user = $this->userRepo->findById($targetId);
        
        if (!$user) {
            return $this->json(['error' => 'Nutzer nicht gefunden.'], 404);
        }

        if ($user['role'] === 'admin') {
            return $this->json(['error' => 'Sicherheitsrichtlinie: Du kannst keine Sitzung von anderen Admins übernehmen.'], 403);
        }

        // Aktuelle Admin-ID als Backup in der Session speichern
        $_SESSION['admin_id'] = $_SESSION['user_id'];
        
        // Session mit den Daten des Zielnutzers überschreiben
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_role'] = $user['role'];
        
        $this->auditRepo->log($_SESSION['admin_id'], 'ADMIN_IMPERSONATE_START', "Hat die Sitzung von Nutzer ID $targetId ({$user['name']}) übernommen.");
        
        return $this->json(['success' => true]);
    }

    /**
     * Nutzer löschen
     */
    public function deleteUser() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $targetId = $input['user_id'] ?? 0;
        $this->userRepo->delete($targetId, $_SESSION['user_id']);
        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_DELETE_USER', "Hat den Nutzer mit ID $targetId gelöscht.");
        return $this->json(['success' => true]);
    }

    /**
     * Audit Logs abrufen
     */
    public function audit() {
        $filterUser = filter_var($_GET['user_id'] ?? '', FILTER_VALIDATE_INT) ?: null;
        return $this->json($this->auditRepo->getLogs($filterUser));
    }

    /**
     * Dashboard Statistiken
     */
    public function dashboard() {
        $stats = [
            'top_level' => [
                'total_users' => $this->userRepo->countAll(),
                'total_lessons' => $this->lessonRepo->countPublished(),
                'logins_24h' => $this->auditRepo->countActionsInLast24h('USER_LOGIN')
            ],
            'popular_lessons' => $this->lessonRepo->getPopular(5),
            'system_health' => [
                'failed_logins_24h' => $this->auditRepo->countActionsInLast24h('LOGIN_FAILED'),
                'status' => 'ok'
            ]
        ];

        if ($stats['system_health']['failed_logins_24h'] > 10) {
            $stats['system_health']['status'] = 'warning';
        }

        return $this->json($stats);
    }

    /**
     * Alle Inhalte für den Content-Manager abrufen
     */
    public function content() {
        return $this->json([
            'lessons' => $this->lessonRepo->getAllLessonsForAdmin(),
            'subjects' => $this->lessonRepo->getAllSubjects()
        ]);
    }

    /**
     * Lektionen-Reihenfolge aktualisieren
     */
    public function updateLessonOrder() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (!isset($input['orders'])) return $this->json(['error' => 'Fehlende Daten'], 400);

        $this->lessonRepo->updateLessonOrder($input['orders']);
        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_CONTENT_REORDER', "Hat die Reihenfolge der Lektionen angepasst.");
        return $this->json(['success' => true]);
    }

    /**
     * Lektion duplizieren
     */
    public function cloneLesson() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $lessonId = $input['lesson_id'] ?? 0;

        if (!$lessonId) return $this->json(['error' => 'ID fehlt'], 400);

        $newId = $this->lessonRepo->cloneLesson($lessonId, $_SESSION['user_id']);
        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_CONTENT_CLONE', "Hat Lektion ID $lessonId geklont (Neu: ID $newId).");
        
        return $this->json(['success' => true, 'id' => $newId]);
    }

    /**
     * Bulk Status Update
     */
    public function bulkStatus() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $ids = $input['ids'] ?? [];
        $status = $input['status'] ?? 'draft';

        if (empty($ids)) return $this->json(['error' => 'Keine IDs gewählt'], 400);

        $this->lessonRepo->bulkUpdateStatus($ids, $status);
        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_CONTENT_BULK_STATUS', "Hat den Status von " . count($ids) . " Beiträgen auf '$status' gesetzt.");
        
        return $this->json(['success' => true]);
    }

    /**
     * Bulk Delete
     */
    public function bulkDelete() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $ids = $input['ids'] ?? [];

        if (empty($ids)) return $this->json(['error' => 'Keine IDs gewählt'], 400);

        $this->lessonRepo->bulkDelete($ids);
        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_CONTENT_BULK_DELETE', "Hat " . count($ids) . " Beiträge gelöscht.");
        
        return $this->json(['success' => true]);
    }

    /**
     * Fach erstellen oder aktualisieren
    public function saveSubject() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = $input['id'] ?? null;
        $title = trim($input['title'] ?? '');
        $color = trim($input['color'] ?? '#3b82f6');
        $icon = trim($input['icon'] ?? 'ph-folder');

        if (empty($title)) {
            return $this->json(['error' => 'Titel darf nicht leer sein.'], 400);
        }

        try {
            if ($id) {
                // Update
                $stmt = $this->db->prepare("UPDATE subjects SET title = ?, color = ?, icon = ? WHERE id = ?");
                $stmt->execute([$title, $color, $icon, $id]);
                $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_SUBJECT_UPDATED', "Fach aktualisiert: $title (ID: $id)");
            } else {
                // Create
                $stmt = $this->db->prepare("INSERT INTO subjects (title, color, icon) VALUES (?, ?, ?)");
                $stmt->execute([$title, $color, $icon]);
                $id = $this->db->lastInsertId();
                $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_SUBJECT_CREATED', "Fach erstellt: $title (ID: $id)");
            }
            return $this->json(['success' => true, 'id' => $id]);
        } catch (Exception $e) {
            return $this->json(['error' => 'Fehler beim Speichern: ' . $e->getMessage()], 500);
        }
    }

    public function deleteSubject() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = filter_var($input['id'] ?? 0, FILTER_VALIDATE_INT);
        if (!$id) return $this->json(['error' => 'Ungültige ID'], 400);

        try {
            $stmt = $this->db->prepare("DELETE FROM subjects WHERE id = ?");
            $stmt->execute([$id]);
            $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_SUBJECT_DELETED', "Fach gelöscht (ID: $id)");
            return $this->json(['success' => true]);
        } catch (Exception $e) {
            return $this->json(['error' => 'Fehler beim Löschen: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Ruft alle Systemeinstellungen ab (Announcement + Security)
     */
    public function getSettings() {
        $settingRepo = $this->container->get('SettingRepository');
        
        $announcementJson = $settingRepo->get('global_announcement');
        $announcement = $announcementJson ? json_decode($announcementJson, true) : [
            'message' => '',
            'type' => 'info',
            'is_active' => false
        ];

        $securityJson = $settingRepo->get('security_settings');
        $security = $securityJson ? json_decode($securityJson, true) : [
            'max_login_attempts' => 5,
            'session_duration_days' => 30
        ];

        return $this->json([
            'announcement' => $announcement,
            'security' => $security
        ]);
    }

    /**
     * Speichert die Systemeinstellungen
     */
    public function saveSettings() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $settingRepo = $this->container->get('SettingRepository');

        if (isset($input['announcement'])) {
            $a = $input['announcement'];
            $settingRepo->set('global_announcement', json_encode([
                'message' => trim($a['message'] ?? ''),
                'type' => in_array($a['type'] ?? '', ['info', 'warning', 'danger', 'success']) ? $a['type'] : 'info',
                'is_active' => (bool)($a['is_active'] ?? false)
            ]));
        }

        if (isset($input['security'])) {
            $s = $input['security'];
            $settingRepo->set('security_settings', json_encode([
                'max_login_attempts' => max(1, min(20, (int)($s['max_login_attempts'] ?? 5))),
                'session_duration_days' => max(1, min(365, (int)($s['session_duration_days'] ?? 30)))
            ]));
        }

        $this->auditRepo->log($_SESSION['user_id'], 'ADMIN_SYSTEM_SETTINGS_UPDATED', "Systemeinstellungen (Banner/Sicherheit) wurden aktualisiert.");
        return $this->json(['success' => true]);
    }

    /**
     * Generiert einen SQL-Dump der Datenbank via PHP (Fallback, da pg_dump oft fehlt)
     */
    public function downloadBackup() {
        $filename = "backup_" . date('Y-m-d_H-i-s') . ".sql";
        
        try {
            // Tabellen in der richtigen Reihenfolge (wegen Foreign Keys)
            $tables = ['users', 'subjects', 'lessons', 'user_progress', 'audit_logs', 'bookmarks', 'notes', 'settings'];
            $output = "-- Code & Cash Lernplattform - SQL Dump\n";
            $output .= "-- Generiert am: " . date('Y-m-d H:i:s') . "\n";
            $output .= "-- Host: " . (getenv('DB_HOST') ?: 'localhost') . "\n\n";
            $output .= "SET FOREIGN_KEY_CHECKS=0;\n\n"; // Falls MySQL/MariaDB
            
            foreach ($tables as $table) {
                // Prüfen ob Tabelle existiert (Postgres Syntax)
                $check = $this->db->query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$table')");
                if (!$check->fetchColumn()) continue;

                $output .= "-- Table: $table\n";
                $output .= "TRUNCATE TABLE $table CASCADE;\n"; // Leert die Tabelle vor dem Import
                
                $stmt = $this->db->query("SELECT * FROM $table");
                $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                
                if (empty($rows)) {
                    $output .= "-- Keine Daten für $table\n\n";
                    continue;
                }

                foreach ($rows as $row) {
                    $keys = array_keys($row);
                    $values = array_values($row);
                    
                    // Werte für SQL escapen
                    $escapedValues = array_map(function($v) {
                        if ($v === null) return 'NULL';
                        if (is_numeric($v)) return $v;
                        return $this->db->quote($v);
                    }, $values);
                    
                    $output .= "INSERT INTO $table (" . implode(', ', $keys) . ") VALUES (" . implode(', ', $escapedValues) . ");\n";
                }
                $output .= "\n";
            }
            
            $output .= "SET FOREIGN_KEY_CHECKS=1;\n";

            header('Content-Type: application/sql');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            header('Content-Length: ' . strlen($output));
            
            echo $output;
            $this->auditRepo->log($_SESSION['user_id'], 'SYSTEM_BACKUP', "Datenbank-Backup via PHP-Export heruntergeladen ($filename).");
            exit;

        } catch (Exception $e) {
            // Falls ein Fehler auftritt, geben wir ihn als Textdatei aus, statt einer leeren SQL
            header('Content-Type: text/plain');
            echo "Fehler beim Erstellen des Backups:\n" . $e->getMessage();
            exit;
        }
    }
}