import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Product, CreateSaleDto } from './types';

// Android emulator uses 10.0.2.2 to access host localhost
// Real device would need the actual LAN IP of the computer
const BASE_URL = Platform.OS === 'android'
    ? 'http://10.10.6.80:3001' // Use LAN IP for both Emulator and Physical Device
    : 'http://localhost:3001';

async function getHeaders() {
    const token = await SecureStore.getItemAsync('auth_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
}

export const ApiClient = {
    async login(credentials: { phone?: string; pin?: string; email?: string; password?: string }) {
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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

    async getProducts(): Promise<Product[]> {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${BASE_URL}/products`, {
                headers: headers as any,
            });
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch products:', error);
            throw error;
        }
    },

    async createProduct(product: any): Promise<Product> {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${BASE_URL}/products`, {
                method: 'POST',
                headers: headers as any,
                body: JSON.stringify(product),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Create Failed: ${response.status} - ${errorBody}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to create product:', error);
            throw error;
        }
    },

    async updateProduct(id: string, product: any): Promise<Product> {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${BASE_URL}/products/${id}`, {
                method: 'PATCH',
                headers: headers as any,
                body: JSON.stringify(product),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Update Failed: ${response.status} - ${errorBody}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to update product:', error);
            throw error;
        }
    },

    async toggleProductStatus(id: string, status: string): Promise<Product> {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${BASE_URL}/products/${id}`, {
                method: 'PATCH',
                headers: headers as any,
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Status Update Failed: ${response.status} - ${errorBody}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to toggle product status:', error);
            throw error;
        }
    },

    async createSale(saleData: CreateSaleDto): Promise<any> {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${BASE_URL}/sales`, {
                method: 'POST',
                headers: headers as any,
                body: JSON.stringify(saleData),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorBody}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to create sale:', error);
            throw error;
        }
    },

    async getDashboardStats(): Promise<any> {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${BASE_URL}/dashboard/stats`, {
                headers: headers as any,
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorBody}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            throw error;
        }
    },

    async getSalesHistory(limit?: number): Promise<any[]> {
        try {
            const headers = await getHeaders();
            const url = limit
                ? `${BASE_URL}/sales/recent?limit=${limit}`
                : `${BASE_URL}/sales`;

            const response = await fetch(url, {
                headers: headers as any,
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch sales history:', error);
            throw error;
        }
    },

    async getSalesExport(period: string): Promise<{ summary: any[], details: any[] }> {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${BASE_URL}/sales/export?period=${period}`, {
                headers: headers as any,
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch sales export:', error);
            throw error;
        }
    },

    async refundSale(saleId: string, reason: string, restock: boolean): Promise<any> {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${BASE_URL}/sales/${saleId}/refund`, {
                method: 'POST',
                headers: headers as any,
                body: JSON.stringify({ reason, restock }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Refund Failed: ${response.status} - ${errorBody}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to refund sale:', error);
            throw error;
        }
    },


    async getMerchantProfile(): Promise<any> {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${BASE_URL}/merchants/profile`, {
                headers: headers as any,
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch merchant profile:', error);
            throw error;
        }
    },

    async updateMerchantProfile(profile: any): Promise<any> {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${BASE_URL}/merchants/profile`, {
                method: 'PUT',
                headers: headers as any,
                body: JSON.stringify(profile),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Update Failed: ${response.status} - ${errorBody}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to update merchant profile:', error);
            throw error;
        }
    }
};
