import { useState, useEffect } from 'react';
import { initialNews, NewsItem } from '../../data/news';

export const NewsManager = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

    // Load news from localStorage or mock data
    useEffect(() => {
        const stored = localStorage.getItem('akwos_news');
        if (stored) {
            setNews(JSON.parse(stored));
        } else {
            setNews(initialNews);
        }
    }, []);

    // Save to localStorage whenever news change
    const saveNews = (newNews: NewsItem[]) => {
        setNews(newNews);
        localStorage.setItem('akwos_news', JSON.stringify(newNews));
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this news item?')) {
            const updated = news.filter(n => n.id !== id);
            saveNews(updated);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const newItem: NewsItem = {
            id: editingItem ? editingItem.id : Date.now().toString(),
            title: formData.get('title') as string,
            date: formData.get('date') as string,
            category: formData.get('category') as any,
            image: formData.get('image') as string || "/images/placeholder.jpg",
            tag: formData.get('tag') as string,
            desc: formData.get('desc') as string
        };

        let updatedNews;
        if (editingItem) {
            updatedNews = news.map(n => n.id === newItem.id ? newItem : n);
        } else {
            updatedNews = [newItem, ...news];
        }

        saveNews(updatedNews);
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const openEdit = (item: NewsItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const openNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">News Manager</h1>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
                >
                    <span className="material-symbols-outlined">add</span>
                    Post News
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wide">
                            <th className="p-4 font-semibold">Title</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Tag</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {news.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="p-4">
                                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.desc}</p>
                                </td>
                                <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{item.date}</td>
                                <td className="p-4">
                                    <span className="inline-block px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 text-xs rounded font-medium">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">{item.tag}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit/Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {editingItem ? 'Edit News Item' : 'New News Post'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input
                                    name="title"
                                    defaultValue={editingItem?.title}
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                    <input
                                        name="date"
                                        defaultValue={editingItem?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                    <select
                                        name="category"
                                        defaultValue={editingItem?.category || "Press Release"}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option>Press Release</option>
                                        <option>Publications</option>
                                        <option>Feature</option>
                                        <option>Announcement</option>
                                        <option>The New Times</option>
                                        <option>General</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tag (Small Label)</label>
                                    <input
                                        name="tag"
                                        defaultValue={editingItem?.tag || "Update"}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                    <input
                                        name="image"
                                        placeholder="https://..."
                                        defaultValue={editingItem?.image}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    name="desc"
                                    rows={4}
                                    defaultValue={editingItem?.desc}
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-700 text-white font-bold shadow-md"
                                >
                                    Save Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
