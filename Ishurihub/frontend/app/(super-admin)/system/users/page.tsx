"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";

interface User {
    id: string;
    name: string;
    email: string;
    roleId: string;
    schoolId?: string;
    school?: {
        name: string;
    };
    createdAt: string;
}

export default function SystemUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-6">User Management</h1>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Institution</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading users...</td></tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.name}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                                            user.roleId === 'super_admin' 
                                                ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
                                                : user.roleId === 'school_admin'
                                                ? 'bg-primary/10 text-primary border-primary/20'
                                                : 'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                            {user.roleId.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            {user.school?.name ? (
                                                <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[18px] text-primary">account_balance</span>
                                                    {user.school.name}
                                                </span>
                                            ) : user.roleId === 'super_admin' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-800">
                                                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                                                    Platform (Global)
                                                </span>
                                            ) : (
                                                <span className="text-red-500 text-xs italic">Unassigned (Required)</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
