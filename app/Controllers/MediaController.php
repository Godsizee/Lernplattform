<?php
namespace App\Controllers;

use App\Core\Controller;
use Exception;

class MediaController extends Controller {
    
    public function __construct($container) {
        parent::__construct($container);
        $this->requireAuth();
    }

    /**
     * Verarbeitet den Bilder-Upload
     */
    public function upload() {
        if (!isset($_FILES['image'])) {
            return $this->json(['error' => 'Keine Datei empfangen.'], 400);
        }

        $file = $_FILES['image'];
        
        // PHP Upload Fehler prüfen
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return $this->json(['error' => 'Upload-Fehler: ' . $this->getUploadErrorMessage($file['error'])], 500);
        }

        // Dateityp prüfen (MIME-Type)
        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedMimes)) {
            return $this->json(['error' => 'Ungültiger Dateityp. Nur JPG, PNG, GIF und WEBP sind erlaubt.'], 400);
        }

        // Dateigröße prüfen (max 5MB)
        $maxSize = 5 * 1024 * 1024;
        if ($file['size'] > $maxSize) {
            return $this->json(['error' => 'Datei ist zu groß (max. 5MB).'], 400);
        }

        // Sicherer Dateiname
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        // Falls die Extension nicht zum MIME-Typ passt oder fehlt, setzen wir sie basierend auf dem MIME-Typ
        if (empty($extension)) {
            $extension = explode('/', $mimeType)[1];
        }
        
        $filename = bin2hex(random_bytes(16)) . '.' . strtolower($extension);
        $uploadDir = __DIR__ . '/../../public/uploads/images/';
        $targetPath = $uploadDir . $filename;

        // Verzeichnis erstellen, falls es nicht existiert (Sicherheitshalber)
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            // URL generieren
            $baseUrl = rtrim(BASE_URL, '/');
            $url = $baseUrl . '/uploads/images/' . $filename;
            
            return $this->json([
                'success' => true,
                'url' => $url,
                'name' => $file['name']
            ]);
        } else {
            return $this->json(['error' => 'Datei konnte nicht gespeichert werden.'], 500);
        }
    }

    private function getUploadErrorMessage($errorCode) {
        switch ($errorCode) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                return 'Die Datei ist zu groß für den Server. Bitte verwende ein kleineres Bild (max. 5MB).';
            case UPLOAD_ERR_PARTIAL:
                return 'Der Upload wurde unterbrochen. Bitte versuche es noch einmal.';
            case UPLOAD_ERR_NO_FILE:
                return 'Es wurde keine Datei ausgewählt.';
            case UPLOAD_ERR_NO_TMP_DIR:
            case UPLOAD_ERR_CANT_WRITE:
                return 'Ein Serverfehler ist aufgetreten (Schreibfehler). Bitte wende dich an den Support.';
            case UPLOAD_ERR_EXTENSION:
                return 'Der Upload wurde aus Sicherheitsgründen vom Server blockiert.';
            default:
                return 'Ein unbekannter Fehler ist beim Hochladen aufgetreten.';
        }
    }
}
