/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Julemarked-palet
        jule: {
          green:      '#1a4a2e',  // dyb skovgrøn
          'green-mid':'#2d6a4f',
          'green-light': '#52b788',
          red:        '#8b1a1a',  // klassisk julrød
          'red-light':'#c0392b',
          gold:       '#b8860b',  // mørk guld
          'gold-light':'#d4a017',
          cream:      '#fdf6e3',  // varm cremefarve
          brown:      '#5c3d2e',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
};
