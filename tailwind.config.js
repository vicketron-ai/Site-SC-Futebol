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
          green: '#1a472a',
          dark: '#111827',
          gold: '#d4af37',
        }
      }
    },
  },
  plugins: [],
}
