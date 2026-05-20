'use client';

import { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials({ t }: { t: (key: string) => string }) {
    const testimonials = [
        { quote: t('testimonials.t1.quote'), name: t('testimonials.t1.name'), role: t('testimonials.t1.role') },
        { quote: t('testimonials.t2.quote'), name: t('testimonials.t2.name'), role: t('testimonials.t2.role') },
        { quote: t('testimonials.t3.quote'), name: t('testimonials.t3.name'), role: t('testimonials.t3.role') },
    ];

    const [active, setActive] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 6000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    return (
        <section className="py-20 md:py-28 bg-platinum">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12 reveal">
                    <h2 className="text-3xl md:text-4xl font-bold text-onyx font-heading mb-3">
                        {t('testimonials.title')}
                    </h2>
                    <p className="text-jet-700 text-lg">{t('testimonials.subtitle')}</p>
                </div>

                <div className="relative reveal">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-platinum-400/50 text-center min-h-[260px] flex flex-col justify-center">
                        <Quote className="w-8 h-8 text-gold/40 mx-auto mb-4" />
                        <p className="text-jet text-lg md:text-xl leading-relaxed mb-6 font-medium italic max-w-2xl mx-auto transition-opacity duration-500">
                            &ldquo;{testimonials[active].quote}&rdquo;
                        </p>
                        <div>
                            <div className="w-12 h-12 rounded-full bg-gradient-gold mx-auto mb-3 flex items-center justify-center text-onyx font-bold text-lg">
                                {testimonials[active].name.charAt(0)}
                            </div>
                            <p className="font-bold text-onyx font-heading">{testimonials[active].name}</p>
                            <p className="text-jet-700 text-sm">{testimonials[active].role}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center gap-3 mt-6">
                        <button
                            onClick={() => setActive((p) => (p - 1 + testimonials.length) % testimonials.length)}
                            className="w-10 h-10 rounded-full border border-platinum-400 flex items-center justify-center text-jet-700 hover:border-gold hover:text-gold transition-colors"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-all my-auto ${i === active ? 'bg-gold w-6' : 'bg-platinum-400'}`}
                                aria-label={`Testimonial ${i + 1}`}
                            />
                        ))}
                        <button
                            onClick={() => setActive((p) => (p + 1) % testimonials.length)}
                            className="w-10 h-10 rounded-full border border-platinum-400 flex items-center justify-center text-jet-700 hover:border-gold hover:text-gold transition-colors"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
