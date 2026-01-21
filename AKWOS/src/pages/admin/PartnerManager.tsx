import React, { useState } from 'react';
import { getApiUrl } from '../../utils/apiConfig';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PartnerManager = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        setError('');
        setSuccess('');

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
                setSuccess('Partner added successfully!');
                setFormData({
                    name: '',
                    website_url: ''
                });
                setImage(null);
            } else {
                setError(result.error || 'Failed to add partner.');
            }
        } catch (err) {
            setError('Connection error. Check console.');
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
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
                    {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">{success}</div>}

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
            </div>
        </div>
    );
};

export default PartnerManager;
