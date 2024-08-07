/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        'Calistoga-Regular' : ['Calistoga-Regular' , 'sans-serif'],
        'Margarine-Regular': ['Margarine-Regular', 'sans-serif'],
        'RockSalt-Regular': ['RockSalt-Regular', 'sans-serif'],
        'Sora-VariableFont_wght': ['Sora-VariableFont-wght', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
