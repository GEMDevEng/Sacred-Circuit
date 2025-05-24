/**
 * Theme System Entry Point
 * Exports all available themes and theme utilities
 */

import { ThemeConfig } from '../types/theme';

// Import individual theme configurations
import sacredLotusTheme from './sacred-lotus';
import forestSanctuaryTheme from './forest-sanctuary';
import celestialHealingTheme from './celestial-healing';
import desertWisdomTheme from './desert-wisdom';
import oceanDepthsTheme from './ocean-depths';

// Default theme (Sacred Lotus)
export const DEFAULT_THEME_ID = 'sacred-lotus';

// All available themes
export const AVAILABLE_THEMES: ThemeConfig[] = [
  sacredLotusTheme,
  forestSanctuaryTheme,
  celestialHealingTheme,
  desertWisdomTheme,
  oceanDepthsTheme,
];

// Theme utilities
export const getThemeById = (id: string): ThemeConfig | undefined => {
  return AVAILABLE_THEMES.find(theme => theme.id === id);
};

export const getDefaultTheme = (): ThemeConfig => {
  return getThemeById(DEFAULT_THEME_ID) || AVAILABLE_THEMES[0];
};

export const validateTheme = (theme: Partial<ThemeConfig>): boolean => {
  return !!(
    theme.id &&
    theme.name &&
    theme.colors &&
    theme.typography &&
    theme.spacing
  );
};

// CSS variable generation
export const generateCSSVariables = (theme: ThemeConfig, mode: 'light' | 'dark' = 'light'): Record<string, string> => {
  const variables: Record<string, string> = {};
  
  // Color variables
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    variables[`--color-primary-${key}`] = value;
  });
  
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    variables[`--color-secondary-${key}`] = value;
  });
  
  Object.entries(theme.colors.accent).forEach(([key, value]) => {
    variables[`--color-accent-${key}`] = value;
  });
  
  Object.entries(theme.colors.neutral).forEach(([key, value]) => {
    variables[`--color-neutral-${key}`] = value;
  });
  
  Object.entries(theme.colors.spiritual).forEach(([key, value]) => {
    variables[`--color-spiritual-${key}`] = value;
  });
  
  // Gradient variables
  Object.entries(theme.colors.gradients).forEach(([key, value]) => {
    variables[`--gradient-${key}`] = value;
  });
  
  // Typography variables
  variables['--font-serif'] = theme.typography.fontFamily.serif.join(', ');
  variables['--font-sans'] = theme.typography.fontFamily.sans.join(', ');
  variables['--font-spiritual'] = theme.typography.fontFamily.spiritual.join(', ');
  
  // Spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value;
  });
  
  // Animation variables
  Object.entries(theme.animations.duration).forEach(([key, value]) => {
    variables[`--duration-${key}`] = value;
  });
  
  Object.entries(theme.animations.easing).forEach(([key, value]) => {
    variables[`--easing-${key}`] = value;
  });
  
  // Shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    variables[`--shadow-${key}`] = value;
  });
  
  // Border radius variables
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    variables[`--radius-${key}`] = value;
  });
  
  return variables;
};

// Apply CSS variables to document
export const applyCSSVariables = (variables: Record<string, string>): void => {
  const root = document.documentElement;
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

// Remove CSS variables from document
export const removeCSSVariables = (variables: Record<string, string>): void => {
  const root = document.documentElement;
  Object.keys(variables).forEach(property => {
    root.style.removeProperty(property);
  });
};

// Export individual themes
export {
  sacredLotusTheme,
  forestSanctuaryTheme,
  celestialHealingTheme,
  desertWisdomTheme,
  oceanDepthsTheme,
};

// Export types
export type { ThemeConfig, ThemeMode, ThemeState, ThemeContextType } from '../types/theme';
