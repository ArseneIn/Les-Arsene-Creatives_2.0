import React from 'react';
import { X, Calendar, User, CreditCard, CheckCircle, Clock, XCircle, Printer } from 'lucide-react';

interface SaleItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
}

interface SaleRecord {
    id: string;
    created_at: string;
    customer?: { name: string; email?: string; phone?: string };
    items: SaleItem[];
    total: number;
    vat_amount?: number;
    net_amount?: number;
    payment_method: string;
    sync_status: string;
    profit?: number;
}

interface SaleDetailsModalProps {
    sale: SaleRecord;
    onClose: () => void;
}

export default function SaleDetailsModal({ sale, onClose }: SaleDetailsModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                        <p className="text-sm text-gray-500 font-mono">#{sale.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Status & Meta */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(sale.created_at).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="h-4 w-4" />
                                <span>{sale.customer?.name || 'Walk-in Customer'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CreditCard className="h-4 w-4" />
                                <span>{sale.payment_method}</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center items-center text-center">
                            <span className="text-sm text-gray-500 mb-1">Status</span>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${sale.sync_status === 'Completed' ? 'bg-green-100 text-green-700' :
                                sale.sync_status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                {sale.sync_status === 'Completed' && <CheckCircle className="h-4 w-4" />}
                                {sale.sync_status === 'Pending' && <Clock className="h-4 w-4" />}
                                {sale.sync_status === 'Failed' && <XCircle className="h-4 w-4" />}
                                {sale.sync_status}
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3">Items Purchased</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                    <tr>
                                        <th className="p-3">Product</th>
                                        <th className="p-3 text-right">Qty</th>
                                        <th className="p-3 text-right">Unit Price</th>
                                        <th className="p-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {sale.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="p-3 font-medium text-gray-900">{item.name}</td>
                                            <td className="p-3 text-right">{item.quantity}</td>
                                            <td className="p-3 text-right">{Number(item.price).toLocaleString()}</td>
                                            <td className="p-3 text-right font-medium">{Number(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal (Excl. VAT)</span>
                                <span>{sale.net_amount ? Number(sale.net_amount).toLocaleString() : '0'} RWF</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>VAT (18%)</span>
                                <span>{sale.vat_amount ? Number(sale.vat_amount).toLocaleString() : '0'} RWF</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>{Number(sale.total).toLocaleString()} RWF</span>
                            </div>
                            {sale.profit !== undefined && (
                                <div className={`flex justify-between text-sm font-medium mt-2 pt-2 border-t border-dashed ${sale.profit < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    <span>{sale.profit < 0 ? 'Loss' : 'Profit'}</span>
                                    <span>{Math.abs(sale.profit).toLocaleString()} RWF</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
                        <Printer className="h-4 w-4" /> Print Receipt
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
