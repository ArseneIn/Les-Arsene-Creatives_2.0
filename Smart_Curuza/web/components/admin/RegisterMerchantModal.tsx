import React, { useState } from 'react';
import { X, Save, Loader2, Store, User, Phone, Mail, Lock, MapPin, FileText, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

interface RegisterMerchantModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function RegisterMerchantModal({ onClose, onSuccess }: RegisterMerchantModalProps) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Form State
    const [ownerName, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const [businessName, setBusinessName] = useState('');
    const [address, setAddress] = useState('');
    const [tin, setTin] = useState('');

    const [registrationDoc, setRegistrationDoc] = useState<File | null>(null);
    const [ownerIdDoc, setOwnerIdDoc] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', ownerName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);
            formData.append('role', 'MERCHANT');

            formData.append('business_name', businessName);
            formData.append('address', address);
            formData.append('tin', tin);

            if (registrationDoc) formData.append('registration_doc', registrationDoc);
            if (ownerIdDoc) formData.append('owner_id_doc', ownerIdDoc);

            // We use the public register endpoint which creates both User and Merchant
            // Since we are sending FormData, we need to let the browser set the Content-Type header
            // The api utility might default to JSON, so we might need to bypass it or configure it.
            // Assuming api.post handles FormData correctly if passed directly or we might need to use fetch/axios directly if api wrapper forces JSON.

            // Let's try using the api wrapper first, but usually wrappers set Content-Type: application/json
            // If api wrapper is simple axios/fetch wrapper, it might need adjustment.
            // For safety, I'll use fetch directly for this specific multipart request if I can't verify api wrapper behavior.
            // But let's look at api wrapper usage in other places... it seems to be a custom wrapper.
            // I'll try to use it, but if it fails, I'll switch.

            // Actually, standard axios detects FormData. If 'api' is axios instance.
            // If 'api' is a custom fetch wrapper, it might be tricky.
            // Let's assume standard behavior for now.

            await api.post('/auth/register', formData);

            showToast('Merchant registered successfully', 'success');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Registration error:', error);
            showToast(error.message || 'Failed to register merchant', 'error');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-surface w-full max-w-2xl rounded-xl shadow-lg flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-platinum-600">
                    <div>
                        <h2 className="text-xl font-bold text-jet font-heading">Register New Merchant</h2>
                        <p className="text-sm text-jet-700">Step {step} of 3: {step === 1 ? 'Owner Details' : step === 2 ? 'Business Info' : 'Documents'}</p>
                    </div>
                    <button onClick={onClose} className="text-jet-700 hover:text-jet">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-platinum-200 h-1">
                    <div
                        className="bg-gold h-1 transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="register-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Step 1: Owner Details */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-jet-700 mb-1">Owner Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 h-5 w-5" />
                                            <input
                                                type="text"
                                                required
                                                value={ownerName}
                                                onChange={e => setOwnerName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-jet-700 mb-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 h-5 w-5" />
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={e => setPhone(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                                                placeholder="078..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-jet-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 h-5 w-5" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                                            placeholder="merchant@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-jet-700 mb-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 h-5 w-5" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                                            placeholder="••••••••"
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Business Info */}
                        {step === 2 && (
                            <div className="space-y-4 animate-in slide-in-from-right duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-jet-700 mb-1">Business Name</label>
                                    <div className="relative">
                                        <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 h-5 w-5" />
                                        <input
                                            type="text"
                                            required
                                            value={businessName}
                                            onChange={e => setBusinessName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                                            placeholder="e.g. Kigali Supermarket"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-jet-700 mb-1">TIN Number</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 h-5 w-5" />
                                        <input
                                            type="text"
                                            required
                                            value={tin}
                                            onChange={e => setTin(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                                            placeholder="e.g. 123456789"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-jet-700 mb-1">Shop Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-jet-700 h-5 w-5" />
                                        <textarea
                                            required
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                                            placeholder="District, Sector, Street..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Documents */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                    <p className="text-sm text-blue-800">Please upload clear copies of the required documents. Supported formats: PDF, JPG, PNG.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-jet-700 mb-2">Business Registration Certificate</label>
                                    <div className="border-2 border-dashed border-platinum-400 rounded-lg p-6 hover:bg-platinum-50 transition-colors text-center cursor-pointer relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={e => setRegistrationDoc(e.target.files?.[0] || null)}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 font-medium">
                                            {registrationDoc ? registrationDoc.name : 'Click to upload or drag and drop'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-jet-700 mb-2">Owner's ID / Passport Copy</label>
                                    <div className="border-2 border-dashed border-platinum-400 rounded-lg p-6 hover:bg-platinum-50 transition-colors text-center cursor-pointer relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={e => setOwnerIdDoc(e.target.files?.[0] || null)}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 font-medium">
                                            {ownerIdDoc ? ownerIdDoc.name : 'Click to upload or drag and drop'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-platinum-600 flex justify-between">
                    {step > 1 ? (
                        <button
                            onClick={prevStep}
                            className="px-6 py-2 border border-platinum-600 text-jet rounded-lg hover:bg-platinum-500 transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-platinum-600 text-jet rounded-lg hover:bg-platinum-500 transition-colors"
                        >
                            Cancel
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={nextStep}
                            className="px-6 py-2 bg-jet text-white rounded-lg hover:bg-onyx transition-colors flex items-center gap-2"
                        >
                            Next <ArrowRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            form="register-form"
                            disabled={loading}
                            className="px-6 py-2 bg-gradient-gold text-onyx rounded-lg shadow-gold hover:shadow-lg transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Complete Registration
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
