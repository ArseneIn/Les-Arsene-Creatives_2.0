import React from 'react';
import { X, Package, Calendar, DollarSign } from 'lucide-react';

interface Batch {
    id: string;
    batch_number: string;
    current_quantity: number;
    selling_price?: number;
    expiry_date?: string;
    created_at: string;
}

interface BatchSelectionModalProps {
    productName: string;
    batches: Batch[];
    onClose: () => void;
    onSelect: (batch: Batch) => void;
}

export default function BatchSelectionModal({ productName, batches, onClose, onSelect }: BatchSelectionModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70]">
            <div className="bg-surface w-full max-w-md rounded-xl shadow-lg flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-platinum-600">
                    <div>
                        <h3 className="font-bold text-jet">Select Batch</h3>
                        <p className="text-xs text-jet-700">For {productName}</p>
                    </div>
                    <button onClick={onClose} className="text-jet-700 hover:text-jet">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    {batches.map(batch => (
                        <button
                            key={batch.id}
                            onClick={() => onSelect(batch)}
                            className="w-full bg-white border border-platinum-600 p-3 rounded-lg flex justify-between items-center hover:border-gold hover:shadow-sm transition-all text-left"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Package className="h-4 w-4 text-jet-700" />
                                    <span className="font-medium text-jet text-sm">{batch.batch_number}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-jet-700">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {batch.expiry_date ? new Date(batch.expiry_date).toLocaleDateString() : 'No Expiry'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {batch.selling_price ? Number(batch.selling_price).toLocaleString() : 'Default Price'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-jet">{batch.current_quantity} pcs</span>
                                <span className="text-xs text-success">Available</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
