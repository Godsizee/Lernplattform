export class Learning {
    constructor() {}

    async loadData() {
        try {
            const res = await fetch('../api/content.php?action=subjects');
            if (!res.ok) return;
            const subjects = await res.json();
            
            this.renderTabs(subjects);
            
            if (subjects.length > 0) {
                const activeId = localStorage.getItem('active_subject') || subjects[0].id;
                const activeTitle = subjects.find(s => s.id == activeId)?.title || subjects[0].title;
                this.switchTab(activeId, activeTitle);
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

        // Speichere das aktuelle Fach, damit es nach Reload erhalten bleibt
        localStorage.setItem('active_subject', subjectId);

        const container = document.getElementById('learning-content-container');
        if (!container) return;
        
        container.innerHTML = `<div class="loader"><i class="ph ph-spinner-gap ph-spin"></i> Lade Lektionen...</div>`;

        try {
            const res = await fetch(`../api/content.php?action=lessons&subject_id=${subjectId}`);
            const data = await res.json();
            
            if (data.lessons.length === 0) {
                container.innerHTML = `<div class="content-card"><p>Keine Lektionen in diesem Fach vorhanden.</p></div>`;
                return;
            }

            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
                    <h2 style="margin: 0; color: var(--color-primary); font-family: var(--font-display);">${titleText} Lektionen</h2>
                </div>
            `;

            // Observer für Lesetracking
            const readLessons = new Set();
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lId = entry.target.dataset.lessonId;
                        const lTitle = entry.target.dataset.lessonTitle;
                        if (!readLessons.has(lId)) {
                            readLessons.add(lId);
                            fetch('../api/log.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    action: 'LESSON_READ',
                                    details: `Liest die Lektion '${lTitle}'.`
                                })
                            }).catch(() => {});
                        }
                    }
                });
            }, { threshold: 0.5 });

            // TOC Rendern
            const tocWrapper = document.createElement('div');
            tocWrapper.className = 'content-card toc-card';
            tocWrapper.innerHTML = `<h3>Inhaltsverzeichnis</h3>`;
            const tocList = document.createElement('ul');
            tocList.className = 'toc-list';
            
            data.lessons.forEach(lesson => {
                const isCompleted = data.progress.includes(lesson.id);
                
                // TOC Item
                const li = document.createElement('li');
                li.className = 'toc-item';
                const link = document.createElement('a');
                link.href = `#lesson-${lesson.id}`;
                link.className = 'toc-link';
                if (isCompleted) link.classList.add('completed');
                
                const iconHtml = isCompleted ? `<i class="ph-fill ph-check-circle toc-icon"></i>` : `<i class="ph ph-circle toc-icon"></i>`;
                
                link.innerHTML = `
                    ${iconHtml}
                    <span class="toc-text">${window.escapeHTML(lesson.title)}</span>
                `;
                
                // Smooth scroll via JS
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.getElementById(`lesson-${lesson.id}`);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
                
                li.appendChild(link);
                tocList.appendChild(li);

                // Lektion Rendern
                const lessonWrapper = document.createElement('div');
                lessonWrapper.className = `content-card learning-content searchable-block fade-in`;
                lessonWrapper.id = `lesson-${lesson.id}`;
                lessonWrapper.dataset.lessonId = lesson.id;
                lessonWrapper.dataset.lessonTitle = lesson.title;
                lessonWrapper.style.marginBottom = '3rem';
                lessonWrapper.style.scrollMarginTop = '100px'; 
                
                lessonWrapper.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
                        <h2 style="margin:0; font-family: var(--font-display);">${window.escapeHTML(lesson.title)}</h2>
                        <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-success'} toggle-lesson-btn" 
                                data-lesson-id="${lesson.id}"
                                style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                            <i class="ph ${isCompleted ? 'ph-arrow-counter-clockwise' : 'ph-check'}"></i> 
                            ${isCompleted ? 'Als ungelesen markieren' : 'Abschließen'}
                        </button>
                    </div>
                    <div class="lesson-body" style="font-size: 1.05rem; line-height: 1.8; color: var(--text-primary);">
                        ${lesson.content}
                    </div>
                `;

                const btn = lessonWrapper.querySelector('.toggle-lesson-btn');
                btn.addEventListener('click', () => this.toggleLesson(lesson.id, !isCompleted));

                container.appendChild(lessonWrapper);
                observer.observe(lessonWrapper);
            });
            
            tocWrapper.appendChild(tocList);
            container.insertBefore(tocWrapper, container.children[1]); // Insert after the title

        } catch (error) {
            container.innerHTML = `<div class="form-error">Fehler beim Laden der Lektionen.</div>`;
        }
    }

    async toggleLesson(lessonId, markAsCompleted) {
        try {
            const res = await fetch('../api/progress.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lesson_id: lessonId, completed: markAsCompleted })
            });
            
            if (res.ok) {
                // DOM dynamisch updaten ohne die Seite neuzuladen
                const lessonWrapper = document.getElementById(`lesson-${lessonId}`);
                if (lessonWrapper) {
                    const btn = lessonWrapper.querySelector('.toggle-lesson-btn');
                    if (btn) {
                        btn.className = `btn ${markAsCompleted ? 'btn-secondary' : 'btn-success'} toggle-lesson-btn`;
                        btn.innerHTML = `<i class="ph ${markAsCompleted ? 'ph-arrow-counter-clockwise' : 'ph-check'}"></i> ${markAsCompleted ? 'Als ungelesen markieren' : 'Abschließen'}`;
                        const newBtn = btn.cloneNode(true);
                        btn.parentNode.replaceChild(newBtn, btn);
                        newBtn.addEventListener('click', () => this.toggleLesson(lessonId, !markAsCompleted));
                    }
                }

                const tocLink = document.querySelector(`.toc-link[href="#lesson-${lessonId}"]`);
                if (tocLink) {
                    const text = tocLink.querySelector('.toc-text').textContent;
                    if (markAsCompleted) {
                        tocLink.classList.add('completed');
                        tocLink.innerHTML = `<i class="ph-fill ph-check-circle toc-icon"></i><span class="toc-text">${text}</span>`;
                    } else {
                        tocLink.classList.remove('completed');
                        tocLink.innerHTML = `<i class="ph ph-circle toc-icon"></i><span class="toc-text">${text}</span>`;
                    }
                }
                
                // Fetch progress manually to update global bar if needed
                fetch('../api/content.php?action=dashboard').then(r=>r.json()).then(data => {
                     const bar = document.getElementById('global-progress-bar');
                     const txt = document.getElementById('global-progress-text');
                     if(bar && data.global_progress) bar.style.width = data.global_progress + '%';
                     if(txt && data.global_progress) txt.textContent = data.global_progress + '%';
                });
            }
        } catch (error) {
            console.error('Error toggling progress:', error);
        }
    }
}
