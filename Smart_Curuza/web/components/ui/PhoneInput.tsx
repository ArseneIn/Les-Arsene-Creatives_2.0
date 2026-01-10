import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, AlertCircle } from 'lucide-react';

interface Country {
    code: string;
    dialCode: string;
    flag: React.ReactNode;
    name: string;
}

const COUNTRIES: Country[] = [
    {
        code: 'RW',
        dialCode: '+250',
        name: 'Rwanda',
        flag: (
            <svg viewBox="0 0 640 480" className="w-6 h-4">
                <g fillRule="evenodd">
                    <path fill="#00A1DE" d="M0 0h640v480H0z" />
                    <path fill="#FAD201" d="M0 240h640v240H0z" />
                    <path fill="#20603D" d="M0 360h640v120H0z" />
                    <path fill="#E0AA0F" d="M500 130l15 47h49l-40 29 15 47-40-29-39 29 15-47-40-29h49z" />
                    <circle cx="500" cy="120" r="35" fill="none" stroke="#E0AA0F" strokeWidth="3" />
                </g>
            </svg>
        )
    },
    {
        code: 'KE',
        dialCode: '+254',
        name: 'Kenya',
        flag: (
            <svg viewBox="0 0 640 480" className="w-6 h-4">
                <path fill="#000" d="M0 0h640v480H0z" />
                <path fill="#922529" d="M0 112h640v256H0z" />
                <path fill="#008C51" d="M0 336h640v144H0z" />
                <path fill="#FFF" d="M0 112h640v32H0zM0 336h640v32H0z" />
                <path fill="#BB0000" d="M320 64c-50 0-90 40-90 90v172c0 50 40 90 90 90s90-40 90-90V154c0-50-40-90-90-90z" />
                <path fill="#FFF" d="M320 64c-50 0-90 40-90 90v172c0 50 40 90 90 90s90-40 90-90V154c0-50-40-90-90-90z" fillOpacity=".3" />
            </svg>
        )
    },
    {
        code: 'UG',
        dialCode: '+256',
        name: 'Uganda',
        flag: (
            <svg viewBox="0 0 640 480" className="w-6 h-4">
                <path fill="#000" d="M0 0h640v480H0z" />
                <path fill="#FCDC04" d="M0 80h640v320H0z" />
                <path fill="#D90000" d="M0 160h640v160H0z" />
                <circle cx="320" cy="240" r="70" fill="#FFF" />
            </svg>
        )
    },
    {
        code: 'TZ',
        dialCode: '+255',
        name: 'Tanzania',
        flag: (
            <svg viewBox="0 0 640 480" className="w-6 h-4">
                <path fill="#1EB53A" d="M0 0h640v480H0z" />
                <path fill="#00A3DD" d="M0 0h640v480H0z" clipPath="polygon(0 320, 640 0, 640 480, 0 480)" />
                <path fill="#000" d="M0 360L640 40v80L0 440z" />
                <path fill="#FCD116" d="M0 360L640 40v20L0 380zM0 420l640-320v20L0 440z" />
            </svg>
        )
    },
    {
        code: 'BI',
        dialCode: '+257',
        name: 'Burundi',
        flag: (
            <svg viewBox="0 0 640 480" className="w-6 h-4">
                <path fill="#FFF" d="M0 0h640v480H0z" />
                <path fill="#CE1126" d="M0 0l640 240L0 480z" />
                <path fill="#1EB53A" d="M0 0l640 240L0 480z" transform="rotate(180 320 240)" />
                <circle cx="320" cy="240" r="80" fill="#FFF" />
            </svg>
        )
    }
];

interface PhoneInputProps {
    value: string;
    onChange: (value: string, isValid: boolean) => void;
    countryCode: string;
    onCountryChange: (code: string) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export default function PhoneInput({
    value,
    onChange,
    countryCode,
    onCountryChange,
    placeholder = "78...",
    required = false,
    className = ""
}: PhoneInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedCountry = COUNTRIES.find(c => c.dialCode === countryCode) || COUNTRIES[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const validatePhone = (phone: string, code: string) => {
        // Remove spaces and non-numeric chars
        const cleanPhone = phone.replace(/\D/g, '');

        if (!cleanPhone) {
            return { isValid: !required, error: '' };
        }

        if (code === '+250') { // Rwanda Validation
            // Must be 9 digits (excluding 0)
            if (cleanPhone.length !== 9) {
                return { isValid: false, error: 'Must be 9 digits' };
            }
            // Must start with 78 or 79 (MTN)
            if (!cleanPhone.startsWith('78') && !cleanPhone.startsWith('79')) {
                return { isValid: false, error: 'Must be MTN (78/79)' };
            }
        } else {
            // Generic validation for other countries (basic length check)
            if (cleanPhone.length < 9 || cleanPhone.length > 12) {
                return { isValid: false, error: 'Invalid length' };
            }
        }

        return { isValid: true, error: '' };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
        const validation = validatePhone(newValue, countryCode);
        setError(validation.error);
        onChange(newValue, validation.isValid);
    };

    // Re-validate when country changes
    useEffect(() => {
        const validation = validatePhone(value, countryCode);
        setError(validation.error);
        onChange(value, validation.isValid);
    }, [countryCode]);

    return (
        <div className={`relative ${className}`}>
            <div className="flex gap-2">
                {/* Country Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="h-full bg-platinum-700/50 text-jet px-3 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 font-medium flex items-center gap-2 min-w-[100px] transition-all hover:bg-platinum-700/70"
                    >
                        {selectedCountry.flag}
                        <span>{selectedCountry.dialCode}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                            {COUNTRIES.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => {
                                        onCountryChange(country.dialCode);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-platinum-100 transition-colors ${country.dialCode === countryCode ? 'bg-gold/10 text-gold-600' : 'text-jet'
                                        }`}
                                >
                                    {country.flag}
                                    <span className="flex-1 text-left font-medium">{country.name}</span>
                                    <span className="text-gray-400 text-sm">{country.dialCode}</span>
                                    {country.dialCode === countryCode && <Check className="w-4 h-4 text-gold" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Phone Input */}
                <div className="relative flex-1">
                    <input
                        type="tel"
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                        required={required}
                        className={`w-full bg-platinum-700/50 text-jet placeholder:text-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 transition-all font-medium ${error ? 'ring-2 ring-danger/50 bg-danger/5' : 'focus:ring-gold/50'
                            }`}
                    />
                    {error && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-danger animate-in fade-in">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <p className="text-xs text-danger mt-1 ml-1 font-medium">{error}</p>
            )}
        </div>
    );
}
