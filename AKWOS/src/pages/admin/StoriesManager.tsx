import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/apiConfig';
import { Upload, Plus, Loader2, CheckCircle, Quote } from 'lucide-react';
import { Toast } from '../../components/admin/Toast';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

const StoriesManager = () => {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await fetch(getApiUrl('stories.php'));
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
            await fetch(`${getApiUrl('stories.php')}?id = ${confirmModal.id} `, { method: 'DELETE' });
            fetchStories();
            setToast({ message: "Story deleted successfully", type: 'success' });
        } catch (err) {
            setToast({ message: "Failed to delete story", type: 'error' });
        }
        setConfirmModal({ isOpen: false, id: null });
    };

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        category: 'Leadership',
        excerpt: '',
        badge: ''
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
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
            if (image) {
                data.append('image', image);
            }

            const response = await fetch(getApiUrl('stories.php'), {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (result.success) {
                setToast({ message: "Story published successfully!", type: 'success' });
                setFormData({
                    title: '',
                    date: '',
                    category: 'Leadership',
                    excerpt: '',
                    badge: ''
                });
                setIsCustomCategory(false);
                setImage(null);
                const fileInput = document.getElementById('story-image') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                fetchStories();
            } else {
                setToast({ message: result.error || "Failed to publish story", type: 'error' });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "Connection error", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Impact Stories</h2>
                    <p className="text-gray-500 dark:text-gray-400">Share success stories and testimonials from the community.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Quote size={20} className="text-primary" />
                        Add New Story
                    </h3>
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
                        title="Delete Story?"
                        message="Are you sure you want to delete this story? This cannot be undone."
                        isDeleting={true}
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                    placeholder="e.g. From the Pitch to the Boardroom"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={isCustomCategory ? 'new' : formData.category}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="Leadership">Leadership</option>
                                    <option value="Education">Education</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Health">Health</option>
                                    <option value="Empowerment">Empowerment</option>
                                    <option value="new">+ Add New Category</option>
                                </select>
                                {isCustomCategory && (
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="Enter custom category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md mt-2"
                                        autoFocus
                                    />
                                )}
                            </div>        <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Impact Badge (Short Tag)</label>
                                <input
                                    type="text"
                                    name="badge"
                                    value={formData.badge}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="e.g. Community Leader"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Excerpt / Summary</label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                                placeholder="Brief description of the impact story..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    </div>
                                    <input
                                        id="story-image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                            {image && (
                                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                                    <CheckCircle size={14} /> Selected: {image.name}
                                </p>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                {loading ? 'Publishing...' : 'Publish Story'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Existing Stories */}
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <h2 className="font-bold text-gray-800 mb-4">Existing Components</h2>
                    <div className="space-y-3">
                        {items.map((item: any) => (
                            <div key={item.id} className="bg-white p-4 rounded border flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-3">
                                    {item.image_url && <img src={getApiUrl(item.image_url)} alt={item.title} className="h-10 w-10 object-cover rounded" />}
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.date} • {item.category}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => confirmDelete(item.id)}
                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Story"
                                >
                                    <i className="material-icons">delete</i>
                                </button>
                            </div>
                        ))}
                        {items.length === 0 && <p className="text-gray-500 text-sm italic">No stories found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoriesManager;
