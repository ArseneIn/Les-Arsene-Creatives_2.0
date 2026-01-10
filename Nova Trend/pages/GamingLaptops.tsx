
import React, { useState } from 'react';
import { Zap, Activity, ShoppingBag, Eye, Monitor } from 'lucide-react';
import { PRODUCTS } from '../services/mockData';
import ProductCard from '../components/features/ProductCard';
import FilterSidebar from '../components/features/FilterSidebar';
import { useCart } from '../components/context/CartContext';
import { useShop } from '../components/context/ShopContext';

const GamingLaptops: React.FC = () => {
  const { addToCart } = useCart();
  const { setQuickViewProduct } = useShop();
  const [proOnly, setProOnly] = useState(false);
  const gamingLaptops = PRODUCTS.filter(p => p.useCase === 'Gaming');

  const displayLaptops = proOnly
    ? gamingLaptops.filter(p => p.technical_specs.display.refresh_rate === '240Hz' || p.price > 3000)
    : gamingLaptops;

  return (
    <div className="bg-black min-h-screen pt-20 pb-32">
      <div className="container mx-auto px-4">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-600/10 border border-orange-600/30 text-orange-500 rounded-full mb-6">
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Unfair Advantage</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-none">
              Gaming <span className="text-orange-600">Powerhouses</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pro-Gaming Only</span>
            <button
              onClick={() => setProOnly(!proOnly)}
              className={`w-14 h-7 rounded-full p-1 transition-colors ${proOnly ? 'bg-orange-600' : 'bg-zinc-800'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${proOnly ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayLaptops.map((product) => (
            <div
              key={product.id}
              className="group bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden hover:border-orange-600/50 transition-all duration-500"
            >
              <div className="relative aspect-video">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
                  {product.brand}
                </div>
              </div>

              <div className="p-8 pt-0 relative -mt-8">
                <h3 className="text-2xl font-black text-white uppercase italic mb-6 group-hover:text-orange-500 transition-colors">
                  {product.name}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 group-hover:border-orange-600/20 transition-all">
                    <div className="text-[10px] font-black text-zinc-600 uppercase mb-2">GPU Arch</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-orange-600" /> {product.technical_specs.gpu_model || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 group-hover:border-orange-600/20 transition-all">
                    <div className="text-[10px] font-black text-zinc-600 uppercase mb-2">Max Refresh</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-orange-600" /> {product.technical_specs.display.refresh_rate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-white">${product.price.toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setQuickViewProduct(product)} className="p-4 bg-zinc-900 text-zinc-400 rounded-2xl hover:text-white transition-colors border border-zinc-800"><Eye /></button>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-orange-900/20"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamingLaptops;
