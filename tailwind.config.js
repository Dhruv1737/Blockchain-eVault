/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070B14",
          900: "#0B1120",
          850: "#0F172A",
          800: "#131C31",
          700: "#1E293B",
          600: "#334155",
        },
        gold: {
          300: "#FDE047",
          400: "#FACC15",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        authentic: {
          50: "#ECFDF5",
          500: "#10B981",
          600: "#059669",
          900: "#064E3B",
        },
        tampered: {
          50: "#FEF2F2",
          500: "#EF4444",
          600: "#DC2626",
          900: "#7F1D1D",
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
};
