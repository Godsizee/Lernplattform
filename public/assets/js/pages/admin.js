/* pages/admin.js */
import { Admin } from '../modules/Admin.js';

export default async function init() {
    const admin = new Admin({
        container: document.getElementById('view-container')
    });

    await admin.loadAdminData();

    // Tabs
    const tabs = document.querySelectorAll('#admin-tabs .learning-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.admin-panel').forEach(p => p.style.display = 'none');
            const targetPanel = document.getElementById(tab.dataset.target);
            if (targetPanel) targetPanel.style.display = 'block';
        });
    });

    // Filter
    const filter = document.getElementById('audit-user-filter');
    if (filter) {
        filter.addEventListener('change', (e) => {
            admin.loadAuditLogs(e.target.value);
        });
    }

    // Delegierte Events (Rollen ändern, User löschen)
    const usersTable = document.getElementById('admin-users');
    if (usersTable) {
        usersTable.addEventListener('change', (e) => {
            if (e.target.classList.contains('admin-role-select')) {
                admin.adminSetRole(e.target.dataset.id, e.target.value);
            }
        });

        usersTable.addEventListener('click', (e) => {
            const delBtn = e.target.closest('.admin-del-user');
            if (delBtn) {
                admin.adminDeleteUser(delBtn.dataset.id);
            }
        });
    }
}