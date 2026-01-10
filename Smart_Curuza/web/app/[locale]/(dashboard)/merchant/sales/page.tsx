'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import POSCart, { CartItem } from '@/components/POSCart';
import ProductSearch, { Product } from '@/components/ProductSearch';
import PaymentModal from '@/components/PaymentModal';
import CustomerSelectionModal from '@/components/CustomerSelectionModal';
import BatchSelectionModal from '@/components/BatchSelectionModal';

import { db } from '@/lib/db';
import { syncService } from '@/lib/sync';
import { useReactToPrint } from 'react-to-print';
import { ReceiptTemplate } from '@/components/ReceiptTemplate';
import { Printer, CheckCircle, Clock } from 'lucide-react';
import ShiftModal from '@/components/ShiftModal';
import { Button } from '@/components/ui/Button';

export default function POSPage() {
    const { showToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showPayment, setShowPayment] = useState(false);
    const [showCustomerSelect, setShowCustomerSelect] = useState(false);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('Processing Transaction...');

    // Batch Selection State
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [currentProductForBatch, setCurrentProductForBatch] = useState<Product | null>(null);
    const [availableBatches, setAvailableBatches] = useState<any[]>([]);

    // Receipt Printing State
    const [lastSale, setLastSale] = useState<any>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const receiptRef = React.useRef<HTMLDivElement>(null);
    const [merchantProfile, setMerchantProfile] = useState<any>(null);

    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
    } as any);

    const [user, setUser] = useState<any>(null);
    const [activeShift, setActiveShift] = useState<any>(null);
    const [showShiftModal, setShowShiftModal] = useState(false);

    // Discount State
    const [discount, setDiscount] = useState(0);

    // Hold/Resume State
    const [heldSale, setHeldSale] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            await fetchProducts();
            await fetchMerchantProfile();
            await checkShiftStatus();
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            // Check for held sale
            const storedHeldSale = localStorage.getItem('held_sale');
            if (storedHeldSale) {
                setHeldSale(JSON.parse(storedHeldSale));
            }
        };
        init();
    }, []);

    const checkShiftStatus = async () => {
        try {
            const shift = await api.get<any>('/merchants/shifts/current');
            setActiveShift(shift);
            if (!shift) {
                setShowShiftModal(true);
            }
        } catch (error) {
            console.error('Error checking shift status:', error);
        }
    };

    const fetchMerchantProfile = async () => {
        try {
            const data = await api.get('/merchants/profile');
            setMerchantProfile(data);
        } catch (error) {
            console.error('Error fetching merchant profile:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            // Try to load from local DB first
            const localProducts = await db.products.toArray();
            if (localProducts.length > 0) {
                setProducts(localProducts as any);
            }

            // If online, fetch from API and update local DB
            if (navigator.onLine) {
                const data = await api.get<Product[]>('/products');
                const activeProducts = data.filter(p => p.status === 'active');
                setProducts(activeProducts);

                // Update local DB
                await db.products.clear();
                await db.products.bulkAdd(activeProducts.map(p => ({
                    ...p,
                    status: p.status || 'active',
                    sync_status: 'synced'
                })));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product: Product) => {
        try {
            const batches = await api.get<any[]>(`/batches/${product.id}`);
            const activeBatches = batches.filter(b => b.status === 'active' && b.current_quantity > 0);

            if (activeBatches.length > 1) {
                setAvailableBatches(activeBatches);
                setCurrentProductForBatch(product);
                setShowBatchModal(true);
            } else {
                const batchId = activeBatches.length === 1 ? activeBatches[0].id : undefined;
                const price = activeBatches.length === 1 && activeBatches[0].selling_price
                    ? Number(activeBatches[0].selling_price)
                    : Number(product.price);
                const maxQuantity = activeBatches.length === 1
                    ? Number(activeBatches[0].current_quantity)
                    : Number(product.stock);

                addItemToCart(product, batchId, price, maxQuantity);
            }
        } catch (error) {
            console.error('Error checking batches:', error);
            addItemToCart(product, undefined, undefined, Number(product.stock));
        }
    };

    const handleBatchSelect = (batch: any) => {
        if (currentProductForBatch) {
            const price = batch.selling_price ? Number(batch.selling_price) : Number(currentProductForBatch.price);
            const maxQuantity = Number(batch.current_quantity);
            addItemToCart(currentProductForBatch, batch.id, price, maxQuantity);
            setShowBatchModal(false);
            setCurrentProductForBatch(null);
        }
    };

    const addItemToCart = (product: Product, batchId?: string, price?: number, maxQuantity?: number) => {
        const finalPrice = price !== undefined ? price : Number(product.price);
        const existing = cart.find(item => item.id === product.id && item.batchId === batchId);
        const limit = maxQuantity !== undefined ? maxQuantity : Number(product.stock);

        if (existing) {
            if (existing.quantity + 1 > limit) {
                showToast(`Insufficient stock! Only ${limit} available.`, 'error');
                return;
            }
            setCart(cart.map(item =>
                item.id === product.id && item.batchId === batchId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            if (1 > limit) {
                showToast(`Insufficient stock! Only ${limit} available.`, 'error');
                return;
            }
            setCart([...cart, {
                id: product.id,
                name: product.name,
                price: finalPrice,
                quantity: 1,
                barcode: product.barcode,
                unit: product.unit,
                image: product.image,
                batchId: batchId,
                maxQuantity: limit
            }]);
        }
    };

    const updateQuantity = (id: string, change: number, batchId?: string) => {
        setCart(cart.map(item => {
            if (item.id === id && item.batchId === batchId) {
                const newQuantity = item.quantity + change;
                if (change > 0 && item.maxQuantity !== undefined && newQuantity > item.maxQuantity) {
                    showToast(`Insufficient stock! Only ${item.maxQuantity} available.`, 'error');
                    return item;
                }
                return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id: string, batchId?: string) => {
        setCart(cart.filter(item => !(item.id === id && item.batchId === batchId)));
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(0);
        setShowPayment(false);
        setShowCustomerSelect(false);
    };

    const handleHoldSale = () => {
        if (cart.length === 0) return;
        const saleToHold = { cart, discount, date: new Date().toISOString() };
        localStorage.setItem('held_sale', JSON.stringify(saleToHold));
        setHeldSale(saleToHold);
        clearCart();
        showToast('Sale put on hold', 'success');
    };

    const handleResumeSale = () => {
        if (!heldSale) return;
        if (cart.length > 0 && !confirm('Current cart will be replaced. Continue?')) return;

        setCart(heldSale.cart);
        setDiscount(heldSale.discount);
        localStorage.removeItem('held_sale');
        setHeldSale(null);
        showToast('Sale resumed', 'success');
    };

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingPaymentMethod, setPendingPaymentMethod] = useState<{ method: string, data?: any } | null>(null);

    const handlePaymentMethodSelect = (method: 'Cash' | 'MoMo' | 'Credit', data?: any) => {
        setPendingPaymentMethod({ method, data });
        setShowConfirmation(true);
    };

    const confirmPayment = async () => {
        if (!pendingPaymentMethod) return;

        const { method, data } = pendingPaymentMethod;
        setShowConfirmation(false);

        if (method === 'Credit') {
            setShowPayment(false);
            setShowCustomerSelect(true);
        } else if (method === 'MoMo') {
            setProcessing(true);
            setProcessingMessage('Waiting for payment confirmation...');
            try {
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                await api.post('/payments/stk-push', {
                    phoneNumber: data.phoneNumber,
                    amount: total,
                    orderId: `order_${Date.now()}`
                });
                processSale(method);
            } catch (error) {
                console.error('Payment failed:', error);
                showToast('Payment failed. Please try again.', 'error');
                setProcessing(false);
            }
        } else {
            processSale(method);
        }
    };

    const handleCustomerSelect = (customer: any) => {
        setShowCustomerSelect(false);
        processSale('Credit', customer.id);
    };

    const processSale = async (method: string, customerId?: string) => {
        if (!activeShift) {
            showToast('You must open a shift before processing sales.', 'error');
            setShowShiftModal(true);
            return;
        }

        if (!processing) {
            setProcessing(true);
            setProcessingMessage('Processing Transaction...');
        }

        try {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const finalTotal = Math.max(0, subtotal - discount);

            const saleData = {
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    batchId: item.batchId,
                    total: item.price * item.quantity
                })),
                total: finalTotal,
                paymentMethod: method,
                customerId,
                discount
            };

            let response: any = { id: `OFFLINE-${Date.now()}` };

            if (navigator.onLine) {
                response = await api.post<any>('/sales', saleData);
            } else {
                // Save to offline queue
                await syncService.addToQueue('/sales', 'POST', saleData);
                // Save to local sales table
                await db.sales.add({
                    ...saleData,
                    created_at: new Date().toISOString(),
                    sync_status: 'pending'
                });
                showToast('Offline mode: Sale saved locally.', 'info');
            }

            // Prepare receipt data
            setLastSale({
                ...saleData,
                id: response.id,
                date: new Date().toLocaleString(),
                receiptNo: response.id,
                cashier: user?.email || 'Staff'
            });

            setShowSuccessModal(true);
            clearCart();
            fetchProducts(); // Refresh stock
        } catch (error) {
            console.error('Error processing sale:', error);
            showToast('Failed to process sale. Please try again.', 'error');
        } finally {
            setProcessing(false);
            setShowPayment(false);
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="h-full flex gap-6 relative">
            {/* Left Side - Products */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
                </div>
            ) : (
                <ProductSearch
                    products={products}
                    onAddToCart={addToCart}
                    activeShift={activeShift}
                    onShiftClick={() => setShowShiftModal(true)}
                />
            )}

            {/* Right Side - Cart */}
            <div className="flex flex-col gap-4 h-full">
                <div className="flex gap-2">
                    <button
                        onClick={handleHoldSale}
                        disabled={cart.length === 0}
                        className="flex-1 py-2 bg-platinum-200 text-jet rounded-lg font-medium hover:bg-platinum-300 disabled:opacity-50 transition-colors"
                    >
                        Hold Sale
                    </button>
                    {heldSale && (
                        <button
                            onClick={handleResumeSale}
                            className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors animate-pulse"
                        >
                            Resume Sale
                        </button>
                    )}
                </div>
                <POSCart
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onClear={clearCart}
                    onCheckout={() => setShowPayment(true)}
                    discount={discount}
                    onDiscountChange={setDiscount}
                />
            </div>

            {/* Payment Modal */}
            {showPayment && (
                <PaymentModal
                    total={total}
                    onClose={() => setShowPayment(false)}
                    onPaymentComplete={handlePaymentMethodSelect}
                />
            )}

            {/* Customer Selection Modal */}
            {showCustomerSelect && (
                <CustomerSelectionModal
                    onClose={() => setShowCustomerSelect(false)}
                    onSelect={handleCustomerSelect}
                />
            )}

            {/* Batch Selection Modal */}
            {showBatchModal && currentProductForBatch && (
                <BatchSelectionModal
                    productName={currentProductForBatch.name}
                    batches={availableBatches}
                    onClose={() => {
                        setShowBatchModal(false);
                        setCurrentProductForBatch(null);
                    }}
                    onSelect={handleBatchSelect}
                />
            )}

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80]">
                    <div className="bg-surface w-full max-w-md rounded-xl shadow-lg p-6 flex flex-col animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-jet font-heading mb-4">Confirm Payment</h2>
                        <p className="text-jet-700 mb-6">
                            Are you sure you want to process this payment of <strong>{total.toLocaleString()} RWF</strong> via <strong>{pendingPaymentMethod?.method}</strong>?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => setShowConfirmation(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmPayment}
                                isLoading={processing}
                            >
                                Confirm & Pay
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Processing Overlay */}
            {processing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
                    <div className="bg-surface p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
                        <p className="text-jet font-medium">{processingMessage}</p>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && lastSale && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70]">
                    <div className="bg-surface w-full max-w-md rounded-xl shadow-lg p-6 flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-jet font-heading mb-2">Sale Completed!</h2>
                        <p className="text-jet-700 mb-6 text-center">Transaction has been recorded successfully.</p>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={handlePrint}
                                className="flex-1 py-3 bg-platinum-600 text-jet rounded-lg font-medium hover:bg-platinum-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Printer className="h-5 w-5" />
                                Print Receipt
                            </button>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="flex-1 py-3 bg-gold text-onyx rounded-lg font-bold hover:bg-gold/90 transition-colors"
                            >
                                New Sale
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Shift Modal */}
            {showShiftModal && (
                <ShiftModal
                    onClose={() => setShowShiftModal(false)}
                    onShiftChange={(shift) => setActiveShift(shift)}
                />
            )}



            {/* Hidden Receipt Template */}
            <div className="hidden">
                {lastSale && (
                    <ReceiptTemplate
                        ref={receiptRef}
                        shopName={merchantProfile?.business_name || "Smart Curuza Shop"}
                        address={merchantProfile?.address || "Kigali, Rwanda"}
                        phone={merchantProfile?.phone || "+250 788 123 456"}
                        tin={merchantProfile?.tin || "123456789"}
                        receiptNo={lastSale.receiptNo}
                        date={lastSale.date}
                        items={lastSale.items}
                        total={lastSale.total}
                        cashier={lastSale.cashier}
                    />
                )}
            </div>
        </div>
    );
}
