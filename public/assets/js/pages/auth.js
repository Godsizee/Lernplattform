/* pages/auth.js */
import { Auth } from '../modules/Auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialisiert das Auth-Modul, welches automatisch die Event-Listener 
    // für Login- und Registrierungsformulare bindet.
    new Auth();
});
