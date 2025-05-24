/**
 * Ocean Depths Theme
 * Aqua blues, flowing animations - representing emotional healing and fluidity
 */

import { ThemeConfig } from '../types/theme';

const oceanDepthsTheme: ThemeConfig = {
  id: 'ocean-depths',
  name: 'Ocean Depths',
  description: 'A flowing theme inspired by the depths of the ocean and healing waters, featuring aqua blues and fluid animations that promote emotional healing and inner peace.',
  category: 'water',
  
  colors: {
    primary: {
      50: '#F0FDFF',
      100: '#E1FBFF',
      200: '#C3F7FF',
      300: '#A5F3FF',
      400: '#87EFFF',
      500: '#69EBFF',
      600: '#5AD4E6',
      700: '#4BBDCC',
      800: '#3CA6B3',
      900: '#2D8F99',
      DEFAULT: '#69EBFF',
    },
    secondary: {
      50: '#F7FCFD',
      100: '#EFF9FB',
      200: '#DFF3F7',
      300: '#CFEDF3',
      400: '#BFE7EF',
      500: '#AFE1EB',
      600: '#9ECBD4',
      700: '#8DB5BD',
      800: '#7C9FA6',
      900: '#6B898F',
      DEFAULT: '#AFE1EB',
    },
    accent: {
      50: '#F5FBFC',
      100: '#EBF7F9',
      200: '#D7EFF3',
      300: '#C3E7ED',
      400: '#AFDFE7',
      500: '#9BD7E1',
      600: '#8BC2CA',
      700: '#7BADB3',
      800: '#6B989C',
      900: '#5B8385',
      DEFAULT: '#9BD7E1',
    },
    neutral: {
      50: '#FAFCFD',
      100: '#F5F9FB',
      200: '#EBF3F7',
      300: '#E1EDF3',
      400: '#D7E7EF',
      500: '#CDE1EB',
      600: '#B8CCD6',
      700: '#A3B7C1',
      800: '#8EA2AC',
      900: '#798D97',
    },
    spiritual: {
      light: '#F0FDFF',
      medium: '#87EFFF',
      dark: '#2D8F99',
      glow: 'rgba(105, 235, 255, 0.4)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #F0FDFF 0%, #87EFFF 50%, #69EBFF 100%)',
      secondary: 'linear-gradient(135deg, #F7FCFD 0%, #AFE1EB 100%)',
      accent: 'linear-gradient(135deg, #F5FBFC 0%, #9BD7E1 100%)',
      spiritual: 'radial-gradient(circle at center, rgba(105, 235, 255, 0.15) 0%, rgba(175, 225, 235, 0.05) 100%)',
    },
  },
  
  typography: {
    fontFamily: {
      serif: ['Libre Baskerville', 'Lora', 'serif'],
      sans: ['Nunito', 'Open Sans', 'sans-serif'],
      spiritual: ['Cormorant Garamond', 'Playfair Display', 'serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem',
  },
  
  animations: {
    duration: {
      fast: '400ms',
      normal: '800ms',
      slow: '1200ms',
      slower: '2000ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spiritual: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    keyframes: {
      oceanWave: {
        '0%': 'transform: translateX(0px) translateY(0px) rotate(0deg)',
        '25%': 'transform: translateX(5px) translateY(-3px) rotate(1deg)',
        '50%': 'transform: translateX(0px) translateY(-5px) rotate(0deg)',
        '75%': 'transform: translateX(-5px) translateY(-3px) rotate(-1deg)',
        '100%': 'transform: translateX(0px) translateY(0px) rotate(0deg)',
      },
      fluidPulse: {
        '0%': 'transform: scale(1); opacity: 0.8',
        '50%': 'transform: scale(1.05); opacity: 1',
        '100%': 'transform: scale(1); opacity: 0.8',
      },
      currentFlow: {
        '0%': 'transform: translateX(-100px) opacity: 0',
        '50%': 'transform: translateX(0px) opacity: 1',
        '100%': 'transform: translateX(100px) opacity: 0',
      },
    },
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(105, 235, 255, 0.1)',
    md: '0 4px 6px -1px rgba(105, 235, 255, 0.2), 0 2px 4px -1px rgba(105, 235, 255, 0.1)',
    lg: '0 10px 15px -3px rgba(105, 235, 255, 0.2), 0 4px 6px -2px rgba(105, 235, 255, 0.1)',
    xl: '0 20px 25px -5px rgba(105, 235, 255, 0.2), 0 10px 10px -5px rgba(105, 235, 255, 0.08)',
    spiritual: '0 0 35px rgba(105, 235, 255, 0.5), 0 0 70px rgba(175, 225, 235, 0.3)',
    glow: '0 0 25px rgba(105, 235, 255, 0.6)',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
    spiritual: '3rem',
  },
  
  backgroundPatterns: {
    primary: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2387EFFF' fill-opacity='0.08'%3E%3Cpath d='M50 50c0-13.807-11.193-25-25-25s-25 11.193-25 25 11.193 25 25 25 25-11.193 25-25zm25-25c13.807 0 25 11.193 25 25s-11.193 25-25 25-25-11.193-25-25 11.193-25 25-25z'/%3E%3C/g%3E%3C/svg%3E")`,
    secondary: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23AFE1EB' fill-opacity='0.04'%3E%3Cpath d='M30 30c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15zm15-15c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
    accent: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239BD7E1' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  
  soundscape: {
    ambient: '/sounds/ocean-ambient.mp3',
    interaction: '/sounds/ocean-chime.mp3',
    transition: '/sounds/ocean-transition.mp3',
  },
  
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    focusVisible: true,
  },
};

export default oceanDepthsTheme;
