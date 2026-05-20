'use client';

import { WifiOff, Smartphone, RefreshCw, Languages, TrendingUp, UsersRound } from 'lucide-react';

export default function Benefits({ t }: { t: (key: string) => string }) {
    const items = [
        { icon: <WifiOff className="w-5 h-5" />, title: t('benefits.offline.title'), desc: t('benefits.offline.desc') },
        { icon: <Smartphone className="w-5 h-5" />, title: t('benefits.mobile.title'), desc: t('benefits.mobile.desc') },
        { icon: <RefreshCw className="w-5 h-5" />, title: t('benefits.sync.title'), desc: t('benefits.sync.desc') },
        { icon: <Languages className="w-5 h-5" />, title: t('benefits.language.title'), desc: t('benefits.language.desc') },
        { icon: <TrendingUp className="w-5 h-5" />, title: t('benefits.analytics.title'), desc: t('benefits.analytics.desc') },
        { icon: <UsersRound className="w-5 h-5" />, title: t('benefits.team.title'), desc: t('benefits.team.desc') },
    ];

    return (
        <section id="benefits" className="py-20 md:py-28 bg-platinum-900">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16 reveal">
                    <h2 className="text-3xl md:text-4xl font-bold text-onyx font-heading mb-3">
                        {t('benefits.title')}
                    </h2>
                    <p className="text-jet-700 text-lg max-w-xl mx-auto">{t('benefits.subtitle')}</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="group flex gap-4 p-5 rounded-2xl bg-white border border-platinum-400/50 hover:border-gold/40 hover:shadow-gold transition-all duration-300 reveal"
                            style={{ transitionDelay: `${i * 0.08}s` }}
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-saffron group-hover:bg-gradient-gold group-hover:text-onyx transition-all">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-onyx font-heading text-sm mb-1">{item.title}</h3>
                                <p className="text-jet-700 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
