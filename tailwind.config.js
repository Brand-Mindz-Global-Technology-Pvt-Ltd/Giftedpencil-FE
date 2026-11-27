/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/admin/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
