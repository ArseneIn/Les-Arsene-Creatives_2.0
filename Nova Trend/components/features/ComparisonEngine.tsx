
import React from 'react';
import { Check, X, Minus, HelpCircle, Trophy, Scale, Zap, Cpu, Monitor, Layers, Database, Battery, Settings, Weight, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../context/ShopContext';

interface ComparisonEngineProps {
  products: Product[];
  onRemove: (p: Product) => void;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const ComparisonEngine: React.FC<ComparisonEngineProps> = ({ products, onRemove, onClose, onAddToCart }) => {
  if (products.length === 0) return null;

  const specRows = [
    {
      label: 'Processor',
      icon: <Cpu className="w-4 h-4" />,
      getVal: (p: Product) => `${p.technical_specs.cpu_brand} ${p.technical_specs.cpu_model} `,
      winnerId: products.find(p => p.technical_specs.cpu_brand === 'Apple')?.id || products[0]?.id
    },
    {
      label: 'Display',
      icon: <Monitor className="w-4 h-4" />,
      getVal: (p: Product) => `${p.technical_specs.display.size} ${p.technical_specs.display.panel} (${p.technical_specs.display.resolution})`,
      winnerId: products.find(p => p.technical_specs.display.panel === 'OLED')?.id || products[0]?.id
    },
    {
      label: 'Memory',
      icon: <Layers className="w-4 h-4" />,
      getVal: (p: Product) => p.technical_specs.memory,
      winnerId: [...products].sort((a, b) => parseInt(b.technical_specs.memory) - parseInt(a.technical_specs.memory))[0].id
    },
    {
      label: 'SSD Capacity',
      icon: <Database className="w-4 h-4" />,
      getVal: (p: Product) => p.technical_specs.storage,
      winnerId: products.find(p => p.technical_specs.storage.includes('2TB'))?.id || products[0]?.id
    },
    {
      label: 'Endurance',
      icon: <Battery className="w-4 h-4" />,
      getVal: (p: Product) => p.technical_specs.battery_life,
      winnerId: products.find(p => p.brand === 'Apple')?.id || products[0]?.id
    },
    {
      label: 'I/O Matrix',
      icon: <Settings className="w-4 h-4" />,
      getVal: (p: Product) => p.technical_specs.usb_ports,
      winnerId: products.find(p => p.brand !== 'Apple')?.id || products[0]?.id
    },
    {
      label: 'Portability',
      icon: <Weight className="w-4 h-4" />,
      getVal: (p: Product) => `${p.technical_specs.weight_lbs} lbs`,
      winnerId: [...products].sort((a, b) => a.technical_specs.weight_lbs - b.technical_specs.weight_lbs)[0].id
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300 p-4 md:p-8">
      <div className="relative w-full h-full md:max-w-6xl bg-white md:rounded-[48px] shadow-[0_0_100px_rgba(255,79,0,0.15)] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="sticky top-0 z-30 bg-slate-900 text-white p-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Hardcoded Node Grid Icon */}
            <svg viewBox="0 0 100 100" className="w-10 h-10">
              <circle cx="20" cy="20" r="8" fill="white" />
              <circle cx="50" cy="20" r="8" fill="#FF4F00" />
              <circle cx="80" cy="20" r="8" fill="white" />
              <path d="M20 50 H 50" stroke="#FF4F00" strokeWidth="8" strokeLinecap="round" />
              <circle cx="20" cy="50" r="8" fill="#FF4F00" />
              <circle cx="50" cy="50" r="8" fill="#FF4F00" />
              <circle cx="80" cy="50" r="8" fill="white" />
              <circle cx="20" cy="80" r="8" fill="white" />
              <circle cx="50" cy="80" r="8" fill="#FF4F00" />
              <circle cx="80" cy="80" r="8" fill="#FF4F00" />
            </svg>
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                Hardware <span className="text-[#FF4F00]">Showdown</span>
              </h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Nova Comparison Matrix v5.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-[#FF4F00] transition-all active:scale-90"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
          <div className="min-w-[900px] md:w-full border-collapse">

            {/* Asset Header Row */}
            <div className="flex border-b border-slate-100">
              <div className="w-[25%] p-10 flex items-end">
                <div className="text-[#FF4F00] font-black uppercase tracking-[0.3em] text-[10px]">Technical Matrix</div>
              </div>
              {products.map((p) => (
                <div key={p.id} className="flex-1 p-10 group relative bg-white border-l border-slate-50">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FF4F00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 space-y-8">
                    <button
                      onClick={() => onRemove(p)}
                      className="absolute -top-4 -right-4 p-2.5 bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="aspect-video bg-slate-50 rounded-3xl p-6 border border-slate-100 group-hover:shadow-2xl group-hover:shadow-orange-900/5 transition-all overflow-hidden">
                      <img src={p.image} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" alt="" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-[#FF4F00] uppercase tracking-widest mb-1">{p.brand} Registry</div>
                      <h3 className="text-xl font-black text-slate-900 leading-none uppercase italic truncate">{p.name}</h3>
                      <div className="text-2xl font-black text-slate-900 mt-4 tracking-tighter">${p.price.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Spec Matrix Body */}
            <div className="space-y-0">
              {specRows.map((row) => (
                <div key={row.label} className="flex group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <div className="w-[25%] p-10 flex items-center gap-4 bg-slate-50/50 group-hover:bg-white transition-colors">
                    <div className="text-[#FF4F00]">{row.icon}</div>
                    <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[11px]">
                      {row.label}
                    </span>
                  </div>

                  {products.map((p) => {
                    const isWinner = row.winnerId === p.id;
                    return (
                      <div
                        key={`${p.id} -${row.label} `}
                        className={`flex - 1 p - 10 text - sm font - bold border - l border - slate - 50 transition - all ${isWinner ? 'bg-orange-50/50 text-slate-900' : 'text-slate-600'
                          } `}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className={isWinner ? 'font-black' : ''}>{row.getVal(p)}</span>
                          {isWinner && (
                            <div className="w-7 h-7 bg-[#FF4F00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/10">
                              <Trophy className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Action Row */}
            <div className="flex bg-slate-900 p-10">
              <div className="w-[25%]"></div>
              {products.map(p => (
                <div key={`cta - ${p.id} `} className="flex-1 px-4">
                  <button
                    onClick={() => onAddToCart(p)}
                    className="w-full bg-[#FF4F00] hover:bg-orange-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all transform active:scale-95 shadow-xl shadow-orange-900/20"
                  >
                    <ShoppingBag className="w-5 h-5" /> Secure Deployment
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonEngine;