/**
 * Custom Theme Hook
 * Provides convenient access to theme functionality and utilities
 */

import { useContext, useMemo } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { ThemeConfig, ThemeMode } from '../types/theme';

/**
 * Main theme hook - re-exports the context hook for convenience
 */
export { useTheme } from '../contexts/ThemeContext';

/**
 * Hook for getting theme-aware CSS classes
 */
export const useThemeClasses = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeClasses must be used within a ThemeProvider');
  }

  const { theme, mode } = context;

  return useMemo(() => ({
    // Base theme classes
    theme: `theme-${theme.id}`,
    mode: `mode-${mode}`,
    
    // Color classes
    primary: {
      bg: 'bg-primary-500',
      bgLight: 'bg-primary-100',
      bgDark: 'bg-primary-700',
      text: 'text-primary-600',
      textLight: 'text-primary-400',
      textDark: 'text-primary-800',
      border: 'border-primary-300',
      ring: 'ring-primary-500',
    },
    
    secondary: {
      bg: 'bg-secondary-500',
      bgLight: 'bg-secondary-100',
      bgDark: 'bg-secondary-700',
      text: 'text-secondary-600',
      textLight: 'text-secondary-400',
      textDark: 'text-secondary-800',
      border: 'border-secondary-300',
      ring: 'ring-secondary-500',
    },
    
    accent: {
      bg: 'bg-accent-500',
      bgLight: 'bg-accent-100',
      bgDark: 'bg-accent-700',
      text: 'text-accent-600',
      textLight: 'text-accent-400',
      textDark: 'text-accent-800',
      border: 'border-accent-300',
      ring: 'ring-accent-500',
    },
    
    spiritual: {
      bg: 'bg-spiritual-light',
      text: 'text-spiritual-dark',
      glow: 'shadow-spiritual',
      border: 'border-spiritual-medium',
    },
    
    // Animation classes
    animations: {
      fade: 'transition-opacity duration-normal ease-spiritual',
      scale: 'transition-transform duration-normal ease-spiritual hover:scale-105',
      glow: 'transition-shadow duration-normal ease-spiritual hover:shadow-glow',
      float: 'animate-float-up',
    },
    
    // Layout classes
    container: 'container-custom',
    card: 'card bg-white shadow-md rounded-spiritual',
    button: {
      primary: 'btn btn-primary',
      secondary: 'btn btn-secondary',
      accent: 'btn btn-accent',
      ghost: 'btn btn-ghost',
    },
  }), [theme.id, mode]);
};

/**
 * Hook for getting theme-aware styles
 */
export const useThemeStyles = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeStyles must be used within a ThemeProvider');
  }

  const { theme, mode, getCSSVariables } = context;

  return useMemo(() => ({
    // CSS variables
    variables: getCSSVariables(),
    
    // Inline styles for dynamic theming
    primary: {
      backgroundColor: theme.colors.primary.DEFAULT,
      color: mode === 'dark' ? theme.colors.primary[100] : theme.colors.primary[900],
    },
    
    secondary: {
      backgroundColor: theme.colors.secondary.DEFAULT,
      color: mode === 'dark' ? theme.colors.secondary[100] : theme.colors.secondary[900],
    },
    
    accent: {
      backgroundColor: theme.colors.accent.DEFAULT,
      color: mode === 'dark' ? theme.colors.accent[100] : theme.colors.accent[900],
    },
    
    spiritual: {
      backgroundColor: theme.colors.spiritual.light,
      color: theme.colors.spiritual.dark,
      boxShadow: theme.shadows.spiritual,
    },
    
    gradient: {
      primary: { background: theme.colors.gradients.primary },
      secondary: { background: theme.colors.gradients.secondary },
      accent: { background: theme.colors.gradients.accent },
      spiritual: { background: theme.colors.gradients.spiritual },
    },
  }), [theme, mode, getCSSVariables]);
};

/**
 * Hook for theme-aware animations
 */
export const useThemeAnimations = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeAnimations must be used within a ThemeProvider');
  }

  const { theme, preferences } = context;

  return useMemo(() => {
    // Return no animations if reduced motion is preferred
    if (preferences.reducedMotion) {
      return {
        duration: { fast: '0ms', normal: '0ms', slow: '0ms', slower: '0ms' },
        easing: { ease: 'linear', easeIn: 'linear', easeOut: 'linear', easeInOut: 'linear', spiritual: 'linear' },
        keyframes: {},
      };
    }

    return theme.animations;
  }, [theme.animations, preferences.reducedMotion]);
};

/**
 * Hook for responsive theme utilities
 */
export const useResponsiveTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useResponsiveTheme must be used within a ThemeProvider');
  }

  const { theme } = context;

  return useMemo(() => ({
    // Responsive spacing
    spacing: {
      mobile: {
        xs: theme.spacing.xs,
        sm: theme.spacing.sm,
        md: theme.spacing.md,
        lg: theme.spacing.lg,
      },
      tablet: {
        xs: theme.spacing.sm,
        sm: theme.spacing.md,
        md: theme.spacing.lg,
        lg: theme.spacing.xl,
      },
      desktop: {
        xs: theme.spacing.md,
        sm: theme.spacing.lg,
        md: theme.spacing.xl,
        lg: theme.spacing['2xl'],
      },
    },
    
    // Responsive typography
    typography: {
      mobile: {
        h1: theme.typography.fontSize['2xl'],
        h2: theme.typography.fontSize.xl,
        h3: theme.typography.fontSize.lg,
        body: theme.typography.fontSize.sm,
      },
      tablet: {
        h1: theme.typography.fontSize['3xl'],
        h2: theme.typography.fontSize['2xl'],
        h3: theme.typography.fontSize.xl,
        body: theme.typography.fontSize.base,
      },
      desktop: {
        h1: theme.typography.fontSize['4xl'],
        h2: theme.typography.fontSize['3xl'],
        h3: theme.typography.fontSize['2xl'],
        body: theme.typography.fontSize.base,
      },
    },
  }), [theme]);
};

/**
 * Hook for theme accessibility features
 */
export const useThemeAccessibility = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeAccessibility must be used within a ThemeProvider');
  }

  const { theme, preferences, mode } = context;

  return useMemo(() => ({
    // High contrast mode
    isHighContrast: preferences.highContrast,
    
    // Reduced motion
    prefersReducedMotion: preferences.reducedMotion,
    
    // Focus styles
    focusRing: theme.accessibility.focusVisible ? 'focus:ring-2 focus:ring-primary-500 focus:outline-none' : '',
    
    // Color contrast helpers
    getContrastColor: (backgroundColor: string) => {
      // Simple contrast calculation - in production, use a proper contrast library
      return mode === 'dark' ? theme.colors.neutral[100] : theme.colors.neutral[900];
    },
    
    // ARIA attributes for theme
    themeAttributes: {
      'data-theme': theme.id,
      'data-mode': mode,
      'data-high-contrast': preferences.highContrast,
      'data-reduced-motion': preferences.reducedMotion,
    },
  }), [theme, preferences, mode]);
};
