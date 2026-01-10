
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Check, ShoppingBag, Zap, Info } from 'lucide-react';
import { PRODUCTS } from '../../services/mockData';
import { Product } from '../../types';
import { useCart } from '../context/CartContext';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
  relatedIds: string[];
  onAddBundleToCart: (products: Product[]) => void;
}

const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  currentProduct,
  relatedIds = [],
  onAddBundleToCart
}) => {
  // Hydrate related product data
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(p => relatedIds.includes(p.id));
  }, [relatedIds]);

  const bundleList = [currentProduct, ...relatedProducts];

  // State for which items are selected (bitmask approach or simple array)
  const [selectedIds, setSelectedIds] = useState<string[]>([currentProduct.id, ...relatedIds]);

  useEffect(() => {
    setSelectedIds([currentProduct.id, ...relatedIds]);
  }, [currentProduct.id, relatedIds]);

  const toggleSelection = (id: string) => {
    if (id === currentProduct.id) return; // Main product is always required in FBT
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalPrice = useMemo(() => {
    return bundleList
      .filter(p => selectedIds.includes(p.id))
      .reduce((sum, p) => sum + p.price, 0);
  }, [selectedIds, bundleList]);

  const handleAddAll = () => {
    const productsToAdd = bundleList.filter(p => selectedIds.includes(p.id));
    onAddBundleToCart(productsToAdd);
  };

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-20 p-8 md:p-12 bg-zinc-50 rounded-[40px] border border-zinc-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 mb-10">
        <Zap className="w-5 h-5 text-[#FF8C00]" />
        <h3 className="text-2xl font-black text-black uppercase italic tracking-tight">Complete <span className="text-[#FF8C00]">Your Setup</span></h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Visual Equation */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {bundleList.map((product, idx) => (
            <React.Fragment key={product.id}>
              <div
                className={`relative group cursor-pointer transition-all duration-300 ${!selectedIds.includes(product.id) ? 'opacity-40 grayscale scale-95' : 'hover:scale-105'}`}
                onClick={() => toggleSelection(product.id)}
              >
                <div className={`w-28 h-28 md:w-40 md:h-40 bg-white rounded-3xl p-4 shadow-xl border-2 transition-all ${selectedIds.includes(product.id) ? 'border-[#FF8C00]/30 shadow-orange-900/5' : 'border-transparent shadow-zinc-200/50'}`}>
                  <img src={product.image} className="w-full h-full object-contain" alt={product.name} />
                  {selectedIds.includes(product.id) && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FF8C00] text-black rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                      <Check className="w-4 h-4 stroke-[4]" />
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{product.brand}</p>
                  <p className="text-xs font-bold text-black truncate max-w-[120px] mx-auto mt-1">${product.price.toLocaleString()}</p>
                </div>
              </div>
              {idx < bundleList.length - 1 && (
                <Plus className="w-6 h-6 text-zinc-300 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Checkbox List & CTA */}
        <div className="w-full lg:w-96 bg-white rounded-[32px] p-8 shadow-2xl shadow-zinc-200/50 border border-zinc-100 flex flex-col justify-between min-h-[300px]">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
              <Info className="w-3 h-3" /> Select Bundled Items
            </p>
            {bundleList.map((product) => (
              <label
                key={product.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${selectedIds.includes(product.id) ? 'bg-zinc-50 border-[#FF8C00]/20' : 'bg-white border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-4 h-4 border-2 border-zinc-200 rounded checked:bg-[#FF8C00] checked:border-[#FF8C00] transition-all"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelection(product.id)}
                      disabled={product.id === currentProduct.id}
                    />
                    <Check className="absolute inset-0 m-auto w-2.5 h-2.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none stroke-[4]" />
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-tight line-clamp-1 ${product.id === currentProduct.id ? 'text-black' : 'text-zinc-500 group-hover:text-black'}`}>
                    {product.id === currentProduct.id ? 'Main: ' : ''} {product.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-zinc-400 ml-4 shrink-0">${product.price.toLocaleString()}</span>
              </label>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-100">
            <div className="flex justify-between items-end mb-6">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Deployment Total</p>
              <p className="text-3xl font-black text-black leading-none">${totalPrice.toLocaleString()}</p>
            </div>
            <button
              onClick={handleAddAll}
              className="w-full bg-[#FF8C00] hover:bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl shadow-orange-900/10 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" /> Add selected items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
