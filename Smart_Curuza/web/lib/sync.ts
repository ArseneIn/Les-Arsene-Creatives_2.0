import { db, OfflineQueueItem } from './db';
import { api } from './api';

export const syncService = {
    // Add request to offline queue
    async addToQueue(url: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', body: any) {
        await db.offlineQueue.add({
            url,
            method,
            body,
            created_at: Date.now(),
            retry_count: 0
        });
        // Try to sync immediately if online
        if (navigator.onLine) {
            this.processQueue();
        }
    },

    // Process the offline queue
    async processQueue() {
        if (!navigator.onLine) return;

        const queue = await db.offlineQueue.toArray();
        if (queue.length === 0) return;

        console.log(`Processing ${queue.length} offline items...`);

        for (const item of queue) {
            try {
                await api.fetchApi(item.url, {
                    method: item.method,
                    body: JSON.stringify(item.body)
                });
                // If successful, remove from queue
                await db.offlineQueue.delete(item.id!);
                console.log(`Synced item ${item.id}`);
            } catch (error) {
                console.error(`Failed to sync item ${item.id}:`, error);
                // Increment retry count or handle failure logic
                await db.offlineQueue.update(item.id!, { retry_count: item.retry_count + 1 });
            }
        }
    },

    // Sync Products from Backend to IndexedDB
    async syncProducts() {
        try {
            const products = await api.get<any[]>('/products');
            await db.products.bulkPut(products.map(p => ({ ...p, sync_status: 'synced' })));
            console.log('Products synced to local DB');
        } catch (error) {
            console.error('Failed to sync products:', error);
        }
    },

    // Sync Customers from Backend to IndexedDB
    async syncCustomers() {
        try {
            const customers = await api.get<any[]>('/client-management/customers');
            await db.customers.bulkPut(customers.map(c => ({ ...c, sync_status: 'synced' })));
            console.log('Customers synced to local DB');
        } catch (error) {
            console.error('Failed to sync customers:', error);
        }
    }
};

// Listen for online status
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        console.log('Back online! Syncing...');
        syncService.processQueue();
        syncService.syncProducts();
        syncService.syncCustomers();
    });
}
