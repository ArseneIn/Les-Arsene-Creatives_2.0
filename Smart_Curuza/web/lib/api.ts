

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.84:3001';

export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            (headers as any)['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null as T;
}

export const api = {
    get: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: any) => fetchApi<T>(endpoint, {
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body)
    }),
    put: <T>(endpoint: string, body: any) => fetchApi<T>(endpoint, {
        method: 'PUT',
        body: body instanceof FormData ? body : JSON.stringify(body)
    }),
    patch: <T>(endpoint: string, body: any) => fetchApi<T>(endpoint, {
        method: 'PATCH',
        body: body instanceof FormData ? body : JSON.stringify(body)
    }),
    delete: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'DELETE' }),
    fetchApi // Export raw fetchApi for SyncService
};
