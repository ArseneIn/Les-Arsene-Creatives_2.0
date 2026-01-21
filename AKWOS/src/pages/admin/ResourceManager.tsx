import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/apiConfig';
import { ArrowLeft, Loader2, Save, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResourceManager = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await fetch(getApiUrl('resources.php'));
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;

        try {
            await fetch(`${getApiUrl('resources.php')}?id=${id}`, { method: 'DELETE' });
            fetchResources();
            setSuccess('Resource deleted successfully');
        } catch (err) {
            setError('Failed to delete resource');
        }
    };

    const [formData, setFormData] = useState({
        title: '',
        year: new Date().getFullYear().toString(),
        type: 'Annual Report',
    });
    const [file, setFile] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a PDF file to upload.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('year', formData.year);
            data.append('type', formData.type);
            data.append('file', file);

            const response = await fetch(getApiUrl('resources.php'), {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (result.success) {
                setSuccess('Resource uploaded successfully!');
                setFormData({
                    title: '',
                    year: new Date().getFullYear().toString(),
                    type: 'Annual Report',
                });
                setFile(null);
                fetchResources();
            } else {
                setError(result.error || 'Failed to upload resource.');
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
                    <h1 className="text-xl font-bold text-gray-800">Upload Resource</h1>
                </div>

                <div className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
                    {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                placeholder="e.g. Annual Report 2024"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <input
                                    type="text"
                                    name="year"
                                    required
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option>Annual Report</option>
                                    <option>Strategic Plan</option>
                                    <option>Policy Brief</option>
                                    <option>Research</option>
                                    <option>Conference Report</option>
                                    <option>Training Report</option>
                                    <option>Newsletter</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PDF Document</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                <input
                                    type="file"
                                    name="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="resource-file-upload"
                                />
                                <label htmlFor="resource-file-upload" className="cursor-pointer flex flex-col items-center">
                                    <FileText className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">
                                        {file ? file.name : "Click to upload PDF"}
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
                                Upload Document
                            </button>
                        </div>
                    </form>
                </div>

                {/* Existing Resources */}
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <h2 className="font-bold text-gray-800 mb-4">Existing Resources</h2>
                    <div className="space-y-3">
                        {items.map((item: any) => (
                            <div key={item.id} className="bg-white p-4 rounded border flex justify-between items-center shadow-sm">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.type} • {item.year}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Resource"
                                >
                                    <i className="material-icons">delete</i>
                                </button>
                            </div>
                        ))}
                        {items.length === 0 && <p className="text-gray-500 text-sm italic">No resources found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceManager;
