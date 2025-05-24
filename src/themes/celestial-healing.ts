/**
 * Celestial Healing Theme
 * Deep blues, silvers, star patterns - representing cosmic connection and divine healing
 */

import { ThemeConfig } from '../types/theme';

const celestialHealingTheme: ThemeConfig = {
  id: 'celestial-healing',
  name: 'Celestial Healing',
  description: 'A mystical theme inspired by the night sky and celestial bodies, featuring deep blues and silver accents that connect you to cosmic healing energies.',
  category: 'celestial',
  
  colors: {
    primary: {
      50: '#F0F4FF',
      100: '#E1E9FF',
      200: '#C3D3FF',
      300: '#A5BDFF',
      400: '#87A7FF',
      500: '#6991FF',
      600: '#5A7AE6',
      700: '#4B63CC',
      800: '#3C4CB3',
      900: '#2D3599',
      DEFAULT: '#6991FF',
    },
    secondary: {
      50: '#F8F9FB',
      100: '#F1F3F7',
      200: '#E3E7EF',
      300: '#D5DBE7',
      400: '#C7CFDF',
      500: '#B9C3D7',
      600: '#A6B0C2',
      700: '#939DAD',
      800: '#808A98',
      900: '#6D7783',
      DEFAULT: '#B9C3D7',
    },
    accent: {
      50: '#FAFBFC',
      100: '#F5F7F9',
      200: '#EBEEF3',
      300: '#E1E6ED',
      400: '#D7DDE7',
      500: '#CDD5E1',
      600: '#B8C0CA',
      700: '#A3ABB3',
      800: '#8E969C',
      900: '#798185',
      DEFAULT: '#CDD5E1',
    },
    neutral: {
      50: '#FAFBFC',
      100: '#F5F6F8',
      200: '#EBEDF1',
      300: '#E1E4EA',
      400: '#D7DBE3',
      500: '#CDD2DC',
      600: '#B8BDC7',
      700: '#A3A8B2',
      800: '#8E939D',
      900: '#797E88',
    },
    spiritual: {
      light: '#F0F4FF',
      medium: '#87A7FF',
      dark: '#2D3599',
      glow: 'rgba(105, 145, 255, 0.4)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #F0F4FF 0%, #87A7FF 50%, #6991FF 100%)',
      secondary: 'linear-gradient(135deg, #F8F9FB 0%, #B9C3D7 100%)',
      accent: 'linear-gradient(135deg, #FAFBFC 0%, #CDD5E1 100%)',
      spiritual: 'radial-gradient(circle at center, rgba(105, 145, 255, 0.15) 0%, rgba(185, 195, 215, 0.05) 100%)',
    },
  },
  
  typography: {
    fontFamily: {
      serif: ['Playfair Display', 'Lora', 'serif'],
      sans: ['Nunito Sans', 'Open Sans', 'sans-serif'],
      spiritual: ['Cinzel', 'Cormorant Garamond', 'serif'],
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
      fast: '250ms',
      normal: '500ms',
      slow: '750ms',
      slower: '1500ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spiritual: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    keyframes: {
      starTwinkle: {
        '0%': 'opacity: 0.3; transform: scale(0.8)',
        '50%': 'opacity: 1; transform: scale(1.2)',
        '100%': 'opacity: 0.3; transform: scale(0.8)',
      },
      cosmicPulse: {
        '0%': 'box-shadow: 0 0 0 0 rgba(105, 145, 255, 0.7)',
        '70%': 'box-shadow: 0 0 0 10px rgba(105, 145, 255, 0)',
        '100%': 'box-shadow: 0 0 0 0 rgba(105, 145, 255, 0)',
      },
      celestialFloat: {
        '0%': 'transform: translateY(0px) rotate(0deg)',
        '33%': 'transform: translateY(-8px) rotate(120deg)',
        '66%': 'transform: translateY(4px) rotate(240deg)',
        '100%': 'transform: translateY(0px) rotate(360deg)',
      },
    },
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(105, 145, 255, 0.08)',
    md: '0 4px 6px -1px rgba(105, 145, 255, 0.15), 0 2px 4px -1px rgba(105, 145, 255, 0.08)',
    lg: '0 10px 15px -3px rgba(105, 145, 255, 0.15), 0 4px 6px -2px rgba(105, 145, 255, 0.08)',
    xl: '0 20px 25px -5px rgba(105, 145, 255, 0.15), 0 10px 10px -5px rgba(105, 145, 255, 0.06)',
    spiritual: '0 0 30px rgba(105, 145, 255, 0.4), 0 0 60px rgba(185, 195, 215, 0.3)',
    glow: '0 0 20px rgba(105, 145, 255, 0.5)',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
    spiritual: '2rem',
  },
  
  backgroundPatterns: {
    primary: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2387A7FF' fill-opacity='0.06'%3E%3Cpolygon points='50,0 60,35 100,35 70,57 80,91 50,70 20,91 30,57 0,35 40,35'/%3E%3C/g%3E%3C/svg%3E")`,
    secondary: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B9C3D7' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='10' r='1'/%3E%3Ccircle cx='10' cy='50' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
    accent: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23CDD5E1' fill-opacity='0.03'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20-20c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  
  soundscape: {
    ambient: '/sounds/celestial-ambient.mp3',
    interaction: '/sounds/celestial-chime.mp3',
    transition: '/sounds/celestial-transition.mp3',
  },
  
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    focusVisible: true,
  },
};

export default celestialHealingTheme;
