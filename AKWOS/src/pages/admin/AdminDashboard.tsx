import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-primary">AKWOS Admin Portal</h1>
                    <button
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700 font-medium"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: News */}
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <h2 className="text-lg font-semibold mb-2">Manage News</h2>
                        <p className="text-gray-600 mb-4">Add, edit, or delete news articles.</p>
                        <span className="text-primary font-medium">Go to News &rarr;</span>
                    </div>

                    {/* Card 2: Resources */}
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <h2 className="text-lg font-semibold mb-2">Manage Resources</h2>
                        <p className="text-gray-600 mb-4">Upload PDFs and reports.</p>
                        <span className="text-primary font-medium">Go to Resources &rarr;</span>
                    </div>

                    {/* Card 3: Partners */}
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <h2 className="text-lg font-semibold mb-2">Manage Partners</h2>
                        <p className="text-gray-600 mb-4">Upload partner logos.</p>
                        <span className="text-primary font-medium">Go to Partners &rarr;</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
