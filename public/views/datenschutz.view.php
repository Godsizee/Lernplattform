<?php
require_once __DIR__ . '/../includes/header.php';
?>

<div class="view fade-in">
    <header class="view-header">
        <h1>Datenschutzerklärung</h1>
        <p>Informationen zum Umgang mit deinen Daten.</p>
    </header>
    
    <div class="content-card" style="max-width: 800px; line-height: 1.6;">
        <h2>1. Verantwortlicher</h2>
        <p>Verantwortlich für den Betrieb dieser Webseite ist:<br>
        Sebastian Bade<br>
        Friedrich-Dürr-Str. 12, 68307 Mannheim<br>
        eztokk@gmail.com</p>

        <h2 style="margin-top: 1.5rem;">2. Erhebung und Speicherung von Daten</h2>
        <h3 style="margin-top: 1rem;">a) Server-Logfiles</h3>
        <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die dein Browser automatisch übermittelt. Dies sind: Browsertyp/-version, Betriebssystem, Referrer URL, Uhrzeit der Serveranfrage und IP-Adresse. Diese Daten sind technisch erforderlich und werden nicht mit anderen Datenquellen zusammengeführt.</p>
        
        <h3 style="margin-top: 1rem;">b) Benutzerkonten & Lernfortschritt</h3>
        <p>Auf dieser Plattform legst du ein Nutzerkonto an, um deinen Lernfortschritt zu speichern. Dabei speichern wir deinen Namen, deine E-Mail-Adresse und ein verschlüsseltes Passwort. Wir verarbeiten diese Daten ausschließlich, um dir den Zugang zur Plattform zu ermöglichen und deinen individuellen Lern- und Quizfortschritt in unserer Datenbank zu sichern.</p>

        <h2 style="margin-top: 1.5rem;">3. Lokale Speicherung (LocalStorage) & Funktionale Cookies</h2>
        <p>Diese Webseite verwendet <strong>keine Tracking-Cookies</strong> (wie z.B. Google Analytics). Für die Funktionalität nutzen wir LocalStorage in deinem Browser. Dort speichern wir ausschließlich technisch notwendige Informationen:</p>
        <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
            <li>Deine visuellen Einstellungen (z.B. Dark Mode).</li>
        </ul>
        <p><em>Hinweis zur Login-Funktion:</em> Wenn Sie beim Login die Funktion „Angemeldet bleiben“ aktivieren, wird ein funktionaler Cookie (<code>lern_remember</code>) in Ihrem Browser gespeichert. Dieser enthält ein verschlüsseltes Token, um Sie bei zukünftigen Besuchen automatisch einzuloggen. Dieser Cookie verfällt nach 30 Tagen oder wenn Sie sich ausloggen. Es findet kein websiteübergreifendes Tracking statt.</p>

        <h2 style="margin-top: 1.5rem;">4. Deine Rechte</h2>
        <p>Du hast jederzeit das Recht auf unentgeltliche Auskunft über deine gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten. Du kannst deine kompletten Daten in den Profileinstellungen herunterladen (JSON-Export) oder dein Konto dort jederzeit unwiderruflich löschen.</p>
        
        <div style="margin-top: 2rem;">
            <?php if(isset($_SESSION['user_id'])): ?>
                <button class="btn btn-primary" onclick="window.location.href='<?= BASE_URL ?>/'">Zurück zum Dashboard</button>
            <?php else: ?>
                <button class="btn btn-primary" onclick="window.location.href='<?= BASE_URL ?>/login'">Zurück zum Login</button>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php
require_once __DIR__ . '/../includes/footer.php';
?>