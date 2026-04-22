import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { lightTheme, darkTheme, ThemeColors } from './colors';

interface ThemeContextType {
    isDarkMode: boolean;
    colors: ThemeColors;
    toggleDarkMode: () => void;
    setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await SecureStore.getItemAsync('app_theme');
                if (storedTheme === 'dark') {
                    setIsDarkMode(true);
                }
            } catch (error) {
                console.error('Failed to load theme preference', error);
            }
        };

        loadTheme();
    }, []);

    const toggleDarkMode = async () => {
        const newValue = !isDarkMode;
        setIsDarkMode(newValue);
        try {
            await SecureStore.setItemAsync('app_theme', newValue ? 'dark' : 'light');
        } catch (error) {
            console.error('Failed to save theme preference', error);
        }
    };

    const setDarkMode = async (value: boolean) => {
        setIsDarkMode(value);
        try {
            await SecureStore.setItemAsync('app_theme', value ? 'dark' : 'light');
        } catch (error) {
            console.error('Failed to save theme preference', error);
        }
    };

    const colors = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDarkMode, colors, toggleDarkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}
