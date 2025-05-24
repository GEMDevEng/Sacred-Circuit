/**
 * Theme System Types for Sacred Circuit
 * Defines the structure and interfaces for the spiritual theme system
 */

export interface ThemeColors {
  // Primary colors
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    DEFAULT: string;
  };
  
  // Secondary colors
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    DEFAULT: string;
  };
  
  // Accent colors
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    DEFAULT: string;
  };
  
  // Neutral colors
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Spiritual element colors
  spiritual: {
    light: string;
    medium: string;
    dark: string;
    glow: string;
  };
  
  // Background gradients
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    spiritual: string;
  };
}

export interface ThemeTypography {
  fontFamily: {
    serif: string[];
    sans: string[];
    spiritual: string[];
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
}

export interface ThemeAnimations {
  duration: {
    fast: string;
    normal: string;
    slow: string;
    slower: string;
  };
  easing: {
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spiritual: string;
  };
  keyframes: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  spiritual: string;
  glow: string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
  spiritual: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  category: 'spiritual' | 'nature' | 'celestial' | 'earth' | 'water';
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  animations: ThemeAnimations;
  shadows: ThemeShadows;
  borderRadius: ThemeBorderRadius;
  backgroundPatterns: {
    primary: string;
    secondary: string;
    accent: string;
  };
  soundscape?: {
    ambient: string;
    interaction: string;
    transition: string;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    focusVisible: boolean;
  };
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  currentTheme: ThemeConfig;
  mode: ThemeMode;
  isLoading: boolean;
  availableThemes: ThemeConfig[];
  preferences: {
    autoMode: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    soundEnabled: boolean;
  };
}

export interface ThemeContextType {
  // State
  theme: ThemeConfig;
  mode: ThemeMode;
  isLoading: boolean;
  availableThemes: ThemeConfig[];
  preferences: ThemeState['preferences'];
  
  // Actions
  setTheme: (themeId: string) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  updatePreferences: (preferences: Partial<ThemeState['preferences']>) => void;
  resetToDefault: () => void;
  
  // Utilities
  getThemeById: (id: string) => ThemeConfig | undefined;
  isThemeActive: (themeId: string) => boolean;
  getCSSVariables: () => Record<string, string>;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

// Theme validation schema
export interface ThemeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Theme customization options
export interface ThemeCustomization {
  colors?: Partial<ThemeColors>;
  typography?: Partial<ThemeTypography>;
  animations?: Partial<ThemeAnimations>;
  preferences?: Partial<ThemeState['preferences']>;
}
