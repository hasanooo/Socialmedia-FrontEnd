/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe6fe',
          200: '#bfd3fe',
          300: '#93b4fd',
          400: '#608bfa',
          500: '#3b66f5',
          600: '#2547ea',
          700: '#1d37d6',
          800: '#1e2fac',
          900: '#1e2c87',
        },
      },
    },
  },
  plugins: [],
};
