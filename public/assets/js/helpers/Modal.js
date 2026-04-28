/* helpers/Modal.js */
export const Modal = {
    confirm(message, options = {}) {
        const {
            title = 'Bist du sicher?',
            confirmText = 'Ja, löschen',
            cancelText = 'Abbrechen',
            icon = 'ph-warning-circle'
        } = options;

        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            
            overlay.innerHTML = `
                <div class="modal-container">
                    <div class="modal-header">
                        <i class="ph ${icon}"></i>
                        <h3 class="modal-title">${title}</h3>
                    </div>
                    <div class="modal-body">${message}</div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary modal-cancel">${cancelText}</button>
                        <button class="btn btn-danger modal-confirm">${confirmText}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            
            // Trigger animation
            requestAnimationFrame(() => overlay.classList.add('active'));

            const cleanup = (result) => {
                overlay.classList.remove('active');
                overlay.addEventListener('transitionend', () => {
                    overlay.remove();
                    resolve(result);
                });
            };

            overlay.querySelector('.modal-confirm').onclick = () => cleanup(true);
            overlay.querySelector('.modal-cancel').onclick = () => cleanup(false);
            
            // Close on backdrop click
            overlay.onclick = (e) => {
                if (e.target === overlay) cleanup(false);
            };
        });
    }
};
