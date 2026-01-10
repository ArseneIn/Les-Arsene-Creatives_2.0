import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Core Color Palette
                onyx: {
                    DEFAULT: '#0b0c0c',
                    100: '#020303',
                    200: '#050505',
                    300: '#070808',
                    400: '#0a0b0b',
                    500: '#0b0c0c',
                    600: '#3b4040',
                    700: '#697272',
                    800: '#9aa2a2',
                    900: '#cdd0d0'
                },
                jet: {
                    DEFAULT: '#2a2e34',
                    100: '#08090a',
                    200: '#101214',
                    300: '#191b1f',
                    400: '#212429',
                    500: '#2a2e34',
                    600: '#4e5661',
                    700: '#747f8f',
                    800: '#a2aab5',
                    900: '#d1d4da'
                },
                platinum: {
                    DEFAULT: '#e9eaec',
                    100: '#2c2e32',
                    200: '#575c64',
                    300: '#858a95',
                    400: '#b7bac0',
                    500: '#e9eaec',
                    600: '#eeeef0',
                    700: '#f2f2f4',
                    800: '#f6f7f7',
                    900: '#fbfbfb'
                },
                gold: {
                    DEFAULT: '#fbe134',
                    100: '#3b3301',
                    200: '#766702',
                    300: '#b19a04',
                    400: '#eccd05',
                    500: '#fbe134',
                    600: '#fce65b',
                    700: '#fcec84',
                    800: '#fdf3ad',
                    900: '#fef9d6'
                },
                saffron: {
                    DEFAULT: '#e4b61a',
                    100: '#2e2405',
                    200: '#5c490a',
                    300: '#8a6d0f',
                    400: '#b89214',
                    500: '#e4b61a',
                    600: '#ebc547',
                    700: '#f0d375',
                    800: '#f5e2a3',
                    900: '#faf0d1'
                },
                // Semantic Colors (mapped to palette)
                primary: '#fbe134', // bright_gold
                secondary: '#e4b61a', // saffron
                accent: '#fbe134', // bright_gold
                success: '#10B981',
                danger: '#EF4444',
                warning: '#e4b61a', // saffron
                background: '#e9eaec', // platinum
                surface: '#fbfbfb', // platinum-900
                text: {
                    primary: '#0b0c0c', // onyx
                    secondary: '#2a2e34', // jet
                    muted: '#697272', // onyx-700
                },
            },
            fontFamily: {
                heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'], // Poppins for headings
                body: ['var(--font-montserrat)', 'system-ui', 'sans-serif'], // Montserrat for body text
                sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'], // Montserrat for UI elements
                serif: ['var(--font-playfair)', 'Georgia', 'serif'], // Playfair Display
            },
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '5%': { transform: 'rotate(-12deg)' },
                    '10%': { transform: 'rotate(12deg)' },
                    '15%': { transform: 'rotate(-12deg)' },
                    '20%': { transform: 'rotate(12deg)' },
                    '25%': { transform: 'rotate(0deg)' },
                }
            },
            animation: {
                shake: 'shake 3s ease-in-out infinite',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
