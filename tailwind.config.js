/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        needs: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
          bg: 'rgba(59, 130, 246, 0.1)',
        },
        wants: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          bg: 'rgba(245, 158, 11, 0.1)',
        },
        investing: {
          DEFAULT: '#10b981',
          light: '#34d399',
          bg: 'rgba(16, 185, 129, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
