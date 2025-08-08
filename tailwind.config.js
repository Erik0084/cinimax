/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: "#171725",
        soft: "#252836",
        blue_accent: "#ddcc8e",
        green: "#22B07D",
        orange: "#FF8700",
        red: "#FB4141",
        black: "#171725",
        dark_gray: "#696974",
        grey: "#92929D",
        white_grey: "#EBEBEF",
        white: "#fff",
        line_dark: "#EAEAEA"
      },
      fontSize: {
        h1: "28px",
        h2: "24px",
        h3: "18px",
        h4: "16px",
        h5: "14px",
        h6: "12px",
        h7: "10px",
        body: "12px"
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
        heading: ['"Open Sans"', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },  
  plugins: [],
};