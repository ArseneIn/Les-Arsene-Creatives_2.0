import { useState } from 'react';

export const Donation = () => {
    const [frequency, setFrequency] = useState<'One-time' | 'Monthly'>('One-time');
    const [amount, setAmount] = useState<string>('50');

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col">
                <div className="md:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">

                        {/* Hero Section */}
                        <div className="@container mb-8">
                            <div className="@[480px]:p-4">
                                <div
                                    className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-6 pb-12 pt-24 @[480px]:px-10 shadow-xl"
                                    style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(15, 73, 189, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBFyrQ1Jc7HSf5BWIqpJQI5YutwcNSr92vOajYgAbH2t3QiQXHrb0721FwYu2QtdprrUs9O3EMUlrbUVHgO-vFWJ1aAABxY20VfM4g4BBv3v_TfJnpxtQOnUE2MGVhaJSiEANP6jWodGoXcNJXvBBENuCyUWzM9bCgb8A-2gZvHjne714UTyfmOEpE49Y02WgQNnc_KbaXCvy_m_xfeGPD4JBqA9A5KdyLjZj7RQTMtGXlfV6NHCq7WD3iUFp3ET4x_9v_ckMfeamM")' }}
                                >
                                    <div className="flex flex-col gap-3 text-left max-w-2xl">
                                        <h1 className="text-white text-4xl font-black leading-tight tracking-tight @[480px]:text-5xl drop-shadow-md">
                                            Invest in the Future of Women and Girls
                                        </h1>
                                        <h2 className="text-white/90 text-base font-normal leading-relaxed @[480px]:text-lg max-w-xl drop-shadow-sm">
                                            Your contribution empowers young women through sports and education. Join us in creating lasting change across communities.
                                        </h2>
                                    </div>
                                    <div className="flex gap-4 flex-wrap">
                                        <button className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-secondary hover:bg-secondary/90 text-white text-base font-bold shadow-lg transition-all transform hover:scale-105">
                                            Support Our Mission
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Donation Widget Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8 mb-12">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <h2 className="text-[#0d121b] text-2xl font-bold leading-tight tracking-tight">Choose Your Impact</h2>
                                {/* Segmented Control */}
                                <div className="flex bg-slate-100 rounded-lg p-1 w-full md:w-auto">
                                    {['One-time', 'Monthly'].map((freq) => (
                                        <button
                                            key={freq}
                                            onClick={() => setFrequency(freq as 'One-time' | 'Monthly')}
                                            className={`flex-1 md:flex-none cursor-pointer flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all ${frequency === freq ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
                                                }`}
                                        >
                                            {freq}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {[
                                    { id: '25', label: 'Supporter', price: '$25', desc: 'Provides training materials for one athlete' },
                                    { id: '50', label: 'Teammate', price: '$50', desc: 'Sports equipment for one youth club', popular: true },
                                    { id: '100', label: 'Champion', price: '$100', desc: 'Funds a community leadership workshop' },
                                    { id: '500', label: 'Game Changer', price: '$500', desc: 'Sponsors a regional tournament event' },
                                ].map((tier) => (
                                    <label
                                        key={tier.id}
                                        className={`group cursor-pointer relative flex flex-col gap-4 rounded-xl border-2 p-5 transition-all ${amount === tier.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-transparent bg-slate-50 hover:border-primary/30'
                                            }`}
                                    >
                                        {tier.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full tracking-wider shadow-sm">Popular</div>
                                        )}
                                        <input
                                            type="radio"
                                            name="amount"
                                            value={tier.id}
                                            checked={amount === tier.id}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="absolute top-4 right-4 text-primary focus:ring-primary border-gray-300"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-slate-600 text-sm font-bold uppercase tracking-wide">{tier.label}</h3>
                                            <p className="text-[#0d121b] text-3xl font-black">{tier.price}</p>
                                        </div>
                                        <div className="flex gap-2 text-[13px] text-slate-600 leading-normal mt-auto">
                                            <span className="material-icons text-primary text-[18px]">check_circle</span>
                                            {tier.desc}
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Custom Amount & CTA */}
                            <div className="flex flex-col sm:flex-row gap-4 items-center border-t border-slate-100 pt-6">
                                <div className="relative w-full sm:w-1/3">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 font-bold">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Other Amount"
                                        className="block w-full pl-8 pr-12 py-3 sm:text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <button className="flex-1 w-full bg-primary hover:bg-blue-800 text-white text-lg font-bold py-3 px-8 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2">
                                    <span>Donate ${amount} Securely</span>
                                    <span className="material-icons text-[20px]">lock</span>
                                </button>
                            </div>
                        </div>

                        {/* Ways to Give */}
                        <div className="px-4 mb-12">
                            <h2 className="text-[#0d121b] text-[22px] font-bold leading-tight tracking-tight mb-6">More Ways to Give</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: 'calendar_month', title: 'Monthly Giving', desc: 'Join our "Champions Circle" to provide sustained support for year-round programs.', action: 'Learn more', actionIcon: 'arrow_forward' },
                                    { icon: 'domain', title: 'Corporate Matching', desc: 'Many companies match charitable contributions. Check if your employer will double your impact.', action: 'Search companies', actionIcon: 'search' },
                                    { icon: 'account_balance', title: 'Bank Transfer', desc: 'For large gifts, we accept direct wire transfers. Contact our finance team for details.', action: 'View instructions', actionIcon: 'description' },
                                ].map((way, idx) => (
                                    <div key={idx} className="flex flex-col gap-4 p-6 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                                        <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-2">
                                            <span className="material-icons text-3xl">{way.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-[#0d121b] mb-2">{way.title}</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed">{way.desc}</p>
                                        </div>
                                        <a href="#" className="mt-auto text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                                            {way.action} <span className="material-icons text-[16px]">{way.actionIcon}</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trust & Transparency */}
                        <div className="bg-slate-100 rounded-xl p-8 mb-12 flex flex-col items-center text-center">
                            <div className="flex items-center gap-2 mb-4 text-primary">
                                <span className="material-icons text-3xl">verified_user</span>
                                <h2 className="text-xl font-bold">100% Secure & Audited</h2>
                            </div>
                            <p className="text-slate-600 max-w-2xl mb-8">
                                AKWOS is a registered non-profit. We value transparency and accountability. All donations are processed securely and audited annually.
                            </p>
                            <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="flex items-center gap-2 font-bold text-slate-700 text-xl"><span className="material-icons">credit_card</span> VISA</div>
                                <div className="flex items-center gap-2 font-bold text-slate-700 text-xl"><span className="material-icons">payments</span> Mastercard</div>
                                <div className="flex items-center gap-2 font-bold text-slate-700 text-xl"><span className="material-icons">account_balance_wallet</span> PayPal</div>
                                <div className="flex items-center gap-2 font-bold text-slate-700 text-xl"><span className="material-icons">lock</span> Stripe</div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="px-4 mb-16 max-w-3xl mx-auto w-full">
                            <h2 className="text-[#0d121b] text-[22px] font-bold leading-tight tracking-tight mb-6 text-center">Frequently Asked Questions</h2>
                            <div className="flex flex-col gap-4">
                                {[
                                    { q: "Is my donation tax-deductible?", a: "Yes, AKWOS is a registered non-profit organization. Donations are tax-deductible to the extent allowed by law in your country of residence. You will receive an official tax receipt immediately via email." },
                                    { q: "How is my money used?", a: "We pride ourselves on efficiency. 85% of every dollar goes directly to our sports and education programs for women and girls. The remaining 15% covers essential administrative and fundraising costs to keep our mission running." },
                                    { q: "Can I donate in a currency other than USD?", a: "Yes! Our secure payment processor automatically handles currency conversion at the current exchange rate. You can donate using any major credit card from anywhere in the world." },
                                ].map((faq, idx) => (
                                    <details key={idx} className="group bg-white border border-slate-200 rounded-lg open:shadow-sm transition-all duration-300">
                                        <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-4 text-[#0d121b]">
                                            <span>{faq.q}</span>
                                            <span className="transition group-open:rotate-180">
                                                <span className="material-icons">expand_more</span>
                                            </span>
                                        </summary>
                                        <div className="text-slate-600 text-sm mt-0 p-4 pt-0 leading-relaxed border-t border-transparent group-open:border-slate-100">
                                            {faq.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
