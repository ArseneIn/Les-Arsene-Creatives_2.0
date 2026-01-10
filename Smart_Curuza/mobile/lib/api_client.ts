import { Platform } from 'react-native';
import { Product, CreateSaleDto } from './types';

// Android emulator uses 10.0.2.2 to access host localhost
// Real device would need the actual LAN IP of the computer
const BASE_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:3001'
    : 'http://localhost:3001';

export const ApiClient = {
    async getProducts(): Promise<Product[]> {
        try {
            const response = await fetch(`${BASE_URL}/products`);
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
            const response = await fetch(`${BASE_URL}/sales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
    }
};
