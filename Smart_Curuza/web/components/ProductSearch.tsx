import React, { useState } from 'react';
import { Search, Plus, Clock } from 'lucide-react';

export interface Product {
    id: string;
    name: string;
    price: number;
    barcode: string;
    stock: number;
    unit?: string;
    image?: string;
    status?: 'active' | 'inactive';
    itemClsCd?: string;
    taxTyCd?: string;
}

interface ProductSearchProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
    activeShift: any;
    onShiftClick: () => void;
}

export default function ProductSearch({ products, onAddToCart, activeShift, onShiftClick }: ProductSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

    const handleAddToCart = (product: Product) => {
        onAddToCart(product);
        setAddedItems(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [product.id]: false }));
        }, 1000);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchQuery))
    );

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-jet font-heading mb-2">Point of Sale</h1>
                    <p className="text-jet-700 font-body">Scan or search for products to add to cart</p>
                </div>
                <button
                    onClick={onShiftClick}
                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${activeShift
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200 animate-pulse'
                        }`}
                >
                    <Clock className="h-4 w-4" />
                    {activeShift ? 'Shift Active' : 'Open Shift'}
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search by name or scan barcode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none font-body"
                    autoFocus
                />
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                    {filteredProducts.map(product => (
                        <button
                            key={product.id}
                            onClick={() => handleAddToCart(product)}
                            className="bg-surface rounded-xl border-2 border-platinum-600 hover:border-gold hover:shadow-gold transition-all duration-200 text-left group overflow-hidden flex flex-col h-full min-h-[200px] relative"
                        >
                            {/* Added Feedback Overlay */}
                            {addedItems[product.id] && (
                                <div className="absolute inset-0 z-10 bg-green-500/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
                                    <div className="text-white font-bold text-lg flex flex-col items-center">
                                        <div className="bg-white text-green-500 rounded-full p-2 mb-2">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                        Added!
                                    </div>
                                </div>
                            )}

                            <div className="h-32 w-full bg-gray-200 relative">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-platinum-700 text-jet-700 font-bold text-2xl">
                                        {product.name.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus className="h-4 w-4 text-gold" />
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="font-semibold text-jet font-body mb-1">{product.name}</h3>
                                <div className="flex justify-between items-center mt-auto">
                                    <p className="text-lg font-bold text-jet font-heading">
                                        {Number(product.price).toLocaleString()} RWF
                                    </p>
                                    <span className={`text-xs font-medium font-sans ${product.stock < 10 ? 'text-danger' : 'text-success'}`}>
                                        {product.stock} {product.unit || 'Units'} left
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
