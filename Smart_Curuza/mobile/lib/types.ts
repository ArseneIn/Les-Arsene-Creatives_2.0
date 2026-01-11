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
    productId: string;
    quantity: number;
    price: number;
}

export interface CreateSaleDto {
    items: SaleItem[];
    totalAmount: number;
    paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CREDIT';
    customerId?: string;
}
