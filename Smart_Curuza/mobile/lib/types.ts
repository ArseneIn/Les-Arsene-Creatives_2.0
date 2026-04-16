export interface Product {
    id: string;
    name: string;
    barcode: string;
    price: number;
    stock: number;
    category?: string;
    image?: string;
    unit?: string;
    status?: 'active' | 'inactive';
}

export interface CartItem extends Product {
    quantity: number;
}

export interface SaleItem {
    id: string;
    name?: string;
    quantity: number;
    price: number;
}

export interface CreateSaleDto {
    items: SaleItem[];
    total: number;
    paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CREDIT' | 'Credit';
    customerId?: string;
    clientName?: string;
    clientPhone?: string;
}
