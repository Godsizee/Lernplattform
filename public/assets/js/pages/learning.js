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
});
