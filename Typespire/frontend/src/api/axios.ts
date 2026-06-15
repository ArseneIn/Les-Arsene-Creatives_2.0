import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1', // Backend URL with global prefix
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Extract message from backend (e.g. "Session expired. Logged in from another device.")
            const reason: string =
                error.response?.data?.message ||
                (error.response.status === 401 ? 'Your session has expired. Please log in again.' : '');
            window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { reason } }));
        }
        return Promise.reject(error);
    }
);

export default api;
