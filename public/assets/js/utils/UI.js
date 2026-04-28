/* utils/UI.js */
export class UI {
    /**
     * Toggles a loading spinner on a button.
     * @param {HTMLButtonElement} button 
     * @param {boolean} isLoading 
     * @param {string} [originalText] - Optional fallback if dataset is not used.
     */
    static setLoading(button, isLoading, originalText = '') {
        if (!button) return;

        if (isLoading) {
            // Save current content if not already saved
            button.dataset.origText = button.innerHTML;
            button.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i>';
            button.disabled = true;
        } else {
            // Restore original content
            button.innerHTML = originalText || button.dataset.origText || 'Speichern';
            button.disabled = false;
        }
    }
}
