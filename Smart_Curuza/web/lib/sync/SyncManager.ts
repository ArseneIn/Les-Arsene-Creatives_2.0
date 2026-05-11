import { db } from './db';
import { api } from '../api';

class WebSyncManager {
    private isSyncing: boolean = false;
    private listeners: ((syncing: boolean, progress: number, queueLength: number) => void)[] = [];

    public async enqueue(endpoint: string, method: string, body: any) {
        await db.syncQueue.add({
            endpoint,
            method,
            body,
            timestamp: Date.now()
        });
        console.log(`[WebSyncManager] Enqueued ${method} ${endpoint}`);
        this.notifyListeners(0);
    }

    public async getQueueLength() {
        return await db.syncQueue.count();
    }

    public subscribe(listener: (syncing: boolean, progress: number, queueLength: number) => void) {
        this.listeners.push(listener);
        // Initial notify
        this.getQueueLength().then(len => listener(this.isSyncing, 0, len));
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private async notifyListeners(progress: number = 0) {
        const len = await this.getQueueLength();
        this.listeners.forEach(listener => listener(this.isSyncing, progress, len));
    }

    public async processQueue() {
        if (this.isSyncing) return;

        const queueCount = await this.getQueueLength();
        if (queueCount === 0) return;

        console.log(`[WebSyncManager] Starting sync of ${queueCount} items`);
        this.isSyncing = true;
        
        let processed = 0;
        this.notifyListeners(0);

        const items = await db.syncQueue.orderBy('timestamp').toArray();

        for (const request of items) {
            try {
                // We use raw fetchApi from our api object to bypass the interceptor
                await api.fetchApi(request.endpoint, {
                    method: request.method,
                    body: request.body ? JSON.stringify(request.body) : undefined,
                    headers: { 'X-Bypass-Offline': 'true' }
                });

                console.log(`[WebSyncManager] Successfully synced ${request.method} ${request.endpoint}`);
                
                // Remove from queue
                if (request.id) await db.syncQueue.delete(request.id);
                processed++;
                
                const progress = Math.round((processed / queueCount) * 100);
                this.notifyListeners(progress);

            } catch (error: any) {
                console.error(`[WebSyncManager] Failed to sync ${request.method} ${request.endpoint}`, error);
                // Abort sync loop on failure to preserve order
                break;
            }
        }

        this.isSyncing = false;
        this.notifyListeners(100);
        
        // Reset progress
        setTimeout(() => {
            if (!this.isSyncing) this.notifyListeners(0);
        }, 1000);
    }
}

export const syncManager = new WebSyncManager();
