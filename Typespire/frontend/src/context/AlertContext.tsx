import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertState {
    show: boolean;
    message: string;
    title: string;
    type: AlertType;
}

interface AlertContextProps {
    showAlert: (message: string, title?: string, type?: AlertType) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alertState, setAlertState] = useState<AlertState>({
        show: false,
        message: '',
        title: '',
        type: 'info'
    });

    const okButtonRef = useRef<HTMLButtonElement>(null);

    const showAlert = (message: string, title?: string, type?: AlertType) => {
        let finalType: AlertType = type || 'info';
        let finalTitle = title || '';

        if (!type) {
            // Intelligent semantic deduction from message content
            const lower = message.toLowerCase();
            if (
                lower.includes('fail') || 
                lower.includes('error') || 
                lower.includes('cannot') || 
                lower.includes('invalid') || 
                lower.includes('no students') ||
                lower.includes('not quite') ||
                lower.includes('please check')
            ) {
                finalType = 'error';
                if (!title) finalTitle = 'Action Required';
            } else if (
                lower.includes('success') || 
                lower.includes('saved') || 
                lower.includes('reset') || 
                lower.includes('invited') || 
                lower.includes('processed') ||
                lower.includes('updated')
            ) {
                finalType = 'success';
                if (!title) finalTitle = 'Action Successful';
            } else if (
                lower.includes('warning') || 
                lower.includes('attention') || 
                lower.includes('caution') ||
                lower.includes('alert')
            ) {
                finalType = 'warning';
                if (!title) finalTitle = 'System Warning';
            } else {
                finalType = 'info';
                if (!title) finalTitle = 'Notification';
            }
        }

        setAlertState({
            show: true,
            message,
            title: finalTitle,
            type: finalType
        });
    };

    const hideAlert = () => {
        setAlertState(prev => ({ ...prev, show: false }));
    };

    // Global override for native window.alert
    useEffect(() => {
        const nativeAlert = window.alert;
        window.alert = (message: string) => {
            showAlert(message);
        };

        return () => {
            window.alert = nativeAlert;
        };
    }, []);

    // Focus management & keyboard listeners
    useEffect(() => {
        if (alertState.show) {
            // Focus OK button for rapid Enter dismissal
            setTimeout(() => {
                okButtonRef.current?.focus();
            }, 50);

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape' || e.key === 'Enter') {
                    e.preventDefault();
                    hideAlert();
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [alertState.show]);

    // Theme details based on type
    const getTypeStyles = () => {
        switch (alertState.type) {
            case 'success':
                return {
                    icon: 'check_circle',
                    iconColor: 'text-[#33B974] bg-[#33B974]/10 dark:bg-[#33B974]/15',
                    buttonBg: 'bg-[#33B974] hover:bg-[#33B974]/90 shadow-[#33B974]/20',
                    border: 'border-emerald-500/20 dark:border-emerald-500/10'
                };
            case 'error':
                return {
                    icon: 'cancel',
                    iconColor: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/15',
                    buttonBg: 'bg-rose-500 hover:bg-rose-500/90 shadow-rose-500/20',
                    border: 'border-rose-500/20 dark:border-rose-500/10'
                };
            case 'warning':
                return {
                    icon: 'warning',
                    iconColor: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/15',
                    buttonBg: 'bg-amber-500 hover:bg-amber-500/90 shadow-amber-500/20',
                    border: 'border-amber-500/20 dark:border-amber-500/10'
                };
            case 'info':
            default:
                return {
                    icon: 'info',
                    iconColor: 'text-[#094A71] bg-[#094A71]/10 dark:bg-[#094A71]/15 dark:text-blue-400',
                    buttonBg: 'bg-[#094A71] hover:bg-[#094A71]/90 shadow-[#094A71]/20',
                    border: 'border-slate-200 dark:border-slate-800'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            
            {/* Custom Alert Overlay Card */}
            {alertState.show && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#061824]/75 dark:bg-[#06141f]/85 backdrop-blur-[4px] p-4 animate-in fade-in duration-200">
                    <div 
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="alert-title"
                        aria-describedby="alert-message"
                        className={`bg-white dark:bg-[#0b1e2d] border ${styles.border} p-8 rounded-[24px] shadow-2xl max-w-sm w-full text-center relative overflow-hidden transition-all duration-300 animate-in zoom-in-95 duration-200 flex flex-col items-center`}
                    >
                        {/* Decorative Premium Glow */}
                        <div className={`absolute top-0 inset-x-0 h-1.5 ${alertState.type === 'success' ? 'bg-[#33B974]' : alertState.type === 'error' ? 'bg-rose-500' : alertState.type === 'warning' ? 'bg-amber-500' : 'bg-[#094A71]'}`} />

                        {/* Theme Icon */}
                        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full mb-4.5 ${styles.iconColor}`}>
                            <span className="material-symbols-outlined text-3xl font-black">{styles.icon}</span>
                        </div>

                        {/* Title */}
                        <h2 
                            id="alert-title" 
                            className="text-lg font-black text-slate-900 dark:text-white leading-tight font-heading mt-2 uppercase tracking-wide"
                        >
                            {alertState.title}
                        </h2>

                        {/* Message content */}
                        <p 
                            id="alert-message" 
                            className="text-xs text-slate-500 dark:text-[#929bc9] leading-relaxed mt-3.5 px-1 font-semibold"
                        >
                            {alertState.message}
                        </p>

                        {/* Styled Close Button */}
                        <button
                            ref={okButtonRef}
                            onClick={hideAlert}
                            className={`w-full text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover-scale active-scale mt-7 font-heading ${styles.buttonBg}`}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
};
