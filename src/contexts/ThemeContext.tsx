/**
 * Theme Context for Sacred Circuit
 * Manages theme state, preferences, and provides theme switching functionality
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { ThemeConfig, ThemeMode, ThemeState, ThemeContextType, ThemeProviderProps } from '../types/theme';
import {
  AVAILABLE_THEMES,
  getDefaultTheme,
  getThemeById,
  generateCSSVariables,
  applyCSSVariables,
  DEFAULT_THEME_ID
} from '../themes/index';

// Create the Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  THEME: 'sacred-circuit-theme',
  MODE: 'sacred-circuit-mode',
  PREFERENCES: 'sacred-circuit-theme-preferences',
} as const;

// Default preferences
const DEFAULT_PREFERENCES: ThemeState['preferences'] = {
  autoMode: false,
  reducedMotion: false,
  highContrast: false,
  soundEnabled: true,
};

/**
 * Theme Provider Component
 * Wraps the application and provides theme context to all children
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = DEFAULT_THEME_ID,
  defaultMode = 'light',
  storageKey = STORAGE_KEYS.THEME,
}) => {
  // Initialize state
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
    // Try to load theme from localStorage
    if (typeof window !== 'undefined') {
      const savedThemeId = localStorage.getItem(storageKey);
      if (savedThemeId) {
        const theme = getThemeById(savedThemeId);
        if (theme) return theme;
      }
    }
    // Fallback to default theme
    return getThemeById(defaultTheme) || getDefaultTheme();
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    // Try to load mode from localStorage
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem(STORAGE_KEYS.MODE) as ThemeMode;
      if (savedMode === 'light' || savedMode === 'dark') {
        return savedMode;
      }
    }
    return defaultMode;
  });

  const [preferences, setPreferencesState] = useState<ThemeState['preferences']>(() => {
    // Try to load preferences from localStorage
    if (typeof window !== 'undefined') {
      const savedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (savedPreferences) {
        try {
          return { ...DEFAULT_PREFERENCES, ...JSON.parse(savedPreferences) };
        } catch (error) {
          console.warn('Failed to parse saved theme preferences:', error);
        }
      }
    }
    return DEFAULT_PREFERENCES;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Apply CSS variables when theme or mode changes
  useEffect(() => {
    const variables = generateCSSVariables(currentTheme, mode);
    applyCSSVariables(variables);

    // Apply theme class to body for additional styling
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .replace(/mode-\w+/g, '');
    document.body.classList.add(`theme-${currentTheme.id}`, `mode-${mode}`);

    // Apply accessibility preferences
    if (preferences.reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }

    if (preferences.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [currentTheme, mode, preferences.reducedMotion, preferences.highContrast]);

  // Auto mode detection
  useEffect(() => {
    if (!preferences.autoMode) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setModeState(e.matches ? 'dark' : 'light');
    };

    // Set initial mode based on system preference
    setModeState(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences.autoMode]);

  // Persist theme to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, currentTheme.id);
    }
  }, [currentTheme.id, storageKey]);

  // Persist mode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MODE, mode);
    }
  }, [mode]);

  // Persist preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    }
  }, [preferences]);

  // Theme switching function
  const setTheme = useCallback(async (themeId: string) => {
    const theme = getThemeById(themeId);
    if (!theme) {
      console.warn(`Theme with id "${themeId}" not found`);
      return;
    }

    setIsLoading(true);

    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 150));

    setCurrentTheme(theme);
    setIsLoading(false);

    // Play transition sound if enabled
    if (preferences.soundEnabled && theme.soundscape?.transition) {
      try {
        const audio = new Audio(theme.soundscape.transition);
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Ignore audio play errors (user interaction required)
        });
      } catch (error) {
        // Ignore audio errors
      }
    }
  }, [preferences.soundEnabled]);

  // Mode switching functions
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState(prevMode => prevMode === 'light' ? 'dark' : 'light');
  }, []);

  // Preferences update function
  const updatePreferences = useCallback((newPreferences: Partial<ThemeState['preferences']>) => {
    setPreferencesState(prev => ({ ...prev, ...newPreferences }));
  }, []);

  // Reset to default function
  const resetToDefault = useCallback(() => {
    const defaultThemeConfig = getDefaultTheme();
    setCurrentTheme(defaultThemeConfig);
    setModeState('light');
    setPreferencesState(DEFAULT_PREFERENCES);
  }, []);

  // Utility functions
  const isThemeActive = useCallback((themeId: string) => {
    return currentTheme.id === themeId;
  }, [currentTheme.id]);

  const getCSSVariables = useCallback(() => {
    return generateCSSVariables(currentTheme, mode);
  }, [currentTheme, mode]);

  // Memoized context value
  const contextValue = useMemo<ThemeContextType>(() => ({
    // State
    theme: currentTheme,
    mode,
    isLoading,
    availableThemes: AVAILABLE_THEMES,
    preferences,

    // Actions
    setTheme,
    setMode,
    toggleMode,
    updatePreferences,
    resetToDefault,

    // Utilities
    getThemeById,
    isThemeActive,
    getCSSVariables,
  }), [
    currentTheme,
    mode,
    isLoading,
    preferences,
    setTheme,
    setMode,
    toggleMode,
    updatePreferences,
    resetToDefault,
    isThemeActive,
    getCSSVariables,
  ]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the Theme Context
 * Provides access to theme state and functions
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

/**
 * Higher-order component for theme-aware components
 */
export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: ThemeConfig; mode: ThemeMode }>
) => {
  const WrappedComponent = (props: P) => {
    const { theme, mode } = useTheme();
    return <Component {...props} theme={theme} mode={mode} />;
  };

  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export { ThemeContext };
export default ThemeContext;
