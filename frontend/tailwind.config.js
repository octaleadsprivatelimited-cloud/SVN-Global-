/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue': '#003366',
        'royal-blue-dark': '#001f3f',
        'metallic-gold': '#C9A227',
        'light-grey': '#E6E6E6',
        'dark-grey': '#333333',
      },
    },
  },
  plugins: [],
}

