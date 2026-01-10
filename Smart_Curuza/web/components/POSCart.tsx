import React from 'react';
import { Search, Trash2, Minus, Plus, Banknote, Smartphone, CreditCard } from 'lucide-react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    barcode: string;
    unit?: string;
    image?: string;
    batchId?: string;
    maxQuantity?: number;
}

interface POSCartProps {
    cart: CartItem[];
    onUpdateQuantity: (id: string, change: number, batchId?: string) => void;
    onRemove: (id: string, batchId?: string) => void;
    onClear: () => void;
    onCheckout: () => void;
    discount?: number;
    onDiscountChange?: (amount: number) => void;
}

export default function POSCart({ cart, onUpdateQuantity, onRemove, onClear, onCheckout, discount, onDiscountChange }: POSCartProps) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="w-80 bg-surface rounded-xl border border-platinum-600 p-6 flex flex-col shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-jet font-heading">Cart</h2>
                {cart.length > 0 && (
                    <button
                        onClick={onClear}
                        className="text-sm text-danger hover:text-danger/80 font-medium font-sans"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-platinum-700 rounded-full flex items-center justify-center mb-3">
                            <Search className="h-8 w-8 text-jet-700" />
                        </div>
                        <p className="text-jet-700 font-body">Cart is empty</p>
                        <p className="text-sm text-jet-700 font-body mt-1">Add products to get started</p>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.id} className="bg-platinum-800 p-3 rounded-lg">
                            <div className="flex gap-3 mb-2">
                                {item.image && (
                                    <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-jet font-body truncate">{item.name}</h4>
                                        <button
                                            onClick={() => onRemove(item.id, item.batchId)}
                                            className="text-danger hover:text-danger/80 ml-2 flex-shrink-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-jet-700">{item.price.toLocaleString()} RWF / {item.unit || 'Unit'}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pl-[3.75rem]">
                                <div className="flex items-center gap-2 bg-platinum-700 rounded-lg p-1">
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, -1, item.batchId)}
                                        className="w-7 h-7 bg-white rounded hover:bg-gold hover:text-onyx transition-all duration-200 flex items-center justify-center shadow-sm"
                                    >
                                        <Minus className="h-3 w-3" />
                                    </button>

                                    <div className="flex items-center gap-1 px-1 min-w-[3rem] justify-center">
                                        <span className="font-bold text-jet text-sm">{item.quantity}</span>
                                        <span className="text-xs text-jet-700 font-medium">{item.unit || 'pcs'}</span>
                                    </div>

                                    <button
                                        onClick={() => onUpdateQuantity(item.id, 1, item.batchId)}
                                        className="w-7 h-7 bg-white rounded hover:bg-gold hover:text-onyx transition-all duration-200 flex items-center justify-center shadow-sm"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>
                                <span className="font-semibold text-jet font-heading">
                                    {(item.price * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Discount */}
            <div className="border-t border-platinum-600 pt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-jet-700 font-body">Subtotal</span>
                    <span className="font-semibold text-jet font-heading">{total.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-jet-700 font-body">Discount</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="w-20 px-2 py-1 text-right border border-platinum-300 rounded focus:border-gold outline-none text-sm"
                            onChange={(e) => onDiscountChange && onDiscountChange(Number(e.target.value))}
                        />
                        <span className="text-sm text-jet-700">RWF</span>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-jet font-heading">Total</span>
                    <span className="text-2xl font-bold text-jet font-heading">{(total - (discount || 0)).toLocaleString()} RWF</span>
                </div>
            </div>

            {/* Checkout Button */}
            <button
                onClick={onCheckout}
                disabled={cart.length === 0}
                className="w-full py-3 bg-gradient-gold text-onyx rounded-lg shadow-gold hover:shadow-lg transition-all duration-200 font-semibold font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Proceed to Payment
            </button>
        </div>
    );
}
