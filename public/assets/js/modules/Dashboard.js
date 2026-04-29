/* modules/Dashboard.js */
import { ApiService } from '../services/ApiService.js';
import { Skeleton } from '../helpers/Skeleton.js';

export class Dashboard {
    constructor() {}

    async loadData() {
        const container = document.getElementById('dashboard-subjects-container');
        if (!container) return;

        container.innerHTML = Skeleton.getDashboardLoaders(4);

        try {
            const data = await ApiService.content.getDashboard();
            container.innerHTML = '';
            
            data.subjects.forEach(subject => {
                const progress = data.progress[subject.id] || { total_lessons: 0, completed_lessons: 0 };
                const percentage = progress.total_lessons > 0 
                    ? Math.round((progress.completed_lessons / progress.total_lessons) * 100) 
                    : 0;
                
                container.appendChild(this.createSubjectCard(subject, percentage));
            });

            // Lesezeichen laden
            await this.loadBookmarks();

            // Streak Update (ehemals in UI.js)
            this.updateStreakUI(data.streak);

        } catch (error) {
            container.innerHTML = `<div class="form-error">Fehler beim Laden des Dashboards.</div>`;
        }
    }

    async loadBookmarks() {
        const container = document.getElementById('dashboard-bookmarks-container');
        if (!container) return;

        try {
            const bookmarks = await ApiService.student.getBookmarks();
            container.innerHTML = '';

            if (bookmarks.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="ph ph-bookmark-simple" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        <p>Du hast noch keine Lektionen markiert.<br>Klicke auf das Lesezeichen-Symbol in einer Lektion, um sie hier zu speichern.</p>
                    </div>
                `;
                container.style.display = 'block'; // Ensure it's not hidden
                return;
            }

            bookmarks.forEach(bm => {
                container.appendChild(this.createBookmarkCard(bm));
            });
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            container.innerHTML = `<p class="form-error">Lesezeichen konnten nicht geladen werden.</p>`;
        }
    }

    createBookmarkCard(bm) {
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        card.style.setProperty('--subject-color', bm.subject_color);
        
        const dateStr = new Date(bm.bookmarked_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });

        card.innerHTML = `
            <div class="bookmark-info">
                <span class="bookmark-subject">${bm.subject_title}</span>
                <h3 class="bookmark-title">${bm.title}</h3>
            </div>
            <div class="bookmark-footer">
                <span>Gemerkt am ${dateStr}</span>
                <i class="ph ph-arrow-right"></i>
            </div>
        `;

        card.addEventListener('click', () => {
            window.Router.navigate(`/learning?subject=${bm.subject_id}&lesson=${bm.id}`);
        });

        return card;
    }

    updateStreakUI(streak) {
        const sc = document.getElementById('streak-counter');
        if (sc) sc.innerText = `${streak || 0} Tage Streak!`;
    }

    createSubjectCard(subject, percentage) {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.style.setProperty('--subject-color', subject.color);
        card.dataset.subject = subject.id;

        const iconHtml = this.getIconHtml(subject);

        card.innerHTML = `
            <div class="card-icon">${iconHtml}</div>
            <h3>${subject.title}</h3>
            <div class="card-progress">
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percentage}%;"></div>
                </div>
                <span>${percentage}%</span>
            </div>
        `;

        card.addEventListener('click', () => {
            localStorage.setItem('active_subject', subject.id);
            window.Router.navigate('/learning');
        });

        return card;
    }

    getIconHtml(subject) {
        if (subject.icon.startsWith('ph-')) {
            const iconMap = {
                'ph-database': 'sql.png', 
                'ph-chart-bar': 'bwl.png', 
                'ph-buildings': 'sap.png', 
                'ph-coffee': 'java.png'
            };
            if (iconMap[subject.icon]) {
                return `<img src="${window.BASE_URL}/assets/img/icons/${iconMap[subject.icon]}" class="subject-icon-img" alt="${subject.title}">`;
            }
            return `<i class="${subject.icon}"></i>`;
        }
        
        if (subject.icon.endsWith('.png') || subject.icon.endsWith('.svg')) {
            return `<img src="${window.BASE_URL}/assets/img/icons/${subject.icon}" class="subject-icon-img" alt="${subject.title}">`;
        }
        
        return `<i class="${subject.icon}"></i>`;
    }
}
