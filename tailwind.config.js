const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    enabled: false,
    mode: "layers",
    content: [
      "./**/*.html"
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.warmGray,
        amber: colors.amber
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
  ],
}
