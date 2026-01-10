import React, { useMemo, useEffect, useState } from 'react';
import {
  TrendingUp, ShoppingCart, Package, ShieldCheck,
  DollarSign, ArrowUpRight, User, Laptop,
  Activity, Clock, ChevronRight, Zap,
  BarChart3, Layers, AlertTriangle,
  MessageSquare,
  Trophy,
  ArrowDownRight,
  Send,
  Smartphone,
  PieChart as PieIcon
} from 'lucide-react';
import { BarChart, Bar, Cell, PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';
import { Order, Product, OrderLog } from '../../types';
import { fetchInventory, getAllOrders, fetchAllLogs, getAllCustomers } from '../../lib/api';

const CHART_DATA = [
  { day: 'Tue', revenue: 4200 },
  { day: 'Wed', revenue: 5100 },
  { day: 'Thu', revenue: 4900 },
  { day: 'Fri', revenue: 7200 },
  { day: 'Sat', revenue: 8400 },
  { day: 'Sun', revenue: 6147 },
];

interface OverviewProps {
  orders: Order[];
  onNavigateTab: (tab: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ orders: initialOrders, onNavigateTab }) => {
  const [logs, setLogs] = useState<OrderLog[]>([]);
  const [criticalStock, setCriticalStock] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<any[]>([]);
  const [trendingAssets, setTrendingAssets] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [logsData, invData, ordersData, customersData] = await Promise.all([
          fetchAllLogs(10),
          fetchInventory(0, 100),
          getAllOrders(),
          getAllCustomers()
        ]);

        setLogs(logsData);
        setOrders(ordersData);
        setCustomers(customersData);

        const critical = (invData.data || []).filter((p: any) => (p.stock_quantity || 0) <= 3);
        setCriticalStock(critical);

        const trending = (invData.data || [])
          .sort((a: any, b: any) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
          .slice(0, 3);
        setTrendingAssets(trending);

      } catch (err) {
        console.error('Registry sync failure');
      }
    };
    loadData();
  }, []);

  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total_amount, 0), [orders]);

  const funnelData = useMemo(() => {
    return [
      { name: 'Pending', value: orders.filter(o => o.status === 'Pending').length, color: '#E2E8F0' },
      { name: 'Processing', value: orders.filter(o => o.status === 'Processing').length, color: '#FF4F00' },
      { name: 'In Transit', value: orders.filter(o => o.status === 'Out for Delivery').length, color: '#0F172A' }
    ].filter(v => v.value > 0);
  }, [orders]);

  const whaleCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, 3);
  }, [customers]);

  const handleWhatsAppCustomer = (c: any) => {
    const msg = `Hello ${c.name}, this is Nova Trend Operations. We are reviewing your registry nodes. How is your fleet performing?`;
    window.open(`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* KPI LAYER: FINANCIAL PULSE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1">Total Registry Volume</p>
              <div className="flex items-end justify-between mb-8">
                <h3 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                  ${totalRevenue.toLocaleString()}
                </h3>
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                  <TrendingUp className="w-3 h-3" /> +12% Delta
                </span>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA}>
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {CHART_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === CHART_DATA.length - 1 ? '#FF4F00' : '#F1F5F9'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="md:w-64 flex flex-col justify-between p-8 bg-slate-950 dark:bg-black rounded-[32px] text-white">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-nova-orange" /> Node Funnel
                </h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={funnelData}
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '12px', fontSize: '10px', fontWeight: '900' }}
                        itemStyle={{ color: '#FFFFFF' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-2">
                {funnelData.map(f => (
                  <div key={f.name} className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase text-slate-500">{f.name}</span>
                    <span className="text-[10px] font-black italic">{f.value} Nodes</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LOGS FEED: REAL-TIME TELEMETRY */}
          <section className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase italic flex items-center gap-3">
                <Clock className="w-5 h-5 text-nova-orange" /> Real-time Activity Matrix
              </h3>
            </div>

            <div className="p-8 space-y-6">
              {logs.map((log) => (
                <div key={log.id} className="group relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 py-1 transition-all hover:border-nova-orange">
                  <div className="absolute -left-[5px] top-3 w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full group-hover:bg-nova-orange transition-colors" />
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{log.status_text}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mono">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Order <span className="font-black text-slate-900 dark:text-slate-200">#{log.order_id}</span>: {log.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* SIDEBAR MODULES: WHALES & TRENDS */}
        <div className="lg:col-span-4 space-y-8">
          {/* WHALE TRACKER */}
          <section className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic flex items-center gap-3 mb-8">
              <Trophy className="w-5 h-5 text-amber-500" /> The Whale Tracker
            </h3>
            <div className="space-y-4">
              {whaleCustomers.map((c, i) => (
                <div key={c.phone} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-nova-orange transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black italic ${i === 0 ? 'bg-nova-orange text-white' : 'bg-slate-950 text-white'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase line-clamp-1">{c.name}</p>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.1em] mt-1">${(c.totalSpent || 0).toLocaleString()} CLV</p>
                    </div>
                  </div>
                  <button onClick={() => handleWhatsAppCustomer(c)} className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366] hover:text-white transition-all shadow-sm">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* TRENDING ASSETS */}
          <section className="bg-slate-950 dark:bg-black p-8 rounded-[40px] shadow-2xl relative overflow-hidden border border-white/5">
            <div className="relative z-10">
              <h3 className="text-lg font-black text-white uppercase italic flex items-center gap-3 mb-8">
                <Zap className="w-5 h-5 text-nova-orange" /> Trending Assets
              </h3>
              <div className="space-y-6">
                {trendingAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl p-3 border border-white/10 shrink-0 group-hover:bg-white/10 transition-all">
                      <img src={asset.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-white uppercase truncate mb-1">{asset.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{asset.brand}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className="text-[9px] font-black text-nova-orange uppercase italic">{asset.reviewsCount} Mentions</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-nova-orange transition-colors" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-nova-orange/5 rounded-full blur-[80px]" />
          </section>

          {/* CRITICAL ALERTS */}
          <div className="bg-[#FF4F00] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-white" /> Registry Alerts
              </h3>
              <div className="space-y-3">
                {criticalStock.length > 0 ? criticalStock.slice(0, 3).map(item => (
                  <div key={item.id} className="p-4 bg-white/10 rounded-2xl border border-white/10 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase truncate max-w-[140px]">{item.name}</p>
                    <span className="text-[10px] font-black bg-white text-[#FF4F00] px-3 py-1 rounded-lg">Only {item.stock_quantity}</span>
                  </div>
                )) : (
                  <div className="py-6 text-center bg-white/5 rounded-2xl border border-dashed border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 italic">Registry Nodes Stabilized</p>
                  </div>
                )}
              </div>
              <button onClick={() => onNavigateTab('inventory')} className="w-full py-5 bg-white text-slate-950 rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-slate-100 transition-all shadow-xl active:scale-95">Synchronize Stock</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
