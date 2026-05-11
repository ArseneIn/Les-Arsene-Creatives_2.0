import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiClient } from '../api_client';

export interface QueuedRequest {
    id: string;
    endpoint: string;
    method: string;
    body: any;
    timestamp: number;
}

const SYNC_QUEUE_KEY = '@smartcuruza_sync_queue';

class SyncManager {
    private queue: QueuedRequest[] = [];
    private isSyncing: boolean = false;
    private listeners: ((syncing: boolean, progress: number, queueLength: number) => void)[] = [];

    constructor() {
        this.loadQueue();
    }

    private async loadQueue() {
        try {
            const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
            if (data) {
                this.queue = JSON.parse(data);
                this.notifyListeners();
            }
        } catch (error) {
            console.error('Failed to load sync queue', error);
        }
    }

    private async saveQueue() {
        try {
            await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(this.queue));
            this.notifyListeners();
        } catch (error) {
            console.error('Failed to save sync queue', error);
        }
    }

    public async enqueue(endpoint: string, method: string, body: any) {
        const request: QueuedRequest = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            endpoint,
            method,
            body,
            timestamp: Date.now(),
        };

        this.queue.push(request);
        await this.saveQueue();
        console.log(`[SyncManager] Enqueued ${method} ${endpoint}. Queue size: ${this.queue.length}`);
    }

    public getQueueLength() {
        return this.queue.length;
    }

    public subscribe(listener: (syncing: boolean, progress: number, queueLength: number) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(progress: number = 0) {
        this.listeners.forEach(listener => listener(this.isSyncing, progress, this.queue.length));
    }

    public async processQueue() {
        if (this.isSyncing || this.queue.length === 0) return;

        console.log(`[SyncManager] Starting sync of ${this.queue.length} items`);
        this.isSyncing = true;
        
        const totalItems = this.queue.length;
        let processed = 0;

        this.notifyListeners(0);

        // Process queue sequentially
        while (this.queue.length > 0) {
            const request = this.queue[0]; // peek

            try {
                // We use ApiClient._request but bypass the offline interceptor to prevent infinite loops
                await ApiClient._request(request.endpoint, {
                    method: request.method,
                    body: request.body ? JSON.stringify(request.body) : undefined,
                }, false, 0, true); // true = bypassOfflineInterceptor

                console.log(`[SyncManager] Successfully synced ${request.method} ${request.endpoint}`);
                
                // Remove from queue on success
                this.queue.shift();
                processed++;
                
                const progress = Math.round((processed / totalItems) * 100);
                this.notifyListeners(progress);
                await this.saveQueue();

            } catch (error: any) {
                console.error(`[SyncManager] Failed to sync ${request.method} ${request.endpoint}`, error);
                // If it's a 4xx error (e.g. validation), we should probably discard it or move to a dead-letter queue.
                // For now, if it fails, we abort the sync loop and try again later to preserve order.
                break;
            }
        }

        this.isSyncing = false;
        this.notifyListeners(100);
        
        // Brief delay before resetting progress bar to 0
        setTimeout(() => {
            if (!this.isSyncing) this.notifyListeners(0);
        }, 1000);
    }
}

export const syncManager = new SyncManager();
