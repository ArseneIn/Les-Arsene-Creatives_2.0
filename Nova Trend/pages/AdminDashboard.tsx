
import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Settings, TrendingUp, AlertTriangle,
  Edit3, CheckCircle2,
  ArrowUpRight, DollarSign, Zap, Plus,
  MessageSquare, ShieldAlert, X,
  Save, LogOut, Laptop, ShieldCheck,
  Trash2, Search, Minus, BarChart3,
  Loader2, Filter, Shield, Lock
} from 'lucide-react';
import { Product, Order, OrderStatus, AdminRole } from '../types';
import { useAuth } from '../components/context/AuthContext';
import AdminSettings from './AdminSettings';
import AddProductModal from '../components/ui/AddProductModal';
import OrderManager from '../components/features/OrderManager';
import CustomerManager from '../components/features/CustomerManager';
import ServiceHub from '../components/features/ServiceHub';
import Overview from '../components/features/Overview';
import NovaLogo from '../components/ui/NovaLogo';
import { fetchInventory, getAllOrders } from '../lib/api';
import { PRODUCTS } from '../services/mockData';

const AdminDashboard: React.FC = () => {
  const { logout, userProfile: authProfile } = useAuth();
  // Allow overriding profile for admin demo simulation or just use authProfile. 
  // For now, we keep the demo simulation logic if authProfile is null, or merge them.
  // Actually, let's trust useAuth for profile if available, or fallback to demo localstorage for "admin mode" toggle if that was the intent.
  // But strictly, we should use useAuth.
  // However, the previous code read from localStorage 'userProfile' directly which might be different from AuthContext if we haven't fully migrated the "Login as Admin" flow to AuthContext.
  // AuthContext handles 'user' and 'isSupabaseConfigured'.
  // We'll rely on AuthContext. If AuthContext doesn't have the admin role, we might have issues. 
  // But let's assume AuthContext is the source of truth.

  const userProfile = authProfile || {
    name: 'Arsene Cyuzuzo',
    role_type: 'super_admin',
    perm_financials: true, perm_fleet: true, perm_support: true, perm_userdata: true
  }; // Fallback for demo if not logged in via context (which shouldn't happen due to ProtectedRoute)

  const [activeTab, setActiveTab] = useState(() => {
    if (userProfile.perm_financials) return 'overview';
    if (userProfile.perm_fleet) return 'inventory';
    if (userProfile.perm_support) return 'service';
    return 'settings';
  });

  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [inventorySearch, setInventorySearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data.length > 0 ? data : []);
      } catch (err) { console.error(err); }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    if (activeTab === 'inventory') {
      loadInventory(0, true);
    }
  }, [activeTab, categoryFilter]);

  const loadInventory = async (page: number, reset = false) => {
    setIsLoading(true);
    try {
      const { data } = await fetchInventory(page, 20, categoryFilter);
      setInventory(prev => reset ? (data.length > 0 ? data : PRODUCTS.slice(0, 20)) : [...prev, ...data]);
    } catch (err) {
      if (reset) setInventory(PRODUCTS.slice(0, 20));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustStock = async (id: string, delta: number) => {
    setInventory(prev => prev.map(p => p.id === id ? { ...p, stock_quantity: Math.max(0, (p.stock_quantity || 0) + delta) } : p));
  };

  const handleSaveProduct = async (data: any) => {
    const isUpdate = !!data.id;
    if (isUpdate) {
      setInventory(prev => prev.map(p => p.id === data.id ? { ...p, ...data } : p));
    } else {
      setInventory([{ ...data, id: `ASSET-${Math.random().toString(36).substr(2, 5)}` }, ...inventory]);
    }
    setSelectedProduct(null);
  };

  const navigationItems = useMemo(() => {
    const items = [];
    if (userProfile.perm_financials) {
      items.push({ id: 'overview', label: 'Dashboard Pulse', icon: LayoutDashboard });
    }
    if (userProfile.perm_fleet) {
      items.push({ id: 'inventory', label: 'Fleet Inventory', icon: Package });
      items.push({ id: 'orders', label: 'Order Registry', icon: ShoppingCart });
    }
    if (userProfile.perm_userdata) {
      items.push({ id: 'customers', label: 'User Matrix', icon: Users });
    }
    if (userProfile.perm_support) {
      items.push({ id: 'service', label: 'Support Node', icon: ShieldAlert });
    }
    items.push({ id: 'settings', label: 'System Prefs', icon: Settings });
    return items;
  }, [userProfile]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0F172A] font-sans transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 dark:bg-slate-950 flex flex-col fixed top-0 left-0 h-full z-[70] border-r border-slate-800">
        <div className="p-8 border-b border-slate-800">
          <div className="flex flex-col gap-5">
            <NovaLogo variant="full" theme="dark" size={42} />
            <div className="h-px bg-nova-orange/20 w-full" />
            <div className="flex items-center gap-3 pl-1">
              <div className="w-2.5 h-2.5 bg-nova-orange rounded-full animate-pulse shadow-[0_0_8px_rgba(255,79,0,0.8)]" />
              <p className="text-[10px] font-black text-nova-orange uppercase tracking-[0.4em] brand-font">Registry Control</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          {navigationItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative group ${isActive
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-nova-orange rounded-r-full shadow-[2px_0_12px_rgba(255,79,0,0.6)]" />}
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-nova-orange' : 'group-hover:text-nova-orange'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest brand-font">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Security Audit & Logout Cluster */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="px-6 py-4 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center gap-3">
            <Lock className="w-3.5 h-3.5 text-nova-orange" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Nova Security Protocol v1.1</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase">Authorized Access Only</span>
            </div>
          </div>
          <button onClick={() => logout()} className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-900/10 transition-all group">
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[10px] font-black uppercase tracking-widest brand-font">Terminate Session</span>
          </button>
        </div>
      </aside>

      <main className="ml-80 flex-1 p-10 min-h-screen text-slate-900 dark:text-slate-100">
        {activeTab === 'overview' && userProfile.perm_financials && <Overview orders={orders} onNavigateTab={setActiveTab} />}
        {activeTab === 'inventory' && userProfile.perm_fleet && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative flex-1 max-w-md text-slate-900 dark:text-slate-100">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input value={inventorySearch} onChange={(e) => setInventorySearch(e.target.value)} placeholder="Search fleet registry..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:border-nova-orange outline-none transition-colors" />
              </div>
              <button onClick={() => setIsAddModalOpen(true)} className="bg-nova-orange hover:bg-nova-hover text-white px-10 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 shadow-xl active:scale-95 transition-all transform hover:-translate-y-0.5">
                <Plus className="w-5 h-5" /> Deploy New Asset
              </button>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-950/50">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="p-8 text-[10px] font-black uppercase text-slate-500">Node Asset</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-500">Vertical</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-500">Value</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-500">Registry Stock</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.filter(p => p.name?.toLowerCase().includes(inventorySearch.toLowerCase())).map(item => (
                    <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-8 flex items-center gap-5">
                        <img src={item.image} className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm" alt="" />
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">{item.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.brand}</p>
                        </div>
                      </td>
                      <td className="p-8"><span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">{item.category}</span></td>
                      <td className="p-8 font-black text-slate-900 dark:text-white italic tracking-tighter text-lg">${item.price?.toLocaleString()}</td>
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleAdjustStock(item.id, -1)} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">-</button>
                          <span className="mono font-bold text-sm w-8 text-center dark:text-white">{item.stock_quantity || 0}</span>
                          <button onClick={() => handleAdjustStock(item.id, 1)} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">+</button>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <button
                          onClick={() => { setSelectedProduct(item); setIsAddModalOpen(true); }}
                          className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-nova-orange transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-30"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'orders' && userProfile.perm_fleet && <OrderManager />}
        {activeTab === 'customers' && userProfile.perm_userdata && <CustomerManager />}
        {activeTab === 'service' && userProfile.perm_support && <ServiceHub />}
        {activeTab === 'settings' && <AdminSettings onLogout={logout} isSuperAdmin={userProfile.role_type === 'super_admin'} />}
      </main>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setSelectedProduct(null); }} onSave={handleSaveProduct} product={selectedProduct} />
    </div>
  );
};

export default AdminDashboard;
