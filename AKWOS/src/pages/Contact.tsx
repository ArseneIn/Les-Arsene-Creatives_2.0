import { useState } from 'react';
import { getApiUrl } from '../utils/assets';

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        organization: '',
        email: '',
        inquiry_type: 'General Inquiry',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const response = await fetch(getApiUrl('contact.php'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
                setFormData({
                    name: '',
                    organization: '',
                    email: '',
                    inquiry_type: 'General Inquiry',
                    message: ''
                });
            } else {
                setStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Connection error. Please check your internet.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-16 bg-background-light dark:bg-background-dark text-gray-900 dark:text-white">
            {/* Hero & Contact Section */}
            <div className="px-6 md:px-10 lg:px-20 py-12 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">

                    {/* Section 1: Office Details (Left) */}
                    <div className="flex-1 flex flex-col gap-8">
                        <div className="space-y-4">
                            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">Contact Us</span>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">Connect with <span className="text-primary">AKWOS</span></h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-lg">
                                We are here to answer your questions and explore partnerships to empower women in sports. Reach out to our team in Kigali.
                            </p>
                        </div>

                        {/* Details Grid/List */}
                        <div className="grid gap-6 mt-4">
                            {/* Headquarters */}
                            <div className="flex items-start gap-4 p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-primary">
                                    <span className="material-icons text-2xl">location_on</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Headquarters</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        KG 11 Ave, Remera Sector<br />
                                        Gasabo District, Kigali<br />
                                        Rwanda
                                    </p>
                                </div>
                            </div>

                            {/* Email Contacts */}
                            <div className="flex items-start gap-4 p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-primary">
                                    <span className="material-icons text-2xl">mail</span>
                                </div>
                                <div className="w-full">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Email Us</h3>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">General</p>
                                            <a href="mailto:info@akwos.org" className="text-sm font-medium text-primary hover:underline">info@akwos.org</a>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Partnerships</p>
                                            <a href="mailto:partners@akwos.org" className="text-sm font-medium text-primary hover:underline">partners@akwos.org</a>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Programs</p>
                                            <a href="mailto:programs@akwos.org" className="text-sm font-medium text-primary hover:underline">programs@akwos.org</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Contact Form (Right) */}
                    <div className="flex-1 lg:max-w-[540px]">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send a Secure Message</h2>
                                    <span className="material-icons text-slate-300 dark:text-slate-600 text-3xl">lock</span>
                                </div>

                                {status.message && (
                                    <div className={`fixed top-24 right-6 z-50 p-4 rounded-lg shadow-2xl border animate-in slide-in-from-right duration-300 max-w-sm ${status.type === 'success' ? 'bg-white border-green-200 text-green-800' : 'bg-white border-red-200 text-red-800'}`}>
                                        <div className="flex items-start gap-3">
                                            <span className="material-icons text-xl mt-0.5">{status.type === 'success' ? 'check_circle' : 'error'}</span>
                                            <div>
                                                <h4 className="font-bold text-sm mb-1">{status.type === 'success' ? 'Success' : 'Error'}</h4>
                                                <p className="text-sm leading-relaxed opacity-90">{status.message}</p>
                                            </div>
                                            <button onClick={() => setStatus({ type: null, message: '' })} className="text-slate-400 hover:text-slate-600">
                                                <span className="material-icons text-lg">close</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <label className="block">
                                            <span className="text-sm font-medium text-gray-900 dark:text-slate-200 mb-1.5 block">Full Name</span>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Jane Doe"
                                                className="w-full h-12 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium text-gray-900 dark:text-slate-200 mb-1.5 block">Organization</span>
                                            <input
                                                type="text"
                                                name="organization"
                                                value={formData.organization}
                                                onChange={handleChange}
                                                placeholder="Org Name"
                                                className="w-full h-12 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                                            />
                                        </label>
                                    </div>

                                    <label className="block">
                                        <span className="text-sm font-medium text-gray-900 dark:text-slate-200 mb-1.5 block">Email Address</span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="jane@example.com"
                                            className="w-full h-12 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-medium text-gray-900 dark:text-slate-200 mb-1.5 block">Reason for Inquiry</span>
                                        <div className="relative">
                                            <select
                                                name="inquiry_type"
                                                value={formData.inquiry_type}
                                                onChange={handleChange}
                                                className="w-full h-12 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                            >
                                                <option>General Inquiry</option>
                                                <option>Partnership Opportunity</option>
                                                <option>Program Information</option>
                                                <option>Press & Media</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                                <span className="material-icons text-xl">expand_more</span>
                                            </div>
                                        </div>
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-medium text-gray-900 dark:text-slate-200 mb-1.5 block">Subject / Message</span>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            placeholder="How can we help you?"
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-slate-400"
                                        ></textarea>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full h-12 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? (
                                            <span>Sending...</span>
                                        ) : (
                                            <>
                                                <span className="material-icons text-[20px]">lock</span>
                                                Send Secure Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Beneficiary Safety Box */}
                            <div className="bg-gray-900 dark:bg-black/40 border-t border-gray-800 p-5">
                                <div className="flex gap-4">
                                    <div className="shrink-0 p-2 bg-green-500/20 rounded-lg h-fit">
                                        <span className="material-icons text-green-500">encrypted</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white text-sm font-bold mb-1">Beneficiary Safety is Our Priority</h4>
                                        <p className="text-slate-400 text-xs leading-relaxed">
                                            All communications through this portal are encrypted. We handle beneficiary reports with strict confidentiality and in accordance with international protection standards.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="mt-8 relative w-full h-[450px] bg-slate-200 dark:bg-slate-800 overflow-hidden group">
                {/* Map Placeholder Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCX61cENyZRLOlV4Sl55js7nZ0iseyC-ZsHIqTFb--6NXYvW9-T5WCFXZGcn1EjJr2uwc-pxsUckcJY_9z8AhK2alS5MjfDUt0OS-_sfwqeL1bCN51E7A4zXdmbthlINqP2n4Do_kECFRx8J2h87x9UY-9gcx1wkkkcJyy9Z0qLvI4oiJI2DOq7hO5Fk7EGfHvcYrmrKFRsUKAX8rnZ6_1GfJMTjbOtA-aS-4c-IIr8OaOl-r16O9fZE0Kp6EnJn1CcXUgwzFactyk')" }}
                ></div>

                {/* Map Overlay UI */}
                <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>

                {/* Location Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center drop-shadow-2xl">
                    <div className="relative">
                        <div className="size-16 bg-primary rounded-full flex items-center justify-center text-white shadow-xl animate-bounce">
                            <span className="material-icons text-4xl">location_on</span>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm"></div>
                    </div>
                    <div className="mt-4 bg-white dark:bg-gray-800 py-2 px-4 rounded-lg shadow-lg text-center border border-gray-100 dark:border-gray-700">
                        <p className="font-bold text-brand-dark dark:text-white text-sm">AKWOS HQ</p>
                        <p className="text-xs text-slate-500">Kigali, Rwanda</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
