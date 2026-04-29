/* helpers/Skeleton.js */

export const Skeleton = {
    /**
     * Erzeugt Skeleton-Cards für das Dashboard.
     * @param {number} count Anzahl der anzuzeigenden Platzhalter.
     */
    getDashboardLoaders(count = 3) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
                <div class="skeleton-card">
                    <div class="skeleton skeleton-card-icon"></div>
                    <div class="skeleton skeleton-title" style="width: 80%;"></div>
                    <div class="skeleton-progress" style="margin-top: auto;">
                        <div class="skeleton skeleton-text" style="height: 8px; margin-bottom: 8px;"></div>
                        <div class="skeleton skeleton-text short" style="height: 12px; width: 30%;"></div>
                    </div>
                </div>
            `;
        }
        return html;
    },

    /**
     * Erzeugt Skeleton-Items für das Inhaltsverzeichnis (TOC).
     * @param {number} count Anzahl der Zeilen.
     */
    getTOCLoaders(count = 5) {
        let html = '<div class="toc-container" style="opacity: 0.7;">';
        html += '<div class="skeleton skeleton-title" style="width: 50%; margin: 1rem 0 1.5rem 0;"></div>';
        html += '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
        for (let i = 0; i < count; i++) {
            const width = 60 + Math.random() * 30; // Zufällige Breite für natürlicheren Look
            html += `<div class="skeleton skeleton-toc-item" style="width: ${width}%;"></div>`;
        }
        html += '</div></div>';
        return html;
    },

    /**
     * Erzeugt Skeleton-Inhalt für eine Lektion.
     */
    getLessonLoader() {
        return `
            <div class="content-card learning-content" style="opacity: 0.7;">
                <div class="skeleton skeleton-header" style="width: 70%;"></div>
                <div class="article-meta" style="border: none; margin-bottom: 2rem;">
                    <div class="skeleton skeleton-text short" style="margin-right: 1rem;"></div>
                    <div class="skeleton skeleton-text short"></div>
                </div>
                <div class="skeleton-body">
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text medium"></div>
                    <br>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text medium"></div>
                    <br>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text short"></div>
                </div>
            </div>
        `;
    }
};
