<?php
require_once __DIR__ . '/../includes/header.php';
?>



<div class="auth-wrapper fade-in">
    <div class="auth-card">
        <div class="auth-header">
            <img src="<?= BASE_URL ?>/assets/img/logo.png" alt="Code & Cash Logo" class="auth-logo-img">
            <p id="auth-subtitle">Erstelle deinen Account!</p>
        </div>
        
        <div class="auth-tabs">
            <button class="auth-tab" onclick="window.location.href='<?= BASE_URL ?>/login'">Login</button>
            <button class="auth-tab active" onclick="window.location.href='<?= BASE_URL ?>/register'">Registrieren</button>
        </div>

        <div class="auth-forms">
            <form id="register-form" class="auth-form active">
                <div class="form-group">
                    <label>Voller Name</label>
                    <input type="text" id="register-name" required placeholder="Dein Name" class="form-control">
                </div>
                <div class="form-group">
                    <label>E-Mail Adresse</label>
                    <input type="email" id="register-email" required placeholder="name@beispiel.de" class="form-control">
                </div>
                <div class="form-group">
                    <label>Passwort (min. 8 Zeichen, inkl. Zahl & Sonderzeichen)</label>
                    <input type="password" id="register-password" required minlength="8" placeholder="••••••••" class="form-control">
                </div>
                <div class="form-error" id="register-error"></div>
                <button type="submit" class="btn btn-success full-width">Account erstellen <i class="ph-bold ph-check"></i></button>
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