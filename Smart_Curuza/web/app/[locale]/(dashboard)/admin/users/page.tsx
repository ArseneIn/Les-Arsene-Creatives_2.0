'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/data-table/PageHeader';
import { FilterBar } from '@/components/ui/data-table/FilterBar';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { User, Shield, Mail, Calendar, Edit2, Trash2, X, Check, Ban } from 'lucide-react';

interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: 'Superadmin' | 'Support' | 'Auditor';
    status: 'Active' | 'Inactive';
    lastLogin: string;
}

// Mock Data
const MOCK_USERS: SystemUser[] = [
    { id: 'USR-001', name: 'Admin User', email: 'admin@smartcuruza.com', role: 'Superadmin', status: 'Active', lastLogin: 'Just now' },
    { id: 'USR-002', name: 'Support Team', email: 'support@smartcuruza.com', role: 'Support', status: 'Active', lastLogin: '2 hours ago' },
    { id: 'USR-003', name: 'John Doe', email: 'john@smartcuruza.com', role: 'Auditor', status: 'Inactive', lastLogin: '1 week ago' },
];

export default function UsersPage() {
    const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS);
    const [search, setSearch] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Support',
        password: '', // Only for new users
        status: 'Active'
    });

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());

        const matchesRole = activeFilters.role ? u.role === activeFilters.role : true;
        const matchesStatus = activeFilters.status ? u.status === activeFilters.status : true;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const filterGroups = [
        {
            id: 'role',
            label: 'Role',
            options: [
                { label: 'Superadmin', value: 'Superadmin' },
                { label: 'Support', value: 'Support' },
                { label: 'Auditor', value: 'Auditor' },
            ],
        },
        {
            id: 'status',
            label: 'Status',
            options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
            ],
        },
    ];

    const handleOpenAdd = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'Support', password: '', status: 'Active' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: SystemUser) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
            status: user.status
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            // Update existing user
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } as SystemUser : u));
        } else {
            // Add new user
            const newUser: SystemUser = {
                id: `USR-${Date.now()}`,
                name: formData.name,
                email: formData.email,
                role: formData.role as any,
                status: formData.status as any,
                lastLogin: 'Never'
            };
            setUsers([...users, newUser]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const toggleStatus = (id: string) => {
        setUsers(users.map(u => {
            if (u.id === id) {
                return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' };
            }
            return u;
        }));
    };

    const columns = [
        {
            header: 'User',
            accessorKey: 'name' as keyof SystemUser,
            cell: (item: SystemUser) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                        {item.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-jet">{item.name}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                            <Mail className="h-3 w-3 mr-1" />
                            {item.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Role',
            accessorKey: 'role' as keyof SystemUser,
            cell: (item: SystemUser) => (
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gold" />
                    <span className="text-sm text-jet">{item.role}</span>
                </div>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status' as keyof SystemUser,
            cell: (item: SystemUser) => (
                <button
                    onClick={() => toggleStatus(item.id)}
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${item.status === 'Active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                >
                    {item.status === 'Active' ? <Check className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                    {item.status}
                </button>
            ),
        },
        {
            header: 'Last Login',
            accessorKey: 'lastLogin' as keyof SystemUser,
            cell: (item: SystemUser) => (
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1.5" />
                    {item.lastLogin}
                </div>
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'id' as keyof SystemUser,
            cell: (item: SystemUser) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <PageHeader
                title="System Users"
                actionLabel="Add User"
                onAdd={handleOpenAdd}
            />

            <FilterBar
                onSearch={setSearch}
                filterGroups={filterGroups}
                activeFilters={activeFilters}
                onFilterChange={(groupId, value) => setActiveFilters(prev => ({ ...prev, [groupId]: value }))}
                onClearFilter={(groupId) => setActiveFilters(prev => {
                    const next = { ...prev };
                    delete next[groupId];
                    return next;
                })}
            />

            <DataTable
                data={filteredUsers}
                columns={columns}
            />

            {/* Add/Edit User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-jet font-heading">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-jet mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                    placeholder="e.g. Jane Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-jet mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                    placeholder="user@smartcuruza.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-jet mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                >
                                    <option value="Superadmin">Superadmin</option>
                                    <option value="Support">Support</option>
                                    <option value="Auditor">Auditor</option>
                                </select>
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-jet mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gold text-onyx rounded-lg font-bold hover:bg-gold/90"
                                >
                                    {editingUser ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
