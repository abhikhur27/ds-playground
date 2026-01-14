/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F9F9F6', // Cream background
        ink: '#2D3748',   // Soft charcoal text
        pencil: '#A0AEC0', // Grey lines
        highlight: '#ECC94B', // Active state
        accent: '#319795', // Teal for pointers
      },
      fontFamily: {
        serif: ['"Merriweather"', 'serif'],
        mono: ['"Fira Code"', 'monospace'],
      }
    },
  },
  plugins: [],
}