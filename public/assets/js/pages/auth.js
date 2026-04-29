/* pages/auth.js */
import { Auth } from '../modules/Auth.js';

export default async function init() {
    // Initialisiert das Auth-Modul, welches automatisch die Event-Listener 
    // für Login- und Registrierungsformulare bindet.
    new Auth();
}
