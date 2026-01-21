import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isDeleting?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isDeleting = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-up border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 rounded-xl ${isDeleting ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-5 py-2.5 rounded-lg text-white font-bold shadow-lg transition-transform hover:scale-105 ${isDeleting
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                                : 'bg-primary hover:bg-blue-700 shadow-blue-500/30'
                            }`}
                    >
                        {isDeleting ? 'Yes, Delete' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};
