/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#1E40AF', // Xanh dương đậm
        secondary: '#FBBF24', // Vàng sáng

      }
    },
  },
  plugins: [],
}

