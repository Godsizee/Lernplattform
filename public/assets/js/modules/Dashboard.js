export class Dashboard {
    constructor() {}

    async loadData() {
        try {
            const res = await fetch('../api/content.php?action=dashboard');
            if (!res.ok) return;
            const data = await res.json();
            

            const container = document.getElementById('dashboard-subjects-container');
            if (!container) return;
            
            container.innerHTML = '';
            
            data.subjects.forEach(subject => {
                const progress = data.progress[subject.id] || { total_lessons: 0, completed_lessons: 0 };
                const percentage = progress.total_lessons > 0 
                    ? Math.round((progress.completed_lessons / progress.total_lessons) * 100) 
                    : 0;
                
                const card = this.createSubjectCard(subject, percentage);
                container.appendChild(card);
            });

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    createSubjectCard(subject, percentage) {
        const base = window.APP_BASE || '/files/lernplattform/public/';
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.style.setProperty('--subject-color', subject.color);
        card.dataset.subject = subject.id;

        let iconHtml = `<i class="${subject.icon}"></i>`;
        if (subject.icon.startsWith('ph-')) {
            const iconMap = {
                'ph-database': 'sql.png', 
                'ph-chart-bar': 'bwl.png', 
                'ph-buildings': 'sap.png', 
                'ph-coffee': 'java.png'
            };
            if (iconMap[subject.icon]) {
                iconHtml = `<img src="${base}assets/img/icons/${iconMap[subject.icon]}" class="subject-icon-img" alt="${subject.title}">`;
            }
        } else if (subject.icon.endsWith('.png') || subject.icon.endsWith('.svg')) {
            iconHtml = `<img src="${base}assets/img/icons/${subject.icon}" class="subject-icon-img" alt="${subject.title}">`;
        }

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
            window.location.href = base + 'lernen';
        });

        return card;
    }
}
