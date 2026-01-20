import { useState, useEffect } from 'react';
import { initialResources, ResourceItem } from '../../data/resources';

export const ResourceManager = () => {
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);

    // Load resources from localStorage or mock data
    useEffect(() => {
        const stored = localStorage.getItem('akwos_resources');
        if (stored) {
            setResources(JSON.parse(stored));
        } else {
            setResources(initialResources);
        }
    }, []);

    // Save to localStorage whenever resources change
    const saveResources = (newResources: ResourceItem[]) => {
        setResources(newResources);
        localStorage.setItem('akwos_resources', JSON.stringify(newResources));
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            const updated = resources.filter(r => r.id !== id);
            saveResources(updated);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const newItem: ResourceItem = {
            id: editingItem ? editingItem.id : Date.now().toString(),
            title: formData.get('title') as string,
            year: formData.get('year') as string,
            type: formData.get('type') as any,
            size: formData.get('size') as string || "Unknown",
            ext: "PDF", // Default for now
            color: "text-red-500",
            downloadUrl: formData.get('downloadUrl') as string,
            // Simple logic for gradients based on type for UI consistency
            gradient: "bg-gradient-to-r from-blue-900 to-blue-600"
        };

        let updatedResources;
        if (editingItem) {
            updatedResources = resources.map(r => r.id === newItem.id ? newItem : r);
        } else {
            updatedResources = [newItem, ...resources];
        }

        saveResources(updatedResources);
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const openEdit = (item: ResourceItem) => {
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
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Resource Manager</h1>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add Resource
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wide">
                            <th className="p-4 font-semibold">Title</th>
                            <th className="p-4 font-semibold">Type</th>
                            <th className="p-4 font-semibold">Year</th>
                            <th className="p-4 font-semibold">File Path</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {resources.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="p-4">
                                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                                </td>
                                <td className="p-4">
                                    <span className="inline-block px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs rounded font-medium">
                                        {item.type}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">{item.year}</td>
                                <td className="p-4 text-sm text-gray-400 font-mono text-xs truncate max-w-[200px]" title={item.downloadUrl}>
                                    {item.downloadUrl}
                                </td>
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

                {resources.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No resources found. Add one to get started.
                    </div>
                )}
            </div>

            {/* Edit/Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {editingItem ? 'Edit Resource' : 'Add New Resource'}
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <select
                                        name="type"
                                        defaultValue={editingItem?.type || "Research"}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option>Annual Report</option>
                                        <option>Strategic Plan</option>
                                        <option>Policy Brief</option>
                                        <option>Research</option>
                                        <option>Conference Report</option>
                                        <option>Training Report</option>
                                        <option>Newsletter</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                                    <input
                                        name="year"
                                        defaultValue={editingItem?.year || new Date().getFullYear().toString()}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size (e.g. 2.4 MB)</label>
                                    <input
                                        name="size"
                                        defaultValue={editingItem?.size}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File Path</label>
                                    <input
                                        name="downloadUrl"
                                        placeholder="/documents/filename.pdf"
                                        defaultValue={editingItem?.downloadUrl}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
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
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
