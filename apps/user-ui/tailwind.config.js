

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ['var(--font-roboto)', 'sans-serif'],
        Poppins: ['var(--font-poppins)', 'sans-serif'],
        Oregano: ['var(--font-oregano)', 'cursive'],
      }
    },
  },
  plugins: [],
};
