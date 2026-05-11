import Dexie, { Table } from 'dexie';

export interface QueuedRequest {
  id?: number;
  endpoint: string;
  method: string;
  body: any;
  timestamp: number;
}

export class SyncDatabase extends Dexie {
  syncQueue!: Table<QueuedRequest, number>;

  constructor() {
    super('SmartCuruzaSyncDB');
    this.version(1).stores({
      syncQueue: '++id, endpoint, method, timestamp'
    });
  }
}

export const db = new SyncDatabase();
