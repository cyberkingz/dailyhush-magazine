/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Neon Lime (Primary)
        brand: {
          DEFAULT: '#C5F82A', // lime-500
          50: '#FAFFD9',
          100: '#F4FFB3',
          200: '#EAFF8C',
          300: '#DFFF66',
          400: '#D5FF40',
          500: '#C5F82A',
          600: '#A8D622',
          700: '#8BB51C',
          800: '#6E9416',
          900: '#517310',
        },
        // Primary alias to lime
        primary: {
          DEFAULT: '#C5F82A',
          50: '#FAFFD9',
          100: '#F4FFB3',
          200: '#EAFF8C',
          300: '#DFFF66',
          400: '#D5FF40',
          500: '#C5F82A',
          600: '#A8D622',
          700: '#8BB51C',
          800: '#6E9416',
          900: '#517310',
        },
        // Emerald - Secondary (Supporting)
        emerald: {
          DEFAULT: '#059669',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Sage - Secondary/Accent colors
        sage: {
          DEFAULT: '#8bb4a1',
          100: '#e8f0ed',
          200: '#d1e1da',
          300: '#b9d2c7',
          400: '#a2c3b4',
          500: '#8bb4a1',
          600: '#6d9280',
          700: '#527060',
          800: '#364d40',
          900: '#1b2620',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
