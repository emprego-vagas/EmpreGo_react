/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // usa .dark para alternar tema
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // inclui todos os componentes React
  ],
  theme: {
    extend: {
      colors: {
        /* ======= PALETA BASE ======= */
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },

        /* ======= PROFESSIONAL THEME ======= */
        professional: {
          dark: 'var(--color-professional-dark)',
          gray: 'var(--color-professional-gray)',
          card: 'var(--color-professional-card)',
          accent: 'var(--color-professional-accent)',
          lightaccent: 'var(--color-professional-lightaccent)',
          text: 'var(--color-professional-text)',
          subtitle: 'var(--color-professional-subtitle)',
          subtitleText: 'var(--color-professional-subtitleText)',
        },

        /* ======= TWITCH THEME ======= */
        twitch: {
          dark: 'var(--color-twitch-dark)',
          gray: 'var(--color-twitch-gray)',
          purple: 'var(--color-twitch-purple)',
          lightpurple: 'var(--color-twitch-lightpurple)',
          text: 'var(--color-twitch-text)',
        },

        /* ======= DARK & LIGHT SHADES ======= */
        dark: {
          50: 'var(--color-dark-50)',
          100: 'var(--color-dark-100)',
          200: 'var(--color-dark-200)',
          300: 'var(--color-dark-300)',
          400: 'var(--color-dark-400)',
          500: 'var(--color-dark-500)',
          600: 'var(--color-dark-600)',
          700: 'var(--color-dark-700)',
          800: 'var(--color-dark-800)',
          900: 'var(--color-dark-900)',
        },

        light: {
          100: 'var(--color-light-100)',
          200: 'var(--color-light-200)',
          300: 'var(--color-light-300)',
          400: 'var(--color-light-400)',
        },
      },

      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },

      fontSize: {
        '2xl': 'var(--text-2xl)',
      },

      transitionDuration: {
        DEFAULT: '200ms',
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },

      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
