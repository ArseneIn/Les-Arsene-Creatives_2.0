
import React, { useState, useEffect, useMemo } from 'react';
import {
  X, Check, ChevronRight, ChevronLeft, Laptop, ShieldCheck,
  AlertCircle, Camera, Truck, History, Loader2, Package,
  MapPin, CheckCircle2, Zap
} from 'lucide-react';
import { Order, OrderItem, Ticket } from '../../types';
import { fetchUserOrders, createTicket } from '../../lib/api';

interface WarrantyClaimFormProps {
  isOpen: boolean;
  onClose: () => void;
  customerPhone: string;
  customerName: string;
  customerAddress: string;
}

const FAULT_TYPES = ['Battery', 'Display', 'Performance', 'Physical Damage', 'Keyboard/IO', 'Other'];
const RESOLUTIONS = ['Repair', 'Replacement', 'Technical Consultation'];

const WarrantyClaimForm: React.FC<WarrantyClaimFormProps> = ({
  isOpen, onClose, customerPhone, customerName, customerAddress
}) => {
  const [step, setStep] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);

  // Form State
  const [selectedAsset, setSelectedAsset] = useState<{ orderId: string, item: OrderItem } | null>(null);
  const [faultType, setFaultType] = useState(FAULT_TYPES[0]);
  const [description, setDescription] = useState('');
  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [pickupAddress, setPickupAddress] = useState(customerAddress);
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    if (isOpen && step === 1) {
      const loadOrders = async () => {
        setIsLoading(true);
        try {
          const data = await fetchUserOrders(customerPhone);
          setOrders(data);
        } catch (err) {
          console.error('Failed to load assets:', err);
        } finally {
          setIsLoading(false);
        }
      };
      loadOrders();
    }
  }, [isOpen, customerPhone]);

  const calculateWarranty = (dateStr: string) => {
    const purchaseDate = new Date(dateStr);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const diffTime = expiryDate.getTime() - new Date().getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { status: 'Expired', color: 'text-red-500', bg: 'bg-red-50' };
    const months = Math.floor(daysLeft / 30);
    return {
      status: `Active: ${months > 0 ? `${months} Months` : `${daysLeft} Days`} Remaining`,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    };
  };

  const handleAssetSelect = (orderId: string, item: OrderItem) => {
    setSelectedAsset({ orderId, item });
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!selectedAsset) return;
    setIsSubmitting(true);

    try {
      const payload: Partial<Ticket> = {
        customer_name: customerName,
        customer_phone: customerPhone,
        product_name: selectedAsset.item.product_name,
        category: 'Warranty',
        priority: faultType === 'Display' || faultType === 'Performance' ? 'P1' : 'P2',
        status: 'Open',
        description: description,
        order_id: selectedAsset.orderId,
        meta: {
          fault_type: faultType,
          resolution_preference: resolution,
          pickup_address: pickupAddress,
          serial_number: `WT-${selectedAsset.item.product_id.slice(-6).toUpperCase()}`, // Simulated SN for demo
          image_refs: [] // In real app, upload to storage first
        }
      };

      const result = await createTicket(payload);
      setSuccessTicketId(result.id);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (successTicketId) {
    return (
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-[40px] p-12 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-black uppercase italic mb-4">Claim Submitted</h2>
          <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-10">
            Your Ticket ID is <span className="text-black font-bold">#{successTicketId}</span>.
            We are reviewing your claim against the 12-month Titan Warranty. Expect an engineer update within 2-4 business hours.
          </p>
          <button onClick={onClose} className="w-full bg-[#FF8C00] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-900/10">Return to Portal</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-[40px] max-w-4xl w-full max-h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

        {/* Header (Clinical Style) */}
        <div className="px-10 py-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <ShieldCheck className="w-5 h-5 text-zinc-400" />
              <h2 className="text-2xl font-black text-black uppercase italic tracking-tight">Warranty <span className="text-zinc-400">Claim Registry</span></h2>
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Authorized RMA Handshake protocol v2.1</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-zinc-100 rounded-2xl transition-all text-zinc-400"><X /></button>
        </div>

        {/* Content Wizard */}
        <div className="flex-1 overflow-y-auto no-scrollbar">

          {/* Step Indicators */}
          <div className="px-10 py-6 border-b border-zinc-50 flex gap-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${step === s ? 'bg-black text-white' : step > s ? 'bg-zinc-200 text-zinc-500' : 'border border-zinc-200 text-zinc-300'}`}>
                  {step > s ? <Check className="w-3 h-3" /> : s}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${step === s ? 'text-black' : 'text-zinc-300'}`}>
                  {s === 1 ? 'Asset Selection' : s === 2 ? 'Issue Audit' : 'Logistics'}
                </span>
              </div>
            ))}
          </div>

          <div className="p-10">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-black uppercase italic">Select Covered Asset</h3>
                  <p className="text-xs text-zinc-500 font-medium italic leading-relaxed">Choose the hardware vertical experiencing technical discrepancies.</p>
                </div>

                {isLoading ? (
                  <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-200" /></div>
                ) : orders.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
                    <Package className="w-12 h-12 text-zinc-100 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-zinc-300 uppercase italic">No Registered Deployment Records Found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map(order => order.items?.map(item => {
                      const w = calculateWarranty(order.created_at);
                      const isSelected = selectedAsset?.item.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleAssetSelect(order.id, item)}
                          className={`p-6 rounded-3xl border text-left transition-all group ${isSelected ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-300'}`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-black transition-colors">
                              <Laptop className="w-5 h-5" />
                            </div>
                            <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${w.bg} ${w.color}`}>
                              {w.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-black uppercase line-clamp-1 mb-1">{item.product_name}</h4>
                          <div className="flex items-center justify-between mt-4">
                            <p className="text-[9px] font-bold text-zinc-400 uppercase">Purchased: {new Date(order.created_at).toLocaleDateString()}</p>
                            <p className="text-[9px] font-black text-zinc-900 mono">#{order.id}</p>
                          </div>
                        </button>
                      );
                    }))}
                  </div>
                )}
              </div>
            )}

            {step === 2 && selectedAsset && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-6 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black shadow-sm">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Audit Subject</p>
                    <h4 className="text-base font-black text-black uppercase italic">{selectedAsset.item.product_name}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nature of the Fault</label>
                    <select
                      value={faultType}
                      onChange={(e) => setFaultType(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-zinc-300"
                    >
                      {FAULT_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Incident documentation (Photos)</label>
                    <div className="flex gap-3">
                      <button className="flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-200 rounded-2xl py-4 hover:border-zinc-300 transition-all text-zinc-400">
                        <Camera className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase">Attach Media</span>
                      </button>
                      <div className="w-16 h-full bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-200">
                        <Package className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Behavioral Audit (Description)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the symptoms or visual defects in detail..."
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl p-6 text-sm font-medium text-zinc-600 outline-none focus:border-zinc-300 h-32 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-black uppercase italic">Deployment Logistics</h3>
                  <p className="text-xs text-zinc-500 font-medium italic leading-relaxed">Finalize the resolution path and physical handshake location.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Preferred Resolution Path</label>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-zinc-300"
                    >
                      {RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">RMA Pickup Matrix (Address)</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold outline-none focus:border-zinc-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-zinc-950 rounded-[32px] text-white space-y-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-sm font-black uppercase italic">Technical Review Protocol</h4>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                      By submitting this claim, you authorize Titan Electronics engineers to perform physical diagnostics.
                      Warranty covers factory defects only. Physical or liquid damage discovered during audit may incur service fees.
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-2xl" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer (Step controls) */}
        <div className="p-8 border-t border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <button
            onClick={() => step === 1 ? onClose() : setStep(step - 1)}
            className="px-8 py-4 bg-white border border-zinc-200 text-zinc-400 hover:text-black rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> {step === 1 ? 'Abort Claim' : 'Previous Module'}
          </button>

          <button
            onClick={() => step === 3 ? handleSubmit() : setStep(step + 1)}
            disabled={step === 1 && !selectedAsset || isSubmitting}
            className={`px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-30 ${step === 3 ? 'bg-[#FF8C00] text-white hover:bg-orange-600 shadow-orange-900/10' : 'bg-black text-white'}`}
          >
            {isSubmitting ? (
              <> <Loader2 className="w-4 h-4 animate-spin" /> Transmitting Registry...</>
            ) : (
              <>
                {step === 3 ? 'Finalize & Submit Claim' : 'Continue to next module'}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarrantyClaimForm;
