export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tahoma', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};