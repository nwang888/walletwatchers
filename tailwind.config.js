/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: '#0B0B14',
        subtext: '#525252',
        background: '#F3F2F8',
        primary: '#434072',
        secondary: '#C3B692',
        accent: '#779D58',
        accent2: '#AAAAAA',
        danger: '#ff4d4d',

        'primary-light': '#bfbeda',
        'secondary-light': '#dbd3bd',
        'accent-light': '#cbdabe',

        'primary-hover': "#6f6cac",
        
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'header': ['Plus Jakarta Sans', 'sans-serif'],
      }
    }
  },
  plugins: [],
}