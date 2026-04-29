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

            // Streak Update (ehemals in UI.js)
            this.updateStreakUI(data.streak);

        } catch (error) {
            container.innerHTML = `<div class="form-error">Fehler beim Laden des Dashboards.</div>`;
        }
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
            window.location.href = `${window.BASE_URL}/learning`;
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
