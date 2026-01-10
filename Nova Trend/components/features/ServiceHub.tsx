import React, { useState, useEffect, useMemo } from 'react';
import { useNotification } from '../context/NotificationContext';
import {
  ShieldAlert, Check, X, MessageSquare, AlertTriangle,
  Clock, User, History, ShieldCheck, Zap,
  RefreshCw, ChevronRight, Phone, Smartphone, ExternalLink,
  Loader2, Star, Trash2, Filter, Search, MoreVertical,
  Activity, ArrowUpRight, Send, Briefcase
} from 'lucide-react';
import { Review, Ticket, Order } from '../../types';
import {
  getPendingReviews, updateReviewApproval,
  getActiveTickets, updateTicketStatus, createTicket, getAllOrders
} from '../../lib/api';

const SLACountdown: React.FC<{ deadline: string, isResolved: boolean }> = ({ deadline, isResolved }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isBreached, setIsBreached] = useState(false);

  useEffect(() => {
    if (isResolved) {
      setTimeLeft('SLA ACHIEVED');
      return;
    }
    const timer = setInterval(() => {
      const diff = new Date(deadline).getTime() - new Date().getTime();
      if (diff < 0) {
        setIsBreached(true);
        setTimeLeft('SLA BREACHED');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline, isResolved]);

  return (
    <div className="flex flex-col gap-1">
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] tabular-nums ${isResolved ? 'text-emerald-500' : isBreached ? 'text-red-600 animate-pulse' : 'text-[#FF4F00]'}`}>
        {timeLeft}
      </span>
      <div className="h-1 w-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${isResolved ? 'bg-emerald-500' : isBreached ? 'bg-red-600' : 'bg-[#FF4F00]'}`} style={{ width: isResolved ? '100%' : isBreached ? '100%' : '40%' }} />
      </div>
    </div>
  );
};

const ServiceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'tickets'>('tickets');
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [waUpdate, setWaUpdate] = useState('');

  const syncData = async () => {
    setIsRefreshing(true);
    try {
      const [reviewsData, ticketsData] = await Promise.all([
        getPendingReviews(),
        getActiveTickets()
      ]);
      const openTicketNumbers = new Set(ticketsData.filter(t => t.status !== 'Resolved').map(t => t.customer_phone));
      const enrichedReviews = reviewsData.map(r => ({ ...r, hasActiveTicket: openTicketNumbers.has(r.userPhone || '') }));
      setPendingReviews(enrichedReviews);
      setTickets(ticketsData);
    } catch (err) {
      console.error('Service Hub Sync Failure:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => { syncData(); }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (selectedTicket) {
        try {
          const allOrders = await getAllOrders();
          const filtered = allOrders.filter(o => o.phone_number === selectedTicket.customer_phone);
          setCustomerOrders(filtered);
        } catch (err) { console.error(err); }
      }
    };
    fetchHistory();
  }, [selectedTicket]);

  // Add notification hook
  const { addLog } = useNotification();

  const handleReviewAction = async (id: string, approved: boolean) => {
    setIsProcessing(id);
    try {
      await updateReviewApproval(id, approved);
      setPendingReviews(prev => prev.filter(r => r.id !== id));
      addLog('Review Moderator', approved ? 'Review Approved & Published' : 'Review Rejected');
    } catch (err) { console.error(err); } finally { setIsProcessing(null); }
  };

  const handleTicketStatusChange = async (ticketId: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    setIsProcessing(ticketId);
    try {
      await updateTicketStatus(ticketId, newStatus);
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
      if (selectedTicket?.id === ticketId) setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
      addLog('Support Ticket', `Ticket #${ticketId} status: ${newStatus}`);
    } catch (err) { console.error(err); } finally { setIsProcessing(null); }
  };

  const handleResolveTicket = async (ticket: Ticket) => {
    setIsProcessing(ticket.id);
    try {
      await handleTicketStatusChange(ticket.id, 'Resolved');
      const msg = waUpdate || `Hello ${ticket.customer_name}, your Support Ticket #${ticket.ticket_id} regarding your ${ticket.product_name} has been resolved. Standardized by Nova Trend.`;
      window.open(`https://wa.me/${ticket.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
      setSelectedTicket(null);
      setWaUpdate('');
      // Log handled in handleTicketStatusChange
    } catch (err) { console.error(err); } finally { setIsProcessing(null); }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-[#FF4F00] text-white animate-pulse shadow-[0_0_15px_rgba(255,79,0,0.4)]';
      case 'P2': return 'bg-orange-50 dark:bg-orange-950/30 text-[#FF4F00] border border-[#FF4F00]/30';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 transition-colors">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-2">
          {[
            { id: 'tickets', label: 'Support Node', icon: Smartphone, count: tickets.filter(t => t.status !== 'Resolved').length },
            { id: 'reviews', label: 'Feedback Matrix', icon: Star, count: pendingReviews.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-950 dark:bg-white text-white dark:text-black' : 'text-slate-500 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#FF4F00]' : ''}`} />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeTab === tab.id ? 'bg-[#FF4F00] text-white' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <button onClick={syncData} className="p-4 mr-2 text-slate-400 hover:text-[#FF4F00] transition-all"><RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} /></button>
      </div>

      {activeTab === 'tickets' ? (
        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-950/50">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="p-8 text-[10px] font-black uppercase text-slate-500">Prio</th>
                  <th className="p-8 text-[10px] font-black uppercase text-slate-500">SLA Registry</th>
                  <th className="p-8 text-[10px] font-black uppercase text-slate-500">Identity</th>
                  <th className="p-8 text-[10px] font-black uppercase text-slate-500">Asset</th>
                  <th className="p-8 text-[10px] font-black uppercase text-slate-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                    <td className="p-8"><span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-[11px] uppercase ${getPriorityStyle(ticket.priority)}`}>{ticket.priority}</span></td>
                    <td className="p-8"><SLACountdown deadline={ticket.sla_deadline} isResolved={ticket.status === 'Resolved'} /></td>
                    <td className="p-8">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic leading-none">{ticket.customer_name}</p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2 mono">{ticket.customer_phone}</p>
                    </td>
                    <td className="p-8">
                      <p className="text-xs font-bold text-slate-900 dark:text-white uppercase line-clamp-1">{ticket.product_name}</p>
                      <p className="text-[9px] font-black text-[#FF4F00] uppercase mt-1 italic tracking-widest">{ticket.status}</p>
                    </td>
                    <td className="p-8 text-right"><button onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${ticket.customer_phone.replace(/\D/g, '')}`, '_blank'); }} className="p-4 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-2xl transition-all active:scale-90"><MessageSquare className="w-5 h-5" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingReviews.map((rev) => (
            <div key={rev.id} className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:border-orange-600/30 transition-all group animate-in fade-in">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center font-black italic relative">
                    {rev.userName.charAt(0)}
                    {rev.hasActiveTicket && <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4F00] border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center animate-bounce"><AlertTriangle className="w-3 h-3 text-white" /></div>}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic leading-none">{rev.userName}</h4>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-widest">{rev.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-[#FF4F00] text-[#FF4F00]' : 'text-slate-200 dark:text-slate-700'}`} />)}</div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic mb-8 flex-1">"{rev.comment}"</p>
              <div className="flex gap-3 mt-auto">
                <button disabled={!!isProcessing} onClick={() => handleReviewAction(rev.id, true)} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg active:scale-95">{isProcessing === rev.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Deploy Node'}</button>
                <button disabled={!!isProcessing} onClick={() => handleReviewAction(rev.id, false)} className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl border border-slate-200 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSelectedTicket(null)} />
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col border-l border-slate-200 dark:border-slate-800 transition-colors">
            <div className="p-10 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-xl ${getPriorityStyle(selectedTicket.priority)}`}>{selectedTicket.priority}</div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic leading-none">Node <span className="text-[#FF4F00]">Audit</span></h2>
                  <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mt-1">Registry ID: {selectedTicket.ticket_id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all"><X className="text-slate-900 dark:text-white" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
              <section className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#FF4F00] flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Subject Description</h4>
                <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-inner"><p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic">"{selectedTicket.description}"</p></div>
              </section>
              <section className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#FF4F00] flex items-center gap-2"><Smartphone className="w-3.5 h-3.5" /> Push Resolution Handshake</h4>
                <textarea value={waUpdate} onChange={(e) => setWaUpdate(e.target.value)} placeholder="Enter clinical resolution details for customer portal synchronization..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#FF4F00] transition-all h-40 resize-none shadow-sm placeholder:text-slate-400" />
              </section>
            </div>
            <div className="p-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 grid grid-cols-2 gap-4">
              <button onClick={() => handleTicketStatusChange(selectedTicket.id, 'In Progress')} className="py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 border border-slate-200 dark:border-slate-700">Mark In Progress</button>
              <button onClick={() => handleResolveTicket(selectedTicket)} className="bg-[#25D366] hover:bg-[#128C7E] text-white py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">{isProcessing === selectedTicket.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><MessageSquare className="w-4 h-4 fill-current" /> Push to Client</>}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceHub;
