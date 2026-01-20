import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminLogin = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock authentication - simple password check, case-insensitive and trimmed
        if (password.trim().toLowerCase() === "akwos2026") {
            localStorage.setItem('akwos_admin_token', 'true');
            navigate('/admin/dashboard');
        } else {
            setError("Invalid password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-display">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <img src="/images/logo-transparent.png" className="h-16 mb-4" alt="AKWOS Logo" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Portal</h1>
                    <p className="text-sm text-gray-500">Sign in to manage content</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Access Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="Enter admin password"
                        />
                        {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md"
                    >
                        Access Dashboard
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                    <a href="/" className="text-sm text-gray-400 hover:text-primary transition-colors">← Back to Website</a>
                </div>
            </div>
        </div>
    );
};
