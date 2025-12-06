/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "scrollbar-bg": "#f0f0f0",
        "scrollbar-thumb": "#888888",
      },
    },
  },
  plugins: [],
};
