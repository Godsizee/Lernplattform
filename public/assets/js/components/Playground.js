/* components/Playground.js */

/**
 * Playground — Interaktiver HTML/CSS/JS-Editor.
 *
 * Kapselt die gesamte Logik für einen einzelnen Playground-Block in einer
 * Lektion. Wird von Learning.js auf jedes `.code-playground-mount`-Element
 * angewendet.
 *
 * Sicherheit: Der Iframe läuft mit `sandbox="allow-scripts"` — kein Zugriff
 * auf die Parent-Page, kein LocalStorage, keine Cookies.
 */
export class Playground {
    /**
     * @param {HTMLElement} mountEl - Das Mount-Element mit den data-* Attributen.
     */
    constructor(mountEl) {
        this.mount   = mountEl;
        this.activeTab = 'html';
        this.debounceTimer = null;

        // Initialen Code aus den (URL-codierten) data-Attributen lesen
        this.code = {
            html: this._decode(mountEl.dataset.html || ''),
            css:  this._decode(mountEl.dataset.css  || ''),
            js:   this._decode(mountEl.dataset.js   || ''),
        };

        this._render();
        this._bindEvents();
        this._updatePreview(); // Initial render
    }

    // ─── Private: Hilfsmethoden ────────────────────────────────────────────

    _decode(str) {
        try { return decodeURIComponent(str); } catch { return str; }
    }

    // ─── Private: DOM aufbauen ─────────────────────────────────────────────

    _render() {
        const root = document.createElement('div');
        root.className = 'code-playground';
        root.setAttribute('role', 'region');
        root.setAttribute('aria-label', 'Interaktiver Code-Playground');

        root.innerHTML = `
            <div class="playground-header">
                <div class="playground-tabs" role="tablist">
                    <button class="playground-tab active" data-lang="html" role="tab" aria-selected="true">HTML</button>
                    <button class="playground-tab"        data-lang="css"  role="tab" aria-selected="false">CSS</button>
                    <button class="playground-tab"        data-lang="js"   role="tab" aria-selected="false">JS</button>
                </div>
                <div class="playground-actions">
                    <span class="playground-label">
                        <i class="ph ph-code-block"></i> Live Playground
                    </span>
                    <button class="playground-btn run-btn" title="Vorschau aktualisieren (Strg+Enter)">
                        <i class="ph ph-play"></i> Run
                    </button>
                </div>
            </div>

            <div class="playground-body">
                <div class="playground-editor-pane">
                    <textarea class="playground-textarea" spellcheck="false"
                        aria-label="Code-Editor: HTML"
                        autocomplete="off" autocorrect="off" autocapitalize="off"
                    >${this._escapeForTextarea(this.code.html)}</textarea>
                </div>
                <div class="playground-preview-pane">
                    <span class="playground-preview-label">Vorschau</span>
                    <iframe class="playground-iframe"
                        sandbox="allow-scripts"
                        title="Live-Vorschau des Code-Playgrounds"
                    ></iframe>
                </div>
            </div>

            <div class="playground-footer">
                <span class="playground-status ok" id="pg-status-${this._id()}">Bereit</span>
                <span>Änderungen werden automatisch übernommen</span>
            </div>
        `;

        // Referenzen sichern
        this.tabBtns    = root.querySelectorAll('.playground-tab');
        this.textarea   = root.querySelector('.playground-textarea');
        this.iframe     = root.querySelector('.playground-iframe');
        this.runBtn     = root.querySelector('.run-btn');
        this.statusEl   = root.querySelector('[id^="pg-status-"]');

        // Mount-Element ersetzen
        this.mount.replaceWith(root);
        this.root = root;
    }

    _escapeForTextarea(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    _id() {
        return Math.random().toString(36).slice(2, 7);
    }

    // ─── Private: Tab-Wechsel ──────────────────────────────────────────────

    _switchTab(lang) {
        // Aktuellen Stand speichern
        this.code[this.activeTab] = this.textarea.value;

        this.activeTab = lang;

        // Tab-Buttons aktualisieren
        this.tabBtns.forEach(btn => {
            const isActive = btn.dataset.lang === lang;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Textarea-Inhalt und Label tauschen
        this.textarea.value = this.code[lang];
        this.textarea.setAttribute('aria-label', `Code-Editor: ${lang.toUpperCase()}`);
        this.textarea.focus();
    }

    // ─── Private: Preview aktualisieren ───────────────────────────────────

    _updatePreview(immediate = false) {
        // Aktuellen Tab-Inhalt sichern
        this.code[this.activeTab] = this.textarea.value;

        const run = () => {
            this._setStatus('running', 'Wird ausgeführt…');

            const doc = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
/* Playground Reset */
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }
${this.code.css}
</style>
</head>
<body>
${this.code.html}
<script>
// Fehlerbehandlung: Fehler im Iframe nicht an die Hauptseite weitergeben
window.onerror = function(msg, src, line, col, err) {
    document.body.insertAdjacentHTML('beforeend',
        '<div style="position:fixed;bottom:0;left:0;right:0;background:#fee2e2;color:#991b1b;padding:0.5rem 1rem;font-family:monospace;font-size:0.8rem;z-index:9999;">'
        + '\u26a0\ufe0f ' + msg + ' (Zeile ' + line + ')'
        + '</div>'
    );
    return true;
};
${this.code.js}
<\/script>
</body>
</html>`;

            this.iframe.srcdoc = doc;

            // Status nach kurzer Verzögerung zurücksetzen
            setTimeout(() => this._setStatus('ok', 'Bereit'), 400);
        };

        if (immediate) {
            run();
        } else {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(run, 350);
        }
    }

    _setStatus(state, text) {
        if (!this.statusEl) return;
        this.statusEl.className = `playground-status ${state}`;
        this.statusEl.textContent = text;
    }

    // ─── Private: Events ───────────────────────────────────────────────────

    _bindEvents() {
        // Tab-Klicks
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this._switchTab(btn.dataset.lang));
        });

        // Live-Update beim Tippen
        this.textarea.addEventListener('input', () => this._updatePreview());

        // Run-Button: Sofortiges Update
        this.runBtn.addEventListener('click', () => this._updatePreview(true));

        // Tastaturkürzel: Strg+Enter / Cmd+Enter → Run
        this.textarea.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this._updatePreview(true);
            }

            // Tab-Taste: Einrückung einfügen statt Fokus wechseln
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.textarea.selectionStart;
                const end = this.textarea.selectionEnd;
                this.textarea.value =
                    this.textarea.value.substring(0, start) + '  ' +
                    this.textarea.value.substring(end);
                this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
            }
        });
    }
}
