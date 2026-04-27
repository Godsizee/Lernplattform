import { Editor } from '../modules/Editor.js';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');
    const isEditing = !!editId;

    const subjectSelect = document.getElementById('article-subject');
    const titleInput = document.getElementById('article-title');
    const saveBtn = document.getElementById('article-save-btn');
    const msgDiv = document.getElementById('article-message');
    const statusSwitch = document.getElementById('status-toggle-switch');
    const statusLabel = document.getElementById('status-label');
    const pageTitle = document.getElementById('editor-page-title');
    const pageSubtitle = document.getElementById('editor-page-subtitle');

    let currentStatus = 'draft';

    const editor = new Editor('article-editor-container');

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

    if (isEditing) {
        pageTitle.textContent = 'Beitrag bearbeiten';
        pageSubtitle.textContent = 'Überarbeite deinen bestehenden Beitrag.';

        try {
            const res = await fetch(`../api/articles.php?action=get&id=${editId}`);
            if (res.ok) {
                const article = await res.json();
                subjectSelect.value = article.subject_id;
                titleInput.value = article.title;
                currentStatus = article.status || 'draft';

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

    updateStatusUI();

    statusSwitch.addEventListener('click', () => {
        currentStatus = currentStatus === 'published' ? 'draft' : 'published';
        updateStatusUI();
    });

    function updateStatusUI() {
        if (currentStatus === 'published') {
            statusSwitch.classList.add('active');
            statusLabel.textContent = 'Veröffentlicht';
            saveBtn.querySelector('span').textContent = 'Veröffentlichen';
        } else {
            statusSwitch.classList.remove('active');
            statusLabel.textContent = 'Entwurf';
            saveBtn.querySelector('span').textContent = 'Als Entwurf speichern';
        }
    }

    saveBtn.addEventListener('click', async () => {
        const subjectId = subjectSelect.value;
        const title = titleInput.value.trim();
        const contentRaw = editor.getValue().trim();

        if (!subjectId || !title || !contentRaw) {
            showMessage('Bitte fülle alle Felder aus.', false);
            return;
        }

        const origHtml = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i>';
        saveBtn.disabled = true;

        try {
            const payload = {
                subject_id: parseInt(subjectId),
                title: title,
                content_raw: contentRaw,
                status: currentStatus
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
                const statusText = currentStatus === 'draft' ? ' (Entwurf)' : '';
                showMessage(`Beitrag erfolgreich ${verb}${statusText}!`, true);

                if (!isEditing && data.id) {
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
            saveBtn.innerHTML = origHtml;
            saveBtn.disabled = false;
        }
    });

    function showMessage(text, success) {
        msgDiv.textContent = text;
        msgDiv.style.color = success ? 'var(--color-success)' : 'var(--color-danger)';
        setTimeout(() => { msgDiv.textContent = ''; }, 4000);
    }
});
