import * as FileSystem from 'expo-file-system/legacy';
// ApiClient imported dynamically to break require cycle

export interface QueuedRequest {
    id: string;
    endpoint: string;
    method: string;
    body: any;
    timestamp: number;
}

const QUEUE_FILE = FileSystem.documentDirectory + 'sync_queue.json';

class SyncManager {
    private queue: QueuedRequest[] = [];
    private isSyncing: boolean = false;
    private listeners: ((syncing: boolean, progress: number, queueLength: number) => void)[] = [];
    private apiClient: any = null;

    constructor() {
        this.loadQueue();
    }

    public setApiClient(client: any) {
        this.apiClient = client;
    }

    private async loadQueue() {
        try {
            const fileInfo = await FileSystem.getInfoAsync(QUEUE_FILE);
            if (fileInfo.exists) {
                const data = await FileSystem.readAsStringAsync(QUEUE_FILE);
                this.queue = JSON.parse(data);
                this.notifyListeners();
            }
        } catch (error) {
            console.error('Failed to load sync queue', error);
        }
    }

    private async saveQueue() {
        try {
            await FileSystem.writeAsStringAsync(QUEUE_FILE, JSON.stringify(this.queue));
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
        if (!this.apiClient || this.isSyncing || this.queue.length === 0) return;

        this.isSyncing = true;
        this.notifyListeners(0);

        console.log(`[SyncManager] Processing queue with ${this.queue.length} items`);

        let successCount = 0;
        let failureCount = 0;

        // Clone queue to work with
        const currentQueue = [...this.queue];
        const nextQueue: QueuedRequest[] = [];

        for (let i = 0; i < currentQueue.length; i++) {
            const request = currentQueue[i];
            
            try {
                await this.apiClient._request(request.endpoint, {
                    method: request.method,
                    body: request.body ? JSON.stringify(request.body) : undefined,
                }, false, 0, true); 
                
                successCount++;
                const progress = Math.round(((i + 1) / currentQueue.length) * 100);
                this.notifyListeners(progress);
            } catch (error: any) {
                console.error(`[SyncManager] Failed to sync ${request.method} ${request.endpoint}`, error);
                
                // Inspect status code if available
                const statusCode = error.status || error.response?.status;
                
                if (statusCode >= 400 && statusCode < 500) {
                    console.warn(`[SyncManager] Non-retriable error (${statusCode}). Discarding request to unblock queue.`);
                    failureCount++;
                    // Item is NOT added to nextQueue (discarded)
                } else {
                    console.log(`[SyncManager] Retriable error (Network/Server). Preserving remainder of queue.`);
                    nextQueue.push(...currentQueue.slice(i));
                    break;
                }
            }
        }

        this.queue = nextQueue;
        await this.saveQueue();
        
        this.isSyncing = false;
        this.notifyListeners(100);
        
        setTimeout(() => {
            if (!this.isSyncing) this.notifyListeners(0);
        }, 1000);
    }
}

export const syncManager = new SyncManager();
