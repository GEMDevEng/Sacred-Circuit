/**
 * Sacred Lotus Theme
 * Soft purples, golds, lotus motifs - representing spiritual awakening and enlightenment
 */

import { ThemeConfig } from '../types/theme';

const sacredLotusTheme: ThemeConfig = {
  id: 'sacred-lotus',
  name: 'Sacred Lotus',
  description: 'A serene theme inspired by the sacred lotus flower, featuring soft purples and golden accents that evoke spiritual awakening and inner peace.',
  category: 'spiritual',
  
  colors: {
    primary: {
      50: '#F8F4FF',
      100: '#F0E8FF',
      200: '#E1D1FF',
      300: '#D2BAFF',
      400: '#C3A3FF',
      500: '#B48CFF',
      600: '#9F6AE6',
      700: '#8A48CC',
      800: '#7526B3',
      900: '#5F0499',
      DEFAULT: '#B48CFF',
    },
    secondary: {
      50: '#FFFDF7',
      100: '#FFFAEF',
      200: '#FFF5DF',
      300: '#FFEFCF',
      400: '#FFEABF',
      500: '#FFE4AF',
      600: '#F4D89E',
      700: '#E8CC8D',
      800: '#DCC07C',
      900: '#D0B46B',
      DEFAULT: '#FFE4AF',
    },
    accent: {
      50: '#FDF8F0',
      100: '#FBF1E1',
      200: '#F7E3C3',
      300: '#F3D5A5',
      400: '#EFC787',
      500: '#EBB969',
      600: '#D4A55F',
      700: '#BD9155',
      800: '#A67D4B',
      900: '#8F6941',
      DEFAULT: '#EBB969',
    },
    neutral: {
      50: '#FDFCFB',
      100: '#FAF9F7',
      200: '#F5F3F0',
      300: '#F0EDE8',
      400: '#EBE7E1',
      500: '#E6E1D9',
      600: '#D1CCC3',
      700: '#BCB7AD',
      800: '#A7A297',
      900: '#928D81',
    },
    spiritual: {
      light: '#F8F4FF',
      medium: '#D2BAFF',
      dark: '#8A48CC',
      glow: 'rgba(180, 140, 255, 0.3)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #F8F4FF 0%, #D2BAFF 50%, #B48CFF 100%)',
      secondary: 'linear-gradient(135deg, #FFFDF7 0%, #FFE4AF 100%)',
      accent: 'linear-gradient(135deg, #FDF8F0 0%, #EBB969 100%)',
      spiritual: 'radial-gradient(circle at center, rgba(180, 140, 255, 0.1) 0%, rgba(235, 185, 105, 0.05) 100%)',
    },
  },
  
  typography: {
    fontFamily: {
      serif: ['Lora', 'Georgia', 'serif'],
      sans: ['Inter', 'Open Sans', 'sans-serif'],
      spiritual: ['Cinzel', 'Playfair Display', 'serif'],
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
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spiritual: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    keyframes: {
      lotusBloom: {
        '0%': 'transform: scale(0.8) rotate(0deg); opacity: 0.7',
        '50%': 'transform: scale(1.05) rotate(180deg); opacity: 1',
        '100%': 'transform: scale(1) rotate(360deg); opacity: 0.9',
      },
      spiritualGlow: {
        '0%': 'box-shadow: 0 0 5px rgba(180, 140, 255, 0.3)',
        '50%': 'box-shadow: 0 0 20px rgba(180, 140, 255, 0.6)',
        '100%': 'box-shadow: 0 0 5px rgba(180, 140, 255, 0.3)',
      },
      floatUp: {
        '0%': 'transform: translateY(0px)',
        '50%': 'transform: translateY(-10px)',
        '100%': 'transform: translateY(0px)',
      },
    },
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(180, 140, 255, 0.05)',
    md: '0 4px 6px -1px rgba(180, 140, 255, 0.1), 0 2px 4px -1px rgba(180, 140, 255, 0.06)',
    lg: '0 10px 15px -3px rgba(180, 140, 255, 0.1), 0 4px 6px -2px rgba(180, 140, 255, 0.05)',
    xl: '0 20px 25px -5px rgba(180, 140, 255, 0.1), 0 10px 10px -5px rgba(180, 140, 255, 0.04)',
    spiritual: '0 0 20px rgba(180, 140, 255, 0.3), 0 0 40px rgba(235, 185, 105, 0.2)',
    glow: '0 0 15px rgba(180, 140, 255, 0.4)',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
    spiritual: '1.5rem',
  },
  
  backgroundPatterns: {
    primary: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D2BAFF' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    secondary: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFE4AF' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zm0 0c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
    accent: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23EBB969' fill-opacity='0.03'%3E%3Cpolygon points='10,0 15,8 10,16 5,8'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  
  soundscape: {
    ambient: '/sounds/lotus-ambient.mp3',
    interaction: '/sounds/lotus-chime.mp3',
    transition: '/sounds/lotus-transition.mp3',
  },
  
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    focusVisible: true,
  },
};

export default sacredLotusTheme;
