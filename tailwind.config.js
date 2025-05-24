/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dynamic theme colors using CSS variables
        primary: {
          DEFAULT: 'var(--color-primary-DEFAULT, #6A9BD8)',
          50: 'var(--color-primary-50, #EFF5FC)',
          100: 'var(--color-primary-100, #DFEAF9)',
          200: 'var(--color-primary-200, #BFD6F2)',
          300: 'var(--color-primary-300, #9FC1EB)',
          400: 'var(--color-primary-400, #7FACDE)',
          500: 'var(--color-primary-500, #6A9BD8)',
          600: 'var(--color-primary-600, #4E83D0)',
          700: 'var(--color-primary-700, #3269C0)',
          800: 'var(--color-primary-800, #2A579E)',
          900: 'var(--color-primary-900, #22457C)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary-DEFAULT, #F5F5DC)',
          50: 'var(--color-secondary-50, #FEFEFE)',
          100: 'var(--color-secondary-100, #FCFCF3)',
          200: 'var(--color-secondary-200, #F9F9E7)',
          300: 'var(--color-secondary-300, #F5F5DC)',
          400: 'var(--color-secondary-400, #EDEDB3)',
          500: 'var(--color-secondary-500, #E6E68A)',
          600: 'var(--color-secondary-600, #DEDE61)',
          700: 'var(--color-secondary-700, #D5D538)',
          800: 'var(--color-secondary-800, #B5B525)',
          900: 'var(--color-secondary-900, #8C8C1D)',
        },
        accent: {
          DEFAULT: 'var(--color-accent-DEFAULT, #A8D5BA)',
          50: 'var(--color-accent-50, #FFFFFF)',
          100: 'var(--color-accent-100, #F5FAF7)',
          200: 'var(--color-accent-200, #E1F0E8)',
          300: 'var(--color-accent-300, #CDE6D9)',
          400: 'var(--color-accent-400, #B8DDCC)',
          500: 'var(--color-accent-500, #A8D5BA)',
          600: 'var(--color-accent-600, #88C6A0)',
          700: 'var(--color-accent-700, #68B787)',
          800: 'var(--color-accent-800, #4E9F6D)',
          900: 'var(--color-accent-900, #3B7B53)',
        },
        neutral: {
          50: 'var(--color-neutral-50, #F8F9FA)',
          100: 'var(--color-neutral-100, #F5F5F5)',
          200: 'var(--color-neutral-200, #E5E5E5)',
          300: 'var(--color-neutral-300, #D4D4D4)',
          400: 'var(--color-neutral-400, #A3A3A3)',
          500: 'var(--color-neutral-500, #737373)',
          600: 'var(--color-neutral-600, #525252)',
          700: 'var(--color-neutral-700, #404040)',
          800: 'var(--color-neutral-800, #262626)',
          900: 'var(--color-neutral-900, #171717)',
        },
        spiritual: {
          light: 'var(--color-spiritual-light, #F8F4FF)',
          medium: 'var(--color-spiritual-medium, #D2BAFF)',
          dark: 'var(--color-spiritual-dark, #8A48CC)',
          glow: 'var(--color-spiritual-glow, rgba(180, 140, 255, 0.3))',
        },
      },
      fontFamily: {
        serif: 'var(--font-serif, Lora, serif)',
        sans: 'var(--font-sans, "Open Sans", sans-serif)',
        spiritual: 'var(--font-spiritual, Cinzel, serif)',
      },
      spacing: {
        xs: 'var(--spacing-xs, 0.25rem)',
        sm: 'var(--spacing-sm, 0.5rem)',
        md: 'var(--spacing-md, 1rem)',
        lg: 'var(--spacing-lg, 1.5rem)',
        xl: 'var(--spacing-xl, 2rem)',
        '2xl': 'var(--spacing-2xl, 3rem)',
        '3xl': 'var(--spacing-3xl, 4rem)',
        '4xl': 'var(--spacing-4xl, 6rem)',
        '5xl': 'var(--spacing-5xl, 8rem)',
      },
      borderRadius: {
        spiritual: 'var(--radius-spiritual, 1.5rem)',
      },
      boxShadow: {
        spiritual: 'var(--shadow-spiritual, 0 0 20px rgba(180, 140, 255, 0.3))',
        glow: 'var(--shadow-glow, 0 0 15px rgba(180, 140, 255, 0.4))',
      },
      animation: {
        // Existing animations
        fadeIn: 'fadeIn var(--duration-normal, 0.5s) var(--easing-spiritual, ease-in-out)',
        slideInFromRight: 'slideInFromRight var(--duration-fast, 0.3s) var(--easing-easeOut, ease-out)',
        slideInFromLeft: 'slideInFromLeft var(--duration-fast, 0.3s) var(--easing-easeOut, ease-out)',

        // New spiritual animations
        'lotus-bloom': 'lotusBloom var(--duration-slower, 2s) var(--easing-spiritual, ease-in-out) infinite',
        'spiritual-glow': 'spiritualGlow var(--duration-slow, 2s) var(--easing-spiritual, ease-in-out) infinite',
        'float-up': 'floatUp var(--duration-slow, 3s) var(--easing-spiritual, ease-in-out) infinite',
        'leaf-rustle': 'leafRustle var(--duration-slow, 4s) var(--easing-spiritual, ease-in-out) infinite',
        'growth-pulse': 'growthPulse var(--duration-slow, 2s) var(--easing-spiritual, ease-in-out) infinite',
        'natural-flow': 'naturalFlow var(--duration-slower, 6s) var(--easing-spiritual, ease-in-out) infinite',
        'star-twinkle': 'starTwinkle var(--duration-slow, 2s) var(--easing-spiritual, ease-in-out) infinite',
        'cosmic-pulse': 'cosmicPulse var(--duration-slow, 2s) var(--easing-spiritual, ease-in-out) infinite',
        'celestial-float': 'celestialFloat var(--duration-slower, 8s) var(--easing-spiritual, ease-in-out) infinite',
        'sand-shift': 'sandShift var(--duration-slower, 5s) var(--easing-spiritual, ease-in-out) infinite',
        'wisdom-glow': 'wisdomGlow var(--duration-slow, 3s) var(--easing-spiritual, ease-in-out) infinite',
        'desert-breeze': 'desertBreeze var(--duration-slower, 7s) var(--easing-spiritual, ease-in-out) infinite',
        'ocean-wave': 'oceanWave var(--duration-slower, 4s) var(--easing-spiritual, ease-in-out) infinite',
        'fluid-pulse': 'fluidPulse var(--duration-slow, 2s) var(--easing-spiritual, ease-in-out) infinite',
        'current-flow': 'currentFlow var(--duration-slower, 6s) var(--easing-spiritual, ease-in-out) infinite',
      },
      keyframes: {
        // Existing keyframes
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

        // Sacred Lotus animations
        lotusBloom: {
          '0%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0.7' },
          '50%': { transform: 'scale(1.05) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '0.9' },
        },
        spiritualGlow: {
          '0%': { boxShadow: '0 0 5px rgba(180, 140, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(180, 140, 255, 0.6)' },
          '100%': { boxShadow: '0 0 5px rgba(180, 140, 255, 0.3)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },

        // Forest Sanctuary animations
        leafRustle: {
          '0%': { transform: 'rotate(-2deg) translateX(0px)' },
          '25%': { transform: 'rotate(1deg) translateX(2px)' },
          '50%': { transform: 'rotate(-1deg) translateX(-1px)' },
          '75%': { transform: 'rotate(2deg) translateX(1px)' },
          '100%': { transform: 'rotate(-2deg) translateX(0px)' },
        },
        growthPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.8' },
        },
        naturalFlow: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-5px) rotate(1deg)' },
          '66%': { transform: 'translateY(2px) rotate(-1deg)' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' },
        },

        // Celestial Healing animations
        starTwinkle: {
          '0%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
          '100%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
        cosmicPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(105, 145, 255, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(105, 145, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(105, 145, 255, 0)' },
        },
        celestialFloat: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) rotate(120deg)' },
          '66%': { transform: 'translateY(4px) rotate(240deg)' },
          '100%': { transform: 'translateY(0px) rotate(360deg)' },
        },

        // Desert Wisdom animations
        sandShift: {
          '0%': { transform: 'translateX(0px) scaleX(1)' },
          '25%': { transform: 'translateX(2px) scaleX(1.01)' },
          '50%': { transform: 'translateX(0px) scaleX(1)' },
          '75%': { transform: 'translateX(-2px) scaleX(0.99)' },
          '100%': { transform: 'translateX(0px) scaleX(1)' },
        },
        wisdomGlow: {
          '0%': { opacity: '0.7', boxShadow: '0 0 5px rgba(235, 185, 135, 0.3)' },
          '50%': { opacity: '1', boxShadow: '0 0 15px rgba(235, 185, 135, 0.5)' },
          '100%': { opacity: '0.7', boxShadow: '0 0 5px rgba(235, 185, 135, 0.3)' },
        },
        desertBreeze: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-3px) rotate(1deg)' },
          '50%': { transform: 'translateY(0px) rotate(0deg)' },
          '75%': { transform: 'translateY(3px) rotate(-1deg)' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' },
        },

        // Ocean Depths animations
        oceanWave: {
          '0%': { transform: 'translateX(0px) translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateX(5px) translateY(-3px) rotate(1deg)' },
          '50%': { transform: 'translateX(0px) translateY(-5px) rotate(0deg)' },
          '75%': { transform: 'translateX(-5px) translateY(-3px) rotate(-1deg)' },
          '100%': { transform: 'translateX(0px) translateY(0px) rotate(0deg)' },
        },
        fluidPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.8' },
        },
        currentFlow: {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '50%': { transform: 'translateX(0px)', opacity: '1' },
          '100%': { transform: 'translateX(100px)', opacity: '0' },
        },
      },
      transitionDuration: {
        fast: 'var(--duration-fast, 150ms)',
        normal: 'var(--duration-normal, 300ms)',
        slow: 'var(--duration-slow, 500ms)',
        slower: 'var(--duration-slower, 1000ms)',
      },
      transitionTimingFunction: {
        spiritual: 'var(--easing-spiritual, cubic-bezier(0.4, 0, 0.2, 1))',
      },
    },
  },
  plugins: [
    // Custom plugin for theme-specific utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.reduce-motion': {
          '*': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
          },
        },
        '.high-contrast': {
          '*': {
            'filter': 'contrast(1.5)',
          },
        },
        '.spiritual-gradient': {
          'background': 'var(--gradient-spiritual)',
        },
        '.primary-gradient': {
          'background': 'var(--gradient-primary)',
        },
        '.secondary-gradient': {
          'background': 'var(--gradient-secondary)',
        },
        '.accent-gradient': {
          'background': 'var(--gradient-accent)',
        },
      };

      addUtilities(newUtilities);
    },
  ],
};