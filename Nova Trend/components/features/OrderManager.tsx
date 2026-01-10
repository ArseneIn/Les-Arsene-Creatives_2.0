import React, { useState, useMemo, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import {
  Search, Eye, Copy, Check, MessageSquare,
  MapPin, Phone, ShoppingCart, User,
  ChevronRight, X, ExternalLink, RefreshCw,
  CreditCard, Loader2, Save, FileText, UserCheck,
  Zap, Calendar, Clock, BellRing, Smartphone,
  Activity, Power
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { getAllOrders, updateOrderStatus, updateMerchantData, updateAutomationStatus } from '../../lib/api';

const OrderManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [merchantNotes, setMerchantNotes] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrders();
      setLocalOrders(data.length > 0 ? data : []);
    } catch (err) {
      console.error('Failed to sync orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    if (selectedOrder) {
      setMerchantNotes(selectedOrder.merchant_notes || '');
      setVerifiedBy(selectedOrder.verified_by || '');
    }
  }, [selectedOrder]);

  const filteredOrders = useMemo(() =>
    localOrders.filter(o =>
      o.id.toString().includes(searchTerm) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.momo_ref?.includes(searchTerm)
    ),
    [localOrders, searchTerm]);

  const { addLog } = useNotification();

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus(id, newStatus, selectedOrder.status);
      setLocalOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      addLog('Order Status', `Order #${id} updated to ${newStatus}`);
    } catch (err) { console.error(err); } finally { setIsUpdating(false); }
  };

  const handleToggleAutomation = async () => {
    if (!selectedOrder) return;
    const newState = !selectedOrder.automation_enabled;
    setIsUpdating(true);
    try {
      await updateAutomationStatus(selectedOrder.id, newState);
      setLocalOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, automation_enabled: newState } : o));
      setSelectedOrder(prev => prev ? { ...prev, automation_enabled: newState } : null);
      setToast(`Automation ${newState ? 'Armed' : 'Paused'}`);
      setTimeout(() => setToast(null), 3000);
      addLog('Automation', `Order #${selectedOrder.id} automation ${newState ? 'enabled' : 'disabled'}`);
    } catch (err) { console.error(err); } finally { setIsUpdating(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by Order ID or Client..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold outline-none focus:border-[#FF6B00] transition-all text-slate-900 dark:text-white" />
        </div>
        <button onClick={fetchOrders} className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-black dark:hover:text-white transition-all">
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-950/50">
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="p-8 text-[10px] font-black uppercase text-slate-500">Order ID</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-500">Identity</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-500">Total Value</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-500">Status</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all">
                <td className="p-8 font-black text-xs mono text-slate-400">#{order.id}</td>
                <td className="p-8">
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">{order.customer_name}</p>
                </td>
                <td className="p-8">
                  <p className="text-lg font-black text-slate-900 dark:text-white">${order.total_amount.toLocaleString()}</p>
                </td>
                <td className="p-8">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{order.status}</span>
                </td>
                <td className="p-8 text-right">
                  <button onClick={() => setSelectedOrder(order)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-[#FF6B00] hover:text-white transition-all"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-[40px] max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic leading-none">Command <span className="text-[#FF6B00]">Dispatch</span></h2>
              <button onClick={() => setSelectedOrder(null)} className="p-3 text-slate-500 hover:text-black dark:hover:text-white"><X /></button>
            </div>

            <div className="p-10 flex-1 overflow-y-auto space-y-10 no-scrollbar">
              <section className="flex justify-between items-center p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedOrder.automation_enabled !== false ? 'bg-emerald-600' : 'bg-red-600'} text-white shadow-lg`}>
                    <Power className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Automation Engine</p>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">{selectedOrder.automation_enabled !== false ? 'Active: 24H Follow-up Armed' : 'Registry Kill-Switch Engaged'}</h4>
                  </div>
                </div>
                <button
                  onClick={handleToggleAutomation}
                  className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${selectedOrder.automation_enabled !== false ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                >
                  {selectedOrder.automation_enabled !== false ? 'Deactivate 24H Hook' : 'Arm Automation Node'}
                </button>
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Lifecycle Control</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-5 px-6 font-black uppercase tracking-widest text-sm text-slate-900 dark:text-white focus:border-[#FF6B00] outline-none"
                >
                  <option value="Pending">Node Received</option>
                  <option value="Processing">Diagnostic Phase</option>
                  <option value="Out for Delivery">In Transit</option>
                  <option value="Delivered">Asset Confirmed</option>
                  <option value="Cancelled">Void Transaction</option>
                </select>
              </section>

              <div className="p-8 bg-slate-950 rounded-[32px] text-white">
                <div className="flex justify-between items-baseline mb-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Ref ID: {selectedOrder.momo_ref || 'PENDING'}</p>
                  <p className="text-3xl font-black italic text-white">${selectedOrder.total_amount.toLocaleString()}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Financial State</p>
                    <p className="text-xs font-bold text-[#FF6B00] uppercase">Authorized via MoMo Node</p>
                  </div>
                  <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1">RWA VAT</p>
                    <p className="text-xs font-bold text-white uppercase">18% Compliant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl animate-in slide-in-from-bottom-5 border border-[#FF6B00]/30 flex items-center gap-3">
          <Zap className="w-4 h-4 text-[#FF6B00]" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default OrderManager;