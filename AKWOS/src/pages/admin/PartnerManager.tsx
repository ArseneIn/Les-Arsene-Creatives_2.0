import { useState, useEffect } from 'react';
import { initialPartners, PartnerItem } from '../../data/partners';

export const PartnerManager = () => {
    const [partners, setPartners] = useState<PartnerItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PartnerItem | null>(null);

    // Load partners from localStorage or mock data
    useEffect(() => {
        const stored = localStorage.getItem('akwos_partners');
        if (stored) {
            setPartners(JSON.parse(stored));
        } else {
            setPartners(initialPartners);
        }
    }, []);

    // Save to localStorage whenever partners change
    const savePartners = (newPartners: PartnerItem[]) => {
        setPartners(newPartners);
        localStorage.setItem('akwos_partners', JSON.stringify(newPartners));
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this partner?')) {
            const updated = partners.filter(p => p.id !== id);
            savePartners(updated);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const newItem: PartnerItem = {
            id: editingItem ? editingItem.id : Date.now().toString(),
            name: formData.get('name') as string,
            logo: formData.get('logo') as string || "/images/placeholder-logo.png",
            category: formData.get('category') as any,
            website: formData.get('website') as string
        };

        let updatedPartners;
        if (editingItem) {
            updatedPartners = partners.map(p => p.id === newItem.id ? newItem : p);
        } else {
            updatedPartners = [newItem, ...partners];
        }

        savePartners(updatedPartners);
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const openEdit = (item: PartnerItem) => {
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
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Partner Manager</h1>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add Partner
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wide">
                            <th className="p-4 font-semibold">Logo</th>
                            <th className="p-4 font-semibold">Partner Name</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {partners.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="p-4">
                                    <div className="h-10 w-24 flex items-center justify-start">
                                        <img src={item.logo} alt={item.name} className="h-full w-auto object-contain" />
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                                <td className="p-4">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium 
                                        ${item.category === 'Government' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300' :
                                            item.category === 'NGO' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300' :
                                                'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300'}`}>
                                        {item.category || "General"}
                                    </span>
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
            </div>

            {/* Edit/Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {editingItem ? 'Edit Partner' : 'Add New Partner'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization Name</label>
                                <input
                                    name="name"
                                    defaultValue={editingItem?.name}
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                    <select
                                        name="category"
                                        defaultValue={editingItem?.category || "NGO"}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    >
                                        <option>Government</option>
                                        <option>NGO</option>
                                        <option>Foundation</option>
                                        <option>Corporate</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website (Optional)</label>
                                    <input
                                        name="website"
                                        defaultValue={editingItem?.website}
                                        placeholder="https://"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo URL / Path</label>
                                <div className="flex gap-2">
                                    <input
                                        name="logo"
                                        defaultValue={editingItem?.logo}
                                        required
                                        placeholder="/images/partners/logo.png"
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Recommended height: 100px (PNG/SVG transparent)</p>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-700 text-white font-bold shadow-md transition-colors"
                                >
                                    Save Partner
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
