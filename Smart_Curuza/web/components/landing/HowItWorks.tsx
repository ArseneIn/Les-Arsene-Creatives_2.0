'use client';

import { Store, Package, UserCheck } from 'lucide-react';

export default function HowItWorks({ t }: { t: (key: string) => string }) {
    const steps = [
        { icon: <Store className="w-7 h-7" />, title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
        { icon: <Package className="w-7 h-7" />, title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
        { icon: <UserCheck className="w-7 h-7" />, title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
    ];

    return (
        <section id="how-it-works" className="py-20 md:py-28 bg-platinum-900">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16 reveal">
                    <h2 className="text-3xl md:text-4xl font-bold text-onyx font-heading mb-3">
                        {t('howItWorks.title')}
                    </h2>
                    <p className="text-jet-700 text-lg max-w-xl mx-auto">{t('howItWorks.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
                    {/* Connector line (desktop) */}
                    <div className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-gold/20 via-gold to-gold/20" />

                    {steps.map((step, i) => (
                        <div key={i} className="relative text-center reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                            {/* Step number circle */}
                            <div className="w-14 h-14 rounded-full bg-gradient-gold mx-auto flex items-center justify-center text-onyx font-bold text-lg shadow-gold relative z-10">
                                {i + 1}
                            </div>

                            {/* Icon */}
                            <div className="mt-6 mb-4 flex justify-center text-jet-700">
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-bold text-onyx font-heading mb-2">{step.title}</h3>
                            <p className="text-jet-700 leading-relaxed text-sm max-w-xs mx-auto">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
