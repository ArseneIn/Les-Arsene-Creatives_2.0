"use client";

import { useAuthContext } from "@/context/AuthContext";
import { mockUsers } from "@/data/users";

export default function RoleSwitcher() {
    const { user, login } = useAuthContext();

    if (!user) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-white dark:bg-[#1e2536] p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Switch Role (Demo)</p>
            <div className="flex flex-col gap-2">
                {mockUsers.map((u) => (
                    <button
                        key={u.id}
                        onClick={() => login(u.id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${user.id === u.id
                                ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                                : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                            }`}
                    >
                        <div
                            className={`size-6 rounded-full bg-cover bg-center border ${user.id === u.id ? 'border-white/50' : 'border-gray-200 dark:border-gray-600'}`}
                            style={{ backgroundImage: `url('${u.avatarUrl}')` }}
                        ></div>
                        <div className="text-left">
                            <p className="leading-none">{u.name}</p>
                            <p className={`text-[10px] ${user.id === u.id ? 'text-white/80' : 'text-gray-400'}`}>
                                {u.roleId.replace('_', ' ').toUpperCase()}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
