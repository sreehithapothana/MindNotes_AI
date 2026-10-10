/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9FC',
        lavender: {
          light: '#EDE4FA',
          DEFAULT: '#8B72B9',
          dark: '#67518e',
        },
        powder: '#E5EEFF',
        sage: '#E4F3E9',
        peach: '#FCEBDD',
        primary: {
          50: '#EDE4FA',
          100: '#E4D6F6',
          500: '#8B72B9',
          600: '#755DA1',
          700: '#5F4A84',
          900: '#3D2F57',
        },
        gray: {
          900: '#302C3B',
          500: '#777384',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(139, 114, 185, 0.08)',
      }
    },
  },
  plugins: [],
}
