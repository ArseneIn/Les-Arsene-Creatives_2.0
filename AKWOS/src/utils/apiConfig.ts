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
    ? "http://localhost/akwos/api"  // Point to XAMPP when working locally
    : "/api";                       // Point to relative path when online

// Helper function to get full URL
export const getApiUrl = (endpoint: string) => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};
