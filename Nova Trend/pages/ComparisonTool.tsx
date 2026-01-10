
import React, { useState } from 'react';
import { Plus, X, Monitor, Cpu, Database, Battery, CheckCircle2, ShoppingBag, Trophy, Layers } from 'lucide-react';
import { PRODUCTS } from '../services/mockData';
import ComparisonEngine from '../components/features/ComparisonEngine';
import ComparisonBar from '../components/features/ComparisonBar';
import { Product } from '../types';
import { useCart } from '../components/context/CartContext';

const ComparisonTool: React.FC = () => {
  const { addToCart } = useCart();
  const [slot1, setSlot1] = useState<Product | null>(null);
  const [slot2, setSlot2] = useState<Product | null>(null);
  const [isChoosing, setIsChoosing] = useState<1 | 2 | null>(null);

  const specRows = [
    { label: 'Category', icon: <CheckCircle2 />, get: (p: Product) => p.useCase, winner: null },
    { label: 'Processor', icon: <Cpu />, get: (p: Product) => `${p.technical_specs.cpu_brand} ${p.technical_specs.cpu_model} `, winner: (p1: Product, p2: Product) => p1.price > p2.price ? p1.id : p2.id },
    { label: 'RAM', icon: <Database />, get: (p: Product) => p.technical_specs.memory, winner: (p1: Product, p2: Product) => parseInt(p1.technical_specs.memory) > parseInt(p2.technical_specs.memory) ? p1.id : p2.id },
    { label: 'Display Panel', icon: <Monitor />, get: (p: Product) => p.technical_specs.display.panel, winner: (p1: Product, p2: Product) => p1.technical_specs.display.panel.includes('OLED') ? p1.id : p2.id },
    { label: 'Battery Est.', icon: <Battery />, get: (p: Product) => p.technical_specs.battery_life, winner: (p1: Product, p2: Product) => p1.brand === 'Apple' ? p1.id : p2.id },
    { label: 'Weight', icon: <CheckCircle2 />, get: (p: Product) => `${p.technical_specs.weight_lbs} lbs`, winner: (p1: Product, p2: Product) => p1.technical_specs.weight_lbs < p2.technical_specs.weight_lbs ? p1.id : p2.id },
  ];

  const handleSelect = (product: Product) => {
    if (isChoosing === 1) setSlot1(product);
    if (isChoosing === 2) setSlot2(product);
    setIsChoosing(null);
  };

  return (
    <div className="bg-white min-h-screen pt-20 pb-32 transition-colors">
      <div className="container mx-auto px-4">
        {/* Exact Node Grid Header Icon Implementation */}
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 100 100" className="w-12 h-12">
            <circle cx="20" cy="20" r="8" fill="black" />
            <circle cx="50" cy="20" r="8" fill="#FF4F00" />
            <circle cx="80" cy="20" r="8" fill="black" />
            <path d="M20 50 H 50" stroke="#FF4F00" strokeWidth="8" strokeLinecap="round" />
            <circle cx="20" cy="50" r="8" fill="#FF4F00" />
            <circle cx="50" cy="50" r="8" fill="#FF4F00" />
            <circle cx="80" cy="50" r="8" fill="black" />
            <circle cx="20" cy="80" r="8" fill="black" />
            <circle cx="50" cy="80" r="8" fill="#FF4F00" />
            <circle cx="80" cy="80" r="8" fill="#FF4F00" />
          </svg>
        </div>

        <header className="mb-20 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic mb-6">
            Specs vs <span className="text-[#FF4F00]">Specs</span>
          </h1>
          <p className="text-slate-600 font-medium text-lg leading-relaxed">
            Rationalize your decision. <span className="text-[#FF4F00] font-black">Nova Comparison Matrix</span> allows you to dissect technical capabilities side-by-side.
          </p>
        </header>

        {/* Selection Slots */}
        <div className="grid grid-cols-2 gap-8 mb-20 sticky top-16 z-30 bg-white/95 backdrop-blur-md py-10 border-b border-slate-100">
          {[slot1, slot2].map((slot, idx) => (
            <div key={idx} className="relative group">
              {slot ? (
                <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-200 flex items-center gap-8 shadow-xl shadow-slate-200/40 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-24 h-24 shrink-0 bg-white rounded-3xl p-3 border border-slate-100 shadow-sm">
                    <img src={slot.image} className="w-full h-full object-contain" alt={slot.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-[#FF4F00] uppercase tracking-[0.2em] mb-1">{slot.brand} Registry</div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none truncate">{slot.name}</h3>
                    <div className="text-2xl font-black text-slate-900 mt-3 tracking-tighter">${slot.price.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => idx === 0 ? setSlot1(null) : setSlot2(null)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsChoosing(idx === 0 ? 1 : 2)}
                  className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center gap-5 hover:border-[#FF4F00]/50 hover:bg-orange-50/20 transition-all text-slate-400 group"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform shadow-sm">
                    <Plus className="w-8 h-8 text-[#FF4F00]" />
                  </div>
                  <div className="text-center">
                    <span className="block text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Select Hardware Asset</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registry Slot {idx + 1}</span>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Matrix */}
        {slot1 && slot2 ? (
          <div className="border border-slate-100 rounded-[48px] overflow-hidden shadow-2xl shadow-slate-200/50 bg-white">
            {specRows.map((row) => {
              const winId = row.winner ? row.winner(slot1, slot2) : null;
              return (
                <div key={row.label} className="flex flex-col md:flex-row border-b border-slate-100 last:border-0 group hover:bg-slate-50/50 transition-colors">
                  <div className="md:w-1/4 p-10 bg-slate-50/50 md:bg-transparent md:border-r border-slate-100 flex items-center gap-4">
                    <span className="text-[#FF4F00]">{row.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{row.label}</span>
                  </div>
                  {[slot1, slot2].map((slot, i) => {
                    const isWinner = winId === slot.id;
                    return (
                      <div
                        key={i}
                        className={`flex-1 p-10 text-sm font-bold flex items-center justify-between gap-6 transition-all ${isWinner
                          ? 'bg-orange-50/50 text-slate-900 border-x-4 border-[#FF4F00]'
                          : 'text-slate-600'
                          } `}
                      >
                        <span className={isWinner ? 'font-black' : ''}>{row.get(slot)}</span>
                        {isWinner && (
                          <div className="w-8 h-8 bg-[#FF4F00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/10">
                            <Trophy className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {/* CTA Footer */}
            <div className="flex bg-slate-900 p-10">
              <div className="hidden md:block md:w-1/4"></div>
              {[slot1, slot2].map((slot, i) => (
                <div key={i} className="flex-1 px-4">
                  <button
                    onClick={() => addToCart(slot)}
                    className="w-full bg-[#FF4F00] hover:bg-orange-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 shadow-xl shadow-orange-900/20 active:scale-95 transition-all"
                  >
                    <ShoppingBag className="w-5 h-5" /> Deploy {slot.brand}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-32 text-center space-y-10 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto text-slate-200 border border-slate-100">
              <Layers className="w-12 h-12" />
            </div>
            <div className="space-y-3">
              <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs italic">Awaiting technical parameters for node synchronization...</p>
              <p className="text-slate-400 font-medium text-sm">Select two products above to initialize the performance matrix.</p>
            </div>
          </div>
        )}
      </div>

      {/* Choice Overlay */}
      {isChoosing !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsChoosing(null)} />
          <div className="relative bg-white rounded-[40px] p-10 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col no-scrollbar">
            <div className="flex justify-between items-center mb-10 sticky top-0 bg-white z-10 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FF4F00] rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-orange-900/10">N</div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-slate-900 uppercase italic tracking-tight">Select <span className="text-[#FF4F00]">Hardware</span></h2>
              </div>
              <button onClick={() => setIsChoosing(null)} className="p-3 text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-100 rounded-2xl"><X className="w-7 h-7" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className="flex items-center gap-5 p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:border-[#FF4F00] hover:bg-white hover:shadow-2xl hover:shadow-orange-900/5 transition-all text-left group"
                >
                  <div className="w-16 h-16 shrink-0 bg-white rounded-2xl border border-slate-100 p-2 group-hover:scale-105 transition-transform">
                    <img src={p.image} className="w-full h-full object-contain" alt="" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-black text-[#FF4F00] uppercase tracking-widest leading-none mb-1">{p.brand}</div>
                    <div className="font-black text-slate-900 text-sm line-clamp-1 uppercase italic tracking-tight leading-tight">{p.name}</div>
                    <div className="text-xs font-bold text-slate-500 mt-1">${p.price.toLocaleString()}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonTool;