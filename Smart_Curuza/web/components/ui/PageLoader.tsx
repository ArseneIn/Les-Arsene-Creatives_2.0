'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageLoader({ isManual = false }: { isManual?: boolean }) {
    const pathname = usePathname();
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<'hidden' | 'entering' | 'loading' | 'leaving'>(isManual ? 'entering' : 'hidden');
    const prevPath = useRef(pathname);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isManual && pathname === prevPath.current) return;
        prevPath.current = pathname;

        // Clear previous
        if (timerRef.current) clearTimeout(timerRef.current);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        setProgress(0);
        setPhase('entering');

        // Short delay for enter animation, then start progress
        timerRef.current = setTimeout(() => {
            setPhase('loading');

            let current = 0;
            const tick = () => {
                current += (82 - current) * 0.06 + 0.4;
                if (current >= 80) current = 80;
                setProgress(current);
                if (current < 80) rafRef.current = requestAnimationFrame(tick);
            };
            rafRef.current = requestAnimationFrame(tick);

            // Complete after page settles
            timerRef.current = setTimeout(() => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                setProgress(100);
                timerRef.current = setTimeout(() => {
                    setPhase('leaving');
                    timerRef.current = setTimeout(() => setPhase('hidden'), 400);
                }, 300);
            }, 550);
        }, 80);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [pathname, isManual]);

    if (phase === 'hidden') return null;

    const isVisible = phase === 'entering' || phase === 'loading';

    return (
        <>
            {/* Full-screen frosted glass overlay */}
            <div
                className="fixed inset-0 z-[9998] pointer-events-all"
                style={{
                    backdropFilter: isVisible ? 'blur(12px) saturate(0.7)' : 'blur(0px) saturate(1)',
                    WebkitBackdropFilter: isVisible ? 'blur(12px) saturate(0.7)' : 'blur(0px) saturate(1)',
                    background: isVisible ? 'rgba(248,249,250,0.55)' : 'rgba(248,249,250,0)',
                    transition: 'backdrop-filter 0.35s ease, -webkit-backdrop-filter 0.35s ease, background 0.35s ease',
                }}
            />

            {/* Centered loader card */}
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
            >
                <div
                    className="flex flex-col items-center gap-5 px-10 py-8 rounded-3xl shadow-2xl border"
                    style={{
                        background: 'rgba(255,255,255,0.72)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        borderColor: 'rgba(251,225,52,0.25)',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(251,225,52,0.15)',
                        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(16px)',
                        opacity: isVisible ? 1 : 0,
                        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
                    }}
                >
                    {/* Logo mark */}
                    <div className="relative w-14 h-14">
                        {/* Outer spinning ring */}
                        <div
                            className="absolute inset-0 rounded-full border-[3px] border-transparent"
                            style={{
                                borderTopColor: '#fbe134',
                                borderRightColor: 'rgba(251,225,52,0.35)',
                                animation: 'loaderSpin 0.9s linear infinite',
                            }}
                        />
                        {/* Inner counter-spin ring */}
                        <div
                            className="absolute inset-[6px] rounded-full border-[2px] border-transparent"
                            style={{
                                borderBottomColor: '#e4b61a',
                                borderLeftColor: 'rgba(228,182,26,0.3)',
                                animation: 'loaderSpin 1.3s linear infinite reverse',
                            }}
                        />
                        {/* Center glow dot */}
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    background: 'radial-gradient(circle, #fbe134, #e4b61a)',
                                    boxShadow: '0 0 10px rgba(251,225,52,0.8)',
                                    animation: 'glow 1.5s ease-in-out infinite alternate',
                                }}
                            />
                        </div>
                    </div>

                    {/* Brand name */}
                    <div className="flex flex-col items-center gap-1">
                        <span
                            className="text-base font-bold tracking-wide"
                            style={{
                                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2e34 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Smart-Curuza
                        </span>
                        <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">
                            Loading
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-40 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #fbe134 0%, #e4b61a 50%, #fbe134 100%)',
                                backgroundSize: '200% 100%',
                                animation: phase === 'loading' ? 'shimmer 1.5s linear infinite' : 'none',
                                boxShadow: '0 0 6px rgba(251,225,52,0.6)',
                                transition: progress === 100
                                    ? 'width 0.3s ease-out'
                                    : 'width 0.08s linear',
                            }}
                        />
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes loaderSpin {
                    to { transform: rotate(360deg); }
                }
                @keyframes glow {
                    from { box-shadow: 0 0 6px rgba(251,225,52,0.5); transform: scale(0.9); }
                    to   { box-shadow: 0 0 16px rgba(251,225,52,1); transform: scale(1.1); }
                }
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </>
    );
}
