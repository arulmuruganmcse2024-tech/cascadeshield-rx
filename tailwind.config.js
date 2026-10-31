/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          slate: '#0F172A',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          red: '#DC2626',
          amber: '#D97706',
          purple: '#7C3AED',
          emerald: '#059669',
          blue: '#2563EB',
        }
      }
    },
  },
  plugins: [],
}
