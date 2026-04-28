/* modules/Learning.js */
import { ApiService } from '../services/ApiService.js';
import { MarkdownParser } from './MarkdownParser.js';
import { escapeHTML } from '../utils/Helpers.js';

export class Learning {
    constructor() {
        this.parser = new MarkdownParser();
        this.currentUserId = null;
        this.isAdmin = false;
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
                const activeTitle = subjects.find(s => s.id == activeId)?.title || subjects[0].title;
                
                await this.switchTab(activeId, activeTitle);

                if (urlLessonId) {
                    this.scrollToLesson(urlLessonId);
                }
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
        }
    }

    scrollToLesson(lessonId) {
        setTimeout(() => {
            const target = document.getElementById(`lesson-${lessonId}`);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                target.classList.add('highlight-pulse');
                setTimeout(() => target.classList.remove('highlight-pulse'), 2000);
            }
        }, 500);
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
            tabsContainer.appendChild(btn);
        });
    }

    async switchTab(subjectId, titleText = '') {
        const tabsContainer = document.getElementById('learning-tabs-container');
        if (tabsContainer) {
            tabsContainer.querySelectorAll('.learning-tab').forEach(t => t.classList.remove('active'));
            const activeTab = tabsContainer.querySelector(`.learning-tab[data-subject-id="${subjectId}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
                titleText = activeTab.textContent;
            }
        }

        localStorage.setItem('active_subject', subjectId);

        const container = document.getElementById('learning-content-container');
        if (!container) return;
        
        container.innerHTML = `<div class="loader"><i class="ph ph-spinner-gap ph-spin"></i> Lade Lektionen...</div>`;

        try {
            const data = await ApiService.content.getLessons(subjectId);

            this.currentUserId = data.current_user_id;
            this.isAdmin = data.is_admin;
            
            container.innerHTML = '';
            this.renderLessonsHeader(container, subjectId, titleText);

            if (data.lessons.length === 0) {
                container.innerHTML += `<div class="content-card"><p>Noch keine Beiträge in diesem Fach. Sei der Erste!</p></div>`;
                return;
            }

            this.renderTOC(container, data.lessons, data.progress);
            this.renderLessonsList(container, data.lessons, data.progress, subjectId);

        } catch (error) {
            container.innerHTML = `<div class="form-error">Fehler beim Laden der Lektionen.</div>`;
        }
    }

    renderLessonsHeader(container, subjectId, titleText) {
        const headerRow = document.createElement('div');
        headerRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;';
        headerRow.innerHTML = `
            <h2 style="margin: 0; color: var(--color-primary); font-family: var(--font-display);">${titleText}</h2>
            <a href="${window.BASE_URL}/editor?subject=${subjectId}" class="create-article-btn">
                <i class="ph ph-plus-circle"></i> Beitrag erstellen
            </a>
        `;
        container.appendChild(headerRow);
    }

    renderTOC(container, lessons, progress) {
        const tocWrapper = document.createElement('div');
        tocWrapper.className = 'content-card toc-card';
        tocWrapper.innerHTML = `<h3>Inhaltsverzeichnis</h3>`;
        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';
        
        lessons.forEach(lesson => {
            const isCompleted = progress.includes(lesson.id);
            const li = document.createElement('li');
            li.className = 'toc-item';
            const link = document.createElement('a');
            link.href = `#lesson-${lesson.id}`;
            link.className = `toc-link ${isCompleted ? 'completed' : ''}`;
            
            const iconClass = isCompleted ? 'ph-fill ph-check-circle' : 'ph ph-circle';
            let titleHtml = `<span class="toc-text">${escapeHTML(lesson.title)}</span>`;
            if (lesson.article_status === 'draft') {
                titleHtml += ` <span class="draft-badge"><i class="ph ph-note-pencil"></i> Entwurf</span>`;
            }
            
            link.innerHTML = `<i class="${iconClass} toc-icon"></i>${titleHtml}`;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(`lesson-${lesson.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            
            li.appendChild(link);
            tocList.appendChild(li);
        });
        
        tocWrapper.appendChild(tocList);
        container.appendChild(tocWrapper);
    }

    renderLessonsList(container, lessons, progress, subjectId) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const { lessonId, lessonTitle } = entry.target.dataset;
                    ApiService.log.add('LESSON_READ', `Liest die Lektion '${lessonTitle}'.`);
                }
            });
        }, { threshold: 0.5 });

        lessons.forEach(lesson => {
            const isCompleted = progress.includes(lesson.id);
            const lessonWrapper = this.createLessonElement(lesson, isCompleted, subjectId);
            container.appendChild(lessonWrapper);
            observer.observe(lessonWrapper);
        });
    }

    createLessonElement(lesson, isCompleted, subjectId) {
        const lessonWrapper = document.createElement('div');
        lessonWrapper.className = `content-card learning-content searchable-block fade-in`;
        lessonWrapper.id = `lesson-${lesson.id}`;
        lessonWrapper.dataset.lessonId = lesson.id;
        lessonWrapper.dataset.lessonTitle = lesson.title;
        lessonWrapper.style.marginBottom = '3rem';
        lessonWrapper.style.scrollMarginTop = '100px'; 

        const canEdit = this.isAdmin || (lesson.author_id && lesson.author_id == this.currentUserId);
        const contentHtml = lesson.content_raw ? this.parser.parse(lesson.content_raw) : lesson.content;

        lessonWrapper.innerHTML = `
            <div class="lesson-header">
                <h2 class="lesson-title">${escapeHTML(lesson.title)}</h2>
                <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-success'} toggle-lesson-btn">
                    <i class="ph ${isCompleted ? 'ph-arrow-counter-clockwise' : 'ph-check'}"></i> 
                    ${isCompleted ? 'Als ungelesen markieren' : 'Abschließen'}
                </button>
            </div>
            ${this.renderArticleMeta(lesson, canEdit)}
            <div class="lesson-body">
                ${contentHtml}
            </div>
        `;

        lessonWrapper.querySelector('.toggle-lesson-btn').addEventListener('click', () => this.toggleLesson(lesson.id, !isCompleted));
        
        const deleteBtn = lessonWrapper.querySelector('.delete-article-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteArticle(lesson.id, lesson.title, subjectId));
        }

        return lessonWrapper;
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
                    <a href="${window.BASE_URL}/editor?id=${lesson.id}" class="btn btn-secondary" title="Bearbeiten">
                        <i class="ph ph-pencil-simple"></i>
                    </a>
                    <button class="btn btn-danger delete-article-btn" data-id="${lesson.id}" title="Löschen">
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
            const lessonWrapper = document.getElementById(`lesson-${lessonId}`);
            if (lessonWrapper) {
                const btn = lessonWrapper.querySelector('.toggle-lesson-btn');
                btn.className = `btn ${markAsCompleted ? 'btn-secondary' : 'btn-success'} toggle-lesson-btn`;
                btn.innerHTML = `<i class="ph ${markAsCompleted ? 'ph-arrow-counter-clockwise' : 'ph-check'}"></i> ${markAsCompleted ? 'Als ungelesen markieren' : 'Abschließen'}`;
                
                // Re-attach listener
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', () => this.toggleLesson(lessonId, !markAsCompleted));
            }

            const tocLink = document.querySelector(`.toc-link[href="#lesson-${lessonId}"]`);
            if (tocLink) {
                tocLink.classList.toggle('completed', markAsCompleted);
                const icon = tocLink.querySelector('.toc-icon');
                icon.className = markAsCompleted ? 'ph-fill ph-check-circle toc-icon' : 'ph ph-circle toc-icon';
            }
        } catch (error) {
            console.error('Error toggling progress:', error);
        }
    }

    async deleteArticle(articleId, title, subjectId) {
        if (!confirm(`Beitrag "${title}" wirklich löschen?`)) return;
        try {
            await ApiService.articles.delete(articleId);
            this.switchTab(subjectId);
        } catch (e) {
            alert(e.message || 'Fehler beim Löschen.');
        }
    }
}
