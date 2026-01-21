import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border transition-all duration-300 animate-slide-up ${type === 'success'
                ? 'bg-white border-green-100 text-green-800'
                : 'bg-white border-red-100 text-red-800'
            }`}>
            {type === 'success' ? (
                <CheckCircle className="text-green-500" size={24} />
            ) : (
                <AlertCircle className="text-red-500" size={24} />
            )}

            <p className="font-medium pr-4">{message}</p>

            <button
                onClick={onClose}
                className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${type === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}
            >
                <X size={16} />
            </button>
        </div>
    );
};
