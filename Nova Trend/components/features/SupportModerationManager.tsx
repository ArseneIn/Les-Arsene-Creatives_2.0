
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, Check, X, MessageSquare, AlertTriangle,
  Clock, User, History, ShieldCheck, Zap,
  RefreshCw, ChevronRight, Phone, Smartphone, ExternalLink,
  Loader2, Star, Trash2
} from 'lucide-react';
import { Review, Order } from '../types';
import { Ticket } from '../../types';
import {
  getPendingReviews, updateReviewApproval,
  getAllOrders, getActiveTickets, updateTicketStatus, resolveTicket
} from '../../lib/api';

const SupportModerationManager: React.FC = () => {
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const syncData = async () => {
    setIsRefreshing(true);
    try {
      const [reviewsData, ticketsData] = await Promise.all([
        getPendingReviews(),
        getActiveTickets()
      ]);

      // Fallback mocks for demo if Supabase empty
      setPendingReviews(reviewsData.length > 0 ? reviewsData : [
        { id: 'rev-1', productId: 'p1', productName: 'MacBook Pro 14', userName: 'Jean B.', rating: 5, date: 'Oct 25', title: 'Powerhouse', comment: 'Absolutely crushing my workflow. Best laptop in Kigali.', isApproved: false, isVerified: true }
      ]);
      // Fixed: Updated mock priorities to match Ticket interface P1/P2/P3 scale
      setTickets(ticketsData.length > 0 ? ticketsData : [
        { id: 'TIC-102', customer_name: 'David K.', customer_phone: '+250788112233', product_name: 'Vivobook S 15', category: 'Warranty', priority: 'P1', status: 'Open', description: 'Screen flickering after only 2 weeks of use.', created_at: new Date().toISOString() },
        { id: 'TIC-103', customer_name: 'Alice M.', customer_phone: '+250799445566', product_name: 'Anker Charger', category: 'Delivery', priority: 'P3', status: 'Open', description: 'Package was marked delivered but I have not received it yet.', created_at: new Date().toISOString() }
      ]);
    } catch (err) {
      console.error('Support Engine Sync Failure:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    syncData();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (selectedTicket) {
        setIsLoading(true);
        try {
          const allOrders = await getAllOrders();
          const filtered = allOrders.filter(o => o.phone_number === selectedTicket.customer_phone);
          setCustomerOrders(filtered);
        } catch (err) {
          console.error('Failed to load customer intel:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchHistory();
  }, [selectedTicket]);

  const handleReviewAction = async (id: string, approved: boolean) => {
    setIsProcessing(id);
    try {
      await updateReviewApproval(id, approved);
      setPendingReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Review action failed:', err);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleResolveTicket = async (ticket: Ticket) => {
    setIsProcessing(ticket.id);
    try {
      await resolveTicket(ticket.id);
      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: 'Resolved' } : t));

      // WhatsApp Automation
      const msg = `Hello ${ticket.customer_name}, your Titan Support Ticket #${ticket.id} regarding your ${ticket.product_name} has been resolved by our technicians. We hope you enjoy your hardware! 🧡`;
      window.open(`https://wa.me/${ticket.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');

      setSelectedTicket(null);
    } catch (err) {
      console.error('Ticket resolution failed:', err);
    } finally {
      setIsProcessing(null);
    }
  };

  // Fixed: Updated getPriorityStyle to handle P1/P2/P3 values
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-600 text-white animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]';
      case 'P2': return 'bg-orange-100 text-orange-600';
      case 'P3': return 'bg-blue-100 text-blue-600';
      default: return 'bg-zinc-100 text-zinc-600';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-black uppercase italic leading-none">Operations <span className="text-orange-600">Control Center</span></h2>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mt-2">Unified Support & Moderation Node v5.0</p>
        </div>
        <button onClick={syncData} className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-500 hover:text-black transition-all">
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: REVIEW MODERATION */}
        <section className="bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-8 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-3">
              <Star className="w-5 h-5 text-[#FF8C00]" /> Review Moderation
            </h3>
            <span className="px-3 py-1 bg-white border border-zinc-200 rounded-lg text-[10px] font-black text-zinc-400">{pendingReviews.length} Pending</span>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
            {pendingReviews.length === 0 ? (
              <div className="py-32 text-center">
                <ShieldCheck className="w-12 h-12 text-zinc-100 mx-auto mb-4" />
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">All feedback cleared and deployed.</p>
              </div>
            ) : pendingReviews.map((rev) => (
              <div key={rev.id} className="bg-zinc-50 rounded-3xl p-6 border border-zinc-100 space-y-4 animate-in slide-in-from-left-4 duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">{rev.productName || 'Asset Feedback'}</p>
                    <h4 className="text-sm font-black text-black uppercase">{rev.title}</h4>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">Submitted by {rev.userName} • {rev.date}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-orange-500 text-orange-500' : 'text-zinc-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 font-medium leading-relaxed italic">"{rev.comment}"</p>
                <div className="flex gap-3 pt-2">
                  <button
                    disabled={!!isProcessing}
                    onClick={() => handleReviewAction(rev.id, true)}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10"
                  >
                    {isProcessing === rev.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3 h-3" /> Approve & Deploy</>}
                  </button>
                  <button
                    disabled={!!isProcessing}
                    onClick={() => handleReviewAction(rev.id, false)}
                    className="flex-1 py-3 bg-white border border-red-100 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> Reject Entry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT: SUPPORT TICKETS */}
        <section className="bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-8 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[#FF8C00]" /> Active Tickets
            </h3>
            <span className="px-3 py-1 bg-white border border-zinc-200 rounded-lg text-[10px] font-black text-zinc-400">{tickets.filter(t => t.status === 'Open').length} Open</span>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer group ${selectedTicket?.id === ticket.id ? 'bg-zinc-950 border-zinc-950 text-white shadow-xl translate-x-2' : 'bg-zinc-50 border-zinc-100 hover:border-orange-600/30'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getPriorityStyle(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">#{ticket.id}</span>
                  </div>
                  <Clock className={`w-4 h-4 ${selectedTicket?.id === ticket.id ? 'text-zinc-500' : 'text-zinc-300'}`} />
                </div>
                <h4 className={`text-sm font-black uppercase italic ${selectedTicket?.id === ticket.id ? 'text-orange-500' : 'text-black'}`}>{ticket.product_name}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <User className={`w-3 h-3 ${selectedTicket?.id === ticket.id ? 'text-zinc-500' : 'text-zinc-400'}`} />
                  <p className={`text-[10px] font-bold uppercase ${selectedTicket?.id === ticket.id ? 'text-zinc-400' : 'text-zinc-500'}`}>{ticket.customer_name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* TICKET DETAIL VIEW MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedTicket(null)} />
          <div className="relative bg-white rounded-[40px] max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">

            <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl italic ${getPriorityStyle(selectedTicket.priority)}`}>
                  {selectedTicket.priority.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-black uppercase italic leading-none">Ticket <span className="text-[#FF8C00]">Registry</span></h2>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mt-2">Audit ID: {selectedTicket.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-3 hover:bg-zinc-100 rounded-2xl transition-all"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Side: Ticket Detail & History */}
              <div className="space-y-10">
                <section className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Incident Report
                  </h3>
                  <div className="bg-zinc-50 p-8 rounded-[32px] border border-zinc-100 space-y-6">
                    <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
                      <span className="text-[9px] font-black text-zinc-400 uppercase">Category: {selectedTicket.category}</span>
                      <span className="text-[9px] font-black text-zinc-400 uppercase">Status: {selectedTicket.status}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-800 leading-relaxed italic">"{selectedTicket.description}"</p>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
                    <History className="w-3.5 h-3.5" /> Warranty Verification Matrix
                  </h3>
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="py-10 text-center animate-pulse"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-200" /></div>
                    ) : customerOrders.length === 0 ? (
                      <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">No order registry found for this identity.</p>
                      </div>
                    ) : customerOrders.map(order => (
                      <div key={order.id} className="p-4 bg-white border border-zinc-100 rounded-2xl flex justify-between items-center hover:border-zinc-300 transition-all">
                        <div>
                          <p className="text-xs font-black text-black">Log #{order.id}</p>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-600">Active Support</span>
                          <p className="text-[10px] font-black text-black mt-1">${order.total_amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Side: Deployment Resolution */}
              <div className="space-y-10">
                <section className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" /> Resolution Module
                  </h3>
                  <div className="bg-black text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                      <div>
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Subject Asset</p>
                        <h4 className="text-2xl font-black italic text-orange-500">{selectedTicket.product_name}</h4>
                      </div>

                      <div className="h-px bg-zinc-800" />

                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-zinc-400">
                          <Phone className="w-4 h-4 text-orange-600" />
                          <span className="text-xs font-black mono">{selectedTicket.customer_phone}</span>
                        </div>
                        <p className="text-[9px] text-zinc-600 font-bold uppercase leading-relaxed">
                          Confirming resolution will sync status with customer portal and trigger WhatsApp automation handshake.
                        </p>
                      </div>

                      <button
                        disabled={selectedTicket.status === 'Resolved' || !!isProcessing}
                        onClick={() => handleResolveTicket(selectedTicket)}
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-green-900/20 disabled:opacity-30"
                      >
                        {isProcessing === selectedTicket.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><MessageSquare className="w-5 h-5 fill-current" /> Resolve Ticket via WhatsApp</>}
                      </button>
                    </div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/5 rounded-full blur-3xl" />
                  </div>
                </section>
              </div>
            </div>

            <div className="p-8 border-t border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">Authorized access: Titan Registry v5.0</p>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-10 py-4 bg-zinc-100 text-zinc-500 hover:text-black rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportModerationManager;
