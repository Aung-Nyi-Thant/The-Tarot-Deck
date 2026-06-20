/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#05030A",
        velvet: "#171025",
        wine: "#3A1231",
        champagne: "#E6C687",
        pearl: "#F7EBD2",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        champagne: "0 0 0 1px rgba(230,198,135,.28), 0 18px 55px rgba(230,198,135,.12)",
        velvet: "0 28px 80px rgba(0,0,0,.56)",
      },
    },
  },
  plugins: [],
};
