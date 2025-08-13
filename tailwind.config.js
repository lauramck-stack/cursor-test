/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark-green': '#1B3A29',
        'brand-light-green': '#77AA89',
        'brand-light-blue': '#CBE3E1',
        'brand-yellow': '#F5C143',
      }
    },
  },
  plugins: [],
}
