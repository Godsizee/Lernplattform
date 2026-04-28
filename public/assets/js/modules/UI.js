export class UI {
    constructor(app) {
        this.app = app;
    }

    async toggleTheme() {
        const isLight = document.body.classList.toggle('light-mode');
        const icon = document.getElementById('theme-icon');
        const text = document.getElementById('theme-text');
        
        if (icon) {
            icon.className = isLight ? 'ph ph-sun' : 'ph ph-moon';
        }
        if (text) {
            text.textContent = isLight ? 'Light Mode' : 'Dark Mode';
        }
        
        if (this.app.user) {
            try {
                await fetch('../api/profile.php?action=update_theme', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ theme: isLight ? 'light' : 'dark' })
                });
            } catch (error) {
                console.error('Failed to save theme preference', error);
            }
        }
    }

    updateStreak(streak) {
        const sc = document.getElementById('streak-counter');
        if (sc) {
            sc.innerText = `${streak || 0} Tage Streak!`;
        }
    }

    async refreshGlobalTopBar() {
        if (!this.app.user) return;
        
        try {
            const res = await fetch('../api/content.php?action=dashboard');
            if (!res.ok) return;
            const data = await res.json();
            
            this.updateStreak(data.streak);
            
            let totalLessons = 0;
            let completedLessons = 0;
            
            if (data.progress) {
                Object.values(data.progress).forEach(p => {
                    totalLessons += parseInt(p.total_lessons || 0, 10);
                    completedLessons += parseInt(p.completed_lessons || 0, 10);
                });
            }
            
            const globalPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
            // Progress Bar removed from UI
            
        } catch (error) {
            console.error('Error refreshing global topbar:', error);
        }
    }
}
