

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
    '../seller-ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [],
};
