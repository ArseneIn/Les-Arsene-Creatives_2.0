import React, { useState, useEffect } from 'react';
import {
  Package,
  History,
  ShieldCheck,
  Download,
  LifeBuoy,
  Lock,
  MapPin,
  Phone,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Laptop,
  ShoppingBag,
  Clock,
  UserCircle,
  ArrowRight,
  FileText,
  Key,
  X,
  Smartphone,
  AlertTriangle
} from 'lucide-react';
import SupportTicketModal from '../components/ui/SupportTicketModal';
import WarrantyClaimForm from '../components/features/WarrantyClaimForm';
import { fetchUserOrders, fetchUserTickets, createTicket } from '../lib/api';
import { Ticket, Order } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, userProfile } = useAuth();

  const customerName = userProfile?.full_name || "Arsene Cyuzuzo";

  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isWarrantyFormOpen, setIsWarrantyFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback phone if not in profile, or use profile phone
  const phone = userProfile?.phone || localStorage.getItem('clientPhone') || '0788112233';

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [ordersData, ticketsData] = await Promise.all([
          fetchUserOrders(phone),
          fetchUserTickets(phone)
        ]);
        setOrders(ordersData);
        setTickets(ticketsData);
      } catch (err) {
        console.error('Registry sync failed');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [phone]);

  const handleTicketSubmit = async (ticketData: any) => {
    try {
      const newTicket = await createTicket({ ...ticketData, customer_name: customerName, customer_phone: phone });
      setTickets(prev => [newTicket as Ticket, ...prev]);
      // onSubmitTicket(newTicket); // Prop removed
    } catch (err) {
      console.error('Portal handshake failed');
    }
  };

  const calculateWarrantyStats = (purchaseDateStr: string) => {
    const purchaseDate = new Date(purchaseDateStr);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const diffTime = expiryDate.getTime() - new Date().getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isActive = daysLeft > 0;
    return { isActive, daysLeft: Math.max(0, daysLeft) };
  };

  const [devices] = useState([
    { name: 'MacBook Pro 14 (M3 Chip)', sn: 'SN-APL-2025-X991', purchaseDate: 'Oct 24, 2024' },
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-32 transition-colors">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#FF4F00] font-black uppercase tracking-[0.4em] text-[11px]">
              <div className="w-2.5 h-2.5 bg-[#FF4F00] rounded-full animate-pulse shadow-[0_0_10px_rgba(255,79,0,0.5)]" />
              NOVA TREND REGISTRY
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white uppercase italic leading-[0.9] tracking-tighter transition-all">
              HELLO, <br />
              <span className="text-[#FF4F00]">{customerName.toUpperCase().replace(/\s/g, '')}!!</span> <br />
              YOUR <span className="underline decoration-[#FF4F00] decoration-[12px] underline-offset-[16px]">PRIVATE HUB.</span>
            </h1>
          </div>
          <button onClick={() => logout()} className="group flex items-center gap-4 px-10 py-5 bg-slate-950 dark:bg-white text-white dark:text-black border border-white/5 rounded-3xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-[#FF4F00] hover:text-white transition-all shadow-2xl active:scale-95">
            TERMINATE SESSION
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            {/* AUDIT LOG */}
            <section className="bg-white dark:bg-slate-900 rounded-[40px] border border-zinc-100 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
              <div className="p-10 border-b border-zinc-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white"><History className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic leading-none">Order Log</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="bg-zinc-50/50 dark:bg-slate-950/50"><th className="p-8 text-[11px] font-black uppercase text-zinc-400">Log ID</th><th className="p-8 text-[11px] font-black uppercase text-zinc-400">Sync Date</th><th className="p-8 text-[11px] font-black uppercase text-zinc-400">Total</th><th className="p-8 text-[11px] font-black uppercase text-zinc-400">Node State</th><th className="p-8 text-[11px] font-black uppercase text-zinc-400 text-right">Audit</th></tr></thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-black uppercase tracking-widest italic">Awaiting Registry Commits</td></tr>
                    ) : orders.map(order => (
                      <tr key={order.id} className="border-b border-zinc-50 dark:border-slate-800 last:border-0 hover:bg-zinc-50/30 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-8 font-black text-slate-900 dark:text-white text-sm mono">#{order.id.slice(-6)}</td>
                        <td className="p-8 text-sm font-bold text-zinc-500 dark:text-slate-400">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="p-8 font-black text-slate-900 dark:text-white text-sm">${order.total_amount.toLocaleString()}</td>
                        <td className="p-8"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Out for Delivery' ? 'bg-orange-50 dark:bg-orange-950/30 text-[#FF4F00]' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'}`}>{order.status}</span></td>
                        <td className="p-8 text-right"><button onClick={() => navigate(`/track/${order.id}`)} className="text-[10px] font-black uppercase tracking-widest text-[#FF4F00] hover:underline">Verify</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SUPPORT TICKETS NODE */}
            <section className="bg-white dark:bg-slate-900 rounded-[40px] border border-zinc-100 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
              <div className="p-10 border-b border-zinc-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white"><Smartphone className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic leading-none">Support Node</h3>
                </div>
                <button onClick={() => setIsSupportModalOpen(true)} className="px-6 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF4F00] hover:text-white transition-all shadow-lg active:scale-95">+ Initialize Request</button>
              </div>
              <div className="p-10 space-y-4">
                {tickets.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 font-black uppercase tracking-widest italic">Node Registry Silent</div>
                ) : tickets.map(ticket => (
                  <div key={ticket.id} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[32px] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-[#FF4F00]/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs italic ${ticket.priority === 'P1' ? 'bg-[#FF4F00] text-white shadow-lg animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        {ticket.priority}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black text-[#FF4F00] uppercase tracking-widest">{ticket.ticket_id}</span>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase italic line-clamp-1">{ticket.product_name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic line-clamp-1">"{ticket.description}"</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-[#FF4F00] shadow-sm animate-nova-glow'}`}>
                        {ticket.status}
                      </span>
                      {ticket.status !== 'Resolved' && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Target Resolution: {ticket.priority === 'P1' ? '4h' : ticket.priority === 'P2' ? '12h' : '24h'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-10">
            <div className="bg-slate-950 dark:bg-white dark:text-black text-white p-10 rounded-[40px] shadow-2xl space-y-8 transition-colors">
              <h3 className="text-2xl font-black uppercase italic leading-none">Node <span className="text-[#FF4F00]">Protocols</span></h3>
              <div className="space-y-4">
                <button onClick={() => setIsSupportModalOpen(true)} className="w-full flex items-center justify-between p-5 bg-white/5 dark:bg-black/5 rounded-2xl border border-white/5 hover:border-[#FF4F00] transition-all group">
                  <div className="flex items-center gap-4"><LifeBuoy className="w-5 h-5 text-[#FF4F00]" /><span className="text-[11px] font-black uppercase tracking-widest">Open Support Node</span></div>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => setIsWarrantyFormOpen(true)} className="w-full flex items-center justify-between p-5 bg-white/5 dark:bg-black/5 rounded-2xl border border-white/5 hover:border-[#FF4F00] transition-all group">
                  <div className="flex items-center gap-4"><ShieldCheck className="w-5 h-5 text-[#FF4F00]" /><span className="text-[11px] font-black uppercase tracking-widest">Submit RMA Claim</span></div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-zinc-100 dark:border-slate-800 shadow-xl transition-colors">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-slate-950 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-[#FF4F00] border border-zinc-100 dark:border-slate-700 shadow-sm"><UserCircle className="w-8 h-8" /></div>
                <div><h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic leading-none">Registry Profile</h3><p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Verified Holder</p></div>
              </div>
              <div className="space-y-6">
                <div><label className="text-[10px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2"><MapPin className="w-3 h-3 text-[#FF4F00]" /> Node Point</label><div className="p-4 bg-zinc-50 dark:bg-slate-950 rounded-2xl border border-zinc-100 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 uppercase leading-relaxed">KN 3 Rd, Kigali, Rwanda</div></div>
                <div><label className="text-[10px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2"><Smartphone className="w-3 h-3 text-[#FF4F00]" /> Identity Channel</label><div className="p-4 bg-zinc-50 dark:bg-slate-950 rounded-2xl border border-zinc-100 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 mono">{phone}</div></div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <SupportTicketModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} devices={devices} onSubmitTicket={handleTicketSubmit} />
      <WarrantyClaimForm isOpen={isWarrantyFormOpen} onClose={() => setIsWarrantyFormOpen(false)} customerPhone={phone} customerName={customerName} customerAddress="KN 3 Rd, Kigali, Rwanda" />
    </div>
  );
};

export default ClientDashboard;