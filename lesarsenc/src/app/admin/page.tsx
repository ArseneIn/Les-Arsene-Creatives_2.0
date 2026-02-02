"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // In production, this fetch needs to point to the actual PHP file location
            // For local dev, we might need a proxy or direct absolute URL if serving PHP separately
            // For now, let's assume relative path which works after deployment
            const res = await fetch("/api/auth.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.status === "success") {
                localStorage.setItem("cms_token", data.token);
                router.push("/admin/dashboard");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            setError("Network error. Please check your connection.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black font-space">
            <div className="bg-white dark:bg-white/5 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-white/10">
                <h1 className="text-2xl font-syne font-bold mb-6 text-center text-gray-900 dark:text-white">CMS Login</h1>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20 focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20 focus:outline-none focus:border-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider rounded-lg hover:bg-primary transition-colors hover:text-white"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
