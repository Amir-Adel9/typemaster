/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        hovered: 'var(--color-hovered)',
        correct: 'var(--color-correct-char)',
        wrong: 'var(--color-wrong-char)',
        underline: 'var(--color-underline)',
      },
      fontFamily: {
        poppins: ['kanit', 'Kanit'],
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
