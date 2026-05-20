'use client';

import { ShoppingCart, BarChart3, Users, Shield } from 'lucide-react';
import Image from 'next/image';

export default function Features({ t }: { t: (key: string) => string }) {
    const features = [
        {
            icon: <ShoppingCart className="w-6 h-6" />,
            title: t('features.pos.title'),
            desc: t('features.pos.desc'),
            color: 'from-gold to-saffron',
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: t('features.inventory.title'),
            desc: t('features.inventory.desc'),
            color: 'from-saffron to-gold',
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: t('features.crm.title'),
            desc: t('features.crm.desc'),
            color: 'from-gold to-saffron',
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: t('features.security.title'),
            desc: t('features.security.desc'),
            color: 'from-saffron to-gold',
        },
    ];

    return (
        <section id="features" className="py-20 md:py-28 bg-platinum">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16 reveal">
                    <h2 className="text-3xl md:text-4xl font-bold text-onyx font-heading mb-3">
                        {t('features.title')}
                    </h2>
                    <p className="text-jet-700 text-lg max-w-xl mx-auto">{t('features.subtitle')}</p>
                </div>

                {/* Feature cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {features.map((feat, i) => (
                        <div
                            key={i}
                            className="group bg-white rounded-2xl p-7 border border-platinum-400/50 hover:shadow-gold transition-all duration-300 hover:-translate-y-1 reveal-scale"
                            style={{ transitionDelay: `${i * 0.1}s` }}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-onyx mb-5 group-hover:scale-110 transition-transform`}>
                                {feat.icon}
                            </div>
                            <h3 className="text-lg font-bold text-onyx font-heading mb-2">{feat.title}</h3>
                            <p className="text-jet-700 text-sm leading-relaxed">{feat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Mockup showcase */}
                <div className="reveal">
                    <div className="relative bg-gradient-to-br from-jet to-onyx rounded-3xl p-8 md:p-12 overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-saffron rounded-full blur-3xl" />
                        </div>

                        <div className="relative grid md:grid-cols-2 gap-8 items-center">
                            {/* Web dashboard mockup */}
                            <div className="reveal-left">
                                <div className="rounded-xl overflow-hidden shadow-2xl border border-jet-600/30">
                                    <Image
                                        src="/mockups/web-dashboard.png"
                                        alt={t('mockup.webAlt')}
                                        width={800}
                                        height={500}
                                        className="w-full h-auto"
                                    />
                                </div>
                                <p className="text-platinum-700 text-xs text-center mt-3">Web Dashboard</p>
                            </div>

                            {/* Mobile mockups */}
                            <div className="flex gap-4 justify-center items-end reveal-right">
                                <div className="w-36 md:w-44 rounded-2xl overflow-hidden shadow-2xl border border-jet-600/30 animate-float">
                                    <Image
                                        src="/mockups/mobile-pos.png"
                                        alt={t('mockup.mobileAlt')}
                                        width={400}
                                        height={800}
                                        className="w-full h-auto"
                                    />
                                </div>
                                <div className="w-32 md:w-40 rounded-2xl overflow-hidden shadow-2xl border border-jet-600/30 animate-float-slow">
                                    <Image
                                        src="/mockups/mobile-crm.png"
                                        alt={t('mockup.crmAlt')}
                                        width={400}
                                        height={800}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
