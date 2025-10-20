/****** Tailwind Config ******/
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0b0f1a',
          primary: '#6EF3A5',
          secondary: '#6EC6F3',
          accent: '#F36EE9'
        }
      },
      boxShadow: {
        glow: '0 0 24px rgba(110, 243, 165, 0.35)'
      }
    },
  },
  plugins: [],
}
