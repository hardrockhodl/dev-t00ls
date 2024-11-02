/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yankees: '#22303F',
        platinum: '#E7E8E7',
        skyblue: '#8FBFDA',
        bdazzled: '#2C6485',
        bdazzledlight: '#3d7ea3',
        charcoal: '#394A56',
        thundra: '#f8fafc'
      },
    },
  },
  plugins: [],
};