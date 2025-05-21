/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class' ,
  content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],

  theme: {
  extend: {
    colors: {
      primary: '#1e293b', // slate-800
      secondary: '#334155', // slate-700
    },
  },
},

  plugins: [],
}

