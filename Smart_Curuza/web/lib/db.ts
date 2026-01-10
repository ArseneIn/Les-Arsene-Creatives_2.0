import Dexie, { Table } from 'dexie';

// Define interfaces for our offline data
export interface OfflineProduct {
    id: string;
    name: string;
    price: number;
    stock: number;
    barcode?: string;
    image?: string;
    status: string;
    category?: string;
    sync_status?: 'synced' | 'pending';
}

export interface OfflineCustomer {
    id: string;
    name: string;
    phone: string;
    total_debt: number;
    loyalty_points: number;
    sync_status?: 'synced' | 'pending';
}

export interface OfflineSale {
    id?: number; // Auto-increment for local ID
    uuid?: string; // Backend ID if synced
    items: any[];
    total: number;
    paymentMethod: string;
    customerId?: string;
    merchantId?: string;
    userId?: string;
    created_at: string;
    sync_status: 'pending' | 'synced' | 'failed';
}

export interface OfflineQueueItem {
    id?: number;
    url: string;
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body: any;
    created_at: number;
    retry_count: number;
}

export class SmartCuruzaDB extends Dexie {
    products!: Table<OfflineProduct>;
    customers!: Table<OfflineCustomer>;
    sales!: Table<OfflineSale>;
    offlineQueue!: Table<OfflineQueueItem>;

    constructor() {
        super('SmartCuruzaDB');
        this.version(1).stores({
            products: 'id, name, barcode, status, sync_status',
            customers: 'id, name, phone, sync_status',
            sales: '++id, uuid, created_at, sync_status',
            offlineQueue: '++id, created_at, retry_count'
        });
    }
}

export const db = new SmartCuruzaDB();
