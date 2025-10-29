export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "system-ui", "sans-serif"],
        body: ["Exo 2", "system-ui", "sans-serif"],
      },
      colors: {
        neon: {
          cyan: "#00fff9",
          pink: "#ff2a6d",
          purple: "#9b5cff",
          yellow: "#fffc00",
          green: "#05ffa1",
        }
      },
      animation: {
        'flicker': 'flicker 3s infinite alternate',
        'grid-pulse': 'grid-pulse 8s ease-in-out infinite',
      }
    }
  },
  plugins: []
};
