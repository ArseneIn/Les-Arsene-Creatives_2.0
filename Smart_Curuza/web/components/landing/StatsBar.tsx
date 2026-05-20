'use client';

import { useEffect, useRef, useState } from 'react';

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = performance.now();
                    const animate = (now: number) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}

export default function StatsBar({ t }: { t: (key: string) => string }) {
    const stats = [
        { value: 500, suffix: '+', label: t('stats.merchants') },
        { value: 10000, suffix: '+', label: t('stats.transactions') },
        { value: 3, suffix: '', label: t('stats.countries') },
        { value: 99, suffix: '%', label: t('stats.uptime') },
    ];

    return (
        <section className="relative py-12 bg-jet">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center reveal reveal-delay-1" style={{ transitionDelay: `${i * 0.1}s` }}>
                            <div className="text-3xl md:text-4xl font-bold text-gold font-heading">
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-platinum-700 text-sm mt-1 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
