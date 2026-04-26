import { Learning } from '../modules/Learning.js';

document.addEventListener('DOMContentLoaded', async () => {
    const learning = new Learning({
        container: document.getElementById('view-container')
    });

    await learning.loadData();

    // Event Delegation für Tabs und Lektionen
    document.getElementById('view-container').addEventListener('click', (e) => {
        const learnTab = e.target.closest('.learning-tab');
        if (learnTab) {
            learning.switchTab(learnTab.dataset.subjectId, learnTab.textContent);
        }
    });
    
    // Aktives Tab wiederherstellen (von Dashboard Klick)
    const activeSubj = localStorage.getItem('active_subject');
    if (activeSubj) {
        const tab = document.querySelector(`.learning-tab[data-subject-id="${activeSubj}"]`);
        if (tab) tab.click();
        localStorage.removeItem('active_subject');
    }
});
