/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:{
          700: "#1a1e30",
          600: "#1e2130",
          500: "#1f222e",
          400: "#20232c",
          300: "#21242b",
          200: "#22252a",
          100: "#232629",
          50: "#252836",
        },
        //  "#191818",
        secondary: {
          700: "#f0563c",
          600: "#e85f48",
          500: "#e66c57",
          400: "#e37562",
          300: "#EA7C69",
          200: "#db8070",
          100: "#d98677",
          50: "#ad7d74",
          25: "#7A605B",
          'light': '#673b34'
        },
        warning: {
          500: "#fa7828"
        },
        text: "white"
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}

