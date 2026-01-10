/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
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
        // Semantic Colors
        primary: '#fbe134',
        secondary: '#e4b61a',
        accent: '#fbe134',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#e4b61a',
        background: '#e9eaec',
        surface: '#fbfbfb',
        text: {
          primary: '#0b0c0c',
          secondary: '#2a2e34',
          muted: '#697272',
        },
      },
      fontFamily: {
        heading: ['Poppins_600SemiBold', 'Poppins_700Bold'],
        body: ['Montserrat_400Regular', 'Montserrat_500Medium'],
      },
    },
  },
  plugins: [],
}
