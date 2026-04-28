/* pages/editor.js */
import { Editor } from '../modules/Editor.js';
import { ApiService } from '../services/ApiService.js';
import { UI } from '../utils/UI.js';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');
    const isEditing = !!editId;

    const subjectSelect = document.getElementById('article-subject');
    const titleInput = document.getElementById('article-title');
    const btnSaveDraft = document.getElementById('btn-save-draft');
    const btnPublish = document.getElementById('btn-publish');
    const msgDiv = document.getElementById('article-message');
    const pageTitle = document.getElementById('editor-page-title');
    const pageSubtitle = document.getElementById('editor-page-subtitle');

    const editor = new Editor('article-editor-container');

    // Fächer laden via ApiService
    try {
        const subjects = await ApiService.content.getSubjects();
        subjects.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.title;
            subjectSelect.appendChild(opt);
        });
    } catch (e) {
        console.error('Fehler beim Laden der Fächer:', e);
    }

    // Wenn Editiert wird: Daten laden
    if (isEditing) {
        if (pageTitle) pageTitle.textContent = 'Beitrag bearbeiten';
        if (pageSubtitle) pageSubtitle.textContent = 'Überarbeite deinen bestehenden Beitrag.';

        try {
            const article = await ApiService.articles.get(editId);
            subjectSelect.value = article.subject_id;
            titleInput.value = article.title;
            editor.render(article.content_raw || '');
        } catch (e) {
            showMessage('Beitrag nicht gefunden oder keine Berechtigung.', false);
        }
    } else {
        const preselectedSubject = params.get('subject');
        if (preselectedSubject) subjectSelect.value = preselectedSubject;
        editor.render('');
    }

    // Event Listener für die Buttons
    if (btnSaveDraft) btnSaveDraft.addEventListener('click', () => saveArticle('draft', btnSaveDraft));
    if (btnPublish) btnPublish.addEventListener('click', () => saveArticle('published', btnPublish));

    async function saveArticle(targetStatus, activeBtn) {
        const subjectId = subjectSelect.value;
        const title = titleInput.value.trim();
        const contentRaw = editor.getValue().trim();

        if (!subjectId || !title || !contentRaw) {
            showMessage('Bitte fülle alle Felder aus.', false);
            return;
        }

        const origHtml = activeBtn.innerHTML;
        UI.setLoading(activeBtn, true);
        if (btnSaveDraft) btnSaveDraft.disabled = true;
        if (btnPublish) btnPublish.disabled = true;

        try {
            const payload = {
                subject_id: parseInt(subjectId),
                title: title,
                content_raw: contentRaw,
                status: targetStatus
            };

            let data;
            if (isEditing) {
                data = await ApiService.articles.update(editId, payload);
            } else {
                data = await ApiService.articles.save(payload);
            }

            if (data.success) {
                const verb = isEditing ? 'aktualisiert' : 'erstellt';
                const statusText = targetStatus === 'draft' ? ' (als Entwurf)' : '';
                showMessage(`Beitrag erfolgreich ${verb}${statusText}!`, true);

                if (targetStatus === 'published' || (!isEditing && data.id)) {
                    setTimeout(() => {
                        window.location.href = `${window.BASE_URL}/learning`;
                    }, 1200);
                }
            } else {
                throw new Error(data.error || 'Fehler beim Speichern.');
            }
        } catch (e) {
            showMessage(e.message || 'Verbindungsfehler.', false);
        } finally {
            UI.setLoading(activeBtn, false, origHtml);
            if (btnSaveDraft) btnSaveDraft.disabled = false;
            if (btnPublish) btnPublish.disabled = false;
        }
    }

    function showMessage(text, success) {
        msgDiv.textContent = text;
        msgDiv.style.color = success ? 'var(--color-success)' : 'var(--color-danger)';
        setTimeout(() => { msgDiv.textContent = ''; }, 4000);
    }
});