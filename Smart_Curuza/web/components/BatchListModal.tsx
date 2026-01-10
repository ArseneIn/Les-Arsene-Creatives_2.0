import React, { useState, useEffect } from 'react';
import { X, Plus, Package, Calendar, DollarSign, Loader2, Check } from 'lucide-react';
import { api } from '@/lib/api';

interface Batch {
    id: string;
    batch_number: string;
    original_quantity: number;
    current_quantity: number;
    buying_price_per_unit: number;
    total_cost: number;
    selling_price?: number;
    expiry_date?: string;
    created_at: string;
    status: 'active' | 'depleted' | 'expired';
}

interface ProductDetails {
    id: string;
    name: string;
    unit: string;
    buying_unit?: string;
    conversion_factor: number;
    price: number;
}

interface BatchListModalProps {
    productId: string;
    productName: string;
    unit: string;
    onClose: () => void;
    onUpdate: () => void;
}

export default function BatchListModal({ productId, productName, unit, onClose, onUpdate }: BatchListModalProps) {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRestockForm, setShowRestockForm] = useState(false);

    // Restock Form State
    const [isBulkRestock, setIsBulkRestock] = useState(false);
    const [quantity, setQuantity] = useState(''); // Single units
    const [buyingPrice, setBuyingPrice] = useState(''); // Cost per single unit

    // Bulk Form State
    const [bulkQuantity, setBulkQuantity] = useState(''); // e.g. Boxes
    const [totalBatchCost, setTotalBatchCost] = useState(''); // Total cost for the batch
    const [conversionFactor, setConversionFactor] = useState(1);

    const [sellingPrice, setSellingPrice] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [productId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [batchesData, productData] = await Promise.all([
                api.get<Batch[]>(`/batches/${productId}`),
                api.get<ProductDetails>(`/products/${productId}`)
            ]);
            setBatches(batchesData);
            setProduct(productData);

            // Initialize conversion factor if available
            if (productData.conversion_factor > 1) {
                setConversionFactor(productData.conversion_factor);
                setIsBulkRestock(true); // Default to bulk if product is bulk
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Derived Values for Bulk Mode
    const calculatedTotalUnits = isBulkRestock
        ? Number(bulkQuantity) * conversionFactor
        : Number(quantity);

    const calculatedCostPerUnit = isBulkRestock
        ? (Number(totalBatchCost) / calculatedTotalUnits) || 0
        : Number(buyingPrice);

    const calculatedTotalCost = isBulkRestock
        ? Number(totalBatchCost)
        : Number(quantity) * Number(buyingPrice);

    const handleRestock = async () => {
        setSubmitting(true);
        try {
            await api.post('/batches', {
                product_id: productId,
                original_quantity: calculatedTotalUnits,
                current_quantity: calculatedTotalUnits,
                buying_price_per_unit: calculatedCostPerUnit,
                selling_price: sellingPrice ? Number(sellingPrice) : undefined,
                expiry_date: expiryDate || undefined,
                total_cost: calculatedTotalCost,
                status: 'active'
            });

            // Refresh batches and notify parent
            const batchesData = await api.get<Batch[]>(`/batches/${productId}`);
            setBatches(batchesData);
            onUpdate();
            setShowRestockForm(false);

            // Reset Form
            setQuantity('');
            setBuyingPrice('');
            setBulkQuantity('');
            setTotalBatchCost('');
            setSellingPrice('');
            setExpiryDate('');
        } catch (error) {
            console.error('Error restocking:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-surface w-full max-w-2xl rounded-xl shadow-lg flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-platinum-600">
                    <div>
                        <h2 className="text-xl font-bold text-jet font-heading">Manage Batches</h2>
                        <p className="text-sm text-jet-700">Product: <span className="font-medium text-jet">{productName}</span></p>
                    </div>
                    <button onClick={onClose} className="text-jet-700 hover:text-jet">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {showRestockForm ? (
                        <div className="bg-platinum-800 p-6 rounded-lg space-y-4 animate-in slide-in-from-right">
                            <h3 className="font-bold text-jet flex items-center justify-between">
                                <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Restock Inventory</span>

                                {/* Bulk Toggle */}
                                <div className="flex items-center gap-2 text-sm font-normal">
                                    <span className={!isBulkRestock ? 'text-gold font-bold' : 'text-jet-700'}>Single Units</span>
                                    <div
                                        onClick={() => setIsBulkRestock(!isBulkRestock)}
                                        className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${isBulkRestock ? 'bg-gold' : 'bg-platinum-600'}`}
                                    >
                                        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${isBulkRestock ? 'translate-x-5' : ''}`} />
                                    </div>
                                    <span className={isBulkRestock ? 'text-gold font-bold' : 'text-jet-700'}>Bulk (Box/Sack)</span>
                                </div>
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                {isBulkRestock ? (
                                    <>
                                        <div className="col-span-2 bg-blue-50 p-3 rounded border border-blue-200 text-sm text-blue-800 flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            <span>
                                                Restocking in <strong>{product?.buying_unit || 'Units'}</strong>.
                                                (1 {product?.buying_unit || 'Unit'} = {conversionFactor} {unit})
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-jet-700 mb-1">
                                                Quantity ({product?.buying_unit || 'Units'})
                                            </label>
                                            <input
                                                type="number"
                                                value={bulkQuantity}
                                                onChange={e => setBulkQuantity(e.target.value)}
                                                className="w-full p-2 rounded border border-platinum-600 focus:border-gold focus:outline-none"
                                                placeholder="0"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-jet-700 mb-1">
                                                Total Cost (For all {bulkQuantity || '0'} {product?.buying_unit || 'Units'}) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={totalBatchCost}
                                                onChange={e => setTotalBatchCost(e.target.value)}
                                                className="w-full p-2 rounded border border-platinum-600 focus:border-gold focus:outline-none"
                                                placeholder="Total amount paid"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2 bg-surface p-3 rounded border border-platinum-600">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-jet-700">Total Stock Added:</span>
                                                <span className="font-bold text-jet">{calculatedTotalUnits} {unit}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm mt-1">
                                                <span className="text-jet-700">Cost per {product?.buying_unit || 'Unit'}:</span>
                                                <span className="font-medium text-jet">
                                                    {bulkQuantity && totalBatchCost
                                                        ? (Number(totalBatchCost) / Number(bulkQuantity)).toLocaleString()
                                                        : '0'} RWF
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm mt-1 border-t border-platinum-600 pt-1">
                                                <span className="text-jet-700">Cost per {unit} (Base):</span>
                                                <span className="font-bold text-gold">{calculatedCostPerUnit.toLocaleString()} RWF</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-jet-700 mb-1">Quantity ({unit}) <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={e => setQuantity(e.target.value)}
                                                className="w-full p-2 rounded border border-platinum-600 focus:border-gold focus:outline-none"
                                                placeholder="0"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-jet-700 mb-1">Buying Price (Per {unit}) <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                value={buyingPrice}
                                                onChange={e => setBuyingPrice(e.target.value)}
                                                className="w-full p-2 rounded border border-platinum-600 focus:border-gold focus:outline-none"
                                                placeholder="0"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-jet-700 mb-1">Selling Price (Optional)</label>
                                    <input
                                        type="number"
                                        value={sellingPrice}
                                        onChange={e => setSellingPrice(e.target.value)}
                                        className="w-full p-2 rounded border border-platinum-600 focus:border-gold focus:outline-none"
                                        placeholder={product?.price ? `${product.price}` : "Same as product price"}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-jet-700 mb-1">Expiry Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={expiryDate}
                                        onChange={e => setExpiryDate(e.target.value)}
                                        className="w-full p-2 rounded border border-platinum-600 focus:border-gold focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setShowRestockForm(false)}
                                    className="px-4 py-2 text-sm text-jet-700 hover:text-jet"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRestock}
                                    disabled={submitting || (isBulkRestock ? (!bulkQuantity || !totalBatchCost) : (!quantity || !buyingPrice))}
                                    className="px-4 py-2 bg-gold text-onyx rounded-lg text-sm font-medium hover:bg-gold/90 flex items-center gap-2"
                                >
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    Confirm Restock
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowRestockForm(true)}
                            className="w-full py-3 border-2 border-dashed border-platinum-600 rounded-lg text-jet-700 hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-2 mb-6"
                        >
                            <Plus className="h-5 w-5" /> Restock (Add New Batch)
                        </button>
                    )}

                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                            </div>
                        ) : batches.length === 0 ? (
                            <p className="text-center text-jet-700 py-8">No active batches found.</p>
                        ) : (
                            batches.map(batch => (
                                <div key={batch.id} className="bg-white border border-platinum-600 p-4 rounded-lg flex justify-between items-center shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-platinum-800 rounded-lg">
                                            <Package className="h-5 w-5 text-jet-700" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-jet">{batch.batch_number}</p>
                                            <div className="flex items-center gap-4 text-xs text-jet-700 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(batch.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    Cost: {Number(batch.buying_price_per_unit).toLocaleString()}
                                                </span>
                                                {batch.selling_price && (
                                                    <span className="flex items-center gap-1 text-green-600">
                                                        <DollarSign className="h-3 w-3" />
                                                        Sell: {Number(batch.selling_price).toLocaleString()}
                                                    </span>
                                                )}
                                                {batch.expiry_date && (
                                                    <span className={`flex items-center gap-1 ${new Date(batch.expiry_date) < new Date() ? 'text-red-500 font-bold' : 'text-jet-700'}`}>
                                                        <Calendar className="h-3 w-3" />
                                                        Exp: {new Date(batch.expiry_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-jet">
                                            {Number(batch.current_quantity)} <span className="text-sm font-normal text-jet-700">{unit}</span>
                                        </p>
                                        {conversionFactor > 1 && (
                                            <p className="text-xs text-jet-700">
                                                ({Math.floor(Number(batch.current_quantity) / conversionFactor)} {product?.buying_unit || 'Box'})
                                            </p>
                                        )}
                                        <p className="text-xs text-success font-medium mt-1">Active</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
