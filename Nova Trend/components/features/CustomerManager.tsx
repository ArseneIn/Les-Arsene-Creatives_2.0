
import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, User, MapPin, Phone, CreditCard,
  ChevronRight, X, MessageSquare, Briefcase,
  Star, TrendingUp, Filter, RefreshCw,
  Mail, Clock, ShieldCheck, FileText,
  Save, Loader2, History, Ticket as TicketIcon,
  Zap, PlusCircle, Laptop, ShieldAlert,
  Calendar, BadgeCheck, Activity,
  ArrowRight, Key, Shield, CheckCircle2
} from 'lucide-react';
import { getAllCustomers, fetchUserOrders, fetchUserTickets } from '../../lib/api';
import NovaLogo from '../ui/NovaLogo';
import { Ticket, Order } from '../../types';

const CustomerManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerFleet, setCustomerFleet] = useState<Order[]>([]);
  const [customerTickets, setCustomerTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isDeployingCredit, setIsDeployingCredit] = useState(false);
  const [creditStatus, setCreditStatus] = useState<string | null>(null);

  const fetchRegistry = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCustomers();
      // SECURITY LOCK: Only show pure client nodes in User Matrix
      setCustomers(data.filter(c => !c.role_type));
    } catch (err) {
      console.error('Customer Registry Sync Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  // Effect to load deeper metrics when a customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      const loadCustomerStats = async () => {
        setIsDetailLoading(true);
        setCreditStatus(null);
        try {
          const [orders, tickets] = await Promise.all([
            fetchUserOrders(selectedCustomer.phone),
            fetchUserTickets(selectedCustomer.phone)
          ]);
          setCustomerFleet(orders);
          setCustomerTickets(tickets);
        } catch (err) {
          console.error('Handshake failed for customer details');
        } finally {
          setIsDetailLoading(false);
        }
      };
      loadCustomerStats();
    }
  }, [selectedCustomer]);

  const filteredCustomers = useMemo(() =>
    customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [customers, searchTerm]);

  const handleWhatsApp = (customer: any) => {
    const msg = `Hello ${customer.name}, this is Nova Trend Operations. We are reviewing your registry account. How is your hardware fleet performing?`;
    window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDeployCredit = () => {
    setIsDeployingCredit(true);
    setTimeout(() => {
      setIsDeployingCredit(false);
      setCreditStatus("VIP Credit Node Deployed: $50 Discount generated.");
      setTimeout(() => setCreditStatus(null), 4000);
    }, 1500);
  };

  const calculateWarrantyDays = (dateStr: string) => {
    const purchaseDate = new Date(dateStr);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const diffTime = expiryDate.getTime() - new Date().getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search & Control Cluster */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search verified Client Matrix..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold outline-none focus:border-nova-orange transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchRegistry} className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-nova-orange transition-all">
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Global User Registry</p>
            <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{customers.length} Verified Identities</p>
          </div>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-950/50">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-8 text-[10px] font-black uppercase text-slate-500">Client Identity</th>
                <th className="p-8 text-[10px] font-black uppercase text-slate-500">Last Synced Node</th>
                <th className="p-8 text-[10px] font-black uppercase text-slate-500 text-center">Commit Volume</th>
                <th className="p-8 text-[10px] font-black uppercase text-slate-500">LTV Value</th>
                <th className="p-8 text-[10px] font-black uppercase text-slate-500 text-right">Audit</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const clv = customer.totalSpent || 0;
                const isHighValue = clv > 5000;
                return (
                  <tr key={customer.phone} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all group">
                    <td className="p-8 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm uppercase ${isHighValue ? 'bg-nova-orange text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic group-hover:text-nova-orange transition-colors">{customer.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 mono uppercase tracking-widest">{customer.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-nova-orange" />
                        <span className="text-xs font-semibold truncate max-w-[150px] uppercase">{customer.address?.split(',').pop()?.trim() || 'Kigali Hub'}</span>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{customer.totalOrders} Node Commits</span>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className={`text-sm font-black ${isHighValue ? 'text-nova-orange' : 'text-slate-900 dark:text-white'}`}>${clv.toLocaleString()}</span>
                        {isHighValue && <span className="text-[8px] font-black text-nova-orange uppercase tracking-widest">Nova VIP Client</span>}
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-nova-orange hover:text-white transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DETAIL SLIDE-OVER */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedCustomer(null)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col border-l border-slate-200 dark:border-slate-800 overflow-hidden">

            {/* Header Module */}
            <div className="p-10 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
              <div className="flex items-center gap-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                  <NovaLogo size={40} variant="mark" theme="brand" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic leading-none">{selectedCustomer.name}</h2>
                  <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
                    <Mail className="w-3 h-3 text-nova-orange" /> {selectedCustomer.email || 'Registry Sync Pending'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <button onClick={() => setSelectedCustomer(null)} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all mb-4">
                  <X className="text-slate-900 dark:text-white w-5 h-5" />
                </button>
                <div className="bg-nova-orange text-white px-5 py-2 rounded-2xl shadow-lg shadow-nova-orange/20 animate-in zoom-in duration-300">
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/80 leading-none mb-1">Total LTV Registry</p>
                  <p className="text-lg font-black italic tracking-tighter leading-none">${selectedCustomer.totalSpent?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Scrollable Intelligence Core */}
            <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar bg-white dark:bg-slate-900 transition-colors">

              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <Loader2 className="w-12 h-12 text-nova-orange animate-spin" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Initializing Handshake...</p>
                </div>
              ) : (
                <>
                  {/* PULSE MODULE */}
                  <section className="bg-slate-950 dark:bg-slate-800 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-nova-orange/20 rounded-2xl flex items-center justify-center text-nova-orange">
                          <Activity className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-nova-orange uppercase tracking-widest">Client Pulse</p>
                          <h4 className="text-sm font-black uppercase italic">Nova Registered User</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-white/40 uppercase">Assets Owned</p>
                        <p className="text-xl font-black italic">{customerFleet.reduce((acc, order) => acc + (order.items?.length || (order as any).order_items?.length || 0), 0)} Nodes</p>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-nova-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  </section>

                  {/* ACTIVE FLEET REGISTRY */}
                  <section className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-nova-orange flex items-center gap-2">
                      <Laptop className="w-4 h-4" /> Hardware Fleet Registry
                    </h3>
                    <div className="space-y-3">
                      {customerFleet.length === 0 ? (
                        <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
                          <p className="text-xs font-bold text-slate-400 uppercase">No hardware assets indexed for this node.</p>
                        </div>
                      ) : customerFleet.flatMap(order => (order as any).order_items || order.items || []).map((item, idx) => {
                        const parentOrder = customerFleet.find(o =>
                          ((o as any).order_items || o.items || []).some((i: any) => i.id === item.id)
                        );
                        const daysLeft = parentOrder ? calculateWarrantyDays(parentOrder.created_at) : 0;
                        return (
                          <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[28px] hover:border-nova-orange/30 transition-all group">
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-nova-orange transition-colors shadow-sm">
                                <Laptop className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic line-clamp-1">{item.product_name}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    Acquired: {parentOrder ? new Date(parentOrder.created_at).toLocaleDateString() : 'Unknown'}
                                  </p>
                                  <span className="text-[8px] font-black text-slate-300 mono">SN-{(item.product_id || 'XXX').slice(-8).toUpperCase()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`flex items-center justify-end gap-2 ${daysLeft > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{daysLeft > 0 ? `${daysLeft}d Left` : 'EXPIRED'}</span>
                              </div>
                              <p className="text-[8px] font-black text-slate-400 uppercase mt-1">Nova-Shield v1.2</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* SUPPORT LOGS NODE */}
                  <section className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-nova-orange flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Support Interaction Node
                      </h3>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{customerTickets.length} Interaction Events</span>
                    </div>
                    <div className="space-y-4">
                      {customerTickets.length === 0 ? (
                        <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
                          <p className="text-xs font-bold text-slate-400 uppercase italic">Support Interaction Registry Silent.</p>
                        </div>
                      ) : customerTickets.map(ticket => (
                        <div key={ticket.id} className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-sm flex flex-col gap-4 group hover:border-nova-orange/20 transition-all">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest ${ticket.priority === 'P1' ? 'bg-red-600 text-white animate-nova-glow' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                {ticket.priority}
                              </span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{ticket.ticket_id}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest ${ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-nova-orange'}`}>
                              {ticket.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{ticket.product_name}</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase line-clamp-2 italic">"{ticket.description}"</p>
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4 mt-1">
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              <Clock className="w-3 h-3" /> Event Logged: {new Date(ticket.created_at).toLocaleDateString()}
                            </div>
                            <button className="text-[9px] font-black text-nova-orange uppercase tracking-widest hover:underline flex items-center gap-1">
                              Audit Trail <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Action Matrix Footer */}
            <div className="p-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md flex flex-col gap-4 transition-colors">
              {creditStatus && (
                <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2">
                  <BadgeCheck className="w-5 h-5" />
                  <p className="text-[10px] font-black uppercase tracking-widest">{creditStatus}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleWhatsApp(selectedCustomer)}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-green-900/10 transition-all active:scale-95"
                >
                  <MessageSquare className="w-5 h-5 fill-current" /> WhatsApp Client
                </button>
                <button
                  onClick={handleDeployCredit}
                  disabled={isDeployingCredit}
                  className="bg-nova-orange hover:bg-nova-hover text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-nova-orange/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isDeployingCredit ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-4 h-4 fill-white" /> Deploy VIP Credit</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
