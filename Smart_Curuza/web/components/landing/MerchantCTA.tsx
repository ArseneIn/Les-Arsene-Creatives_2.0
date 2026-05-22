'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function MerchantCTA() {
    return (
        <section className="relative py-20 md:py-32 bg-white overflow-hidden border-t border-platinum/40">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none"></div>
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                    
                    {/* Text Side (Left) */}
                    <div className="w-full md:w-1/2 reveal">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-6">
                            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                            <span className="text-onyx text-xs font-bold uppercase tracking-wider">Built for African Merchants</span>
                        </div>
                        
                        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black font-heading leading-[1.1] mb-8 text-onyx">
                            Run your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-saffron">entire shop</span><br />
                            from your pocket.
                        </h2>
                        
                        <p className="text-jet-600 text-lg md:text-xl mb-10 leading-relaxed font-body max-w-lg">
                            Join thousands of happy merchants taking control of their inventory, sales, and daily profits with Smart Curuza. No complex computers needed—just your smartphone.
                        </p>
                        
                        <div className="space-y-4 mb-10">
                            {[
                                "Track sales & profits in real-time",
                                "Manage inventory effortlessly",
                                "Know exactly what's making you money"
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0" />
                                    <span className="text-onyx font-bold text-lg">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Image Side (Right) */}
                    <div className="w-full md:w-1/2 relative reveal" style={{ transitionDelay: '0.2s' }}>
                        {/* Decorative Background Blob behind image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gold rounded-full opacity-10 blur-3xl -z-10 animate-pulse-gold"></div>
                        
                        {/* The Image itself */}
                        <div className="relative flex justify-center">
                            <Image 
                                src="/woman-smartcuruza.png" 
                                alt="Happy Merchant using Smart Curuza" 
                                width={800} 
                                height={1000} 
                                className="w-auto h-[500px] md:h-[700px] object-contain drop-shadow-[0_30px_30px_rgba(251,225,52,0.15)] transform hover:scale-[1.02] transition-transform duration-700"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
