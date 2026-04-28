<?php
namespace App\Controllers;

use App\Core\Controller;

class PageController extends Controller {
    /**
     * Dashboard / Startseite
     */
    public function dashboard() {
        $this->requireAuth();
        return $this->render('dashboard', [
            'title' => 'Dashboard - Lernplattform'
        ]);
    }

    /**
     * Login Seite
     */
    public function login() {
        if (isset($_SESSION['user_id'])) {
            header('Location: ' . BASE_URL . '/');
            exit;
        }
        return $this->render('login', [
            'title' => 'Login - Lernplattform'
        ]);
    }

    /**
     * Registrierung Seite
     */
    public function register() {
        if (isset($_SESSION['user_id'])) {
            header('Location: ' . BASE_URL . '/');
            exit;
        }
        return $this->render('register', [
            'title' => 'Registrierung - Lernplattform'
        ]);
    }

    /**
     * Lern-Bereich
     */
    public function learning() {
        $this->requireAuth();
        return $this->render('learning', [
            'title' => 'Lernen - Lernplattform'
        ]);
    }

    /**
     * Profil Seite
     */
    public function profile() {
        $this->requireAuth();
        return $this->render('profile', [
            'title' => 'Mein Profil - Lernplattform'
        ]);
    }

    /**
     * Admin Panel
     */
    public function admin() {
        $this->requireAdmin();
        return $this->render('admin', [
            'title' => 'Admin Panel - Lernplattform'
        ]);
    }

    /**
     * Editor
     */
    public function editor() {
        $this->requireAuth();
        return $this->render('editor', [
            'title' => 'Beitrag erstellen - Lernplattform'
        ]);
    }

    /**
     * Datenschutz
     */
    public function datenschutz() {
        return $this->render('datenschutz', [
            'title' => 'Datenschutz - Lernplattform'
        ]);
    }
}
