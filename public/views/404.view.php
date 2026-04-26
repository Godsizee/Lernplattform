<?php
// 404 kann auch ohne Session aufgerufen werden – minimales Bootstrap
if (!defined('BASE_URL')) define('BASE_URL', '');
if (session_status() === PHP_SESSION_NONE) session_start();

$isLoggedIn = isset($_SESSION['user_id']);
$backUrl = $isLoggedIn ? BASE_URL . '/' : BASE_URL . '/login';
$backLabel = $isLoggedIn ? 'Zurück zum Dashboard' : 'Zurück zum Login';
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 – Seite nicht gefunden | Code & Cash</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Oswald:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <link rel="stylesheet" href="<?= BASE_URL ?>/assets/css/style.css">
    <script>
        const savedTheme = localStorage.getItem('lern_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'light') document.documentElement.classList.add('light-mode');
        window.BASE_URL = '<?= BASE_URL ?>';
    </script>
    <style>
        .error-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
        }

        .error-container {
            max-width: 560px;
            width: 100%;
        }

        .error-code {
            font-family: 'Oswald', sans-serif;
            font-size: clamp(6rem, 20vw, 10rem);
            font-weight: 700;
            line-height: 1;
            background: linear-gradient(135deg, var(--color-primary, #6366f1), #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.25rem;
            user-select: none;
            animation: glitch 4s infinite;
        }

        @keyframes glitch {
            0%, 90%, 100% { transform: translate(0); filter: none; }
            92%            { transform: translate(-3px, 1px); filter: hue-rotate(30deg); }
            94%            { transform: translate(3px, -1px); filter: hue-rotate(-30deg); }
            96%            { transform: translate(-2px, 2px); filter: none; }
        }

        .error-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            display: block;
            animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-12px); }
        }

        .error-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary, #f1f5f9);
            margin-bottom: 0.75rem;
        }

        .error-message {
            color: var(--text-secondary, #94a3b8);
            line-height: 1.7;
            margin-bottom: 2.5rem;
            font-size: 0.975rem;
        }

        .error-message strong {
            color: var(--text-primary, #f1f5f9);
        }

        .error-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn-error-back {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.75rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.925rem;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            background: linear-gradient(135deg, var(--color-primary, #6366f1), #a855f7);
            color: #fff;
            border: none;
            cursor: pointer;
        }

        .btn-error-back:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        }

        .btn-error-secondary {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.75rem;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.925rem;
            text-decoration: none;
            color: var(--text-secondary, #94a3b8);
            border: 1px solid var(--border-color, rgba(255,255,255,0.1));
            background: transparent;
            transition: color 0.2s, border-color 0.2s, transform 0.2s;
            cursor: pointer;
        }

        .btn-error-secondary:hover {
            color: var(--text-primary, #f1f5f9);
            border-color: var(--color-primary, #6366f1);
            transform: translateY(-2px);
        }

        .error-hint {
            margin-top: 3rem;
            padding: 1rem 1.5rem;
            background: rgba(99, 102, 241, 0.08);
            border: 1px solid rgba(99, 102, 241, 0.2);
            border-radius: 10px;
            font-size: 0.85rem;
            color: var(--text-secondary, #94a3b8);
        }

        .error-hint code {
            font-family: monospace;
            color: #a855f7;
            background: rgba(168, 85, 247, 0.1);
            padding: 0.1em 0.4em;
            border-radius: 4px;
        }
    </style>
</head>
<body data-theme="dark">
    <div class="error-page">
        <div class="error-container">

            <span class="error-icon">🗺️</span>
            <div class="error-code">404</div>

            <h1 class="error-title">Diese Seite hat wohl das Studium abgebrochen.</h1>

            <p class="error-message">
                Die URL <strong><?= htmlspecialchars(parse_url($_SERVER['REQUEST_URI'] ?? '404', PHP_URL_PATH)) ?></strong>
                existiert nicht – vermutlich schon beim ersten Semester durchgefallen.<br>
                Kein Stress, passiert den Besten. Einfach zurück und weitermachen.
            </p>

            <div class="error-actions">
                <a href="<?= htmlspecialchars($backUrl) ?>" class="btn-error-back">
                    <i class="ph ph-arrow-left"></i>
                    <?= htmlspecialchars($backLabel) ?>
                </a>
                <button class="btn-error-secondary" onclick="history.back()">
                    <i class="ph ph-arrow-counter-clockwise"></i>
                    Zurück gehen
                </button>
            </div>

            <div class="error-hint">
                <i class="ph ph-lightbulb"></i>
                Tipp: Gültige Routen sind z. B. <code>/</code>, <code>/learning</code>, <code>/profile</code> oder <code>/datenschutz</code>.
            </div>

        </div>
    </div>
</body>
</html>
