/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './docs/**/*.{vue,js,ts,jsx,tsx,md}',
    './docs/.vitepress/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a6f6',
          500: '#0c87eb',
          600: '#026bc9',
          700: '#0355a3',
          800: '#074886',
          900: '#0c3d6f',
        }
      }
    },
  },
  plugins: [],
}
