import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Product, CreateSaleDto } from './types';

// Android emulator uses 10.0.2.2 to access host localhost
// Real device would need the actual LAN IP of the computer
// Use LAN IP for physical devices (both iOS and Android) to reach the backend
const BASE_URL = 'http://192.168.1.69:3001';

// Caching system
type CacheEntry = {
    data: any;
    timestamp: number;
};

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes cache by default

let onUnauthorizedCallback: () => void = () => {
    console.warn('ApiClient: 401 Unauthorized detected but no callback registered.');
};

async function getHeaders() {
    const token = await SecureStore.getItemAsync('auth_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
}

/**
 * Enhanced ApiClient with:
 * 1. Global 401 handling
 * 2. Automated caching for GET requests
 * 3. Centralized fetch logic
 */
export const ApiClient = {
    /**
     * Register a callback to be executed when a 401 Unauthorized error occurs.
     */
    onUnauthorized(callback: () => void) {
        onUnauthorizedCallback = callback;
    },

    /**
     * Manually clear the cache (useful on logout)
     */
    clearCache() {
        cache.clear();
        console.log('ApiClient: Cache cleared');
    },

    /**
     * Synchronously check if valid cached data exists
     */
    getCached(endpoint: string) {
        const url = `${BASE_URL}${endpoint}`;
        const cached = cache.get(url);
        if (cached && (Date.now() - cached.timestamp < DEFAULT_TTL)) {
            return cached.data;
        }
        return null;
    },

    /**
     * Internal request helper
     */
    async _request(endpoint: string, options: any = {}, useCache = false, ttl = DEFAULT_TTL) {
        const url = `${BASE_URL}${endpoint}`;
        const isGet = !options.method || options.method === 'GET';

        // 1. Check Cache
        if (isGet && useCache) {
            const cached = cache.get(url);
            if (cached && (Date.now() - cached.timestamp < ttl)) {
                // Return cached data immediately
                return cached.data;
            }
        }

        // 2. Prepare request
        const headers = await getHeaders();
        const config = {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        };

        // 3. Execute request
        try {
            const response = await fetch(url, config);

            // 4. Handle Unauthorized
            if (response.status === 401) {
                onUnauthorizedCallback();
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(errorBody || `HTTP ${response.status}`);
            }

            const data = await response.json();

            // 5. Update Cache
            if (isGet && useCache) {
                cache.set(url, { data, timestamp: Date.now() });
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    async login(credentials: { phone?: string; pin?: string; email?: string; password?: string }) {
        try {
            // Login bypasses the central _request because it's the one establishing auth
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Login Failed: ${response.status} - ${errorBody}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async getProducts(bypassCache = false): Promise<Product[]> {
        return this._request('/products', {}, !bypassCache);
    },

    async createProduct(product: any): Promise<Product> {
        return this._request('/products', {
            method: 'POST',
            body: JSON.stringify(product),
        });
    },

    async updateProduct(id: string, product: any): Promise<Product> {
        return this._request(`/products/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(product),
        });
    },

    async toggleProductStatus(id: string, status: string): Promise<Product> {
        return this._request(`/products/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },

    async createSale(saleData: CreateSaleDto): Promise<any> {
        return this._request('/sales', {
            method: 'POST',
            body: JSON.stringify(saleData),
        });
    },

    async getDashboardStats(period: string = 'today', bypassCache = false): Promise<any> {
        return this._request(`/dashboard/stats?period=${period}`, {}, !bypassCache);
    },

    async getSalesHistory(limit?: number, bypassCache = false): Promise<any[]> {
        const endpoint = limit ? `/sales/recent?limit=${limit}` : '/sales';
        return this._request(endpoint, {}, !bypassCache);
    },

    async getSalesExport(period: string): Promise<{ summary: any[], details: any[] }> {
        return this._request(`/sales/export?period=${period}`);
    },

    async refundSale(saleId: string, reason: string, restock: boolean): Promise<any> {
        return this._request(`/sales/${saleId}/refund`, {
            method: 'POST',
            body: JSON.stringify({ reason, restock }),
        });
    },

    async getMerchantProfile(bypassCache = false): Promise<any> {
        return this._request('/merchants/profile', {}, !bypassCache);
    },

    async updateMerchantProfile(profile: any): Promise<any> {
        return this._request('/merchants/profile', {
            method: 'PUT',
            body: JSON.stringify(profile),
        });
    },

    async createBatch(batchData: any): Promise<any> {
        return this._request('/batches', {
            method: 'POST',
            body: JSON.stringify(batchData),
        });
    },

    async createExpense(expenseData: any): Promise<any> {
        return this._request('/expenses', {
            method: 'POST',
            body: JSON.stringify(expenseData),
        });
    },

    async getExpenses(startDate?: string, endDate?: string, bypassCache = false): Promise<any[]> {
        let endpoint = '/expenses';
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (params.toString()) endpoint += `?${params.toString()}`;

        return this._request(endpoint, {}, !bypassCache);
    },

    async getExpensesSummary(startDate?: string, endDate?: string, bypassCache = false): Promise<any> {
        let endpoint = '/expenses/summary';
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (params.toString()) endpoint += `?${params.toString()}`;

        return this._request(endpoint, {}, !bypassCache);
    }
};
