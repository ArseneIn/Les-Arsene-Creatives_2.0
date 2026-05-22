import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SSOCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setSession } = useAuth(); // We need to add this to AuthContext
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError('No SSO token provided.');
            return;
        }

        const verifyToken = async () => {
            try {
                // Call backend to validate token and get session
                const response = await api.get(`/auth/sso?token=${token}`);
                const { access_token, user } = response.data;

                // Set session in AuthContext
                setSession(access_token, user);

                // Redirect based on role
                if (user.role === 'STUDENT') {
                    navigate('/');
                } else if (user.role === 'FACILITATOR') {
                    navigate('/facilitator');
                } else {
                    navigate('/unauthorized'); // Or appropriate dashboard
                }
            } catch (err: unknown) {
                console.error('SSO Login Failed', err);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const axiosError = err as any;
                setError(axiosError.response?.data?.message || 'SSO Login Failed');
            }
        };

        verifyToken();
    }, [searchParams, navigate, setSession]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-red-600 text-3xl">error</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-admin-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-900">Logging you in...</h2>
                <p className="text-gray-500">Please wait while we verify your credentials.</p>
            </div>
        </div>
    );
};

export default SSOCallback;
