
import React from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { Box } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  onCompareToggle: (p: Product) => void;
  onNavigate: (page: string, params?: any) => void;
  comparingIds: string[];
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onCompareToggle,
  onNavigate,
  comparingIds
}) => {
  if (products.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
          <Box className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2 tracking-tight">No gear matches your matrix</h3>
        <p className="text-slate-500 font-medium max-w-sm">Try broadening your filters or reset the refinery gear to see all available inventory.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
          onCompareToggle={onCompareToggle}
          onNavigate={onNavigate}
          isComparing={comparingIds.includes(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
