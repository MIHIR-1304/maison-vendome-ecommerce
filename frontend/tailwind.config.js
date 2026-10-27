/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3daeb',
          300: '#95bedc',
          400: '#609dc9',
          500: '#3a81b3',
          600: '#2a6694',
          700: '#225278',
          800: '#1e4463',
          900: '#1b3a53',
          950: '#0c1b28', // Deep navy
        },
        sand: {
          50: '#faf8f5', // Warm neutral background
          100: '#f4f0e8',
          200: '#e8dfce',
          300: '#d9c7ad',
        }
      }
    },
  },
  plugins: [],
}
