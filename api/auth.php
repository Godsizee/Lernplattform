<?php
require_once __DIR__ . '/init.php';

$action = $_GET['action'] ?? null;
$input = getJsonInput();

try {
    switch ($action) {
        case 'register':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
            
            $name = trim(htmlspecialchars($input['name'] ?? '', ENT_QUOTES, 'UTF-8'));
            $email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
            $password = $input['password'] ?? '';

            if (!$name || !$email) {
                sendJson(['error' => 'Bitte alle Felder korrekt ausfüllen.'], 400);
            }

            if (strlen($password) < 8 || !preg_match('/[0-9]/', $password) || !preg_match('/[^a-zA-Z0-9]/', $password)) {
                sendJson(['error' => 'Das Passwort muss mindestens 8 Zeichen lang sein, eine Zahl und ein Sonderzeichen enthalten.'], 400);
            }

            if ($userRepo->findByEmail($email)) {
                sendJson(['error' => 'Diese E-Mail-Adresse wird bereits verwendet.'], 409);
            }

            $hash = password_hash($password, PASSWORD_BCRYPT);
            $userId = $userRepo->create($name, $email, $hash);
            
            $_SESSION['user_id'] = $userId;
            $_SESSION['user_name'] = $name;
            $_SESSION['user_role'] = 'student';

            sendJson([
                'success' => true, 
                'user' => ['id' => $userId, 'name' => $name, 'role' => 'student']
            ]);
            break;

        case 'login':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
            
            if (!isset($_SESSION['login_attempts'])) $_SESSION['login_attempts'] = 0;
            if (isset($_SESSION['last_login_attempt']) && $_SESSION['login_attempts'] >= 5) {
                if (time() - $_SESSION['last_login_attempt'] < 300) {
                    sendJson(['error' => 'Zu viele Login-Versuche. Bitte warte 5 Minuten.'], 429);
                } else {
                    $_SESSION['login_attempts'] = 0;
                }
            }

            $login = trim($input['email'] ?? '');
            $password = $input['password'] ?? '';

            if (!$login || !$password) {
                sendJson(['error' => 'Bitte Benutzername/E-Mail und Passwort eingeben.'], 400);
            }

            $user = $userRepo->findByLogin($login);

            if ($user && password_verify($password, $user['password_hash'])) {
                $_SESSION['login_attempts'] = 0;
                session_regenerate_id(true);
                
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_role'] = $user['role'];
                $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

                sendJson([
                    'success' => true, 
                    'user' => ['id' => $user['id'], 'name' => $user['name'], 'role' => $user['role']],
                    'csrf_token' => $_SESSION['csrf_token']
                ]);
            } else {
                $_SESSION['login_attempts']++;
                $_SESSION['last_login_attempt'] = time();
                sendJson(['error' => 'Falscher Benutzername/E-Mail oder Passwort.'], 401);
            }
            break;

        case 'logout':
            session_destroy();
            sendJson(['success' => true, 'message' => 'Erfolgreich ausgeloggt.']);
            break;

        case 'me':
            if (isset($_SESSION['user_id'])) {
                sendJson([
                    'authenticated' => true, 
                    'user' => [
                        'id' => $_SESSION['user_id'],
                        'name' => $_SESSION['user_name'],
                        'role' => $_SESSION['user_role']
                    ],
                    'csrf_token' => $_SESSION['csrf_token'] ?? ''
                ]);
            } else {
                sendJson(['authenticated' => false], 401);
            }
            break;

        default:
            sendJson(['error' => 'Ungültige Aktion.'], 400);
    }
} catch (Exception $e) {
    error_log("Auth Error: " . $e->getMessage());
    sendJson(['error' => 'Interner Serverfehler.'], 500);
}
