import React, { useState } from 'react';
import { Banknote, Smartphone, CreditCard, X, ArrowLeft, Loader2 } from 'lucide-react';
import PhoneInput from './ui/PhoneInput';

interface PaymentModalProps {
    total: number;
    onClose: () => void;
    onPaymentComplete: (method: 'Cash' | 'MoMo' | 'Credit', data?: any) => void;
}

export default function PaymentModal({ total, onClose, onPaymentComplete }: PaymentModalProps) {
    const [step, setStep] = useState<'select' | 'momo'>('select');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+250');
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleMoMoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPaymentComplete('MoMo', { phoneNumber });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-surface w-full max-w-md rounded-xl shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        {step === 'momo' && (
                            <button onClick={() => setStep('select')} className="text-jet-700 hover:text-jet">
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                        )}
                        <h2 className="text-2xl font-bold text-jet font-heading">
                            {step === 'select' ? 'Payment' : 'Mobile Money'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-jet-700 hover:text-jet">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="mb-8 text-center">
                    <p className="text-jet-700 font-body mb-1">Total Amount Due</p>
                    <p className="text-4xl font-bold text-jet font-heading">{total.toLocaleString()} RWF</p>
                </div>

                {step === 'select' ? (
                    <div className="space-y-3">
                        <button
                            onClick={() => onPaymentComplete('Cash')}
                            className="w-full py-4 bg-success text-white rounded-lg hover:bg-success/90 transition-all duration-200 font-medium font-sans flex items-center justify-center gap-3 text-lg"
                        >
                            <Banknote className="h-6 w-6" />
                            Cash Payment
                        </button>
                        <button
                            onClick={() => setStep('momo')}
                            className="w-full py-4 bg-gold text-onyx rounded-lg hover:bg-saffron transition-all duration-200 font-medium font-sans flex items-center justify-center gap-3 text-lg"
                        >
                            <Smartphone className="h-6 w-6" />
                            Mobile Money
                        </button>
                        <button
                            onClick={() => onPaymentComplete('Credit')}
                            className="w-full py-4 bg-danger text-white rounded-lg hover:bg-danger/90 transition-all duration-200 font-medium font-sans flex items-center justify-center gap-3 text-lg"
                        >
                            <CreditCard className="h-6 w-6" />
                            Credit Sale
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleMoMoSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-jet-700 mb-1">Customer Phone Number</label>
                            <PhoneInput
                                value={phoneNumber}
                                onChange={(val, isValid) => {
                                    setPhoneNumber(val);
                                    setIsPhoneValid(isValid);
                                }}
                                countryCode={countryCode}
                                onCountryChange={setCountryCode}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!isPhoneValid || !phoneNumber}
                            className="w-full py-4 bg-gold text-onyx rounded-lg hover:bg-saffron transition-all duration-200 font-medium font-sans flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Smartphone className="h-6 w-6" />
                            Send Prompt
                        </button>
                    </form>
                )}

                {step === 'select' && (
                    <button
                        onClick={onClose}
                        className="w-full mt-4 py-3 text-jet-700 font-medium hover:text-jet transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}

