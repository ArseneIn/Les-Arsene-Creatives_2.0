import { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/apiConfig';
import { Upload, Plus, Loader2, CheckCircle, User } from 'lucide-react';
import { Toast } from '../../components/admin/Toast';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

const TeamManager = () => {
    const [items, setItems] = useState([]);

    // UI State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await fetch(getApiUrl('team.php'));
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
            await fetch(`${getApiUrl('team.php')}?id=${confirmModal.id}`, { method: 'DELETE' });
            fetchTeam();
            setToast({ message: "Member deleted successfully", type: 'success' });
        } catch (err) {
            setToast({ message: "Failed to delete member", type: 'error' });
        }
        setConfirmModal({ isOpen: false, id: null });
    };

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [category, setCategory] = useState('Operational'); // 'Board' or 'Operational'
    const [tags, setTags] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);


        const formData = new FormData();
        formData.append('name', name);
        formData.append('role', role);
        formData.append('category', category);
        formData.append('tags', tags);
        formData.append('bio', bio);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await fetch(getApiUrl('team.php'), {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setToast({ message: "Team member added successfully!", type: 'success' });
                // Reset form
                setName('');
                setRole('');
                setTags('');
                setBio('');
                setImage(null);
                // Reset file input visually
                const fileInput = document.getElementById('team-image') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                fetchTeam();
            } else {
                setToast({ message: data.error || "Failed to add team member", type: 'error' });
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h2>
                    <p className="text-gray-500 dark:text-gray-400">Add members to Leadership (Board) or Operational Team.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <User size={20} className="text-primary" />
                        Add New Team Member
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
                        title="Delete Member?"
                        message="Are you sure you want to delete this team member? This cannot be undone."
                        isDeleting={true}
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="Operational"
                                        checked={category === 'Operational'}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">Operational Team</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="Board"
                                        checked={category === 'Board'}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">Board of Directors</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                    placeholder="e.g. Jane Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role / Title</label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                    placeholder="e.g. Programs Officer"
                                />
                            </div>
                        </div>

                        {/* Conditional Fields based on Category */}
                        {category === 'Operational' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expertise Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="e.g. Strategic Planning, Finance"
                                />
                                <p className="text-xs text-gray-500 mt-1">These appear as small badges on the card.</p>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Biography</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[150px]"
                                    placeholder="Enter full bio..."
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Photo</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or WEBP</p>
                                    </div>
                                    <input
                                        id="team-image"
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
                                {loading ? 'Adding Member...' : 'Add Team Member'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Existing Team Members */}
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <h2 className="font-bold text-gray-800 mb-4">Existing Team Members</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item: any) => (
                            <div key={item.id} className="bg-white p-4 rounded border flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-3">
                                    {item.image_url ?
                                        <img src={getApiUrl(item.image_url)} alt={item.name} className="h-10 w-10 object-cover rounded-full" /> :
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400"><User size={20} /></div>
                                    }
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-xs text-gray-500">{item.role} • {item.category}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => confirmDelete(item.id)}
                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Member"
                                >
                                    <i className="material-icons">delete</i>
                                </button>
                            </div>
                        ))}
                        {items.length === 0 && <p className="text-gray-500 text-sm italic col-span-2">No team members found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamManager;
