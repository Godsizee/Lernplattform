/* modules/MarkdownParser.js */
// DSGVO-konform: Wir importieren die kampferprobten Bibliotheken lokal vom eigenen Server
import { marked } from '../vendor/marked.esm.js';
import DOMPurify from '../vendor/purify.es.js';

// Globale Konfiguration für den Markdown-Parser
marked.use({
    breaks: true, // Zeilenumbrüche wie im Originaltext übernehmen (erfordert kein doppeltes Enter)
    gfm: true     // GitHub Flavored Markdown (für Tabellen, saubere Listen etc.)
});

export class MarkdownParser {
    
    /**
     * Wandelt Markdown sicher in HTML um.
     * @param {string} markdown - Der rohe Markdown-Text
     * @returns {string} - Das sichere, bereinigte HTML
     */
    parse(markdown) {
        if (!markdown) return '';

        // 1. Markdown in rohes HTML umwandeln
        // Hinweis: marked.parse() parst synchron, wenn keine asynchronen Erweiterungen genutzt werden
        const rawHtml = marked.parse(markdown);

        // 2. XSS-Schutz: Das generierte HTML strikt bereinigen
        const safeHtml = DOMPurify.sanitize(rawHtml, {
            // Wir erlauben das 'class' Attribut ausdrücklich, damit die Code-Blöcke 
            // ihre <code class="language-xyz"> Formatierung für das CSS behalten.
            // 'target' erlauben wir für eventuelle Links.
            ADD_ATTR: ['target', 'class'] 
        });

        return safeHtml;
    }
}