'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

const languages = [
    { code: 'en', name: 'English', flagPath: '/flags/gb.svg' },
    { code: 'rw', name: 'Kinyarwanda', flagPath: '/flags/rw.svg' }
];

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = pathname.split('/')[1] || 'en';
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const switchLanguage = (locale: string) => {
        const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 border border-white/10"
            >
                <div className="relative w-5 h-3.5 rounded-sm overflow-hidden shadow-sm">
                    <Image
                        src={currentLanguage.flagPath}
                        alt={currentLanguage.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="hidden sm:inline">{currentLanguage.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-platinum-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => switchLanguage(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-platinum-100 transition-colors ${currentLocale === lang.code ? 'bg-platinum-50 text-gold font-medium' : 'text-jet'
                                }`}
                        >
                            <div className="relative w-5 h-3.5 rounded-sm overflow-hidden shadow-sm">
                                <Image
                                    src={lang.flagPath}
                                    alt={lang.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
