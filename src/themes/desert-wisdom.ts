/**
 * Desert Wisdom Theme
 * Warm sands, terracotta, minimalist - representing ancient wisdom and inner strength
 */

import { ThemeConfig } from '../types/theme';

const desertWisdomTheme: ThemeConfig = {
  id: 'desert-wisdom',
  name: 'Desert Wisdom',
  description: 'A minimalist theme inspired by ancient desert landscapes and timeless wisdom, featuring warm sand tones and terracotta accents that evoke inner strength and clarity.',
  category: 'earth',
  
  colors: {
    primary: {
      50: '#FDF8F3',
      100: '#FBF1E7',
      200: '#F7E3CF',
      300: '#F3D5B7',
      400: '#EFC79F',
      500: '#EBB987',
      600: '#D4A679',
      700: '#BD936B',
      800: '#A6805D',
      900: '#8F6D4F',
      DEFAULT: '#EBB987',
    },
    secondary: {
      50: '#FBF7F3',
      100: '#F7EFE7',
      200: '#EFDFCF',
      300: '#E7CFB7',
      400: '#DFBF9F',
      500: '#D7AF87',
      600: '#C29E79',
      700: '#AD8D6B',
      800: '#987C5D',
      900: '#836B4F',
      DEFAULT: '#D7AF87',
    },
    accent: {
      50: '#FAF6F2',
      100: '#F5EDE5',
      200: '#EBDBCB',
      300: '#E1C9B1',
      400: '#D7B797',
      500: '#CDA57D',
      600: '#B89571',
      700: '#A38565',
      800: '#8E7559',
      900: '#79654D',
      DEFAULT: '#CDA57D',
    },
    neutral: {
      50: '#FDFCFB',
      100: '#FBF9F7',
      200: '#F7F3EF',
      300: '#F3EDE7',
      400: '#EFE7DF',
      500: '#EBE1D7',
      600: '#D6CCC2',
      700: '#C1B7AD',
      800: '#ACA298',
      900: '#978D83',
    },
    spiritual: {
      light: '#FDF8F3',
      medium: '#EFC79F',
      dark: '#8F6D4F',
      glow: 'rgba(235, 185, 135, 0.3)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #FDF8F3 0%, #EFC79F 50%, #EBB987 100%)',
      secondary: 'linear-gradient(135deg, #FBF7F3 0%, #D7AF87 100%)',
      accent: 'linear-gradient(135deg, #FAF6F2 0%, #CDA57D 100%)',
      spiritual: 'radial-gradient(circle at center, rgba(235, 185, 135, 0.1) 0%, rgba(215, 175, 135, 0.05) 100%)',
    },
  },
  
  typography: {
    fontFamily: {
      serif: ['Merriweather', 'Lora', 'serif'],
      sans: ['Source Sans Pro', 'Open Sans', 'sans-serif'],
      spiritual: ['Trajan Pro', 'Cinzel', 'serif'],
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
      fast: '300ms',
      normal: '600ms',
      slow: '900ms',
      slower: '1800ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spiritual: 'cubic-bezier(0.23, 1, 0.32, 1)',
    },
    keyframes: {
      sandShift: {
        '0%': 'transform: translateX(0px) scaleX(1)',
        '25%': 'transform: translateX(2px) scaleX(1.01)',
        '50%': 'transform: translateX(0px) scaleX(1)',
        '75%': 'transform: translateX(-2px) scaleX(0.99)',
        '100%': 'transform: translateX(0px) scaleX(1)',
      },
      wisdomGlow: {
        '0%': 'opacity: 0.7; box-shadow: 0 0 5px rgba(235, 185, 135, 0.3)',
        '50%': 'opacity: 1; box-shadow: 0 0 15px rgba(235, 185, 135, 0.5)',
        '100%': 'opacity: 0.7; box-shadow: 0 0 5px rgba(235, 185, 135, 0.3)',
      },
      desertBreeze: {
        '0%': 'transform: translateY(0px) rotate(0deg)',
        '25%': 'transform: translateY(-3px) rotate(1deg)',
        '50%': 'transform: translateY(0px) rotate(0deg)',
        '75%': 'transform: translateY(3px) rotate(-1deg)',
        '100%': 'transform: translateY(0px) rotate(0deg)',
      },
    },
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(235, 185, 135, 0.1)',
    md: '0 4px 6px -1px rgba(235, 185, 135, 0.15), 0 2px 4px -1px rgba(235, 185, 135, 0.08)',
    lg: '0 10px 15px -3px rgba(235, 185, 135, 0.15), 0 4px 6px -2px rgba(235, 185, 135, 0.08)',
    xl: '0 20px 25px -5px rgba(235, 185, 135, 0.15), 0 10px 10px -5px rgba(235, 185, 135, 0.06)',
    spiritual: '0 0 25px rgba(235, 185, 135, 0.4), 0 0 50px rgba(215, 175, 135, 0.2)',
    glow: '0 0 18px rgba(235, 185, 135, 0.4)',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
    spiritual: '0.5rem',
  },
  
  backgroundPatterns: {
    primary: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23EFC79F' fill-opacity='0.05'%3E%3Cpath d='M60 60c0-16.569-13.431-30-30-30s-30 13.431-30 30 13.431 30 30 30 30-13.431 30-30zm30-30c16.569 0 30 13.431 30 30s-13.431 30-30 30-30-13.431-30-30 13.431-30 30-30z'/%3E%3C/g%3E%3C/svg%3E")`,
    secondary: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D7AF87' fill-opacity='0.03'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20-20c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
    accent: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23CDA57D' fill-opacity='0.02'%3E%3Crect x='0' y='0' width='20' height='20'/%3E%3Crect x='20' y='20' width='20' height='20'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  
  soundscape: {
    ambient: '/sounds/desert-ambient.mp3',
    interaction: '/sounds/desert-chime.mp3',
    transition: '/sounds/desert-transition.mp3',
  },
  
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    focusVisible: true,
  },
};

export default desertWisdomTheme;
