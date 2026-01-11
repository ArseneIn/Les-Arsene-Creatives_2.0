import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Product, CreateSaleDto } from './types';

// Android emulator uses 10.0.2.2 to access host localhost
// Real device would need the actual LAN IP of the computer
const BASE_URL = Platform.OS === 'android'
    ? 'http://192.168.1.64:3001'
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
                throw new Error(`API Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            throw error;
        }
    }
};
