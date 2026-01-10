
import React from 'react';
import { X, ArrowRight, CheckCircle2, AlertCircle, Layers, Zap, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useCart } from '../context/CartContext';
import { Product } from '../../types';

interface ComparisonBarProps {
  products: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({ products, onRemove, onClear, onCompare }) => {
  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-black/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 pl-3">
          <div className="w-10 h-10 bg-[#FF8C00] rounded-2xl flex items-center justify-center text-black">
            <Layers className="w-5 h-5" />
          </div>
          <div className="hidden md:block">
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Hardware Matrix</p>
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{products.length} of 3 Assets Selected</p>
          </div>
        </div>

        <div className="flex-1 flex justify-center gap-3">
          {products.map((p) => (
            <div key={p.id} className="relative group">
              <img
                src={p.image}
                className="w-12 h-12 rounded-xl object-cover border border-zinc-800 group-hover:border-[#FF8C00] transition-all"
                alt=""
              />
              <button
                onClick={() => onRemove(p.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-zinc-800 text-zinc-400 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-colors border border-zinc-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {[...Array(3 - products.length)].map((_, i) => (
            <div key={i} className="w-12 h-12 rounded-xl border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-800">
              <Zap className="w-4 h-4 opacity-20" />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 px-4 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onCompare}
            disabled={products.length < 2}
            className="bg-[#FF8C00] hover:bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-orange-900/20 active:scale-95 disabled:opacity-30 disabled:grayscale flex items-center gap-2"
          >
            Launch Showdown <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
