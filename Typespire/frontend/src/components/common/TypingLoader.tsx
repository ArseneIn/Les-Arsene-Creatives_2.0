import React, { useState, useEffect } from 'react';

const TypingLoader: React.FC = () => {
    const [text, setText] = useState('');
    const fullText = "TYPESPIRE";
    const [isDeleting, setIsDeleting] = useState(false);
    
    useEffect(() => {
        let timer: NodeJS.Timeout;
        
        if (!isDeleting && text.length < fullText.length) {
            // Type
            timer = setTimeout(() => {
                setText(fullText.substring(0, text.length + 1));
            }, 150);
        } else if (!isDeleting && text.length === fullText.length) {
            // Pause at end
            timer = setTimeout(() => {
                setIsDeleting(true);
            }, 1500);
        } else if (isDeleting && text.length > 0) {
            // Delete
            timer = setTimeout(() => {
                setText(fullText.substring(0, text.length - 1));
            }, 50);
        } else if (isDeleting && text.length === 0) {
            // Pause before restart
            timer = setTimeout(() => {
                setIsDeleting(false);
            }, 500);
        }
        
        return () => clearTimeout(timer);
    }, [text, isDeleting]);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-50 dark:bg-background-dark">
            <div className="flex flex-col items-center gap-8">
                
                {/* Keyboard keys animation */}
                <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-card-dark border-2 border-slate-200 dark:border-[#323b67] shadow-sm flex items-center justify-center key-btn key-delay-0">
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_rgba(9,74,113,0.6)]"></div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-card-dark border-2 border-slate-200 dark:border-[#323b67] shadow-sm flex items-center justify-center key-btn key-delay-1">
                        <div className="w-3 h-3 rounded-full bg-[#33B974] shadow-[0_0_12px_rgba(51,185,116,0.6)]"></div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-card-dark border-2 border-slate-200 dark:border-[#323b67] shadow-sm flex items-center justify-center key-btn key-delay-2">
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_rgba(9,74,113,0.6)]"></div>
                    </div>
                </div>

                {/* Typing text */}
                <div className="flex items-center h-8 px-4 py-2 bg-white/50 dark:bg-[#323b67]/30 rounded-lg border border-slate-200 dark:border-[#323b67]/50 backdrop-blur-sm">
                    <span className="text-slate-800 dark:text-white font-heading text-xl font-black tracking-[0.2em] min-w-[140px]">
                        {text}
                    </span>
                    <span className="w-3 h-6 ml-1 bg-[#33B974] animate-[blink_1s_infinite]"></span>
                </div>
            </div>
        </div>
    );
};

export default TypingLoader;
