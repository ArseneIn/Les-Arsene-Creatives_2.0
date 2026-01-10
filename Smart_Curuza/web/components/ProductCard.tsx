import React from 'react';

interface Product {
    id: string;
    name: string;
    barcode: string;
    stock: number;
    price: number;
    batch?: string;
}

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    return (
        <div className="border rounded p-4 shadow hover:shadow-lg transition-shadow">
            <h2 className="font-heading text-lg mb-2">{product.name}</h2>
            <p className="text-sm text-gray-600">Barcode: {product.barcode}</p>
            <p className="text-sm">Stock: {product.stock}</p>
            <p className="text-sm">Price: ${Number(product.price).toFixed(2)}</p>
            {product.batch && (
                <p className="text-sm mt-1">Batch: {product.batch}</p>
            )}
        </div>
    );
}
