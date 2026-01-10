import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

interface DebtRepaymentModalProps {
    customerName: string;
    currentDebt: number;
    onClose: () => void;
    onConfirm: (amount: number) => void;
}

export default function DebtRepaymentModal({ customerName, currentDebt, onClose, onConfirm }: DebtRepaymentModalProps) {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = Number(amount);
        if (value > 0 && value <= currentDebt) {
            onConfirm(value);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-surface w-full max-w-md rounded-xl shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-jet">Record Debt Repayment</h3>
                    <button onClick={onClose} className="text-jet-500 hover:text-jet">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="bg-platinum-800 p-4 rounded-lg mb-6">
                    <p className="text-sm text-jet-700 mb-1">Customer</p>
                    <p className="font-bold text-jet text-lg">{customerName}</p>
                    <div className="mt-3 flex justify-between items-end">
                        <span className="text-sm text-jet-700">Current Debt</span>
                        <span className="font-bold text-danger text-xl">{currentDebt.toLocaleString()} RWF</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-jet mb-1">Repayment Amount (RWF)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-jet-500" />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none text-lg font-bold"
                                placeholder="0"
                                max={currentDebt}
                                min={1}
                                required
                            />
                        </div>
                        <p className="text-xs text-jet-500 mt-1">Enter the amount paid by the customer.</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-jet-600 hover:bg-platinum-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gold text-onyx rounded-lg font-bold hover:bg-gold/90 transition-colors"
                        >
                            Confirm Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
