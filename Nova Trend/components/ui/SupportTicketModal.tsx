
import React, { useState, useMemo } from 'react';
// Added Loader2 to imports
import { X, Send, MessageSquare, ShieldCheck, Clock, Zap, AlertTriangle, Loader2 } from 'lucide-react';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: any[];
  preselectedDevice?: string;
  preselectedSN?: string;
  onSubmitTicket?: (ticket: any) => void;
}

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({ 
  isOpen, 
  onClose, 
  devices,
  preselectedDevice = "",
  preselectedSN = "",
  onSubmitTicket
}) => {
  const [product, setProduct] = useState(preselectedDevice || (devices[0]?.name || ''));
  const [category, setCategory] = useState('Hardware Issue');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'P1' | 'P2' | 'P3'>('P3');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const slaInfo = useMemo(() => {
    switch(priority) {
      case 'P1': return { label: '4 Business Hours', color: 'text-red-500' };
      case 'P2': return { label: '12 Business Hours', color: 'text-orange-500' };
      default: return { label: '24 Business Hours', color: 'text-blue-500' };
    }
  }, [priority]);

  if (!isOpen) return null;

  const handleSubmit = async (type: 'WHATSAPP' | 'PORTAL') => {
    if (description.length < 10) {
      alert("Please provide a more detailed description of the issue.");
      return;
    }

    setIsSubmitting(true);
    const ticketData = { 
      product_name: product, 
      category, 
      description, 
      priority, 
      created_at: new Date().toISOString() 
    };

    if (type === 'WHATSAPP') {
      const waNumber = "250787202583"; // Nova Operations
      const message = `Support Request: [${category}] for ${product} (SN: ${preselectedSN}). Priority: ${priority}. Issue: ${description}`;
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }

    if (onSubmitTicket) {
      await onSubmitTicket(ticketData);
    }
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white dark:bg-slate-900 rounded-[40px] p-12 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300 transition-colors">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"><ShieldCheck className="w-10 h-10" /></div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic mb-4">Node Dispatched</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-8">
            Your request has been registered. Our technician node will respond within <span className="text-[#FF4F00] font-black">{slaInfo.label}</span>.
          </p>
          <button onClick={onClose} className="w-full bg-slate-950 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#FF4F00] transition-all shadow-xl active:scale-95">Return to Library</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200 border-t-8 transition-all ${priority === 'P1' ? 'border-[#FF4F00]' : 'border-zinc-200 dark:border-slate-800'}`}>
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic leading-none">Support <span className="text-[#FF4F00]">Handshake</span></h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2">Initialize Technical Resolution Node</p>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Hardware Asset</label>
              <select value={product} onChange={(e) => setProduct(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#FF4F00] transition-all">
                {devices.map(d => <option key={d.sn} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Incident Vertical</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#FF4F00] transition-all">
                <option value="Technical">Technical Defect</option>
                <option value="Warranty">Warranty Claim</option>
                <option value="Account">Node Identity Issue</option>
                <option value="Delivery">Dispatch Anomaly</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Urgency Matrix</label>
              <div className="flex gap-2">
                {(['P3', 'P2', 'P1'] as const).map(p => (
                  <button 
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${priority === p ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                  >
                    {p === 'P1' ? 'Critical' : p === 'P2' ? 'High' : 'Standard'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Behavioral Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe symptoms or error registry details..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#FF4F00] transition-all min-h-[120px] resize-none" />
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Clock className={`w-5 h-5 ${slaInfo.color}`} />
               <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Response Time</p>
                  <p className={`text-xs font-black uppercase ${slaInfo.color}`}>{slaInfo.label}</p>
               </div>
             </div>
             {priority === 'P1' && <AlertTriangle className="w-5 h-5 text-[#FF4F00] animate-pulse" />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button onClick={() => handleSubmit('WHATSAPP')} className="bg-[#25D366] hover:bg-[#128C7E] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-green-900/10">
              <MessageSquare className="w-5 h-5 fill-current" /> Sync via WhatsApp
            </button>
            <button onClick={() => handleSubmit('PORTAL')} disabled={isSubmitting} className="bg-slate-950 dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 text-[#FF4F00]" /> Registry Submission</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketModal;
