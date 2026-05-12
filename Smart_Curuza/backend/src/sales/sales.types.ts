export interface BatchItem {
  costPrice: number;
  quantity: number;
}

export interface SaleItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  batchId?: string;
  batches?: BatchItem[];
  category?: string;
}
