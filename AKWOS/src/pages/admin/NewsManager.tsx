import React, { useState } from 'react';
import { getApiUrl } from '../../utils/apiConfig';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewsManager = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        category: 'General',
        tag: 'News',
        description: ''
    });
    const [image, setImage] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
                setSuccess('News article added successfully!');
                setFormData({
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    category: 'General',
                    tag: 'News',
                    description: ''
                });
                setImage(null);
            } else {
                setError(result.error || 'Failed to add news.');
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
                    <h1 className="text-xl font-bold text-gray-800">Add News Article</h1>
                </div>

                <div className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
                    {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">{success}</div>}

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
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option>General</option>
                                    <option>Press Release</option>
                                    <option>Publications</option>
                                    <option>Feature</option>
                                    <option>Announcement</option>
                                    <option>The New Times</option>
                                </select>
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
            </div>
        </div>
    );
};

export default NewsManager;
