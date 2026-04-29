/* pages/learning.js */
import { Learning } from '../modules/Learning.js';

export default async function init() {
    const learning = new Learning();
    await learning.loadData();

    // Event Delegation für Tabs und Lektionen
    const container = document.getElementById('view-container');
    if (container) {
        container.addEventListener('click', (e) => {
            const learnTab = e.target.closest('.learning-tab');
            if (learnTab) {
                learning.switchTab(learnTab.dataset.subjectId, learnTab.textContent);
            }
        });
    }
}
