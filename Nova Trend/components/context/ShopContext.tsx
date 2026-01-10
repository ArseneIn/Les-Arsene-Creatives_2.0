import React, { createContext, useContext, useState } from 'react';
import { Product } from '../../types';

interface ShopContextType {
    comparingProducts: Product[];
    toggleCompare: (product: Product) => void;
    clearCompare: () => void;
    quickViewProduct: Product | null;
    setQuickViewProduct: (product: Product | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [comparingProducts, setComparingProducts] = useState<Product[]>([]);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    const toggleCompare = (product: Product) => {
        setComparingProducts(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.filter(p => p.id !== product.id);
            }
            if (prev.length >= 2) {
                return [prev[1], product]; // Keep last two or replace oldest? Original code: [prev[1], product] implies keeping one.
            }
            return [...prev, product];
        });
    };

    const clearCompare = () => {
        setComparingProducts([]);
    };

    return (
        <ShopContext.Provider value={{
            comparingProducts,
            toggleCompare,
            clearCompare,
            quickViewProduct,
            setQuickViewProduct
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};
