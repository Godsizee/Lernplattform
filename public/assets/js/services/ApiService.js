/* services/ApiService.js */
export class ApiService {
    static async request(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${window.BASE_URL}/api/${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                ...options.headers,
            }
        };

        // Wenn body kein FormData ist, JSON Content-Type setzen
        if (config.body && !(config.body instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        // CSRF Token automatisch hinzufügen, falls vorhanden
        if (config.method && config.method.toUpperCase() !== 'GET') {
            const token = document.querySelector('meta[name="csrf-token"]')?.content;
            if (token) {
                config.headers['X-CSRF-Token'] = token;
            }
        }

        try {
            const response = await fetch(url, config);
            
            // Bei 401 (Unauthorized) evtl. zum Login leiten
            if (response.status === 401 && !url.includes('auth.php')) {
                window.location.href = `${window.BASE_URL}/login`;
                return null;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Request Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // Domain-spezifische Helfer
    static auth = {
        login: (credentials) => this.request('auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        register: (data) => this.request('auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        logout: () => this.request('auth/logout')
    };

    static content = {
        getSubjects: () => this.request('content/subjects'),
        getLessons: (subjectId, listOnly = false) => this.request(`content/lessons?subject_id=${subjectId}${listOnly ? '&list_only=1' : ''}`),
        getDashboard: () => this.request('content/dashboard'),
        search: (query) => this.request(`search?q=${encodeURIComponent(query)}`)
    };

    static media = {
        upload: (file) => {
            const formData = new FormData();
            formData.append('image', file);
            return this.request('media/upload', {
                method: 'POST',
                body: formData
            });
        }
    };

    static progress = {
        toggle: (lessonId, completed, score = null) => this.request('progress/toggle', {
            method: 'POST',
            body: JSON.stringify({ lesson_id: lessonId, completed, score })
        })
    };

    static profile = {
        get: () => this.request('profile/get'),
        update: (data) => this.request('profile/update', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        updateTheme: (theme) => this.request('profile/theme', {
            method: 'POST',
            body: JSON.stringify({ theme })
        })
    };

    static admin = {
        getDashboard: () => ApiService.request('admin/dashboard'),
        getUsers: () => ApiService.request('admin/users'),
        setRole: (userId, role) => ApiService.request('admin/set-role', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, role })
        }),
        deleteUser: (userId) => ApiService.request('admin/delete-user', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId })
        }),
        toggleBan: (userId, status) => ApiService.request('admin/users/ban', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, status })
        }),
        impersonate: (userId) => ApiService.request('admin/impersonate', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId })
        }),
        getAuditLogs: (userId = '') => ApiService.request(`admin/audit${userId ? '?user_id=' + userId : ''}`),
        getContent: () => ApiService.request('admin/content'),
        updateLessonOrder: (orders) => ApiService.request('admin/lessons/reorder', {
            method: 'POST',
            body: JSON.stringify({ orders })
        }),
        cloneLesson: (lessonId) => ApiService.request('admin/lessons/clone', {
            method: 'POST',
            body: JSON.stringify({ lesson_id: lessonId })
        }),
        bulkStatus: (ids, status) => ApiService.request('admin/lessons/bulk-status', {
            method: 'POST',
            body: JSON.stringify({ ids, status })
        }),
        bulkDelete: (ids) => ApiService.request('admin/lessons/bulk-delete', {
            method: 'POST',
            body: JSON.stringify({ ids })
        }),
        saveSubject: (data) => ApiService.request('admin/subjects', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        deleteSubject: (id) => ApiService.request('admin/subjects/delete', {
            method: 'POST',
            body: JSON.stringify({ id })
        }),
        getSystemSettings: () => ApiService.request('admin/system/settings'),
        saveSystemSettings: (data) => ApiService.request('admin/system/settings', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    };

    static articles = {
        save: (data) => this.request('articles', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => this.request(`articles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => this.request(`articles/${id}`, {
            method: 'DELETE'
        }),
        get: (id) => this.request(`articles/${id}`)
    };

    static log = {
        add: (action, details) => this.request('log', {
            method: 'POST',
            body: JSON.stringify({ action, details })
        }).catch(() => {}) 
    };

    static student = {
        getBookmarks: () => this.request('student/bookmarks'),
        toggleBookmark: (lessonId) => this.request('student/bookmarks/toggle', {
            method: 'POST',
            body: JSON.stringify({ lesson_id: lessonId })
        }),
        getNote: (lessonId) => this.request(`student/notes/${lessonId}`),
        saveNote: (lessonId, content) => this.request('student/notes', {
            method: 'POST',
            body: JSON.stringify({ lesson_id: lessonId, content })
        })
    };
}