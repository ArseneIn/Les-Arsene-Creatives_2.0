import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/assets';
import { ArrowLeft, Upload, Loader2, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../components/admin/Toast';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

const PartnerManager = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const [items, setItems] = useState([]);

    // UI State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const res = await fetch(getApiUrl('partners.php'));
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error(err);
        }
    };

    const confirmDelete = (id: number) => {
        setConfirmModal({ isOpen: true, id });
    };

    const handleDelete = async () => {
        if (!confirmModal.id) return;

        try {
            const response = await fetch(`${getApiUrl('partners.php')}?id=${confirmModal.id}`, { method: 'DELETE' });
            const result = await response.json();

            if (response.ok && result.success) {
                fetchPartners();
                setToast({ message: 'Partner deleted successfully', type: 'success' });
            } else {
                setToast({ message: result.error || 'Failed to delete partner', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Network error or server failed to respond', type: 'error' });
            console.error(err);
        }
        setConfirmModal({ isOpen: false, id: null });
    };

    const moveItem = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === items.length - 1) return;

        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        setItems(newItems); // Optimistic update

        try {
            const orderedIds = newItems.map((item: any) => item.id);
            const formData = new FormData();
            formData.append('action', 'reorder');
            orderedIds.forEach((id, idx) => {
                formData.append(`orderedIds[${idx}]`, id.toString());
            });

            await fetch(getApiUrl('partners.php'), {
                method: 'POST',
                body: formData
            });
        } catch (err) {
            console.error('Failed to reorder', err);
            setToast({ message: 'Failed to save order', type: 'error' });
            fetchPartners(); // Revert
        }
    };

    const [formData, setFormData] = useState({
        name: '',
        website_url: ''
    });
    const [image, setImage] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('website_url', formData.website_url);
            if (image) {
                data.append('logo', image);
            }

            const response = await fetch(getApiUrl('partners.php'), {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (result.success) {
                setToast({ message: 'Partner added successfully!', type: 'success' });
                setFormData({
                    name: '',
                    website_url: ''
                });
                setImage(null);
                fetchPartners();
            } else {
                setToast({ message: result.error || 'Failed to add partner.', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Connection error. Check console.', type: 'error' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b flex items-center gap-4">
                    <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Add Institutional Partner</h1>
                </div>

                <div className="p-6">
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )}

                    <ConfirmModal
                        isOpen={confirmModal.isOpen}
                        onClose={() => setConfirmModal({ isOpen: false, id: null })}
                        onConfirm={handleDelete}
                        title="Delete Partner?"
                        message="Are you sure you want to delete this partner? This cannot be undone."
                        isDeleting={true}
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                placeholder="e.g. UNICEF"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (Optional)</label>
                            <input
                                type="url"
                                name="website_url"
                                value={formData.website_url}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Partner Logo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                <input
                                    type="file"
                                    name="logo"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="partner-logo-upload"
                                />
                                <label htmlFor="partner-logo-upload" className="cursor-pointer flex flex-col items-center">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">
                                        {image ? image.name : "Click to upload logo"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Add Partner
                            </button>
                        </div>
                    </form>
                </div>

                {/* Existing Partners */}
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <h2 className="font-bold text-gray-800 mb-4">Existing Partners</h2>
                    <div className="space-y-3">
                        {items.map((item: any, index) => (
                            <div key={item.id} className="bg-white p-4 rounded border flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col gap-1 mr-2">
                                        <button
                                            onClick={() => moveItem(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                                        >
                                            <ChevronUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => moveItem(index, 'down')}
                                            disabled={index === items.length - 1}
                                            className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {item.logo_url && <img src={getApiUrl(item.logo_url)} alt={item.name} className="h-8 w-8 object-contain" />}
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                </div>
                                <button
                                    onClick={() => confirmDelete(item.id)}
                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Partner"
                                >
                                    <i className="material-icons">delete</i>
                                </button>
                            </div>
                        ))}
                        {items.length === 0 && <p className="text-gray-500 text-sm italic">No partners found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerManager;
