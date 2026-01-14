import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
            <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">You do not have permission to view this page.</p>
            <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
                Go Back
            </button>
        </div>
    );
};

export default Unauthorized;
