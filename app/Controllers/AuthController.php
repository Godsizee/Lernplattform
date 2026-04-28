<?php
namespace App\Controllers;

use App\Core\Controller;
use Exception;

class AuthController extends Controller {
    private $userRepo;
    private $auditRepo;

    public function __construct($container) {
        parent::__construct($container);
        $this->userRepo = $container->get('UserRepository');
        $this->auditRepo = $container->get('AuditLogRepository');
    }

    /**
     * Login via API
     */
    public function login() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        if (!isset($_SESSION['login_attempts'])) $_SESSION['login_attempts'] = 0;
        if (isset($_SESSION['last_login_attempt']) && $_SESSION['login_attempts'] >= 5) {
            if (time() - $_SESSION['last_login_attempt'] < 300) {
                return $this->json(['error' => 'Zu viele Login-Versuche. Bitte warte 5 Minuten.'], 429);
            } else {
                $_SESSION['login_attempts'] = 0;
            }
        }

        $login = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';
        $remember = $input['remember'] ?? false;

        if (!$login || !$password) {
            return $this->json(['error' => 'Bitte Benutzername/E-Mail und Passwort eingeben.'], 400);
        }

        $user = $this->userRepo->findByLogin($login);

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['login_attempts'] = 0;
            session_regenerate_id(true);
            
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

            if ($remember) {
                $token = bin2hex(random_bytes(32));
                $hashedToken = hash('sha256', $token);
                $this->userRepo->setRememberToken($user['id'], $hashedToken);
                
                $secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
                setcookie('lern_remember', $token, [
                    'expires' => time() + (86400 * 30),
                    'path' => '/',
                    'secure' => $secure,
                    'httponly' => true,
                    'samesite' => 'Strict'
                ]);
            }

            $this->auditRepo->log($user['id'], 'LOGIN', "Hat sich erfolgreich eingeloggt.");

            return $this->json([
                'success' => true, 
                'user' => ['id' => $user['id'], 'name' => $user['name'], 'role' => $user['role']]
            ]);
        } else {
            $_SESSION['login_attempts']++;
            $_SESSION['last_login_attempt'] = time();
            
            if ($user) {
                $this->auditRepo->log($user['id'], 'LOGIN_FAILED', "Fehlgeschlagener Login-Versuch (falsches Passwort).");
            }
            
            return $this->json(['error' => 'Falscher Benutzername/E-Mail oder Passwort.'], 401);
        }
    }

    /**
     * Registrierung via API
     */
    public function register() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $name = trim(htmlspecialchars($input['name'] ?? '', ENT_QUOTES, 'UTF-8'));
        $email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $password = $input['password'] ?? '';

        if (!$name || !$email) {
            return $this->json(['error' => 'Bitte alle Felder korrekt ausfüllen.'], 400);
        }

        if (strlen($password) < 8 || !preg_match('/[0-9]/', $password) || !preg_match('/[^a-zA-Z0-9]/', $password)) {
            return $this->json(['error' => 'Passwort zu schwach.'], 400);
        }

        if ($this->userRepo->findByEmail($email)) {
            return $this->json(['error' => 'Diese E-Mail-Adresse wird bereits verwendet.'], 409);
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $userId = $this->userRepo->create($name, $email, $hash);
        
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_role'] = 'student';
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

        $this->auditRepo->log($userId, 'REGISTER', "Hat sich neu auf der Plattform registriert.");

        return $this->json([
            'success' => true, 
            'user' => ['id' => $userId, 'name' => $name, 'role' => 'student']
        ]);
    }

    /**
     * Logout
     */
    public function logout() {
        if (isset($_SESSION['user_id'])) {
            $this->auditRepo->log($_SESSION['user_id'], 'LOGOUT', "Hat sich ausgeloggt.");
            $this->userRepo->setRememberToken($_SESSION['user_id'], null);
        }
        
        setcookie('lern_remember', '', time() - 3600, '/');
        session_destroy();
        
        return $this->json(['success' => true, 'message' => 'Erfolgreich ausgeloggt.']);
    }
}
