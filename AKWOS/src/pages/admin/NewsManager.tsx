import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/assets';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../components/admin/Toast';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

const NewsManager = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const [items, setItems] = useState([]);

    // Fetch items on mount
    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch(getApiUrl('news.php'));
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
            await fetch(`${getApiUrl('news.php')}?id=${confirmModal.id}`, { method: 'DELETE' });
            fetchNews();
            // setSuccess('Article deleted successfully'); // Removed old state
            setToast({ message: 'Article deleted successfully', type: 'success' });
        } catch (err) {
            // setError('Failed to delete article'); // Removed old state
            setToast({ message: 'Failed to delete article', type: 'error' });
        }
        setConfirmModal({ isOpen: false, id: null });
    };

    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        category: 'General',
        tag: 'News',
        description: ''
    });
    const [image, setImage] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, tagName } = e.target;

        if (name === 'category') {
            if (tagName === 'SELECT') {
                if (value === 'new') {
                    setIsCustomCategory(true);
                    setFormData({ ...formData, category: '' });
                } else {
                    setIsCustomCategory(false);
                    setFormData({ ...formData, category: value });
                }
            } else {
                // Text input for custom category
                setFormData({ ...formData, category: value });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
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
            data.append('title', formData.title);
            data.append('date', formData.date);
            data.append('category', formData.category);
            data.append('tag', formData.tag);
            data.append('description', formData.description);
            if (image) {
                data.append('image', image);
            }

            const response = await fetch(getApiUrl('news.php'), {
                method: 'POST',
                body: data, // No JSON headers for FormData
            });

            const result = await response.json();

            if (result.success) {
                setToast({ message: 'News article added successfully!', type: 'success' });
                setFormData({
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    category: 'General',
                    tag: 'News',
                    description: ''
                });
                setIsCustomCategory(false);
                setImage(null);
                fetchNews();
            } else {
                setToast({ message: result.error || 'Failed to add news.', type: 'error' });
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
                title="Delete Article?"
                message="Are you sure you want to delete this news article?"
                isDeleting={true}
            />

            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b flex items-center gap-4">
                    <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Add News Article</h1>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                placeholder="Enter article title"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={isCustomCategory ? 'new' : formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="General">General</option>
                                    <option value="Events">Events</option>
                                    <option value="Announcements">Announcements</option>
                                    <option value="Press">Press Release</option>
                                    <option value="new">+ Add New Category</option>
                                </select>
                                {isCustomCategory && (
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="Enter custom category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md mt-2 focus:ring-primary focus:border-primary"
                                        autoFocus
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Article Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="news-image-upload"
                                />
                                <label htmlFor="news-image-upload" className="cursor-pointer flex flex-col items-center">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">
                                        {image ? image.name : "Click to upload cover image"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description / Excerpt</label>
                            <textarea
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                placeholder="Brief summary of the article..."
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Publish Article
                            </button>
                        </div>
                    </form>
                </div>

                {/* List of Existing Items */}
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <h2 className="font-bold text-gray-800 mb-4">Existing News Articles</h2>
                    <div className="space-y-3">
                        {items.map((item: any) => (
                            <div key={item.id} className="bg-white p-4 rounded border flex justify-between items-center shadow-sm">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.date} • {item.category}</p>
                                </div>
                                <button
                                    onClick={() => confirmDelete(item.id)}
                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Article"
                                >
                                    <i className="material-icons">delete</i>
                                </button>
                            </div>
                        ))}
                        {items.length === 0 && <p className="text-gray-500 text-sm italic">No news articles found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsManager;
