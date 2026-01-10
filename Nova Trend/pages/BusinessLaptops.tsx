import React, { useState } from 'react';
import { ShieldCheck, Battery, Fingerprint, Send, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../services/mockData';
import { useCart } from '../components/context/CartContext';
import { useShop } from '../components/context/ShopContext';
import ProductCard from '../components/features/ProductCard';
import FilterSidebar from '../components/features/FilterSidebar';

const BusinessLaptops: React.FC = () => {
  const { addToCart } = useCart();
  const { setQuickViewProduct } = useShop();
  const [showBulkModal, setShowBulkModal] = useState(false);
  const businessLaptops = PRODUCTS.filter(p => p.useCase === 'Office');

  return (
    <div className="bg-white min-h-screen pt-20 pb-32">
      <div className="container mx-auto px-4">
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-100 text-zinc-600 rounded-full mb-6 border border-zinc-200">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Corporate Standards</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-black uppercase italic mb-6">
            Enterprise <span className="text-orange-600">Mobility</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg mb-10">
            Professional machines designed for boardroom performance, military-grade security, and all-day endurance.
          </p>
          <button
            onClick={() => setShowBulkModal(true)}
            className="border-2 border-black hover:bg-black hover:text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
          >
            Bulk Order Inquiry
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {businessLaptops.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col lg:flex-row bg-zinc-50 rounded-[40px] border border-zinc-100 overflow-hidden hover:border-orange-600/30 transition-all duration-500"
            >
              <div className="lg:w-2/5 aspect-square lg:aspect-auto overflow-hidden">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
              </div>
              <div className="lg:w-3/5 p-8 md:p-12 flex flex-col">
                <div className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-4">Domain: Executive Office</div>
                <h3 className="text-3xl font-black text-black uppercase italic mb-6 leading-tight">{product.name}</h3>

                <div className="space-y-4 mb-10 flex-1">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <Battery className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-bold">{product.technical_specs.battery_life}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600">
                    <Fingerprint className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-bold">Biometric Authentication & TPM 2.0</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600">
                    <ShieldCheck className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-bold">Military Grade Durability (MIL-STD 810H)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-zinc-200">
                  <div className="text-2xl font-black text-black">${product.price.toLocaleString()}</div>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Fleet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Order Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBulkModal(false)} />
          <div className="relative bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95">
            <h2 className="text-3xl font-black text-black uppercase italic mb-8">Fleet <span className="text-orange-600">Inquiry</span></h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Inquiry Sent! Our Corporate Lead will contact you shortly.'); setShowBulkModal(false); }}>
              <input placeholder="Organization Name" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-4 font-bold outline-none focus:border-orange-600" required />
              <input placeholder="Project Lead Email" type="email" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-4 font-bold outline-none focus:border-orange-600" required />
              <input placeholder="Estimated Units (10+)" type="number" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-4 font-bold outline-none focus:border-orange-600" required />
              <textarea placeholder="Specific Compliance Requirements..." className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-4 font-bold outline-none focus:border-orange-600 h-32" />
              <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                <Send className="w-5 h-5 text-orange-600" /> Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessLaptops;
