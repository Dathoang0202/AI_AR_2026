/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Be Vietnam Pro', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Merriweather', 'serif'],
      },
      colors: {
        vietphuc: {
          crimson: '#9B1C1C',
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          cream: '#FDFBF7',
          ivory: '#F7F3E9',
          jade: '#1E4D2B',
          charcoal: '#1A202C',
        },
      },
    },
  },
  plugins: [],
};
