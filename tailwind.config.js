/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        plum: '#310A5D',
        grape: '#8A2BE2',
        grapeDark: '#6D1FB8',
        chalk: '#e0e0e0',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        script: ['"The Nautigal"', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.15em',
        widest3: '0.25em',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        riseUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.35s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
        riseUp: 'riseUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
