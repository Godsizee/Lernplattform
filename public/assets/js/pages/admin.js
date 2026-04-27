import { Admin } from '../modules/Admin.js';

document.addEventListener('DOMContentLoaded', async () => {
    const admin = new Admin({
        container: document.getElementById('view-container')
    });

    await admin.loadAdminData();

    // Tabs
    document.querySelectorAll('#admin-tabs .learning-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#admin-tabs .learning-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.admin-panel').forEach(p => p.style.display = 'none');
            const targetPanel = document.getElementById(tab.dataset.target);
            if (targetPanel) targetPanel.style.display = 'block';
        });
    });

    // Filter
    document.getElementById('audit-user-filter').addEventListener('change', (e) => {
        admin.loadAuditLogs(e.target.value);
    });

    // Delegierte Events (Rollen ändern, User löschen)
    document.getElementById('admin-users').addEventListener('change', (e) => {
        if (e.target.classList.contains('admin-role-select')) {
            admin.adminSetRole(e.target.dataset.id, e.target.value);
        }
    });

    document.getElementById('admin-users').addEventListener('click', (e) => {
        const delBtn = e.target.closest('.admin-del-user');
        if (delBtn) {
            admin.adminDeleteUser(delBtn.dataset.id);
        }
    });
});