import { Editor } from '../modules/Editor.js';

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

    // Fächer laden
    try {
        const res = await fetch('../api/content.php?action=subjects');
        if (res.ok) {
            const subjects = await res.json();
            subjects.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = s.title;
                subjectSelect.appendChild(opt);
            });
        }
    } catch (e) {
        console.error('Fehler beim Laden der Fächer:', e);
    }

    // Wenn Editiert wird: Daten laden
    if (isEditing) {
        pageTitle.textContent = 'Beitrag bearbeiten';
        pageSubtitle.textContent = 'Überarbeite deinen bestehenden Beitrag.';

        try {
            const res = await fetch(`../api/articles.php?action=get&id=${editId}`);
            if (res.ok) {
                const article = await res.json();
                subjectSelect.value = article.subject_id;
                titleInput.value = article.title;
                editor.render(article.content_raw || '');
            } else {
                showMessage('Beitrag nicht gefunden oder keine Berechtigung.', false);
            }
        } catch (e) {
            showMessage('Fehler beim Laden des Beitrags.', false);
        }
    } else {
        const preselectedSubject = params.get('subject');
        if (preselectedSubject) subjectSelect.value = preselectedSubject;
        editor.render('');
    }

    // Event Listener für die Buttons
    btnSaveDraft.addEventListener('click', () => saveArticle('draft', btnSaveDraft));
    btnPublish.addEventListener('click', () => saveArticle('published', btnPublish));

    // Zentralisierte Speicher-Funktion
    async function saveArticle(targetStatus, activeBtn) {
        const subjectId = subjectSelect.value;
        const title = titleInput.value.trim();
        const contentRaw = editor.getValue().trim();

        if (!subjectId || !title || !contentRaw) {
            showMessage('Bitte fülle alle Felder aus.', false);
            return;
        }

        // Button State
        const origHtml = activeBtn.innerHTML;
        activeBtn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i> <span>Speichert...</span>';
        btnSaveDraft.disabled = true;
        btnPublish.disabled = true;

        try {
            const payload = {
                subject_id: parseInt(subjectId),
                title: title,
                content_raw: contentRaw,
                status: targetStatus
            };

            let url = '../api/articles.php?action=create';
            if (isEditing) {
                payload.id = parseInt(editId);
                url = '../api/articles.php?action=update';
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                const verb = isEditing ? 'aktualisiert' : 'erstellt';
                const statusText = targetStatus === 'draft' ? ' (als Entwurf)' : '';
                showMessage(`Beitrag erfolgreich ${verb}${statusText}!`, true);

                // Wenn veröffentlicht oder neu erstellt: Zurück zur Liste
                if (targetStatus === 'published' || (!isEditing && data.id)) {
                    setTimeout(() => {
                        window.location.href = window.BASE_URL + '/learning';
                    }, 1200);
                }
            } else {
                showMessage(data.error || 'Fehler beim Speichern.', false);
            }
        } catch (e) {
            showMessage('Verbindungsfehler.', false);
        } finally {
            // Button State Reset
            activeBtn.innerHTML = origHtml;
            btnSaveDraft.disabled = false;
            btnPublish.disabled = false;
        }
    }

    function showMessage(text, success) {
        msgDiv.textContent = text;
        msgDiv.style.color = success ? 'var(--color-success)' : 'var(--color-danger)';
        setTimeout(() => { msgDiv.textContent = ''; }, 4000);
    }
});