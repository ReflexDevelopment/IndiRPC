/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#7257ff',
        success: '#23d05a',
      },
      opacity: {
        '3': '0.03',
        '8': '0.08',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
