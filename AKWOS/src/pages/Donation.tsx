import { useState } from 'react';

export const Donation = () => {
    const [step, setStep] = useState<'amount' | 'details'>('amount');
    const [frequency, setFrequency] = useState<'One-time' | 'Monthly'>('One-time');
    const [amount, setAmount] = useState<string>('50');
    const [paymentMethod, setPaymentMethod] = useState<'Card' | 'PayPal'>('Card');

    // Form state can be expanded as needed, simple stricture for now
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: 'Rwanda',
        mobile: ''
    });

    const handleAmountSubmit = () => {
        // Validation could go here
        setStep('details');
        // Scroll to top of widget
        document.getElementById('donation-widget')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col">
                <div className="md:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">

                        {/* Hero Section - Keep consistent but maybe condense if in details step? keeping same for now */}
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
                                        <button
                                            onClick={() => {
                                                setStep('amount');
                                                document.getElementById('donation-widget')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-secondary hover:bg-secondary/90 text-white text-base font-bold shadow-lg transition-all transform hover:scale-105"
                                        >
                                            Support Our Mission
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Donation Widget Section */}
                        <div id="donation-widget" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8 mb-12 scroll-mt-24">

                            {step === 'amount' ? (
                                <>
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
                                                value={amount}
                                                className="block w-full pl-8 pr-12 py-3 sm:text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={handleAmountSubmit}
                                            className="flex-1 w-full bg-primary hover:bg-blue-800 text-white text-lg font-bold py-3 px-8 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span>Donate ${amount} Securely</span>
                                            <span className="material-icons text-[20px]">lock</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* Step 2: Details & Payment */
                                <div className="animate-fade-in">
                                    <div className="mb-8 pb-6 border-b border-slate-100">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-xl md:text-2xl font-bold text-[#0d121b]">
                                                    You're making a {frequency.toLowerCase()} donation of US ${amount}
                                                </h2>
                                                <button
                                                    onClick={() => setStep('amount')}
                                                    className="text-sm text-primary font-semibold hover:underline mt-2 flex items-center gap-1"
                                                >
                                                    <span className="material-icons text-[16px]">edit</span> Change amount
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#0d121b] mb-4">Personal Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">First name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Please enter a first name"
                                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Last name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Please enter a last name"
                                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="Please enter your email address"
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Country</label>
                                                    <select
                                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                                                        value={formData.country}
                                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                    >
                                                        <option>Rwanda</option>
                                                        <option>United States</option>
                                                        <option>United Kingdom</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile</label>
                                                    <div className="flex rounded-lg shadow-sm">
                                                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm font-medium">
                                                            +250
                                                        </span>
                                                        <input
                                                            type="tel"
                                                            className="flex-1 block w-full rounded-none rounded-r-lg border-gray-300 focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                                                            value={formData.mobile}
                                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            You confirm that you're over 18 and agree to receive emails from Organization of Women in Sports about our work and how you can help. If you provide your phone number, we may also call you. You can opt out anytime. See our privacy policy for details.
                                        </p>

                                        <div className="pt-2">
                                            <h3 className="text-lg font-bold text-[#0d121b] mb-4">Choose a payment method</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => setPaymentMethod('Card')}
                                                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl gap-2 transition-all ${paymentMethod === 'Card'
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                                        }`}
                                                >
                                                    <span className="material-icons text-3xl">credit_card</span>
                                                    <span className="font-bold">Card</span>
                                                </button>
                                                <button
                                                    onClick={() => setPaymentMethod('PayPal')}
                                                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl gap-2 transition-all ${paymentMethod === 'PayPal'
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                                        }`}
                                                >
                                                    <span className="material-icons text-3xl">account_balance_wallet</span>
                                                    <span className="font-bold">PayPal</span>
                                                </button>
                                            </div>

                                            {/* Payment Details Sections */}
                                            {paymentMethod === 'Card' && (
                                                <div className="mt-6 p-6 border border-slate-200 rounded-xl bg-slate-50">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="font-bold text-[#0d121b]">Card payment method details</h4>
                                                        <div className="flex gap-2">
                                                            {/* Simple CSS-only card indicators or using SVGs/Images. Using text/icons for now as placeholders if no assets available, but making them look like badges */}
                                                            <div className="h-6 px-2 bg-white border border-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-600 font-sans tracking-tighter">VISA</div>
                                                            <div className="h-6 px-2 bg-white border border-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-600 font-sans tracking-tighter">MC</div>
                                                            <div className="h-6 px-2 bg-white border border-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-600 font-sans tracking-tighter">AMEX</div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Card number</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    placeholder="0000 0000 0000 0000"
                                                                    className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                                                                />
                                                                <span className="material-icons absolute left-3 top-2.5 text-gray-400">credit_card</span>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Expiration date</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="MM / YY"
                                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Security code</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="000"
                                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 flex gap-3 text-xs text-slate-500 bg-white p-4 rounded-lg border border-slate-100">
                                                        <span className="material-icons text-green-600 text-lg shrink-0">lock</span>
                                                        <div>
                                                            <span className="font-bold text-slate-700 block mb-1">Security</span>
                                                            All information exchanged during card donations is TLS-encrypted. This data can neither be detected, intercepted nor used by third parties. Information is also not stored in our data systems.
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {paymentMethod === 'PayPal' && (
                                                <div className="mt-6 p-6 border border-slate-200 rounded-xl bg-slate-50 text-center">
                                                    <h4 className="font-bold text-[#0d121b] mb-2">PayPal payment method details</h4>
                                                    <p className="text-slate-600 text-sm">
                                                        Once you have completed and submitted this form, you will be redirected to PayPal to complete your donation
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-4 pt-4 mt-8 border-t border-slate-100">
                                            <button
                                                onClick={() => setStep('amount')}
                                                className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button className="flex-1 bg-primary hover:bg-blue-800 text-white text-lg font-bold py-3 px-8 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2">
                                                <span>Donate ${amount} Now</span>
                                                <span className="material-icons text-[20px]">volunteer_activism</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
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
