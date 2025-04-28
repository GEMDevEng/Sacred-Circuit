/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6A9BD8',
          50: '#EFF5FC',
          100: '#DFEAF9',
          200: '#BFD6F2',
          300: '#9FC1EB',
          400: '#7FACDE',
          500: '#6A9BD8',
          600: '#4E83D0',
          700: '#3269C0',
          800: '#2A579E',
          900: '#22457C',
        },
        secondary: {
          DEFAULT: '#F5F5DC',
          50: '#FEFEFE',
          100: '#FCFCF3',
          200: '#F9F9E7',
          300: '#F5F5DC',
          400: '#EDEDB3',
          500: '#E6E68A',
          600: '#DEDE61',
          700: '#D5D538',
          800: '#B5B525',
          900: '#8C8C1D',
        },
        accent: {
          DEFAULT: '#A8D5BA',
          50: '#FFFFFF',
          100: '#F5FAF7',
          200: '#E1F0E8',
          300: '#CDE6D9',
          400: '#B8DDCC',
          500: '#A8D5BA',
          600: '#88C6A0',
          700: '#68B787',
          800: '#4E9F6D',
          900: '#3B7B53',
        },
        neutral: {
          50: '#F8F9FA',
          800: '#4A4A4A',
          900: '#212121',
        },
      },
      fontFamily: {
        serif: ['Lora', 'serif'],
        sans: ['Open Sans', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideInFromRight: 'slideInFromRight 0.3s ease-out',
        slideInFromLeft: 'slideInFromLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};