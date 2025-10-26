export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { display: ['Poppins','ui-sans-serif','system-ui'], sans: ['Inter','ui-sans-serif','system-ui'] },
      colors: { brand: { bg:"#0c0f17", card:"#121728", primary:"#9b5cff", secondary:"#00e7f0", accent:"#ff4d6d", ring:"#7c3aed" } },
      boxShadow: { neon:"0 0 0 2px rgba(155,92,255,0.35), 0 0 30px rgba(0,231,240,0.2)", card:"0 10px 30px rgba(0,0,0,0.25)" },
      animation: { 'pulse-slow': 'pulse 3s ease-in-out infinite' },
    }
  },
  plugins: [],
};