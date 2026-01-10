import React, { useState, useMemo, useEffect } from 'react';
import {
  CreditCard, Truck, CheckCircle2,
  ChevronRight, Lock, AlertCircle,
  ShoppingBag, Smartphone, Landmark, Loader2, Wifi,
  ChevronLeft, Edit3, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/context/CartContext';
import { useAuth } from '../components/context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/api';

const DISTRICTS = ['Gasabo', 'Kicukiro', 'Nyarugenge', 'Upcountry (Provinces)'];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { userProfile } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingData, setShippingData] = useState({
    fullName: userProfile?.full_name || '',
    email: userProfile?.email || '',
    phoneNumber: userProfile?.phone || '',
    district: 'Gasabo',
    sector: '',
    streetAddress: userProfile?.address || '',
    instructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'MoMo' | 'Card' | 'Bank'>('MoMo');
  const [paymentData, setPaymentData] = useState({
    momoNumber: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bankRef, setBankRef] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentData.momoNumber && shippingData.phoneNumber) {
      setPaymentData(prev => ({ ...prev, momoNumber: shippingData.phoneNumber }));
    }
  }, [shippingData.phoneNumber]);

  const shippingFee = shippingData.district === 'Upcountry (Provinces)' ? 5 : 0;
  const vatAmount = cartTotal * 0.18;
  const grandTotal = cartTotal + shippingFee + vatAmount;

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('en-RW', { weekday: 'long', month: 'long', day: 'numeric' });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^07[2389][0-9]{7}$/;
    if (!phoneRegex.test(shippingData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid 10-digit number (078/079/072/073)';
    }
    if (!shippingData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!shippingData.streetAddress.trim()) newErrors.streetAddress = 'Street Address is required';
    if (!shippingData.sector.trim()) newErrors.sector = 'Sector is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (paymentMethod === 'MoMo') {
      const phoneRegex = /^07[2389][0-9]{7}$/;
      if (!phoneRegex.test(paymentData.momoNumber)) {
        newErrors.momoNumber = 'Enter a valid 10-digit MoMo number';
      }
    } else if (paymentMethod === 'Card') {
      if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) newErrors.cardNumber = 'Invalid Card Number';
      if (!paymentData.expiry) newErrors.expiry = 'Required';
      if (!paymentData.cvc) newErrors.cvc = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    const orderId = `LPT-${Math.floor(10000 + Math.random() * 90000)}`;

    // Build local order payload to support offline mode
    const orderData: any = {
      id: orderId,
      customer_name: shippingData.fullName,
      phone_number: shippingData.phoneNumber,
      shipping_address: `${shippingData.streetAddress}, ${shippingData.sector}, ${shippingData.district}`,
      payment_method: paymentMethod,
      payment_number: paymentMethod === 'MoMo' ? paymentData.momoNumber : (paymentMethod === 'Card' ? `****${(paymentData.cardNumber || '').slice(-4)}` : null),
      total_amount: grandTotal,
      status: paymentMethod === 'Bank' ? 'Pending Bank Transfer' : 'Pending',
      momo_ref: paymentMethod === 'MoMo' ? `TITAN-${Math.random().toString(36).substr(2, 6).toUpperCase()}` : null,
      created_at: new Date().toISOString(),
      items: cart.map(item => ({ product_id: item.id, product_name: item.name, quantity: item.quantity, price_at_purchase: item.price })),
    };

    try {
      // Local-only flow: persist to localStorage and simulate processing when Supabase is not configured
      if (!isSupabaseConfigured) {
        // For bank transfers, generate a reference that user can use to pay
        if (paymentMethod === 'Bank') {
          const ref = `BANK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
          orderData.bank_reference = ref;
          setBankRef(ref);
          // Inform user with a blocking alert for now (simple offline UX)
          alert(`Bank Transfer Instructions:\nBank: Bank of Kigali\nAccount: 0004-7721-8890-12\nReference: ${ref}\n\nPlease complete the transfer and then check your Order Status in the Client Dashboard.`);
        }

        const existing = JSON.parse(localStorage.getItem('localOrders') || '[]');
        existing.unshift(orderData);
        localStorage.setItem('localOrders', JSON.stringify(existing));

        // Simulate processing delay for MoMo and Card
        const delay = paymentMethod === 'MoMo' ? 1800 : paymentMethod === 'Card' ? 1200 : 600;
        setTimeout(() => {
          setIsSubmitting(false);
          clearCart();
          navigate('/order-success', {
            state: {
              orderId: orderData.id,
              customerName: orderData.customer_name,
              phoneNumber: orderData.phone_number
            }
          });
        }, delay);

        return;
      }

      // If a real Supabase backend is configured, attempt to use it (kept as best-effort)
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          phone_number: orderData.phone_number,
          shipping_address: orderData.shipping_address,
          payment_method: orderData.payment_method,
          payment_number: orderData.payment_number,
          total_amount: orderData.total_amount,
          status: orderData.status,
          momo_ref: orderData.momo_ref
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = orderData.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      navigate('/order-success', {
        state: {
          orderId: orderData.id,
          customerName: orderData.customer_name,
          phoneNumber: orderData.phone_number
        }
      });
    } catch (error: any) {
      console.warn('Supabase Offline or error occurred. Fallback to local demo persistence.');
      const existing = JSON.parse(localStorage.getItem('localOrders') || '[]');
      existing.unshift(orderData);
      localStorage.setItem('localOrders', JSON.stringify(existing));

      setTimeout(() => {
        setIsSubmitting(false);
        clearCart();
        navigate('/order-success', {
          state: {
            orderId: orderData.id,
            customerName: orderData.customer_name,
            phoneNumber: orderData.phone_number
          }
        });
      }, 1200);
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        if (paymentMethod === 'MoMo') {
          setIsProcessing(true);
          setTimeout(() => {
            setIsProcessing(false);
            setStep(3);
          }, 2500);
        } else {
          setStep(3);
        }
      }
    } else {
      handlePlaceOrder();
    }
  };

  const inputClasses = (errorKey: string) => `
    w-full bg-white dark:bg-slate-800 border-2 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all 
    text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600
    ${errors[errorKey] ? 'border-red-500 bg-red-50/10' : 'border-slate-100 dark:border-slate-700 focus:border-orange-500 shadow-sm'}
  `;

  if (cart.length === 0 && step === 1) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-16 h-16 text-zinc-300 mb-6" />
        <h2 className="text-2xl font-black text-black uppercase italic mb-2">Cart is Empty</h2>
        <p className="text-zinc-500 mb-8">Add some hardware to your deployment manifest.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-black text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-zinc-800 transition-all">
          Return to Base
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 pt-10 pb-20 selection:bg-orange-600 selection:text-white relative transition-colors duration-500">

      {isProcessing && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-500">
          <div className="relative mb-8">
            <Loader2 className="w-20 h-20 text-orange-600 animate-spin stroke-[1.5]" />
            <Wifi className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase italic mb-2 tracking-tighter">Telecom Handshake</h3>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Initiating Secure Bridge with MTN/Airtel Gateways...</p>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10">
          <button onClick={() => navigate(-1)} className="text-zinc-400 dark:text-slate-500 hover:text-black dark:hover:text-white font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-2 transition-colors">
            <ShoppingBag className="w-4 h-4" /> Return to Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-4 mb-8">
              {[1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${step === i ? 'bg-orange-600 text-white scale-110 shadow-lg' :
                      step > i ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-zinc-400'
                      }`}>
                      {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${step === i ? 'text-black dark:text-white' : 'text-zinc-400 dark:text-slate-600'}`}>
                      {i === 1 ? 'Shipping' : i === 2 ? 'Payment' : 'Review'}
                    </span>
                  </div>
                  {i < 3 && <div className="w-8 h-px bg-zinc-200 dark:bg-slate-800" />}
                </React.Fragment>
              ))}
            </div>

            {step === 1 && (
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-sm border border-zinc-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-black dark:text-white uppercase italic leading-none">Shipping <span className="text-orange-600">Information</span></h2>
                  <p className="text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-2">Kigali Express & Regional Logistics</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Legal Name</label>
                    <input name="fullName" value={shippingData.fullName} onChange={handleInputChange} placeholder="Enter full name" className={inputClasses('fullName')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <input name="email" type="email" value={shippingData.email} onChange={handleInputChange} placeholder="name@company.rw" className={inputClasses('email')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest ml-1">Phone Number (MTN/Airtel)</label>
                    <input name="phoneNumber" value={shippingData.phoneNumber} onChange={handleInputChange} placeholder="078 XXX XXXX" className={inputClasses('phoneNumber')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest ml-1">District</label>
                    <select name="district" value={shippingData.district} onChange={handleInputChange} className={inputClasses('district')}>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest ml-1">Sector</label>
                    <input name="sector" value={shippingData.sector} onChange={handleInputChange} placeholder="Enter Sector" className={inputClasses('sector')} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest ml-1">Street Address</label>
                    <input name="streetAddress" value={shippingData.streetAddress} onChange={handleInputChange} placeholder="Ex: KK 305 St, House 15" className={inputClasses('streetAddress')} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest ml-1">Delivery Instructions (Landmarks)</label>
                    <textarea name="instructions" value={shippingData.instructions} onChange={handleInputChange} placeholder="Near the yellow shop..." className={`${inputClasses('instructions')} h-32 resize-none`} />
                  </div>
                </div>
                <div className="mt-12 flex items-center justify-between">
                  <button onClick={() => navigate(-1)} className="text-zinc-400 dark:text-slate-500 hover:text-black dark:hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors">Abort Checkout</button>
                  <button onClick={handleContinue} className="bg-black dark:bg-white text-white dark:text-black hover:bg-orange-600 dark:hover:bg-orange-500 px-12 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3 transition-all active:scale-95 shadow-xl">Continue to Payment <ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-sm border border-zinc-100 dark:border-slate-800 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-black dark:text-white uppercase italic leading-none">Select <span className="text-orange-600">Payment Method</span></h2>
                  <p className="text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-2">Secure Local & International Gateways</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                  {[
                    { id: 'MoMo', label: 'Mobile Money', sub: 'MTN / Airtel', icon: Smartphone },
                    { id: 'Card', label: 'Credit Card', sub: 'Visa / Master', icon: CreditCard },
                    { id: 'Bank', label: 'Bank Transfer', sub: 'B2B Invoice', icon: Landmark }
                  ].map((method) => (
                    <button key={method.id} onClick={() => setPaymentMethod(method.id as any)} className={`p-6 rounded-[32px] border-2 text-left transition-all ${paymentMethod === method.id ? 'border-orange-600 bg-orange-50/10 dark:bg-orange-600/10' : 'border-zinc-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-zinc-200 dark:hover:border-slate-700'}`}>
                      <method.icon className={`w-8 h-8 mb-4 ${paymentMethod === method.id ? 'text-orange-600' : 'text-zinc-300 dark:text-slate-700'}`} />
                      <p className={`text-sm font-black uppercase italic leading-none mb-1 ${paymentMethod === method.id ? 'text-black dark:text-white' : 'text-zinc-400 dark:text-slate-600'}`}>{method.label}</p>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-widest">{method.sub}</p>
                    </button>
                  ))}
                </div>
                <div className="bg-zinc-50 dark:bg-slate-950 rounded-[32px] p-8 border border-zinc-100 dark:border-slate-800">
                  {paymentMethod === 'MoMo' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest ml-1">MoMo Registered Number</label>
                        <input name="momoNumber" value={paymentData.momoNumber} onChange={handlePaymentChange} className={inputClasses('momoNumber')} />
                      </div>
                      <div className="flex items-start gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-zinc-100 dark:border-slate-800">
                        <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
                        <p className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 leading-relaxed uppercase">Direct Prompt: You will receive a 5-digit PIN request on your phone.</p>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'Card' && (
                    <div className="space-y-4">
                      <input name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange} placeholder="Card Number" className={inputClasses('cardNumber')} />
                      <div className="grid grid-cols-2 gap-4">
                        <input name="expiry" value={paymentData.expiry} onChange={handlePaymentChange} placeholder="MM/YY" className={inputClasses('expiry')} />
                        <input name="cvc" value={paymentData.cvc} onChange={handlePaymentChange} placeholder="CVC" className={inputClasses('cvc')} />
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'Bank' && (
                    <div className="space-y-4">
                      <p className="text-[11px] font-bold text-black dark:text-white uppercase">Bank of Kigali - Titan Electronics Ltd.</p>
                      <p className="text-[11px] font-bold text-zinc-500 dark:text-slate-400">Account: <span className="text-black dark:text-white mono">0004-7721-8890-12</span></p>
                    </div>
                  )}
                </div>
                <div className="mt-12 flex items-center justify-between">
                  <button onClick={() => setStep(1)} className="text-zinc-400 dark:text-slate-500 hover:text-black dark:hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Go Back</button>
                  <button onClick={handleContinue} className="bg-black dark:bg-white text-white dark:text-black hover:bg-orange-600 dark:hover:bg-orange-500 px-12 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3 transition-all shadow-xl">Review Order Details <ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-sm border border-zinc-100 dark:border-slate-800">
                  <div className="mb-10">
                    <h2 className="text-3xl font-black text-black dark:text-white uppercase italic leading-none">Review <span className="text-orange-600">Deployment</span></h2>
                    <p className="text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-2">Final validation before order dispatch</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="p-8 bg-zinc-50 dark:bg-slate-950 rounded-[32px] border border-zinc-100 dark:border-slate-800 relative group">
                      <button onClick={() => setStep(1)} className="absolute top-6 right-6 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all text-orange-600 hover:bg-orange-600 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                      <p className="text-[9px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Truck className="w-3 h-3" /> Delivery Details</p>
                      <p className="text-sm font-black text-black dark:text-white uppercase mb-1">{shippingData.fullName}</p>
                      <p className="text-xs text-zinc-500 dark:text-slate-400 leading-relaxed font-medium">{shippingData.streetAddress}, {shippingData.sector}, {shippingData.district}</p>
                      <p className="text-xs text-black dark:text-white font-black mono mt-3">{shippingData.phoneNumber}</p>
                    </div>

                    <div className="p-8 bg-zinc-50 dark:bg-slate-950 rounded-[32px] border border-zinc-100 dark:border-slate-800 relative group">
                      <button onClick={() => setStep(2)} className="absolute top-6 right-6 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all text-orange-600 hover:bg-orange-600 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                      <p className="text-[9px] font-black text-zinc-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Financial Gateway</p>
                      <div className="flex items-center gap-4 mb-2">
                        {paymentMethod === 'MoMo' ? (
                          <div className="w-10 h-10 bg-[#FFCC00] rounded-xl flex items-center justify-center font-black text-xs text-black">MTN</div>
                        ) : <CreditCard className="w-8 h-8 text-orange-600" />}
                        <div>
                          <p className="text-sm font-black uppercase text-black dark:text-white">{paymentMethod} Authorized</p>
                          <p className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 mono">{paymentMethod === 'MoMo' ? paymentData.momoNumber : (paymentMethod === 'Card' ? `**** ${paymentData.cardNumber.slice(-4)}` : paymentMethod === 'Bank' ? 'Bank Transfer Selected' : '')}</p>
                          {paymentMethod === 'Bank' && bankRef && (
                            <div className="mt-3 p-3 bg-zinc-50 dark:bg-slate-800 rounded-lg border border-zinc-100 dark:border-slate-700">
                              <p className="text-[11px] font-black uppercase">Bank Transfer Instructions</p>
                              <p className="text-[11px] font-bold mt-1">Bank: Bank of Kigali</p>
                              <p className="text-[10px] font-bold">Account: <span className="mono">0004-7721-8890-12</span></p>
                              <p className="text-[10px] font-bold">Reference: <span className="mono">{bankRef}</span></p>
                              <p className="text-[10px] mt-2 text-zinc-500">After transfer, check the Client Dashboard to mark payment as received.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 p-6 bg-emerald-50 dark:bg-emerald-600/10 rounded-2xl border border-emerald-100 dark:border-emerald-600/20 flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center"><Truck className="w-6 h-6" /></div>
                      <div>
                        <p className="text-xs font-black text-emerald-900 dark:text-emerald-400 uppercase">Estimated Delivery: {tomorrow}</p>
                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Via Titan Express Moto (Handled with Care)</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-zinc-100 dark:border-slate-800 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <img src={item.image} className="w-12 h-12 rounded-xl object-cover border border-zinc-50 dark:border-slate-800" alt="" />
                          <div>
                            <p className="text-[11px] font-black text-black dark:text-white uppercase italic">{item.name}</p>
                            <p className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase">Qty: {item.quantity} × ${item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="text-sm font-black text-black dark:text-white">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handlePlaceOrder()}
                  disabled={isSubmitting}
                  className="w-full bg-[#FF8C00] hover:bg-orange-500 disabled:opacity-50 text-white py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-3 shadow-2xl shadow-orange-900/20 active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" /> Committing to Registry...
                    </>
                  ) : (
                    <>Confirm & Place Order <ChevronRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-zinc-100 dark:border-slate-800 shadow-sm sticky top-24">
              <h3 className="text-xl font-black text-black dark:text-white uppercase italic mb-8 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-orange-600" /> Financials
              </h3>

              <div className="space-y-4 text-sm font-bold mb-8">
                <div className="flex justify-between text-zinc-400 dark:text-slate-500">
                  <span className="uppercase tracking-widest text-[10px]">Subtotal Matrix</span>
                  <span className="text-black dark:text-white">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400 dark:text-slate-500">
                  <span className="uppercase tracking-widest text-[10px]">Logistics Fee</span>
                  <span className={shippingFee === 0 ? 'text-emerald-500 uppercase tracking-widest text-[10px]' : 'text-black dark:text-white'}>
                    {shippingFee === 0 ? 'Free' : `$${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400 dark:text-slate-500">
                  <span className="uppercase tracking-widest text-[10px]">RWA VAT (18%)</span>
                  <span className="text-black dark:text-white">${vatAmount.toLocaleString()}</span>
                </div>
                <div className="h-px bg-zinc-50 dark:bg-slate-800 my-2" />
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-slate-500">Grand Total</span>
                  <span className="text-3xl font-black text-orange-600 italic tracking-tighter">${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-slate-950 border border-zinc-100 dark:border-slate-800 p-4 rounded-2xl mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span className="text-[9px] font-black uppercase text-black dark:text-white">Titan Security Stack</span>
                </div>
                <p className="text-[9px] font-bold text-zinc-500 dark:text-slate-500 leading-relaxed uppercase">
                  Your purchase is protected by our local warranty program and certified by RICA standards.
                </p>
              </div>

              <div className="flex items-center gap-2 justify-center text-zinc-300 dark:text-slate-800">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;