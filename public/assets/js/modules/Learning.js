export class Learning {
    constructor(app) {
        this.app = app;
        this.lessonsData = [];
        this.subjectsData = [];
        this.activeSubjectId = null;
    }

    async loadData() {
        try {
            const res = await fetch('../api/content.php?action=lessons');
            if (!res.ok) return;
            this.lessonsData = await res.json();
            
            const subMap = {};
            this.lessonsData.forEach(l => {
                if (!subMap[l.subject_id]) {
                    subMap[l.subject_id] = { id: l.subject_id, title: l.subject_title };
                }
            });
            this.subjectsData = Object.values(subMap);
            
            this.renderTabs();
        } catch (error) {
            console.error('Error loading learning data:', error);
        }
    }

    renderTabs() {
        const tabsContainer = document.getElementById('learning-tabs-container');
        if (!tabsContainer) return;

        if (this.subjectsData.length > 0) {
            if (window.activeSubjectRequest && this.subjectsData.find(s => s.id == window.activeSubjectRequest)) {
                this.activeSubjectId = window.activeSubjectRequest;
                window.activeSubjectRequest = null;
            } else if (!this.activeSubjectId || !this.subjectsData.find(s => s.id == this.activeSubjectId)) {
                this.activeSubjectId = this.subjectsData[0].id;
            }

            tabsContainer.innerHTML = '';
            this.subjectsData.forEach(subject => {
                const btn = document.createElement('button');
                btn.className = `learning-tab ${subject.id == this.activeSubjectId ? 'active' : ''}`;
                btn.dataset.subjectId = subject.id;
                btn.textContent = subject.title;
                btn.addEventListener('click', () => this.switchTab(subject.id, subject.title));
                tabsContainer.appendChild(btn);
            });
            
            this.renderSubjectLessons();
        } else {
            document.getElementById('learning-content-container').innerHTML = '<p>Keine Lektionen vorhanden.</p>';
        }
    }

    switchTab(subjectId, subjectTitle) {
        document.querySelectorAll('#learning-tabs-container .learning-tab').forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`#learning-tabs-container .learning-tab[data-subject-id="${subjectId}"]`);
        if (activeTab) activeTab.classList.add('active');

        this.activeSubjectId = subjectId;
        this.renderSubjectLessons();

        fetch('../api/log.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'VIEW_SUBJECT', details: `Fach geöffnet: ${subjectTitle}` })
        }).catch(() => {});
    }

    renderSubjectLessons() {
        const container = document.getElementById('learning-content-container');
        if (!container) return;

        const lessons = this.lessonsData.filter(l => l.subject_id == this.activeSubjectId);
        
        if (lessons.length === 0) {
            container.innerHTML = '<p style="color:var(--text-secondary)">Keine Lektionen in diesem Fach.</p>'; 
            return;
        }

        container.innerHTML = '';
        
        // --- Inhaltsverzeichnis (TOC) rendern ---
        const tocWrapper = document.createElement('div');
        tocWrapper.className = 'content-card toc-card';
        tocWrapper.innerHTML = `<h3>Inhaltsverzeichnis</h3>`;
        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';
        
        lessons.forEach((lesson, index) => {
            const anchorId = `lesson-${lesson.id}`;
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${anchorId}`;
            link.className = 'toc-link';
            link.textContent = `${index + 1}. ${lesson.title}`;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(anchorId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            
            li.appendChild(link);
            tocList.appendChild(li);
        });
        tocWrapper.appendChild(tocList);
        container.appendChild(tocWrapper);
        // ----------------------------------------

        lessons.forEach(lesson => {
            const isCompleted = lesson.status === 'completed';
            const btnClass = isCompleted ? 'btn-secondary' : 'btn-primary';
            const btnIcon = isCompleted ? 'ph-arrow-counter-clockwise' : 'ph-check';
            const btnText = isCompleted ? 'Fortschritt zurücksetzen' : 'Lektion abschließen';
            const statusTarget = isCompleted ? 'pending' : 'completed';
            
            const lessonWrapper = document.createElement('div');
            // Sprungmarken-ID für Inhaltsverzeichnis definieren und Padding ergänzen für Sticky Headers
            lessonWrapper.id = `lesson-${lesson.id}`;
            lessonWrapper.style.marginBottom = '3rem';
            lessonWrapper.style.scrollMarginTop = '100px'; 
            
            lessonWrapper.innerHTML = `
                <header class="view-header" style="margin-bottom: 1rem;">
                    <h2 style="font-size: 1.5rem;">${lesson.title}</h2>
                </header>
                <article class="content-card lesson-content-article">
                    ${lesson.content}
                    <div class="action-bar" style="margin-top: 2rem; display: flex; justify-content: flex-end; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;">
                        <button class="btn ${btnClass}" id="toggle-lesson-btn" data-lesson-id="${lesson.id}" data-status="${statusTarget}">
                            <i class="ph-bold ${btnIcon}"></i> ${btnText}
                        </button>
                    </div>
                </article>
            `;

            const btn = lessonWrapper.querySelector('#toggle-lesson-btn');
            btn.addEventListener('click', () => this.toggleLesson(btn, lesson.id, statusTarget));

            container.appendChild(lessonWrapper);
        });
    }

    async toggleLesson(btn, lessonId, targetStatus) {
        const origHtml = btn.innerHTML;
        try {
            btn.innerHTML = `<i class="ph ph-spinner-gap ph-spin"></i>`; 
            btn.disabled = true;
            
            const res = await fetch('../api/progress.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lesson_id: lessonId, status: targetStatus })
            });
            
            if (res.ok) {
                const lesson = this.lessonsData.find(x => x.id == lessonId);
                if (lesson) {
                    lesson.status = targetStatus;
                    fetch('../api/log.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: targetStatus === 'completed' ? 'LESSON_COMPLETED' : 'LESSON_RESET', 
                            details: `Lektion: ${lesson.title}`
                        })
                    }).catch(() => {});
                }
                this.renderSubjectLessons();
                this.app.ui.refreshGlobalTopBar();
            } else {
                throw new Error('Failed to update progress');
            }
        } catch (error) {
            btn.innerHTML = origHtml;
            btn.disabled = false;
            alert('Fehler beim Speichern des Fortschritts.');
        }
    }
}
