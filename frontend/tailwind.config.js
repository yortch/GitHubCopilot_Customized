/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Syne', 'sans-serif'],
        'body': ['DM Sans', 'sans-serif'],
      },
      colors: {
        'primary': '#00F5D4',
        'dark': '#0B0E17',
        'light': '#FAFAF5',
        'accent': '#FF6B6B',
        'lavender': '#7B61FF',
        'mint': {
          50: '#E0FFF7',
          100: '#B3FFE9',
          200: '#80FFD9',
          300: '#4DFFCA',
          400: '#1AFFBC',
          500: '#00F5D4',
          600: '#00C4AA',
          700: '#009380',
          800: '#006255',
          900: '#00312B',
        },
        'coral': {
          50: '#FFF0F0',
          100: '#FFD6D6',
          200: '#FFB3B3',
          300: '#FF8F8F',
          400: '#FF6B6B',
          500: '#FF4747',
          600: '#CC3939',
          700: '#992B2B',
          800: '#661D1D',
          900: '#330E0E',
        },
        'gray': {
          50: '#F7F7F5',
          100: '#EDEDEA',
          200: '#DDDDD8',
          300: '#C4C4BC',
          400: '#9A9A90',
          500: '#6E6E65',
          600: '#52524B',
          700: '#383833',
          800: '#1E1E1C',
          900: '#141413',
          950: '#0B0E17',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(0,245,212,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(123,97,255,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(255,107,107,0.08) 0px, transparent 50%)',
        'gradient-mesh-light': 'radial-gradient(at 40% 20%, rgba(0,245,212,0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(123,97,255,0.06) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(255,107,107,0.04) 0px, transparent 50%)',
      },
      width: {
        '7/8': '87.5%'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-up-delayed': 'fadeUp 0.8s ease-out 0.2s forwards',
        'fade-up-delayed-2': 'fadeUp 0.8s ease-out 0.4s forwards',
        'fade-up-delayed-3': 'fadeUp 0.8s ease-out 0.6s forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'blob': 'blob 7s infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,245,212,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(0,245,212,0.35)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}