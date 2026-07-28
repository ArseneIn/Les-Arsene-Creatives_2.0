import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { translations } from './translations';

export type Language = 'rw' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (key: string, param?: string | number) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('rw'); // Default to Kinyarwanda

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const storedLang = await SecureStore.getItemAsync('app_language');
                if (storedLang === 'rw' || storedLang === 'en') {
                    setLanguageState(storedLang as Language);
                }
            } catch (error) {
                console.error('Failed to load language preference', error);
            }
        };

        loadLanguage();
    }, []);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        try {
            await SecureStore.setItemAsync('app_language', lang);
        } catch (error) {
            console.error('Failed to save language preference', error);
        }
    };

    /**
     * Translate key using active language. Fall back to 'rw' if translation is missing.
     * Supports replacing '{0}' with an optional parameter.
     */
    const t = (key: string, param?: string | number): string => {
        // Attempt translation in selected language
        let value = (translations[language] as any)?.[key];
        
        // Fall back to default language ('rw') if key is missing
        if (value === undefined) {
            value = (translations['rw'] as any)?.[key];
        }
        
        // Return key name if not found in dictionary
        if (value === undefined) {
            return key;
        }

        // Support parameter replacement (e.g., relative times: "{0}m ago" -> "5m ago")
        if (param !== undefined) {
            return value.replace('{0}', String(param));
        }

        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}
