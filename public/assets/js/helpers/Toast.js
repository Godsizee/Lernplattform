/* helpers/Toast.js */
export const Toast = {
    container: null,

    init() {
        if (this.container) return;
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    },

    show(msg, type = 'info', duration = 4000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <i class="ph ${icon}"></i>
            <span>${msg}</span>
        `;

        this.container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('toast-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, duration);
    },

    success(msg) {
        this.show(msg, 'success');
    },

    error(msg) {
        this.show(msg, 'error');
    },

    info(msg) {
        this.show(msg, 'info');
    },

    getIcon(type) {
        switch (type) {
            case 'success': return 'ph-check-circle';
            case 'error': return 'ph-x-circle';
            case 'info': return 'ph-info';
            default: return 'ph-bell';
        }
    }
};
