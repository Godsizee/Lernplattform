<?php
namespace App\Core;

use PDO;
use PDOException;

class Database {
    private static ?Database $instance = null;
    private PDO $connection;

    private function __construct() {
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: 5433;
        $db   = getenv('DB_NAME') ?: 'code_and_cash';
        $user = getenv('DB_USER') ?: 'lern_user';
        $pass = getenv('DB_PASS') ?: '';

        $dsn = "pgsql:host=$host;port=$port;dbname=$db";
        
        // Best Practices: Exceptions werfen, assoziative Arrays zurückgeben, emulierte Prepares deaktivieren (für echte Prepared Statements)
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $this->connection = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            // Stack Trace verbergen, nur allgemeine Fehlermeldung loggen
            error_log("Database Connection Error: " . $e->getMessage());
            die(json_encode(['error' => 'Datenbankverbindung fehlgeschlagen.']));
        }
    }

    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection(): PDO {
        return $this->connection;
    }

    // Singleton-Schutz vor Klonen und Deserialisierung
    private function __clone() {}
    public function __wakeup() {
        throw new \Exception("Cannot unserialize a singleton.");
    }
}
