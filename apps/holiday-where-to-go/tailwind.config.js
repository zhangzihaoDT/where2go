/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zh: {
          blue: "#174A7C",
          "deep-blue": "#06213D",
          cyan: "#7ECDEB",
          "light-blue": "#DDEFF8",
          cream: "#FFF9EF",
          gold: "#D79A36",
          brown: "#7A4A24",
          text: "#1F2D3D",
          muted: "#6B7C8F",
          card: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
}
