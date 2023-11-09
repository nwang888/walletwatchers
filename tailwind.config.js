/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customColor1: '#CCDFF1',
        customColor2: '#E8F5E4',
        customColor3: '#CCE1EC'
        
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'header': ['Plus Jakarta Sans', 'sans-serif'],
      }
    }
  },
  plugins: [],
}