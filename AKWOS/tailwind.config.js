/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Home Page Colors
                primary: "#0B4A8F",
                secondary: "#D4AF37",
                "background-light": "#FFFFFF",
                "background-dark": "#111827",
                "surface-light": "#F3F4F6",
                "surface-dark": "#1F2937",
                "text-light": "#1F2937",
                "text-dark": "#F3F4F6",

                // Impact Page Colors (Merged where possible, kept distinct where specific)
                "impact-primary": "#135bec",
                "impact-primary-dark": "#0e46b5",
                "accent-gold": "#D4AF37", // Duplicate of secondary, can reuse
                "text-primary-light": "#0d121b",
                "text-secondary-light": "#4c669a",
                "text-primary-dark": "#f8f9fc",
                "text-secondary-dark": "#9aaebb",
            },
            fontFamily: {
                display: ["Montserrat", "Inter", "sans-serif"],
                body: ["Open Sans", "sans-serif"],
            },
            animation: {
                'scroll': 'scroll 40s linear infinite',
            },
            keyframes: {
                scroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                }
            }
        },
    },
    plugins: [],
}
