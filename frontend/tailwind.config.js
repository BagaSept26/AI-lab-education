/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      //custom tema
      colors: {
        'brand-primary': '#4A90E2',
        'brand-secondary': '#50E3C2',
        'dark-bg': '#1a202c',
        'dark-card': '#2d3748',
        'dark-text': '#e2e8f0',
      }
    },
  },
  plugins: [],
}