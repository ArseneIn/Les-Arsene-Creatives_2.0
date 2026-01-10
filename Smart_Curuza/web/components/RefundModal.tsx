import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface RefundModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string, restock: boolean) => Promise<void>;
    isProcessing: boolean;
}

export default function RefundModal({ isOpen, onClose, onConfirm, isProcessing }: RefundModalProps) {
    const [reason, setReason] = useState('');
    const [restock, setRestock] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Process Refund
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to refund this transaction? This action cannot be undone.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Refund</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            rows={3}
                            placeholder="e.g., Customer returned items, Damaged goods..."
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="restock"
                            checked={restock}
                            onChange={(e) => setRestock(e.target.checked)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="restock" className="text-sm text-gray-700">
                            Return items to inventory (Restock)
                        </label>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(reason, restock)}
                        disabled={isProcessing || !reason.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isProcessing ? 'Processing...' : 'Confirm Refund'}
                    </button>
                </div>
            </div>
        </div>
    );
}
