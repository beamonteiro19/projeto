/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito Sans', 'sans-serif'],
      },
      colors: {
        'custom-gray': '#979797',
        'custom-black': '#000000',
      },
    },
  },
  plugins: [],
};
