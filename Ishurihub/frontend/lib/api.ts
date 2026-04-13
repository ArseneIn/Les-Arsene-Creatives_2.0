import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('ishurihub_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors (like 401)
api.interceptors.response.use(
    (response) => {
        // Detect maintenance headers
        if (typeof window !== 'undefined') {
            const onAuthPage = window.location.pathname === '/login' ||
                window.location.pathname.startsWith('/portal') ||
                window.location.pathname.startsWith('/forgot-password');
            const isMaintenance = response.headers['x-maintenance-mode'] === 'true';
            const startsAt = response.headers['x-maintenance-starts-at'];
            
            if (!onAuthPage && (isMaintenance || startsAt)) {
                window.dispatchEvent(new CustomEvent('maintenance-status-changed', {
                    detail: { isMaintenance, startsAt }
                }));
            }
        }
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            if (error.response.status === 401) {
                // localStorage.removeItem('ishurihub_token');
                // window.location.href = '/login';
            }
            
            // Handle maintenance-specific error (503 Service Unavailable)
            if (error.response.status === 503) {
                if (typeof window !== 'undefined') {
                    const onAuthPage = window.location.pathname === '/login' ||
                        window.location.pathname.startsWith('/portal') ||
                        window.location.pathname.startsWith('/forgot-password');
                    if (!onAuthPage) {
                        window.dispatchEvent(new CustomEvent('maintenance-status-changed', {
                            detail: { isMaintenance: true }
                        }));
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
