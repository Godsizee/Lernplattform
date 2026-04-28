/* modules/Learning.js */
import { ApiService } from '../services/ApiService.js';
import { MarkdownParser } from './MarkdownParser.js';
import { escapeHTML } from '../utils/Helpers.js';

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
        
        container.innerHTML = `<div class="loader"><i class="ph ph-spinner-gap ph-spin"></i> Lade Themenübersicht...</div>`;

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
        }
    }

    renderLayout(container, titleText) {
        container.innerHTML = `
            <div class="learning-header fade-in">
                <h2 class="learning-subject-title">${titleText}</h2>
                <a href="${window.BASE_URL}/editor?subject=${this.currentSubjectId}" class="btn btn-primary" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">
                    <i class="ph ph-plus-circle"></i> Beitrag erstellen
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

        mainContainer.innerHTML = `<div class="loader" style="margin-top: 5rem;"><i class="ph ph-spinner-gap ph-spin"></i> Lade Inhalt...</div>`;

        try {
            const lesson = await ApiService.articles.get(lessonId);
            const isCompleted = this.progress.includes(parseInt(lessonId));
            
            this.renderLesson(mainContainer, lesson, isCompleted);
            ApiService.log.add('LESSON_READ', `Liest die Lektion '${lesson.title}'.`);

        } catch (error) {
            console.error('Error loading lesson:', error);
            mainContainer.innerHTML = `<div class="form-error">Fehler beim Laden des Inhalts.</div>`;
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
        const contentHtml = lesson.content_raw ? this.parser.parse(lesson.content_raw) : lesson.content;

        container.innerHTML = `
            <div class="content-card learning-content fade-in" style="margin-bottom: 0;">
                <div class="lesson-header">
                    <h2 class="lesson-title">${escapeHTML(lesson.title)}</h2>
                    <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-success'} toggle-lesson-btn" style="flex-shrink: 0; min-width: 220px;">
                        <i class="ph ${isCompleted ? 'ph-arrow-counter-clockwise' : 'ph-check'}"></i> 
                        ${isCompleted ? 'Als ungelesen markieren' : 'Abschließen'}
                    </button>
                </div>
                ${this.renderArticleMeta(lesson, canEdit)}
                <div class="lesson-body">
                    ${contentHtml}
                </div>
            </div>
        `;

        container.querySelector('.toggle-lesson-btn').addEventListener('click', () => this.toggleLesson(lesson.id, !isCompleted));
        
        const deleteBtn = container.querySelector('.delete-article-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteArticle(lesson.id, lesson.title));
        }
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
                    <a href="${window.BASE_URL}/editor?id=${lesson.id}" class="btn btn-secondary" title="Bearbeiten" style="padding: 0.5rem 1rem;">
                        <i class="ph ph-pencil-simple"></i> Bearbeiten
                    </a>
                    <button class="btn btn-danger delete-article-btn" data-id="${lesson.id}" title="Löschen" style="padding: 0.5rem 1rem;">
                        <i class="ph ph-trash"></i>
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
            } else {
                this.progress = this.progress.filter(id => id != lessonId);
            }

            // Update Current View
            const btn = document.querySelector('.toggle-lesson-btn');
            if (btn) {
                btn.className = `btn ${markAsCompleted ? 'btn-secondary' : 'btn-success'} toggle-lesson-btn`;
                btn.innerHTML = `<i class="ph ${markAsCompleted ? 'ph-arrow-counter-clockwise' : 'ph-check'}"></i> ${markAsCompleted ? 'Als ungelesen markieren' : 'Abschließen'}`;
                
                // Re-attach listener
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', () => this.toggleLesson(lessonId, !markAsCompleted));
            }

            // Update TOC
            this.renderTOC();
        } catch (error) {
            console.error('Error toggling progress:', error);
        }
    }

    async deleteArticle(articleId, title) {
        if (!confirm(`Beitrag "${title}" wirklich löschen?`)) return;
        try {
            await ApiService.articles.delete(articleId);
            this.switchTab(this.currentSubjectId, '');
        } catch (e) {
            alert(e.message || 'Fehler beim Löschen.');
        }
    }
}