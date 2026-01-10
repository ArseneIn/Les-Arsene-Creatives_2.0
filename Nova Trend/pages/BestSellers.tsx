import React from 'react';
import { Star, TrendingUp, ShoppingBag, Eye } from 'lucide-react';
import { PRODUCTS } from '../services/mockData';
import ProductCard from '../components/features/ProductCard';
import FilterSidebar from '../components/features/FilterSidebar';
import { useCart } from '../components/context/CartContext';
import { useShop } from '../components/context/ShopContext';

const BestSellers: React.FC = () => {
  const { addToCart } = useCart();
  const { setQuickViewProduct } = useShop();

  const sortedProducts = [...PRODUCTS].sort((a, b) => b.reviewsCount - a.reviewsCount);
  const trendingIds = sortedProducts.slice(0, 4).map(p => p.id);

  return (
    <div className="bg-white min-h-screen pt-20 pb-32">
      <div className="container mx-auto px-4">
        <header className="mb-16 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full mb-6">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Community Favorites</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-black uppercase italic mb-6">
            Our <span className="text-orange-600">Best Sellers</span>
          </h1>
          <p className="text-zinc-500 font-medium leading-relaxed">
            The gear that defined the year. These products are rated highest for performance, reliability, and value by the Titan community.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-orange-600 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/5"
            >
              <div className="relative aspect-square bg-zinc-50 overflow-hidden">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                {trendingIds.includes(product.id) && (
                  <div className="absolute top-4 right-4 bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => setQuickViewProduct(product)} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors"><Eye className="w-5 h-5" /></button>
                  <button onClick={() => addToCart(product)} className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"><ShoppingBag className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{product.brand}</span>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                    <span className="text-xs font-bold">{product.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-black mb-4 line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                  <span className="text-xl font-black text-black">${product.price.toLocaleString()}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="text-xs font-black uppercase tracking-widest text-orange-600 hover:text-orange-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
