import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface AddCustomerModalProps {
    onClose: () => void;
    onSave: (customer: any) => Promise<void>;
}

export default function AddCustomerModal({ onClose, onSave }: AddCustomerModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error saving customer:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-surface w-full max-w-md rounded-xl shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-jet font-heading">Add New Customer</h2>
                    <button onClick={onClose} className="text-jet-700 hover:text-jet">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-jet-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                            placeholder="e.g. Jean Pierre"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-jet-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                            placeholder="e.g. 0781234567"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-jet-700 mb-1">Email (Optional)</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                            placeholder="e.g. jean@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-jet-700 mb-1">Address (Optional)</label>
                        <textarea
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2 border border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                            placeholder="e.g. Kigali, Nyarugenge"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 border border-platinum-600 text-jet rounded-lg hover:bg-platinum-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-gradient-gold text-onyx rounded-lg shadow-gold hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
