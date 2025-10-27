export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "#0b0f17",
        surface: "#101726",
        card: "#131b2e",
        line: "rgba(255,255,255,.08)",
        brand: {
          primary: "#22d3a6",
          blue: "#60a5fa",
          pink: "#f472b6",
          yellow: "#facc15"
        }
      },
      borderRadius: { xl: "16px", "2xl": "22px" },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.25)",
        glow: "0 0 0 1px rgba(255,255,255,.06), 0 10px 50px rgba(34,211,166,.15)"
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(1200px 600px at 10% -10%, rgba(34,211,166,.25), transparent 55%), radial-gradient(1200px 600px at 90% -20%, rgba(96,165,250,.25), transparent 55%)"
      }
    }
  },
  plugins: []
};