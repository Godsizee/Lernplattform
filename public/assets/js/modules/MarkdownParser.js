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
     * Erkennt und transformiert eigene :::playground Blöcke BEVOR marked läuft.
     *
     * @param {string} markdown - Der rohe Markdown-Text
     * @returns {string} - Das sichere, bereinigte HTML
     */
    parse(markdown) {
        if (!markdown) return '';

        // 1. Playground-Blöcke vor dem Markdown-Parsing herausziehen
        const preprocessed = this._preprocessPlaygrounds(markdown);

        // 2. Restliches Markdown in rohes HTML umwandeln
        const rawHtml = marked.parse(preprocessed);

        // 3. XSS-Schutz: Das generierte HTML strikt bereinigen
        //    data-html/css/js werden explizit erlaubt, damit der Playground
        //    seine Code-Inhalte als Attribute behalten kann.
        const safeHtml = DOMPurify.sanitize(rawHtml, {
            ADD_ATTR: ['target', 'class', 'data-html', 'data-css', 'data-js'],
            // Sandbox-Iframe darf DOMPurify nicht entfernen
            ADD_TAGS: ['div'],
        });

        return safeHtml;
    }

    /**
     * Transformiert :::playground Blöcke in Mount-Divs.
     *
     * Syntax im Markdown-Editor:
     * :::playground
     * ---html
     * <h1>Hallo</h1>
     * ---css
     * h1 { color: coral; }
     * ---js
     * console.log('Hi!');
     * :::
     *
     * @param {string} markdown
     * @returns {string}
     */
    _preprocessPlaygrounds(markdown) {
        // Regex: Alles zwischen :::playground\n und ::: (inkl. Zeilenumbrüche)
        return markdown.replace(/:::playground\n([\s\S]*?):::/g, (match, content) => {
            const html = this._extractSection(content, 'html');
            const css  = this._extractSection(content, 'css');
            const js   = this._extractSection(content, 'js');

            // Code URL-codieren, um Anführungszeichen und Sonderzeichen
            // sicher als HTML-Attributwerte zu speichern
            const encodedHtml = encodeURIComponent(html);
            const encodedCss  = encodeURIComponent(css);
            const encodedJs   = encodeURIComponent(js);

            // Das Mount-Div — wird von Playground.js übernommen und ersetzt
            return `<div class="code-playground-mount" data-html="${encodedHtml}" data-css="${encodedCss}" data-js="${encodedJs}"></div>`;
        });
    }

    /**
     * Extrahiert den Inhalt eines ---lang Abschnitts aus dem Playground-Block.
     *
     * @param {string} content - Der gesamte Inhalt zwischen :::playground und :::
     * @param {string} lang    - 'html', 'css' oder 'js'
     * @returns {string}       - Der extrahierte Code-Block (getrimmt)
     */
    _extractSection(content, lang) {
        // Matcht ---html (oder ---css / ---js) bis zum nächsten --- oder Ende
        const regex = new RegExp(`---${lang}\\n([\\s\\S]*?)(?=---|$)`);
        const match = content.match(regex);
        return match ? match[1].trim() : '';
    }
}