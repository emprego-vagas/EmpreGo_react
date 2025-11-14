/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* ==========================================================
       *  CORES ORIGINAIS DO index.css — TUDO TRANSFERIDO
       * ========================================================== */
      colors: {
        primary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },

        professional: {
          dark: "#0A0A0B",
          gray: "#1A1A1D",
          card: "#242428",
          accent: "#7C3AED",
          lightaccent: "#8B5CF6",
          text: "#F8FAFC",
          subtitle: "#CBD5E1",
          subtitleText: "#abb0b5",
        },

        twitch: {
          dark: "#0E0E10",
          gray: "#18181B",
          purple: "#9146FF",
          lightpurple: "#AF78FF",
          text: "#EFEFF1",
        },

        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#141414",
          800: "#0A0A0A",
          900: "#000000",
        },

        light: {
          100: "#FFFFFF",
          200: "#F9FAFB",
          300: "#F3F4F6",
          400: "#E5E7EB",
        },
      },

      /* ==========================================================
       *  FONTES
       * ========================================================== */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },

      fontSize: {
        "2xl": "1.25rem",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },

      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.2)",
      },

      /* ==========================================================
       *  KEYFRAMES — IGUAIS AO index.css
       * ========================================================== */
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseglow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(139,92,246,.5)" },
          "50%": { boxShadow: "0 0 20px rgba(139,92,246,.8)" },
        },
        textglitch: {
          "0%": { textShadow: "2px 0 #8B5CF6, -2px 0 #EC4899" },
          "25%": { textShadow: "-2px 0 #8B5CF6, 2px 0 #EC4899" },
          "50%": { textShadow: "2px 0 #EC4899, -2px 0 #8B5CF6" },
          "75%": { textShadow: "-2px 0 #EC4899, 2px 0 #8B5CF6" },
          "100%": { textShadow: "2px 0 #8B5CF6, -2px 0 #EC4899" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
      },

      /* ==========================================================
       *  ANIMAÇÕES
       * ========================================================== */
      animation: {
        fadeIn: "fadeIn .5s ease-out",
        float: "float 6s ease-in-out infinite",
        pulseglow: "pulseglow 3s ease infinite",
        textglitch: "textglitch .5s linear infinite",
        shake: "shake .5s ease infinite",
      },
    },
  },

  /* ==========================================================
   *  COMPONENTES CUSTOMIZADOS DO index.css
   * ========================================================== */
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".btn-primary": {
          "@apply bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg transition hover:bg-primary-700":
            {},
        },
        ".card": {
          "@apply bg-professional-card text-professional-text p-4 rounded-xl shadow-md":
            {},
        },

        /* Classes utilitárias equivalentes às que estavam no index.css */
        ".fade-in": { animation: "fadeIn .5s ease-out" },
        ".float": { animation: "float 6s ease-in-out infinite" },
        ".pulse-glow": { animation: "pulseglow 3s ease infinite" },
        ".text-glitch": { animation: "textglitch .5s linear infinite" },
        ".shake": { animation: "shake .5s ease infinite" },
      });
    },
  ],
};
