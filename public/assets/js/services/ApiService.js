/* services/ApiService.js */
export class ApiService {
    static async request(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${window.BASE_URL}/api/${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            }
        };

        // CSRF Token automatisch hinzufügen, falls vorhanden
        if (config.method && config.method.toUpperCase() !== 'GET') {
            const token = localStorage.getItem('csrf_token');
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
        login: (credentials) => this.request('auth.php?action=login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        register: (data) => this.request('auth.php?action=register', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        logout: () => this.request('auth.php?action=logout'),
        check: () => this.request('auth.php?action=check')
    };

    static content = {
        getSubjects: () => this.request('content.php?action=subjects'),
        getLessons: (subjectId) => this.request(`content.php?action=lessons&subject_id=${subjectId}`),
        getDashboard: () => this.request('content.php?action=dashboard'),
        search: (query) => this.request(`search.php?q=${encodeURIComponent(query)}`)
    };

    static progress = {
        toggle: (lessonId, completed) => this.request('progress.php', {
            method: 'POST',
            body: JSON.stringify({ lesson_id: lessonId, completed })
        })
    };

    static profile = {
        get: () => this.request('profile.php?action=get'),
        update: (data) => this.request('profile.php?action=update', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        updateTheme: (theme) => this.request('profile.php?action=update_theme', {
            method: 'POST',
            body: JSON.stringify({ theme })
        })
    };

    static admin = {
        getUsers: () => this.request('admin.php?action=users'),
        setRole: (userId, role) => this.request('admin.php?action=set_role', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, role })
        }),
        deleteUser: (userId) => this.request('admin.php?action=delete_user', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId })
        }),
        getAuditLogs: (userId = '') => this.request(`admin.php?action=audit${userId ? '&user_id=' + userId : ''}`)
    };

    static articles = {
        save: (data) => this.request('articles.php?action=save', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        delete: (id) => this.request('articles.php?action=delete', {
            method: 'POST',
            body: JSON.stringify({ id })
        }),
        get: (id) => this.request(`articles.php?action=get&id=${id}`)
    };

    static log = {
        add: (action, details) => this.request('log.php', {
            method: 'POST',
            body: JSON.stringify({ action, details })
        }).catch(() => {}) // Logs sind "fire and forget"
    };
}
