/* modules/Learning.js */
import { ApiService } from '../services/ApiService.js';
import { MarkdownParser } from './MarkdownParser.js';
import { escapeHTML } from '../utils/Helpers.js';
import { Toast } from '../helpers/Toast.js';
import { Modal } from '../helpers/Modal.js';
import { Skeleton } from '../helpers/Skeleton.js';
import { QuizEngine } from './QuizEngine.js';

export class Learning {
    constructor() {
        this.parser = new MarkdownParser();
        this.currentUserId = null;
        this.isAdmin = false;
        this.lessonsMetadata = [];
        this.currentSubjectId = null;
        this.activeLessonId = null;
    }

    async loadData() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const urlSubjectId = urlParams.get('subject');
            const urlLessonId = urlParams.get('lesson');

            const subjects = await ApiService.content.getSubjects();
            this.renderTabs(subjects);
            
            if (subjects.length > 0) {
                const activeId = urlSubjectId || localStorage.getItem('active_subject') || subjects[0].id;
                const activeSubject = subjects.find(s => s.id == activeId) || subjects[0];
                
                await this.switchTab(activeSubject.id, activeSubject.title);

                if (urlLessonId) {
                    await this.loadLesson(urlLessonId);
                }
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
            Toast.error('Fehler beim Laden der Fächer.');
        }
    }

    renderTabs(subjects) {
        const tabsContainer = document.getElementById('learning-tabs-container');
        if (!tabsContainer) return;
        
        tabsContainer.innerHTML = '';
        subjects.forEach(subject => {
            const btn = document.createElement('button');
            btn.className = 'learning-tab';
            btn.dataset.subjectId = subject.id;
            btn.textContent = subject.title;
            btn.addEventListener('click', () => this.switchTab(subject.id, subject.title));
            tabsContainer.appendChild(btn);
        });
    }

    async switchTab(subjectId, titleText) {
        this.currentSubjectId = subjectId;
        localStorage.setItem('active_subject', subjectId);

        // Update UI Tabs
        const tabsContainer = document.getElementById('learning-tabs-container');
        if (tabsContainer) {
            tabsContainer.querySelectorAll('.learning-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.subjectId == subjectId);
            });
        }

        const container = document.getElementById('learning-content-container');
        if (!container) return;
        
        container.innerHTML = Skeleton.getTOCLoaders(8);

        try {
            // Load only metadata for TOC
            const data = await ApiService.content.getLessons(subjectId, true);
            this.currentUserId = data.current_user_id;
            this.isAdmin = data.is_admin;
            this.lessonsMetadata = data.lessons;
            this.progress = data.progress;
            
            this.renderLayout(container, titleText);
            this.renderTOC();

            // Auto-load first lesson if none active
            const urlParams = new URLSearchParams(window.location.search);
            if (!urlParams.get('lesson') && this.lessonsMetadata.length > 0) {
                this.loadLesson(this.lessonsMetadata[0].id);
            }

        } catch (error) {
            console.error('Error switching tab:', error);
            container.innerHTML = `<div class="form-error">Fehler beim Laden der Themen.</div>`;
            Toast.error('Themenübersicht konnte nicht geladen werden.');
        }
    }

    renderLayout(container, titleText) {
        // Wir injizieren hier eine winzige Style-Klasse direkt ins Layout, um
        // Mobile-Only und Desktop-Only Elemente nahtlos zu steuern.
        container.innerHTML = `
            <style>
                @media (max-width: 768px) {
                    .hide-on-mobile { display: none !important; }
                    .show-on-mobile { display: block !important; }
                    .mobile-bottom-action { margin-top: 2rem; border-top: 1px solid var(--border-glass); padding-top: 1.5rem; }
                }
                @media (min-width: 769px) {
                    .show-on-mobile { display: none !important; }
                }
            </style>
            <div class="learning-header fade-in">
                <h2 class="learning-subject-title">${titleText}</h2>
                <a href="${window.BASE_URL}/editor?subject=${this.currentSubjectId}" class="btn btn-primary create-btn-mobile hide-on-mobile" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">
                    <i class="ph ph-plus-circle"></i> <span>Beitrag erstellen</span>
                </a>
            </div>
            <div class="learning-layout">
                <aside class="learning-sidebar" id="learning-toc-container"></aside>
                <section class="learning-main" id="active-lesson-container">
                    <div class="lesson-placeholder fade-in">
                        <div class="placeholder-icon"><i class="ph ph-books"></i></div>
                        <h3>Bereit für neues Wissen?</h3>
                        <p>Wähle ein Thema aus dem Inhaltsverzeichnis auf der linken Seite,<br>um den Inhalt anzuzeigen und zu lernen.</p>
                    </div>
                </section>
            </div>
        `;
    }

    renderTOC() {
        const tocContainer = document.getElementById('learning-toc-container');
        if (!tocContainer) return;

        const tocWrapper = document.createElement('div');
        tocWrapper.className = 'toc-container fade-in';
        tocWrapper.innerHTML = `<div class="toc-header">Themenübersicht</div>`;
        
        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';
        
        this.lessonsMetadata.forEach(lesson => {
            const isCompleted = this.progress.includes(lesson.id);
            const li = document.createElement('li');
            li.className = 'toc-item';
            
            const link = document.createElement('a');
            link.href = `?subject=${this.currentSubjectId}&lesson=${lesson.id}`;
            link.className = `toc-link ${isCompleted ? 'completed' : ''} ${this.activeLessonId == lesson.id ? 'active' : ''}`;
            link.dataset.lessonId = lesson.id;
            
            let titleHtml = `<span class="toc-text">${escapeHTML(lesson.title)}</span>`;
            if (lesson.article_status === 'draft') {
                titleHtml += ` <span class="draft-badge" style="font-size: 0.7rem; margin-left: 0.5rem; color: var(--color-warning);"><i class="ph ph-note-pencil"></i></span>`;
            }
            
            link.innerHTML = titleHtml;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadLesson(lesson.id);
            });
            
            li.appendChild(link);
            tocList.appendChild(li);
        });
        
        tocWrapper.appendChild(tocList);
        tocContainer.innerHTML = '';
        tocContainer.appendChild(tocWrapper);
    }

    async loadLesson(lessonId) {
        const mainContainer = document.getElementById('active-lesson-container');
        if (!mainContainer) return;

        // Visual Feedback
        this.activeLessonId = lessonId;
        this.updateTOCHighlight();
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('subject', this.currentSubjectId);
        url.searchParams.set('lesson', lessonId);
        window.history.pushState({}, '', url);

        mainContainer.innerHTML = Skeleton.getLessonLoader();

        try {
            const lesson = await ApiService.articles.get(lessonId);
            const isCompleted = this.progress.includes(parseInt(lessonId));
            
            this.renderLesson(mainContainer, lesson, isCompleted);
            ApiService.log.add('LESSON_READ', `Liest die Lektion '${lesson.title}'.`);

        } catch (error) {
            console.error('Error loading lesson:', error);
            mainContainer.innerHTML = `<div class="form-error">Fehler beim Laden des Inhalts.</div>`;
            Toast.error('Lektion konnte nicht geladen werden.');
        }
    }

    updateTOCHighlight() {
        const tocContainer = document.getElementById('learning-toc-container');
        if (tocContainer) {
            tocContainer.querySelectorAll('.toc-link').forEach(link => {
                link.classList.toggle('active', link.dataset.lessonId == this.activeLessonId);
            });
        }
    }

    renderLesson(container, lesson, isCompleted) {
        const canEdit = this.isAdmin || (lesson.author_id && lesson.author_id == this.currentUserId);
        let contentHtml = '';
        if (lesson.type === 'quiz') {
            contentHtml = '<div id="quiz-container-inner"></div>';
        } else {
            contentHtml = lesson.content_raw ? this.parser.parse(lesson.content_raw) : lesson.content;
        }
        
        const btnContentHtml = `<i class="ph ${isCompleted ? 'ph-arrow-counter-clockwise' : 'ph-check'}"></i> ${isCompleted ? 'Als ungelesen markieren' : 'Abschließen'}`;
        
        const nextLesson = this.getNextLesson(lesson.id);

        container.innerHTML = `
            <div class="content-card learning-content fade-in" style="margin-bottom: 0;">
                <div class="lesson-header">
                    <h2 class="lesson-title">${escapeHTML(lesson.title)}</h2>
                </div>
                ${this.renderArticleMeta(lesson, canEdit)}
                <div class="lesson-body">
                    ${contentHtml}
                </div>
                
                <div class="lesson-footer-nav">
                    <!-- Primärer Abschluss-Button am Ende -->
                    <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-success'} toggle-lesson-btn">
                        ${btnContentHtml}
                    </button>

                    ${nextLesson ? `
                        <a href="?subject=${this.currentSubjectId}&lesson=${nextLesson.id}" class="next-lesson-card" id="next-lesson-link">
                            <div class="next-lesson-info">
                                <span class="next-lesson-label">Nächste Lektion</span>
                                <span class="next-lesson-title">${escapeHTML(nextLesson.title)}</span>
                            </div>
                            <i class="ph ph-arrow-right next-lesson-icon"></i>
                        </a>
                    ` : ''}
                </div>

                <!-- Persönliche Notizen Sektion -->
                <div class="student-notes-section">
                    <div class="notes-header">
                        <h3><i class="ph ph-notebook"></i> Deine persönlichen Notizen</h3>
                        <div class="notes-status" id="notes-status">
                            <i class="ph ph-cloud-check"></i> Alle Änderungen gespeichert
                        </div>
                    </div>
                    <div class="notes-container">
                        <div class="notes-tabs">
                            <button class="notes-tab active" data-tab="edit">Schreiben</button>
                            <button class="notes-tab" data-tab="preview">Vorschau</button>
                        </div>
                        <div class="notes-editor-wrapper">
                            <div id="notes-edit-pane">
                                <textarea class="notes-textarea" id="notes-textarea" placeholder="Hier kannst du dir wichtige Punkte merken... (Markdown unterstützt)">${escapeHTML(lesson.user_note || '')}</textarea>
                            </div>
                            <div id="notes-preview-pane" class="notes-preview" style="display: none;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Event-Listener binden
        container.querySelectorAll('.toggle-lesson-btn').forEach(btn => {
            btn.addEventListener('click', () => this.toggleLesson(lesson.id, !isCompleted));
        });

        const bookmarkBtn = container.querySelector('.bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => this.toggleBookmark(lesson.id, bookmarkBtn));
        }

        this.initNotesArea(lesson.id);
        
        const nextLink = container.querySelector('#next-lesson-link');
        if (nextLink) {
            nextLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadLesson(nextLesson.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        const deleteBtn = container.querySelector('.delete-article-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteArticle(lesson.id, lesson.title));
        }

        // Initialize QuizEngine if applicable
        if (lesson.type === 'quiz' && lesson.content_raw) {
            try {
                const quizData = JSON.parse(lesson.content_raw);
                const quizContainer = container.querySelector('#quiz-container-inner');
                new QuizEngine(quizContainer, quizData, {
                    lessonId: lesson.id,
                    onComplete: (passed) => {
                        if (passed && !isCompleted) {
                            // User still has to manually complete it, but we could trigger it automatically if we wanted.
                        }
                    }
                });
            } catch (e) {
                console.error("Error parsing quiz data", e);
                container.querySelector('#quiz-container-inner').innerHTML = "Fehler beim Laden des Quiz.";
            }
        }

        // UX: Scroll-Indikator initialisieren
        this.initScrollIndicator();
    }

    getNextLesson(currentId) {
        const index = this.lessonsMetadata.findIndex(l => l.id == currentId);
        if (index !== -1 && index < this.lessonsMetadata.length - 1) {
            return this.lessonsMetadata[index + 1];
        }
        return null;
    }

    initScrollIndicator() {
        // Bestehenden Indikator entfernen, falls vorhanden
        const existing = document.getElementById('scroll-indicator-container');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'scroll-indicator-container';
        container.className = 'scroll-progress-container';
        container.innerHTML = '<div id="scroll-progress-bar" class="scroll-progress-bar"></div>';
        document.body.appendChild(container);

        const bar = document.getElementById('scroll-progress-bar');
        
        const updateProgress = () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            if (bar) bar.style.width = scrolled + "%";
        };

        // Event Listener hinzufügen und direkt einmal ausführen
        window.removeEventListener('scroll', this._scrollHandler); // Vorherigen Handler entfernen
        this._scrollHandler = updateProgress;
        window.addEventListener('scroll', this._scrollHandler);
        updateProgress();
    }

    renderArticleMeta(lesson, canEdit) {
        let metaHtml = '<div class="article-meta">';
        if (lesson.author_name) metaHtml += `<span class="author-badge"><i class="ph ph-user"></i> ${escapeHTML(lesson.author_name)}</span>`;
        if (lesson.article_status === 'draft') metaHtml += `<span class="draft-badge"><i class="ph ph-note-pencil"></i> Entwurf</span>`;
        
        const dateStr = new Date(lesson.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        metaHtml += `<span class="article-date"><i class="ph ph-calendar-blank"></i> ${dateStr}</span>`;
        
        if (canEdit) {
            metaHtml += `
                <div class="article-actions">
                    <button class="bookmark-btn ${lesson.is_bookmarked ? 'active' : ''}" title="Für später speichern">
                        <i class="ph ${lesson.is_bookmarked ? 'ph-bookmark-simple-fill' : 'ph-bookmark-simple'}"></i>
                        <span>${lesson.is_bookmarked ? 'Gemerkt' : 'Merken'}</span>
                    </button>
                    <a href="${window.BASE_URL}/editor?id=${lesson.id}" class="btn btn-secondary" title="Bearbeiten" style="padding: 0.5rem 1rem;">
                        <i class="ph ph-pencil-simple"></i> Bearbeiten
                    </a>
                    <button class="btn btn-danger delete-article-btn" data-id="${lesson.id}" title="Löschen" style="padding: 0.5rem 1rem;">
                        <i class="ph ph-trash"></i> Löschen
                    </button>
                </div>`;
        } else {
            metaHtml += `
                <div class="article-actions">
                    <button class="bookmark-btn ${lesson.is_bookmarked ? 'active' : ''}" title="Für später speichern">
                        <i class="ph ${lesson.is_bookmarked ? 'ph-bookmark-simple-fill' : 'ph-bookmark-simple'}"></i>
                        <span>${lesson.is_bookmarked ? 'Gemerkt' : 'Merken'}</span>
                    </button>
                </div>`;
        }
        metaHtml += '</div>';
        return metaHtml;
    }

    async toggleLesson(lessonId, markAsCompleted) {
        try {
            await ApiService.progress.toggle(lessonId, markAsCompleted);
            
            // Update Progress State
            if (markAsCompleted) {
                if (!this.progress.includes(parseInt(lessonId))) this.progress.push(parseInt(lessonId));
                Toast.success('Lektion als abgeschlossen markiert.');
            } else {
                this.progress = this.progress.filter(id => id != lessonId);
                Toast.info('Lektion als ungelesen markiert.');
            }

            // Update Current View for the completion button
            const btns = document.querySelectorAll('.toggle-lesson-btn');
            btns.forEach(btn => {
                btn.className = `btn ${markAsCompleted ? 'btn-secondary' : 'btn-success'} toggle-lesson-btn`;
                btn.innerHTML = `<i class="ph ${markAsCompleted ? 'ph-arrow-counter-clockwise' : 'ph-check'}"></i> ${markAsCompleted ? 'Als ungelesen markieren' : 'Abschließen'}`;
                
                // Re-attach listener
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', () => this.toggleLesson(lessonId, !markAsCompleted));
            });

            // Update TOC
            this.renderTOC();
        } catch (error) {
            console.error('Error toggling progress:', error);
            Toast.error('Fehler beim Aktualisieren des Fortschritts.');
        }
    }

    async deleteArticle(articleId, title) {
        const confirmed = await Modal.confirm(`Möchtest du den Beitrag "${title}" wirklich unwiderruflich löschen?`, {
            confirmText: 'Ja, Beitrag löschen',
            icon: 'ph-trash'
        });
        if (!confirmed) return;

        try {
            await ApiService.articles.delete(articleId);
            Toast.success('Beitrag wurde erfolgreich gelöscht.');
            this.switchTab(this.currentSubjectId, '');
        } catch (e) {
            Toast.error(e.message || 'Fehler beim Löschen.');
        }
    }

    async toggleBookmark(lessonId, btn) {
        try {
            const data = await ApiService.student.toggleBookmark(lessonId);
            const icon = btn.querySelector('i');
            const span = btn.querySelector('span');

            if (data.is_bookmarked) {
                btn.classList.add('active');
                icon.className = 'ph ph-bookmark-simple-fill';
                span.textContent = 'Gemerkt';
                Toast.success('Lektion wurde unter deinen Lesezeichen gespeichert.');
            } else {
                btn.classList.remove('active');
                icon.className = 'ph ph-bookmark-simple';
                span.textContent = 'Merken';
                Toast.info('Lesezeichen entfernt.');
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            Toast.error('Lesezeichen konnte nicht aktualisiert werden.');
        }
    }

    initNotesArea(lessonId) {
        const textarea = document.getElementById('notes-textarea');
        const previewPane = document.getElementById('notes-preview-pane');
        const editPane = document.getElementById('notes-edit-pane');
        const status = document.getElementById('notes-status');
        const tabs = document.querySelectorAll('.notes-tab');

        if (!textarea) return;

        // Tabs Toggle
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                if (tab.dataset.tab === 'preview') {
                    previewPane.innerHTML = this.parser.parse(textarea.value);
                    previewPane.style.display = 'block';
                    editPane.style.display = 'none';
                } else {
                    previewPane.style.display = 'none';
                    editPane.style.display = 'block';
                    textarea.focus();
                }
            });
        });

        // Auto-Save mit Debounce
        let timeout;
        textarea.addEventListener('input', () => {
            status.innerHTML = '<i class="ph ph-dots-three-circle-vertical"></i> Speichere Notiz...';
            status.classList.add('saving');

            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                try {
                    await ApiService.student.saveNote(lessonId, textarea.value);
                    status.innerHTML = '<i class="ph ph-cloud-check"></i> Alle Änderungen gespeichert';
                    status.classList.remove('saving');
                } catch (error) {
                    status.innerHTML = '<i class="ph ph-warning-circle"></i> Fehler beim Speichern';
                    status.classList.remove('saving');
                }
            }, 1000);
        });
    }
}