/**
 * Forest Sanctuary Theme
 * Earth tones, greens, nature elements - representing grounding and natural healing
 */

import { ThemeConfig } from '../types/theme';

const forestSanctuaryTheme: ThemeConfig = {
  id: 'forest-sanctuary',
  name: 'Forest Sanctuary',
  description: 'A grounding theme inspired by ancient forests and natural sanctuaries, featuring rich earth tones and vibrant greens that connect you to nature\'s healing energy.',
  category: 'nature',
  
  colors: {
    primary: {
      50: '#F0F9F0',
      100: '#E1F3E1',
      200: '#C3E7C3',
      300: '#A5DBA5',
      400: '#87CF87',
      500: '#69C369',
      600: '#5AAF5A',
      700: '#4B9B4B',
      800: '#3C873C',
      900: '#2D732D',
      DEFAULT: '#69C369',
    },
    secondary: {
      50: '#F9F7F4',
      100: '#F3EFE9',
      200: '#E7DFD3',
      300: '#DBCFBD',
      400: '#CFBFA7',
      500: '#C3AF91',
      600: '#B09E82',
      700: '#9D8D73',
      800: '#8A7C64',
      900: '#776B55',
      DEFAULT: '#C3AF91',
    },
    accent: {
      50: '#FDF9F3',
      100: '#FBF3E7',
      200: '#F7E7CF',
      300: '#F3DBB7',
      400: '#EFCF9F',
      500: '#EBC387',
      600: '#D4B079',
      700: '#BD9D6B',
      800: '#A68A5D',
      900: '#8F774F',
      DEFAULT: '#EBC387',
    },
    neutral: {
      50: '#FAFAF9',
      100: '#F5F5F3',
      200: '#EBEBЕ7',
      300: '#E1E1DB',
      400: '#D7D7CF',
      500: '#CDCDC3',
      600: '#B8B8B0',
      700: '#A3A39D',
      800: '#8E8E8A',
      900: '#797977',
    },
    spiritual: {
      light: '#F0F9F0',
      medium: '#87CF87',
      dark: '#2D732D',
      glow: 'rgba(105, 195, 105, 0.3)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #F0F9F0 0%, #87CF87 50%, #69C369 100%)',
      secondary: 'linear-gradient(135deg, #F9F7F4 0%, #C3AF91 100%)',
      accent: 'linear-gradient(135deg, #FDF9F3 0%, #EBC387 100%)',
      spiritual: 'radial-gradient(circle at center, rgba(105, 195, 105, 0.1) 0%, rgba(195, 175, 145, 0.05) 100%)',
    },
  },
  
  typography: {
    fontFamily: {
      serif: ['Crimson Text', 'Lora', 'serif'],
      sans: ['Source Sans Pro', 'Open Sans', 'sans-serif'],
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
      fast: '200ms',
      normal: '400ms',
      slow: '600ms',
      slower: '1200ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spiritual: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    keyframes: {
      leafRustle: {
        '0%': 'transform: rotate(-2deg) translateX(0px)',
        '25%': 'transform: rotate(1deg) translateX(2px)',
        '50%': 'transform: rotate(-1deg) translateX(-1px)',
        '75%': 'transform: rotate(2deg) translateX(1px)',
        '100%': 'transform: rotate(-2deg) translateX(0px)',
      },
      growthPulse: {
        '0%': 'transform: scale(1); opacity: 0.8',
        '50%': 'transform: scale(1.02); opacity: 1',
        '100%': 'transform: scale(1); opacity: 0.8',
      },
      naturalFlow: {
        '0%': 'transform: translateY(0px) rotate(0deg)',
        '33%': 'transform: translateY(-5px) rotate(1deg)',
        '66%': 'transform: translateY(2px) rotate(-1deg)',
        '100%': 'transform: translateY(0px) rotate(0deg)',
      },
    },
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(105, 195, 105, 0.05)',
    md: '0 4px 6px -1px rgba(105, 195, 105, 0.1), 0 2px 4px -1px rgba(105, 195, 105, 0.06)',
    lg: '0 10px 15px -3px rgba(105, 195, 105, 0.1), 0 4px 6px -2px rgba(105, 195, 105, 0.05)',
    xl: '0 20px 25px -5px rgba(105, 195, 105, 0.1), 0 10px 10px -5px rgba(105, 195, 105, 0.04)',
    spiritual: '0 0 20px rgba(105, 195, 105, 0.3), 0 0 40px rgba(195, 175, 145, 0.2)',
    glow: '0 0 15px rgba(105, 195, 105, 0.4)',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
    spiritual: '1.25rem',
  },
  
  backgroundPatterns: {
    primary: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2387CF87' fill-opacity='0.08'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20-20c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    secondary: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C3AF91' fill-opacity='0.04'%3E%3Cpath d='M30 30c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15zm15-15c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
    accent: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23EBC387' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zm10-10c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  
  soundscape: {
    ambient: '/sounds/forest-ambient.mp3',
    interaction: '/sounds/forest-chime.mp3',
    transition: '/sounds/forest-transition.mp3',
  },
  
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    focusVisible: true,
  },
};

export default forestSanctuaryTheme;
