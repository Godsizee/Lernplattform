<?php
require_once __DIR__ . '/../includes/header.php';
?>

<div class="auth-wrapper fade-in">
    <div class="auth-card">
        <div class="auth-header">
            <img src="<?= BASE_URL ?>/assets/img/logo.png" alt="Code & Cash Logo" class="auth-logo-img">
            <p id="auth-subtitle">Willkommen zurück!</p>
        </div>
        
        <div class="auth-tabs">
            <button class="auth-tab active" onclick="window.location.href='<?= BASE_URL ?>/login'">Login</button>
            <button class="auth-tab" onclick="window.location.href='<?= BASE_URL ?>/register'">Registrieren</button>
        </div>

        <div class="auth-forms">
            <!-- Login Form -->
            <form id="login-form" class="auth-form active">
                <div class="form-group">
                    <label>Benutzername oder E-Mail</label>
                    <input type="text" id="login-email" required placeholder="maxmuster / name@beispiel.de" class="form-control">
                </div>
                <div class="form-group">
                    <label>Passwort</label>
                    <input type="password" id="login-password" required placeholder="••••••••" class="form-control">
                </div>
                <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; flex-direction: row;">
                    <input type="checkbox" id="login-remember" style="width: auto; margin: 0;">
                    <label for="login-remember" style="margin: 0; cursor: pointer;">Angemeldet bleiben (30 Tage)</label>
                </div>
                <div class="form-error" id="login-error"></div>
                <button type="submit" class="btn btn-primary full-width">Einloggen <i class="ph-bold ph-arrow-right"></i></button>
            </form>
        </div>
        
        <div style="text-align: center; margin-top: 1.5rem;">
            <a href="<?= BASE_URL ?>/datenschutz" class="nav-item" style="font-size: 0.85rem; color: var(--text-secondary); text-decoration: underline;">Datenschutzerklärung</a>
        </div>
    </div>
</div>

<?php
$pageScript = 'auth'; 
require_once __DIR__ . '/../includes/footer.php';
?>