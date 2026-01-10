
import React from 'react';
import { ShoppingCart, Eye, Star, Cpu, Activity, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleCompare, setQuickViewProduct, comparingProducts } = useShop();
  const navigate = useNavigate();
  const specs = product.technical_specs;

  const isComparing = comparingProducts.some(p => p.id === product.id);

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const renderSpecs = () => {
    switch (product.category) {
      case 'Audio':
        return (
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Type</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{specs.audio_type}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Battery</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{specs.battery_life}</span>
            </div>
          </div>
        );
      case 'Phones':
        return (
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Camera</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{specs.camera_resolution}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Display</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{specs.display?.size}</span>
            </div>
          </div>
        );
      default: // Laptops
        return (
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Processor</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{specs.cpu_model}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Memory</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{specs.memory}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-[#FF8C00]/30 dark:hover:border-[#FF8C00]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full">
      {/* Image Area */}
      <div className="relative h-64 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8 cursor-pointer" onClick={handleProductClick}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {product.isNew && (
            <div className="bg-[#FF8C00] text-white text-[9px] font-black px-2.5 py-1.5 rounded-md uppercase tracking-widest shadow-sm">
              New Arrival
            </div>
          )}
          {product.originalPrice && (
            <div className="bg-[#E63946] text-white text-[9px] font-black px-2.5 py-1.5 rounded-md uppercase tracking-widest shadow-sm">
              Sale
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm border border-slate-100 dark:border-slate-700">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-black text-slate-900 dark:text-white">{product.rating}</span>
        </div>

        {/* Quick Actions overlay */}
        <div className="absolute inset-0 bg-black/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
            className="w-10 h-10 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-full flex items-center justify-center hover:bg-[#FF8C00] hover:text-white transition-all shadow-lg border border-slate-100 dark:border-slate-600"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-[10px] font-black text-[#FF8C00] uppercase tracking-[0.2em]">{product.brand} Deployment</span>
        </div>

        <h3
          className="text-lg font-black text-slate-900 dark:text-white mb-1 line-clamp-2 hover:text-[#FF8C00] dark:hover:text-[#FF8C00] transition-colors cursor-pointer leading-tight"
          onClick={handleProductClick}
        >
          {product.name}
        </h3>

        {/* Dynamic Category Specs */}
        <div className="flex-1 mt-2">
          {renderSpecs()}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-slate-400 line-through font-bold">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => toggleCompare(product)}
              className={`p-3 rounded-xl transition-all ${isComparing
                ? 'bg-slate-950 dark:bg-white text-[#FF8C00]'
                : 'bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
            >
              <Activity className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              className="p-3 bg-slate-950 dark:bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF8C00] dark:hover:bg-orange-500 hover:text-white transition-all shadow-lg"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;