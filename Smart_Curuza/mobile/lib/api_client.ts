import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Product, CreateSaleDto } from './types';
import NetInfo from '@react-native-community/netinfo';
import { syncManager } from './sync/SyncManager';

// Android emulator uses 10.0.2.2 to access host localhost
// Real device would need the actual LAN IP of the computer
// Use LAN IP for physical devices (both iOS and Android) to reach the backend
const BASE_URL = 'http://10.10.6.52:3001';

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
    async _request(endpoint: string, options: any = {}, useCache = false, ttl = DEFAULT_TTL, bypassOfflineInterceptor = false) {
        const url = `${BASE_URL}${endpoint}`;
        const method = options.method || 'GET';
        const isGet = method === 'GET';

        // 0. Offline Interceptor
        if (!bypassOfflineInterceptor && !isGet) {
            const networkState = await NetInfo.fetch();
            if (!networkState.isConnected) {
                // We are offline, queue the request
                let bodyParsed = options.body;
                if (typeof options.body === 'string') {
                    try { bodyParsed = JSON.parse(options.body); } catch(e) {}
                }
                
                await syncManager.enqueue(endpoint, method, bodyParsed);
                
                // Return a mock success response so the UI proceeds optimistically
                return { _offlineQueued: true, success: true };
            }
        }

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

    async register(data: any) {
        try {
            // Registration also bypasses _request to handle initial setup
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Registration Failed: ${response.status} - ${errorBody}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async changePin(oldPin: string, newPin: string): Promise<any> {
        return this._request('/auth/change-pin', {
            method: 'POST',
            body: JSON.stringify({ oldPin, newPin }),
        });
    },

    // --- Login Approval Methods ---
    async checkLoginStatus(requestId: string): Promise<any> {
        return this._request(`/auth/login/status/${requestId}`, {}, false); // bypassing cache explicitly via GET is tricky, but _request doesn't cache if useCache=false
    },

    async approveLogin(requestId: string): Promise<any> {
        return this._request(`/auth/login/approve/${requestId}`, { method: 'POST' });
    },

    async rejectLogin(requestId: string): Promise<any> {
        return this._request(`/auth/login/reject/${requestId}`, { method: 'POST' });
    },

    async overrideLogin(requestId: string, pin: string): Promise<any> {
        return this._request(`/auth/login/override/${requestId}`, {
            method: 'POST',
            body: JSON.stringify({ pin }),
        });
    },

    async getPendingLogins(bypassCache = false): Promise<any[]> {
        return this._request('/merchants/staff/pending-logins', {}, !bypassCache);
    },

    async getTeamProgress(bypassCache = false): Promise<any[]> {
        return this._request('/merchants/staff/team-progress', {}, !bypassCache);
    },
    // ------------------------------

    async getProducts(bypassCache = false): Promise<Product[]> {
        return this._request('/products', {}, !bypassCache);
    },

    async createProduct(product: any): Promise<Product> {
        const result = await this._request('/products', {
            method: 'POST',
            body: JSON.stringify(product),
        });
        // Invalidate product list cache
        const productsUrl = `${BASE_URL}/products`;
        cache.delete(productsUrl);
        return result;
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
        const result = await this._request('/batches', {
            method: 'POST',
            body: JSON.stringify(batchData),
        });
        // Invalidate product list cache so stock levels update correctly
        const productsUrl = `${BASE_URL}/products`;
        cache.delete(productsUrl);
        return result;
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
    },

    // CRM / Client Management
    async getCustomers(bypassCache = false): Promise<any[]> {
        return this._request('/client-management/customers', {}, !bypassCache);
    },

    async createCustomer(customer: any): Promise<any> {
        return this._request('/client-management/customers', {
            method: 'POST',
            body: JSON.stringify(customer),
        });
    },

    async sendReminder(customerId: string, shopName: string): Promise<any> {
        return this._request(`/client-management/remind/${customerId}`, {
            method: 'POST',
            body: JSON.stringify({ shopName }),
        });
    },

    async recordRepayment(customerId: string, amount: number): Promise<any> {
        return this._request(`/client-management/customers/${customerId}/repay`, {
            method: 'POST',
            body: JSON.stringify({ amount }),
        });
    },

    async getBatches(productId: string): Promise<any[]> {
        return this._request(`/batches/${productId}`);
    },
    
    async getCustomerSales(customerId: string): Promise<any[]> {
        return this._request(`/sales/customer/${customerId}`);
    },

    // Shifts
    async getCurrentShift(bypassCache = false): Promise<any> {
        return this._request('/merchants/shifts/current', {}, !bypassCache);
    },

    async openShift(startingCash: number): Promise<any> {
        return this._request('/merchants/shifts/open', {
            method: 'POST',
            body: JSON.stringify({ startingCash }),
        });
    },

    async closeShift(shiftId: string, actualCash: number, notes?: string): Promise<any> {
        return this._request(`/merchants/shifts/close/${shiftId}`, {
            method: 'PATCH',
            body: JSON.stringify({ actualCash, notes }),
        });
    },

    async getNotifications(bypassCache = false): Promise<any[]> {
        return this._request('/notifications', {}, !bypassCache);
    }
};

// Break require cycle
syncManager.setApiClient(ApiClient);
