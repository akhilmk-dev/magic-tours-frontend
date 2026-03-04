const API_URL = 'https://magic-apis.staff-b0c.workers.dev';

class ApiClient {
    constructor() {
        if (typeof window !== 'undefined') {
            this.accessToken = localStorage.getItem('accessToken');
            this.refreshToken = localStorage.getItem('refreshToken');
        } else {
            this.accessToken = null;
            this.refreshToken = null;
        }
    }

    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        // If body is FormData, let browser set Content-Type with boundary
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        let response = await fetch(url, { ...options, headers });

        // Handle session expiry and refresh token
        if (response.status === 401 && this.refreshToken) {
            try {
                const refreshResponse = await fetch(`${API_URL}/customers/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken: this.refreshToken }),
                });

                if (refreshResponse.ok) {
                    const { accessToken } = await refreshResponse.json();
                    this.setAccessToken(accessToken);
                    headers['Authorization'] = `Bearer ${accessToken}`;
                    // Re-check FormData header removal on retry
                    if (options.body instanceof FormData) {
                        delete headers['Content-Type'];
                    }
                    response = await fetch(url, { ...options, headers });
                } else {
                    this.logout();
                }
            } catch (error) {
                this.logout();
            }
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Something went wrong');
        }

        return response.json();
    }

    setTokens(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        }
    }

    setAccessToken(accessToken) {
        this.accessToken = accessToken;
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
        }
    }

    async logout() {
        if (this.refreshToken) {
            try {
                await fetch(`${API_URL}/customers/logout`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken: this.refreshToken }),
                });
            } catch (e) {
                console.error('Logout failed on server');
            }
        }
        this.accessToken = null;
        this.refreshToken = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    }

    get(endpoint) { return this.request(endpoint, { method: 'GET' }); }

    post(endpoint, data) {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return this.request(endpoint, { method: 'POST', body });
    }

    put(endpoint, data) {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return this.request(endpoint, { method: 'PUT', body });
    }
    delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

export const api = new ApiClient();
