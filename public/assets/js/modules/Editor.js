import { MarkdownParser } from './MarkdownParser.js';
import { ApiService } from '../services/ApiService.js';
import { Toast } from '../helpers/Toast.js';

export class Editor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.parser = new MarkdownParser();
        this.textarea = null;
        this.preview = null;
        this.onChangeCallback = null;
    }

    render(initialValue = '') {
        if (!this.container) return;

        this.container.innerHTML = '';
        this.container.classList.add('wiki-editor');

        const toolbar = this.buildToolbar();
        this.container.appendChild(toolbar);

        const editorBody = document.createElement('div');
        editorBody.className = 'editor-body';

        const writePane = document.createElement('div');
        writePane.className = 'editor-pane editor-write active';

        this.textarea = document.createElement('textarea');
        this.textarea.className = 'editor-textarea';
        this.textarea.placeholder = 'Schreibe deinen Beitrag hier...\n\nNutze die Toolbar oben zum Formatieren.';
        this.textarea.value = initialValue;
        this.textarea.spellcheck = true;

        this.textarea.addEventListener('input', () => this.updatePreview());
        this.textarea.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Drag & Drop
        this.textarea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.textarea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.textarea.addEventListener('drop', (e) => this.handleDrop(e));

        writePane.appendChild(this.textarea);

        const previewPane = document.createElement('div');
        previewPane.className = 'editor-pane editor-preview';
        this.preview = document.createElement('div');
        this.preview.className = 'editor-preview-content lesson-body';
        previewPane.appendChild(this.preview);

        editorBody.appendChild(writePane);
        editorBody.appendChild(previewPane);
        this.container.appendChild(editorBody);

        const mobileToggle = document.createElement('div');
        mobileToggle.className = 'editor-mobile-tabs';
        mobileToggle.innerHTML = `
            <button class="editor-mobile-tab active" data-pane="write">
                <i class="ph ph-pencil-simple"></i> Schreiben
            </button>
            <button class="editor-mobile-tab" data-pane="preview">
                <i class="ph ph-eye"></i> Vorschau
            </button>
        `;
        mobileToggle.querySelectorAll('.editor-mobile-tab').forEach(btn => {
            btn.addEventListener('click', () => this.switchMobileTab(btn.dataset.pane, mobileToggle));
        });
        this.container.insertBefore(mobileToggle, editorBody);

        this.updatePreview();
    }

    buildToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'editor-toolbar';
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Text-Formatierung');

        const groups = [
            {
                items: [
                    { icon: 'ph-text-b', title: 'Fett', action: () => this.wrapSelection('**', '**', 'Fetter Text') },
                    { icon: 'ph-text-italic', title: 'Kursiv', action: () => this.wrapSelection('*', '*', 'Kursiver Text') },
                ]
            },
            {
                items: [
                    { icon: 'ph-text-h', title: 'Überschrift', action: () => this.prependLine('## ', 'Überschrift') },
                    { icon: 'ph-text-h', title: 'Unter-Überschrift', action: () => this.prependLine('### ', 'Unter-Überschrift'), small: true },
                ]
            },
            {
                items: [
                    { icon: 'ph-list-bullets', title: 'Aufzählung', action: () => this.prependLine('- ', 'Listenpunkt') },
                    { icon: 'ph-list-numbers', title: 'Nummerierung', action: () => this.prependLine('1. ', 'Listenpunkt') },
                ]
            },
            {
                items: [
                    { icon: 'ph-code', title: 'Code (inline)', action: () => this.wrapSelection('`', '`', 'code') },
                    { icon: 'ph-code-block', title: 'Code-Block', action: () => this.insertCodeBlock() },
                ]
            },
            {
                items: [
                    { icon: 'ph-link', title: 'Link', action: () => this.insertLink() },
                    { icon: 'ph-quotes', title: 'Zitat', action: () => this.prependLine('> ', 'Zitat') },
                    { icon: 'ph-minus', title: 'Trennlinie', action: () => this.insertAtCursor('\n---\n') },
                ]
            },
        ];

        groups.forEach((group, gi) => {
            const groupEl = document.createElement('div');
            groupEl.className = 'toolbar-group';

            group.items.forEach(item => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'toolbar-btn';
                btn.title = item.title;
                btn.setAttribute('aria-label', item.title);
                btn.innerHTML = `<i class="ph ${item.icon}"></i>`;
                if (item.small) btn.classList.add('toolbar-btn-small');
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.action();
                    this.textarea.focus();
                });
                groupEl.appendChild(btn);
            });

            toolbar.appendChild(groupEl);

            if (gi < groups.length - 1) {
                const sep = document.createElement('div');
                sep.className = 'toolbar-separator';
                toolbar.appendChild(sep);
            }
        });

        return toolbar;
    }

    wrapSelection(before, after, placeholder) {
        const ta = this.textarea;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = ta.value.substring(start, end) || placeholder;
        const replacement = before + selected + after;

        ta.setRangeText(replacement, start, end, 'select');
        ta.selectionStart = start + before.length;
        ta.selectionEnd = start + before.length + selected.length;
        this.updatePreview();
    }

    prependLine(prefix, placeholder) {
        const ta = this.textarea;
        const start = ta.selectionStart;
        const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
        const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd) || placeholder;

        const before = ta.value.substring(0, lineStart);
        const currentLine = ta.value.substring(lineStart, ta.selectionEnd);
        const after = ta.value.substring(ta.selectionEnd);

        if (currentLine.startsWith(prefix)) {
            ta.value = before + currentLine.substring(prefix.length) + after;
        } else {
            const needsNewline = lineStart > 0 && ta.value[lineStart - 1] !== '\n' ? '\n' : '';
            ta.value = before + needsNewline + prefix + (currentLine || selected) + after;
        }

        this.updatePreview();
    }

    insertCodeBlock() {
        const ta = this.textarea;
        const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd) || 'Dein Code hier';
        const block = '\n```\n' + selected + '\n```\n';
        ta.setRangeText(block, ta.selectionStart, ta.selectionEnd, 'end');
        this.updatePreview();
    }

    insertLink() {
        const ta = this.textarea;
        const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd);
        const text = selected || 'Linktext';
        const replacement = `[${text}](https://)`;
        ta.setRangeText(replacement, ta.selectionStart, ta.selectionEnd, 'end');
        this.updatePreview();
    }

    insertAtCursor(text) {
        const ta = this.textarea;
        ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
        this.updatePreview();
    }

    handleKeyboard(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            this.insertAtCursor('    ');
        }
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'b') { e.preventDefault(); this.wrapSelection('**', '**', 'Fetter Text'); }
            if (e.key === 'i') { e.preventDefault(); this.wrapSelection('*', '*', 'Kursiver Text'); }
        }
    }

    switchMobileTab(pane, toggleContainer) {
        toggleContainer.querySelectorAll('.editor-mobile-tab').forEach(b => b.classList.remove('active'));
        toggleContainer.querySelector(`[data-pane="${pane}"]`).classList.add('active');

        const writePane = this.container.querySelector('.editor-write');
        const previewPane = this.container.querySelector('.editor-preview');

        if (pane === 'write') {
            writePane.classList.add('active');
            previewPane.classList.remove('active');
        } else {
            writePane.classList.remove('active');
            previewPane.classList.add('active');
            this.updatePreview();
        }
    }

    updatePreview() {
        if (!this.preview || !this.textarea) return;
        const html = this.parser.parse(this.textarea.value);
        this.preview.innerHTML = html || '<p style="color: var(--text-secondary); font-style: italic;">Die Vorschau erscheint hier, sobald du etwas schreibst...</p>';
        if (this.onChangeCallback) this.onChangeCallback(this.textarea.value);
    }

    getValue() {
        return this.textarea ? this.textarea.value : '';
    }

    setValue(value) {
        if (this.textarea) {
            this.textarea.value = value;
            this.updatePreview();
        }
    }

    onChange(callback) {
        this.onChangeCallback = callback;
    }

    // --- Drag & Drop Handling ---

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.textarea.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.textarea.classList.remove('drag-over');
    }

    async handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.textarea.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            for (const file of files) {
                if (file.type.startsWith('image/')) {
                    await this.uploadFile(file);
                } else {
                    Toast.error(`"${file.name}" ist kein gültiges Bild.`);
                }
            }
        }
    }

    async uploadFile(file) {
        const id = Math.random().toString(36).substring(2, 9);
        const placeholder = `![Hochladen: ${file.name} (${id})...]()`;
        
        // Platzhalter einfügen
        this.insertAtCursor('\n' + placeholder + '\n');
        
        try {
            const response = await ApiService.media.upload(file);
            if (response.success) {
                const markdown = `![${file.name}](${response.url})`;
                this.textarea.value = this.textarea.value.replace(placeholder, markdown);
                this.updatePreview();
            }
        } catch (error) {
            // Platzhalter entfernen bei Fehler
            this.textarea.value = this.textarea.value.replace(placeholder, '');
            Toast.error(`Fehler beim Upload von "${file.name}": ${error.message}`);
            this.updatePreview();
        }
    }
}
