/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.css",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#CCE3DE", // pedido do usuário
          50: "#F4F9F8",
          100: "#EAF4F2",
          200: "#DDECE9",
          300: "#CCE3DE",
          400: "#AECFCC",
          500: "#90BAB9",
          600: "#6EA1A0",
          700: "#537D7C",
          800: "#3C5A59",
          900: "#2A3F3F",
        },
        surface: {
          950: "#0B0F12", // fundo escuro elegante
          900: "#12171B",
          850: "#161C21",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(204, 227, 222, 0.25)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
};
