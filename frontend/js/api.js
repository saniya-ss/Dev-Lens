// API Configuration
const API_BASE_URL = 'https://dev-lenss.netlify.app/api';

// API Helper Functions
class API {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication APIs
    static async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    static async logout() {
        return this.request('/auth/logout', {
            method: 'POST'
        });
    }

    static async getMe() {
        return this.request('/auth/me');
    }

    // Project APIs
    static async getProjects() {
        return this.request('/projects');
    }

    static async createProject(projectData) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    }

    static async getProject(id) {
        return this.request(`/projects/${id}`);
    }

    static async updateProject(id, projectData) {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(projectData)
        });
    }

    static async deleteProject(id) {
        return this.request(`/projects/${id}`, {
            method: 'DELETE'
        });
    }
}

// Utility functions
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';

    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}