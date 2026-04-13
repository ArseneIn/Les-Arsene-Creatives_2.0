import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Modal from '@/components/Modal';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    schoolId: string;
    user?: any; // If editing
    roles: any[]; // Available custom roles
    onSuccess: () => void;
}

export default function UserModal({ isOpen, onClose, schoolId, user, roles, onSuccess }: UserModalProps) {
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '', // Optional for edit
            roleId: '', // Can be a system role ID or 'custom'
            customRoleId: '' // If roleId is 'custom', this is selected
        }
    });

    const selectedRoleId = watch('roleId');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('email', user.email);
            // Determine if it's a system role or custom role
            if (user.customRoleId) {
                setValue('roleId', 'custom');
                setValue('customRoleId', user.customRoleId);
            } else {
                setValue('roleId', user.roleId);
            }
        } else {
            reset({ name: '', email: '', password: '', roleId: '', customRoleId: '' });
        }
    }, [user, setValue, reset, isOpen]);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const payload: any = {
                name: data.name,
                email: data.email,
                schoolId
            };

            if (data.password) payload.password = data.password;

            if (data.roleId === 'custom') {
                payload.roleId = 'school_admin'; // Fallback / Base system role for custom roles
                payload.customRoleId = data.customRoleId;
            } else {
                payload.roleId = data.roleId;
                payload.customRoleId = null;
            }

            if (user) {
                await api.patch(`/users/${user.id}`, payload);
            } else {
                await api.post('/users', { ...payload, schoolId });
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save user:", error);
            alert("Failed to save user");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={user ? 'Edit User' : 'Create New User'}
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">person</span>
                        <input
                            {...register('name', { required: true })}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">mail</span>
                        <input
                            {...register('email', { required: true })}
                            type="email"
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="e.g. john@school.com"
                        />
                    </div>
                </div>

                {!user && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">lock</span>
                            <input
                                {...register('password', { required: true })}
                                type="password"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="••••••"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Role Assignment</label>
                    <select
                        {...register('roleId', { required: true })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">Select a role...</option>
                        <option value="school_admin">School Admin (Full Access)</option>
                        <option value="teacher">Teacher (Standard)</option>
                        <option value="custom">-- Custom Role --</option>
                    </select>
                </div>

                {selectedRoleId === 'custom' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Select Custom Role</label>
                        <select
                            {...register('customRoleId', { required: true })}
                            className="w-full px-4 py-2 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/10 outline-none focus:ring-2 focus:ring-purple-500/20 text-purple-700 dark:text-purple-300"
                        >
                            <option value="">Choose a custom role...</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isLoading && <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {isLoading ? 'Saving...' : 'Save User'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
