import { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/assets';
import { Loader2, Trash2, Mail, CheckCircle, Search, RefreshCw } from 'lucide-react';
import { Toast } from '../../components/admin/Toast';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

interface Message {
    id: number;
    name: string;
    organization: string;
    email: string;
    inquiry_type: string;
    message: string;
    is_read: number;
    created_at: string;
}

const MessageManager = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('messages.php'));
            const data = await response.json();
            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
            setToast({ message: "Failed to load messages", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const response = await fetch(getApiUrl('messages.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id: deleteId })
            });
            const data = await response.json();
            if (data.success) {
                setMessages(messages.filter(m => m.id !== deleteId));
                setToast({ message: "Message deleted successfully", type: 'success' });
            } else {
                setToast({ message: "Failed to delete message", type: 'error' });
            }
        } catch (error) {
            setToast({ message: "Error deleting message", type: 'error' });
        } finally {
            setDeleteId(null);
        }
    };

    const handleMarkRead = async (id: number) => {
        try {
            const response = await fetch(getApiUrl('messages.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'mark_read', id })
            });
            const data = await response.json();
            if (data.success) {
                setMessages(messages.map(m => m.id === id ? { ...m, is_read: 1 } : m));
                setToast({ message: "Marked as read", type: 'success' });
            }
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.inquiry_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
                    <p className="text-slate-500 dark:text-slate-400">View and manage contact form inquiries.</p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by name, email or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filteredMessages.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No messages found</h3>
                    <p className="text-slate-500">Your inbox is empty.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-5 rounded-xl border transition-all ${msg.is_read
                                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 shadow-sm'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{msg.name}</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                                            {msg.inquiry_type}
                                        </span>
                                        {!msg.is_read && (
                                            <span className="px-2 py-0.5 rounded-full bg-primary text-xs font-bold text-white">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        <a href={`mailto:${msg.email}`} className="hover:text-primary hover:underline flex items-center gap-1">
                                            <Mail className="w-4 h-4" /> {msg.email}
                                        </a>
                                        {msg.organization && (
                                            <span className="flex items-center gap-1">
                                                • {msg.organization}
                                            </span>
                                        )}
                                        <span className="text-xs opacity-70">
                                            {new Date(msg.created_at).toLocaleDateString()} at {new Date(msg.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap leading-relaxed">
                                        {msg.message}
                                    </p>
                                </div>
                                <div className="flex md:flex-col gap-2 shrink-0">
                                    {!msg.is_read && (
                                        <button
                                            onClick={() => handleMarkRead(msg.id)}
                                            className="p-2 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2 md:justify-end"
                                            title="Mark as Read"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="md:hidden text-sm font-medium">Mark Read</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setDeleteId(msg.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2 md:justify-end"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        <span className="md:hidden text-sm font-medium">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <ConfirmModal
                isOpen={!!deleteId}
                title="Delete Message"
                message="Are you sure you want to delete this message? This action cannot be undone."
                onConfirm={handleDelete}
                onClose={() => setDeleteId(null)}
                isDeleting={true}
            />
        </div>
    );
};

export default MessageManager;
