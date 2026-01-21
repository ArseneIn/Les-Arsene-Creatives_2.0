/**
 * API Configuration
 * 
 * This file handles the destination of our API calls.
 * 
 * DEVELOPMENT (Your Laptop):
 * When running 'npm run dev', import.meta.env.DEV is true.
 * We point to your XAMPP server: http://localhost/akwos/api
 * 
 * PRODUCTION (Bluehost):
 * When you build the app, import.meta.env.DEV is false.
 * We use a relative path '/api', meaning it looks for the folder on the same server.
 */

export const API_BASE_URL = import.meta.env.DEV
    ? "http://localhost/akwos/api"
    : "/website_e4da3417/api";

export const ASSET_BASE_URL = import.meta.env.DEV
    ? "http://localhost/akwos"
    : "/website_e4da3417";

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Helper function to get full Asset URL
export const getAssetUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${ASSET_BASE_URL}${cleanPath}`;
};
