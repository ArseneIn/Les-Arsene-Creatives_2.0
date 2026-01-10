import React, { forwardRef } from 'react';

interface ReceiptItem {
    name: string;
    quantity: number;
    price: number;
    total: number;
}

interface ReceiptProps {
    shopName: string;
    address: string;
    phone: string;
    tin: string;
    receiptNo: string;
    date: string;
    items: ReceiptItem[];
    total: number;
    cashier: string;
    paymentMethod?: string;
    customerName?: string;
    totalDebt?: number;
}

export const ReceiptTemplate = forwardRef<HTMLDivElement, ReceiptProps>((props, ref) => {
    const vatRate = 0.18;
    const netAmount = props.total / (1 + vatRate);
    const vatAmount = props.total - netAmount;

    return (
        <div ref={ref} className="w-[80mm] p-4 bg-white text-black font-mono text-xs leading-tight">
            <div className="text-center mb-4">
                <h1 className="text-lg font-bold uppercase">{props.shopName}</h1>
                <p>{props.address}</p>
                <p>Tel: {props.phone}</p>
                <p>TIN: {props.tin}</p>
            </div>

            <div className="mb-4 border-b border-black pb-2 border-dashed">
                <div className="flex justify-between">
                    <span>Date: {props.date}</span>
                </div>
                <div className="flex justify-between">
                    <span>Receipt #: {props.receiptNo.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Cashier: {props.cashier}</span>
                </div>
                {props.customerName && (
                    <div className="flex justify-between">
                        <span>Customer: {props.customerName}</span>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-black border-dashed">
                            <th className="py-1">Item</th>
                            <th className="py-1 text-center">Qty</th>
                            <th className="py-1 text-right">Price</th>
                            <th className="py-1 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.items.map((item, index) => (
                            <tr key={index}>
                                <td className="py-1 pr-1 truncate max-w-[30mm]">{item.name}</td>
                                <td className="py-1 text-center">{item.quantity}</td>
                                <td className="py-1 text-right">{item.price.toLocaleString()}</td>
                                <td className="py-1 text-right">{item.total.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-black border-dashed pt-2 mb-4 space-y-1">
                <div className="flex justify-between">
                    <span>Net Amount (Excl. VAT):</span>
                    <span>{netAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                    <span>VAT (18%):</span>
                    <span>{vatAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-black">
                    <span>TOTAL (Inc. VAT):</span>
                    <span>{props.total.toLocaleString()} RWF</span>
                </div>
            </div>

            {props.paymentMethod === 'Credit' && (
                <div className="border-t border-black border-dashed pt-2 mb-4">
                    <p className="font-bold text-center mb-2">DEBT ACKNOWLEDGEMENT</p>
                    <p>I, {props.customerName || 'Customer'}, acknowledge the debt of {props.total.toLocaleString()} RWF.</p>
                    {props.totalDebt !== undefined && (
                        <p className="mt-1">Total Outstanding Debt: {props.totalDebt.toLocaleString()} RWF</p>
                    )}
                    <div className="mt-8 border-t border-black w-1/2 mx-auto"></div>
                    <p className="text-center text-[10px] mt-1">Customer Signature</p>
                </div>
            )}

            <div className="text-center text-[10px] mt-6">
                <p>Thank you for shopping with us!</p>
                <p className="mt-2">Powered by Smart Curuza</p>
            </div>
        </div>
    );
});

ReceiptTemplate.displayName = 'ReceiptTemplate';
