
import React, { useState, useEffect } from 'react';
import { Timer, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../services/mockData';
import ProductCard from '../components/features/ProductCard';
import FilterSidebar from '../components/features/FilterSidebar';
import { useCart } from '../components/context/CartContext';
import { useShop } from '../components/context/ShopContext';

const LimitedDeals: React.FC = () => {
  const { addToCart } = useCart();
  const { setQuickViewProduct } = useShop();
  const [timeLeft, setTimeLeft] = useState({ h: 4, m: 20, s: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = PRODUCTS.slice(0, 4).map(p => ({
    ...p,
    discountPrice: Math.round(p.price * 0.8),
    stockLeft: Math.floor(Math.random() * 8) + 1
  }));

  return (
    <div className="bg-white min-h-screen">
      {/* Top Countdown Bar */}
      <div className="bg-black py-4 sticky top-16 z-40 border-b border-orange-600/20">
        <div className="container mx-auto px-4 flex items-center justify-center gap-6">
          <span className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] hidden sm:block italic">Titan Flash Sale Activated</span>
          <div className="flex items-center gap-3 text-white font-black text-xl italic uppercase">
            <Timer className="text-orange-600 w-6 h-6" />
            DEALS EXPIRE IN:
            <span className="text-orange-600 tabular-nums">
              {String(timeLeft.h).padStart(2, '0')}h {String(timeLeft.m).padStart(2, '0')}m {String(timeLeft.s).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <header className="mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-black uppercase italic leading-[0.85] tracking-tighter">
            The <span className="text-orange-600">Orange Tag</span> <br />
            Flash Sale
          </h1>
          <p className="mt-8 text-zinc-500 font-bold uppercase tracking-[0.2em] max-w-lg">Exclusive 24-hour hardware drops. Final stock allocations only.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {dealProducts.map((deal) => (
            <div key={deal.id} className="group flex flex-col md:flex-row bg-zinc-50 border border-zinc-100 rounded-[40px] overflow-hidden hover:border-orange-600/40 transition-all duration-500">
              <div className="md:w-1/2 relative bg-zinc-100 overflow-hidden">
                <img src={deal.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={deal.name} />
                <div className="absolute top-6 left-6 bg-red-600 text-white font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-2xl">
                  -20% OFF
                </div>
              </div>
              <div className="md:w-1/2 p-10 flex flex-col">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{deal.brand} Deployment</div>
                <h3 className="text-3xl font-black text-black uppercase italic mb-6 leading-tight group-hover:text-orange-600 transition-colors">{deal.name}</h3>

                <div className="flex items-baseline gap-4 mb-10">
                  <span className="text-4xl font-black text-orange-600">${deal.discountPrice.toLocaleString()}</span>
                  <span className="text-xl font-bold text-zinc-300 line-through">${deal.price.toLocaleString()}</span>
                </div>

                <div className="space-y-3 mb-10">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className={deal.stockLeft <= 3 ? 'text-orange-600 animate-pulse' : 'text-zinc-500'}>
                      {deal.stockLeft <= 3 ? `Only ${deal.stockLeft} Left!` : 'Stock Available'}
                    </span>
                    <span className="text-zinc-400">{Math.round((deal.stockLeft / 10) * 100)}% Remaining</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${deal.stockLeft <= 3 ? 'bg-orange-600' : 'bg-black'}`}
                      style={{ width: `${(deal.stockLeft / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button
                    onClick={() => addToCart(deal)}
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-orange-900/10"
                  >
                    Secure Item <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button onClick={() => setQuickViewProduct(deal)} className="p-5 bg-white border border-zinc-200 rounded-2xl text-black hover:bg-zinc-100 transition-all"><Eye className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-black rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <h4 className="text-3xl font-black text-white uppercase italic">Don't Miss <span className="text-orange-600">The Drop</span></h4>
            <p className="text-zinc-500 text-sm font-medium">Join 50k+ enthusiasts receiving early access to our limited tag sales.</p>
          </div>
          <div className="flex w-full md:w-auto gap-4">
            <input placeholder="Email Address" className="flex-1 md:w-80 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-white outline-none focus:border-orange-600" />
            <button className="bg-orange-600 text-white px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2">Notify Me <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimitedDeals;
