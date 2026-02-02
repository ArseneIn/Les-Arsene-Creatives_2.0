import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import api from '@/lib/api';
import Modal from '@/components/Modal';

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    schoolId: string;
    role?: any; // If editing
    onSuccess: () => void;
}

const AVAILABLE_PERMISSIONS = [
    { id: 'manage_students', label: 'Manage Students' },
    { id: 'manage_teachers', label: 'Manage Teachers' },
    { id: 'manage_classes', label: 'Manage Classes' },
    { id: 'manage_finance', label: 'Manage Finance' },
    { id: 'manage_attendance', label: 'Manage Attendance' },
    { id: 'manage_library', label: 'Manage Library' },
    { id: 'manage_discipline', label: 'Manage Discipline' },
    { id: 'manage_reports', label: 'Manage Reports' },
    { id: 'system_settings', label: 'System Settings' },
];

export default function RoleModal({ isOpen, onClose, schoolId, role, onSuccess }: RoleModalProps) {
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            name: '',
            permissions: [] as string[]
        }
    });

    useEffect(() => {
        if (role) {
            setValue('name', role.name);
            setValue('permissions', role.permissions || []);
        } else {
            reset({ name: '', permissions: [] });
        }
    }, [role, setValue, reset, isOpen]);

    const onSubmit = async (data: any) => {
        try {
            if (role) {
                await api.patch(`/roles/${role.id}`, data);
            } else {
                await api.post('/roles', { ...data, schoolId });
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save role:", error);
            alert("Failed to save role");
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={role ? 'Edit Role' : 'Create New Role'}
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Role Name</label>
                    <input
                        {...register('name', { required: true })}
                        placeholder="e.g. Discipline Master"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-black/20 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Permissions</label>
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {AVAILABLE_PERMISSIONS.map((perm) => (
                            <label key={perm.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <input
                                    type="checkbox"
                                    value={perm.id}
                                    {...register('permissions')}
                                    className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{perm.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                    >
                        Save Role
                    </button>
                </div>
            </form>
        </Modal>
    );
}
