/** @type {import('tailwindcss').Config} */
module.exports = {
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

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseglow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)' },
        },
        textglitch: {
          '0%': { textShadow: '2px 0 #8B5CF6, -2px 0 #EC4899' },
          '25%': { textShadow: '-2px 0 #8B5CF6, 2px 0 #EC4899' },
          '50%': { textShadow: '2px 0 #EC4899, -2px 0 #8B5CF6' },
          '75%': { textShadow: '-2px 0 #EC4899, 2px 0 #8B5CF6' },
          '100%': { textShadow: '2px 0 #8B5CF6, -2px 0 #EC4899' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      },

      animation: {
        float: 'float 3s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-in-out',
        pulseglow: 'pulseglow 2s ease-in-out infinite',
        textglitch: 'textglitch 1s infinite',
        shake: 'shake 0.5s ease-in-out infinite',
      },

      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn-primary': {
          '@apply bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg transition hover:bg-primary-700': {},
        },
        '.card': {
          '@apply bg-professional-card text-professional-text p-4 rounded-xl shadow-md': {},
        },
      });
    },
  ],
};