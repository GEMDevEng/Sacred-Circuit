/**
 * Theme Selector Component
 * Provides a beautiful interface for users to switch between spiritual themes
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sun, Moon, Settings, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { ThemeConfig } from '../../types/theme';

interface ThemeSelectorProps {
  className?: string;
  showPreferences?: boolean;
  compact?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  className = '',
  showPreferences = true,
  compact = false,
}) => {
  const {
    theme,
    mode,
    availableThemes,
    preferences,
    isLoading,
    setTheme,
    setMode,
    toggleMode,
    updatePreferences,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleThemeChange = async (themeId: string) => {
    await setTheme(themeId);
    if (compact) {
      setIsOpen(false);
    }
  };

  const getThemeIcon = (themeConfig: ThemeConfig) => {
    const iconMap = {
      'sacred-lotus': '🪷',
      'forest-sanctuary': '🌲',
      'celestial-healing': '⭐',
      'desert-wisdom': '🏜️',
      'ocean-depths': '🌊',
    };
    return iconMap[themeConfig.id as keyof typeof iconMap] || '🎨';
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      spiritual: 'text-purple-600 bg-purple-100',
      nature: 'text-green-600 bg-green-100',
      celestial: 'text-blue-600 bg-blue-100',
      earth: 'text-orange-600 bg-orange-100',
      water: 'text-cyan-600 bg-cyan-100',
    };
    return colorMap[category as keyof typeof colorMap] || 'text-gray-600 bg-gray-100';
  };

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
          disabled={isLoading}
        >
          <Palette className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium">{getThemeIcon(theme)}</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-2 min-w-48 z-50"
            >
              <div className="grid grid-cols-1 gap-1">
                {availableThemes.map((themeConfig) => (
                  <motion.button
                    key={themeConfig.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange(themeConfig.id)}
                    className={`flex items-center space-x-3 p-2 rounded-md text-left transition-colors ${
                      theme.id === themeConfig.id
                        ? 'bg-primary-100 text-primary-800'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{getThemeIcon(themeConfig)}</span>
                    <div>
                      <div className="font-medium text-sm">{themeConfig.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{themeConfig.category}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-800">Spiritual Themes</h3>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMode}
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
            >
              {mode === 'light' ? (
                <Moon className="w-4 h-4 text-gray-600" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-500" />
              )}
            </motion.button>
            {showPreferences && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                title="Theme preferences"
              >
                <Settings className="w-4 h-4 text-gray-600" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Current Theme Display */}
      <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getThemeIcon(theme)}</div>
          <div>
            <h4 className="font-semibold text-gray-800">{theme.name}</h4>
            <p className="text-sm text-gray-600">{theme.description}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(theme.category)}`}>
              {theme.category}
            </span>
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableThemes.map((themeConfig) => (
            <motion.button
              key={themeConfig.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleThemeChange(themeConfig.id)}
              disabled={isLoading}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                theme.id === themeConfig.id
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-xl">{getThemeIcon(themeConfig)}</div>
                <div className="flex-1 text-left">
                  <h5 className="font-medium text-gray-800">{themeConfig.name}</h5>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {themeConfig.description}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(themeConfig.category)}`}>
                    {themeConfig.category}
                  </span>
                </div>
              </div>
              
              {/* Color Preview */}
              <div className="flex space-x-1 mt-3">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: themeConfig.colors.primary.DEFAULT }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: themeConfig.colors.secondary.DEFAULT }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: themeConfig.colors.accent.DEFAULT }}
                />
              </div>

              {theme.id === themeConfig.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Preferences Panel */}
      <AnimatePresence>
        {showSettings && showPreferences && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 bg-gray-50"
          >
            <div className="p-4 space-y-4">
              <h4 className="font-medium text-gray-800 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Preferences</span>
              </h4>
              
              <div className="space-y-3">
                {/* Sound Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {preferences.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-gray-600" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-gray-600" />
                    )}
                    <span className="text-sm text-gray-700">Sound Effects</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updatePreferences({ soundEnabled: !preferences.soundEnabled })}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      preferences.soundEnabled ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: preferences.soundEnabled ? 16 : 0 }}
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </motion.button>
                </div>

                {/* Reduced Motion Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {preferences.reducedMotion ? (
                      <EyeOff className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-600" />
                    )}
                    <span className="text-sm text-gray-700">Reduce Motion</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updatePreferences({ reducedMotion: !preferences.reducedMotion })}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      preferences.reducedMotion ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: preferences.reducedMotion ? 16 : 0 }}
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </motion.button>
                </div>

                {/* High Contrast Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-600 rounded" />
                    <span className="text-sm text-gray-700">High Contrast</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updatePreferences({ highContrast: !preferences.highContrast })}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      preferences.highContrast ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: preferences.highContrast ? 16 : 0 }}
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </motion.button>
                </div>

                {/* Auto Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-blue-600 rounded-full" />
                    <span className="text-sm text-gray-700">Auto Dark Mode</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updatePreferences({ autoMode: !preferences.autoMode })}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      preferences.autoMode ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: preferences.autoMode ? 16 : 0 }}
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Applying theme...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
