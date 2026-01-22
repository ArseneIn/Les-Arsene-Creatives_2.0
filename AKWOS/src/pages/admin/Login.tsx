import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../utils/assets';

export const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(getApiUrl('auth.php'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('akwos_admin_token', data.token); // Keep token name consistent with Layout
                navigate('/admin/dashboard');
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Connection error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={() => console.log("Login container clicked")}
            className="relative z-[9999] min-h-screen flex items-center justify-center bg-gray-100 font-display pointer-events-auto"
        >
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200 relative z-[10000]">
                <div className="flex flex-col items-center mb-8">
                    <img src={`${import.meta.env.BASE_URL}images/logo-transparent.png`} className="h-16 mb-4" alt="AKWOS Logo" />
                    <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                    <p className="text-sm text-gray-500">Sign in to manage content</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all mb-4"
                            placeholder="Enter username"
                        />

                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="Enter password"
                        />
                        {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Signing in...' : 'Access Dashboard'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <a href="/" className="text-sm text-gray-400 hover:text-primary transition-colors">← Back to Website</a>
                </div>
            </div>
        </div>
    );
};
