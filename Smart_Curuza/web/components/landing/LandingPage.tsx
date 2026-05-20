'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Store, Globe, ArrowRight } from 'lucide-react';
import { useScrollReveal } from './useScrollReveal';
import StatsBar from './StatsBar';
import HowItWorks from './HowItWorks';
import Features from './Features';
import Benefits from './Benefits';
import Testimonials from './Testimonials';
import { useEffect } from 'react';

export default function LandingPage({ t, locale }: { t: (key: string) => string; locale: string }) {
    const router = useRouter();
    const pathname = usePathname();
    useScrollReveal();

    // Add/remove landing-page class on body
    useEffect(() => {
        document.body.classList.add('landing-page');
        return () => { document.body.classList.remove('landing-page'); };
    }, []);

    const currentLocale = locale || pathname.split('/')[1] || 'en';
    const toggleLanguage = () => {
        const newLocale = currentLocale === 'en' ? 'rw' : 'en';
        router.push(`/${newLocale}`);
    };
    const goTo = (path: string) => router.push(`/${currentLocale}${path}`);

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* ===== NAVBAR ===== */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-onyx/90 backdrop-blur-lg border-b border-jet-600/30">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-gold flex items-center justify-center">
                            <Store className="w-5 h-5 text-onyx" />
                        </div>
                        <span className="text-shimmer-gold text-lg font-bold font-heading">Smart-Curuza</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#features" className="text-platinum-700 hover:text-gold transition-colors">{t('nav.features')}</a>
                        <a href="#how-it-works" className="text-platinum-700 hover:text-gold transition-colors">{t('nav.howItWorks')}</a>
                        <a href="#benefits" className="text-platinum-700 hover:text-gold transition-colors">{t('nav.benefits')}</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={toggleLanguage} className="text-platinum-700 hover:text-gold transition-colors p-2" aria-label="Switch language">
                            <Globe className="w-4 h-4" />
                        </button>
                        <button onClick={() => goTo('/login')} className="text-sm font-medium text-platinum-800 hover:text-gold transition-colors hidden sm:block">
                            {t('nav.login')}
                        </button>
                        <button
                            onClick={() => goTo('/register')}
                            className="bg-gradient-gold text-onyx text-sm font-bold px-5 py-2 rounded-full hover:shadow-gold transition-all hover:scale-105"
                        >
                            {t('nav.getStarted')}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-onyx via-jet to-onyx bg-gradient-shift overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-saffron/5 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold/5 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/5 rounded-full" />
                </div>

                <div className="relative max-w-6xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-8 reveal">
                        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                        <span className="text-gold/80 text-xs font-medium tracking-wide">{t('hero.badge')}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading leading-tight mb-6 reveal" style={{ transitionDelay: '0.1s' }}>
                        <span className="text-platinum-900">{t('hero.headline1')}</span><br />
                        <span className="text-shimmer-gold">{t('hero.headline2')}</span><br />
                        <span className="text-platinum-900">{t('hero.headline3')}</span>
                    </h1>

                    {/* Tagline */}
                    <p className="text-platinum-700 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed reveal" style={{ transitionDelay: '0.2s' }}>
                        {t('hero.description')}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center reveal" style={{ transitionDelay: '0.3s' }}>
                        <button
                            onClick={() => goTo('/register')}
                            className="group bg-gradient-gold text-onyx font-bold px-8 py-4 rounded-2xl shadow-gold hover:shadow-lg transition-all hover:scale-105 animate-pulse-gold flex items-center justify-center gap-2"
                        >
                            {t('hero.cta')}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a
                            href="#how-it-works"
                            className="border-2 border-gold/40 text-gold font-bold px-8 py-4 rounded-2xl hover:bg-gold/10 transition-all flex items-center justify-center"
                        >
                            {t('hero.ctaSecondary')}
                        </a>
                    </div>
                </div>
            </section>

            {/* ===== STATS ===== */}
            <StatsBar t={t} />

            {/* ===== HOW IT WORKS ===== */}
            <HowItWorks t={t} />

            {/* ===== FEATURES + MOCKUPS ===== */}
            <Features t={t} />

            {/* ===== BENEFITS ===== */}
            <Benefits t={t} />

            {/* ===== TESTIMONIALS ===== */}
            <Testimonials t={t} />

            {/* ===== BOTTOM CTA ===== */}
            <section className="py-20 md:py-28 bg-gradient-to-br from-jet via-onyx to-jet relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-saffron/5 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-3xl mx-auto px-6 text-center reveal">
                    <h2 className="text-3xl md:text-4xl font-bold text-platinum-900 font-heading mb-4">
                        {t('cta.title')}
                    </h2>
                    <p className="text-platinum-700 text-lg mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
                    <button
                        onClick={() => goTo('/register')}
                        className="group bg-gradient-gold text-onyx font-bold px-10 py-4 rounded-2xl shadow-gold hover:shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2"
                    >
                        {t('cta.button')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-platinum-700/60 text-sm mt-4">{t('cta.note')}</p>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="bg-onyx py-12 border-t border-jet-600/30">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-10 mb-10">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                                    <Store className="w-4 h-4 text-onyx" />
                                </div>
                                <span className="text-gold font-bold font-heading">Smart-Curuza</span>
                            </div>
                            <p className="text-platinum-700/60 text-sm">{t('footer.tagline')}</p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="text-platinum-800 font-bold text-sm mb-3 font-heading">{t('footer.product')}</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#features" className="text-platinum-700/60 hover:text-gold transition-colors">{t('nav.features')}</a></li>
                                <li><a href="#how-it-works" className="text-platinum-700/60 hover:text-gold transition-colors">{t('nav.howItWorks')}</a></li>
                                <li><a href="#benefits" className="text-platinum-700/60 hover:text-gold transition-colors">{t('nav.benefits')}</a></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-platinum-800 font-bold text-sm mb-3 font-heading">{t('footer.company')}</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-platinum-700/60 hover:text-gold transition-colors">{t('footer.about')}</a></li>
                                <li><a href="#" className="text-platinum-700/60 hover:text-gold transition-colors">{t('footer.contact')}</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-platinum-800 font-bold text-sm mb-3 font-heading">{t('footer.support')}</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-platinum-700/60 hover:text-gold transition-colors">{t('footer.helpCenter')}</a></li>
                                <li><a href="#" className="text-platinum-700/60 hover:text-gold transition-colors">{t('footer.terms')}</a></li>
                                <li><a href="#" className="text-platinum-700/60 hover:text-gold transition-colors">{t('footer.privacy')}</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-jet-600/30 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-platinum-700/40 text-xs">© {new Date().getFullYear()} Smart-Curuza. {t('footer.rights')}</p>
                        <button onClick={toggleLanguage} className="flex items-center gap-2 text-platinum-700/40 hover:text-gold text-xs transition-colors">
                            <Globe className="w-3 h-3" />
                            {currentLocale === 'en' ? 'Kinyarwanda' : 'English'}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
