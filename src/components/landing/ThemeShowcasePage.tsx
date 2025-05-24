/**
 * Theme Showcase Page
 * Demonstrates all the spiritual themes and their features
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Heart, Sparkles, Leaf, Mountain, Waves } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import ThemeSelector from '../common/ThemeSelector';
import Button from '../common/Button';

const ThemeShowcasePage: React.FC = () => {
  const { theme } = useTheme();

  const themeFeatures = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Sacred Lotus',
      description: 'Soft purples and golds representing spiritual awakening and enlightenment',
      colors: ['#B48CFF', '#FFE4AF', '#EBB969'],
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Forest Sanctuary',
      description: 'Earth tones and greens connecting you to nature\'s healing energy',
      colors: ['#69C369', '#C3AF91', '#EBC387'],
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Celestial Healing',
      description: 'Deep blues and silvers channeling cosmic healing energies',
      colors: ['#6991FF', '#B9C3D7', '#CDD5E1'],
    },
    {
      icon: <Mountain className="w-6 h-6" />,
      title: 'Desert Wisdom',
      description: 'Warm sands and terracotta evoking ancient wisdom and inner strength',
      colors: ['#EBB987', '#D7AF87', '#CDA57D'],
    },
    {
      icon: <Waves className="w-6 h-6" />,
      title: 'Ocean Depths',
      description: 'Aqua blues and flowing animations promoting emotional healing',
      colors: ['#69EBFF', '#AFE1EB', '#9BD7E1'],
    },
  ];

  const componentExamples = [
    {
      title: 'Sacred Cards',
      component: (
        <div className="sacred-card">
          <h3 className="text-lg font-semibold mb-2 spiritual-text">Sacred Wisdom</h3>
          <p className="text-sm text-gray-600">
            This is an example of a sacred card component with spiritual styling and gentle animations.
          </p>
        </div>
      ),
    },
    {
      title: 'Spiritual Quotes',
      component: (
        <div className="spiritual-quote">
          "The lotus flower blooms most beautifully from the deepest and thickest mud."
          <span className="block text-xs mt-2 opacity-75">- Buddhist Proverb</span>
        </div>
      ),
    },
    {
      title: 'Meditation Box',
      component: (
        <div className="meditation-box">
          <h4 className="font-medium mb-2 spiritual-text">Mindful Moment</h4>
          <p className="text-sm">
            Take a deep breath and center yourself in this moment of peace and tranquility.
          </p>
        </div>
      ),
    },
    {
      title: 'Healing Highlight',
      component: (
        <p className="text-sm">
          This text contains a <span className="healing-highlight">healing highlight</span> that 
          draws attention to important spiritual concepts.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container-custom py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Palette className="w-8 h-8 text-primary-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-serif text-primary-600">
              Spiritual Theme System
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the beauty and tranquility of our five carefully crafted spiritual themes, 
            each designed to enhance your healing journey and create a sacred digital space.
          </p>
        </motion.div>

        {/* Current Theme Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="sacred-card text-center animate-theme">
            <h2 className="text-2xl font-serif text-primary-700 mb-2">
              Currently Active: {theme.name}
            </h2>
            <p className="text-gray-600 mb-4">{theme.description}</p>
            <div className="flex justify-center space-x-2 mb-4">
              <div 
                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: theme.colors.primary.DEFAULT }}
              />
              <div 
                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: theme.colors.secondary.DEFAULT }}
              />
              <div 
                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: theme.colors.accent.DEFAULT }}
              />
            </div>
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium capitalize">
              {theme.category}
            </span>
          </div>
        </motion.div>

        {/* Theme Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-serif text-center mb-8 text-gray-800">
            Choose Your Sacred Theme
          </h2>
          <div className="max-w-4xl mx-auto">
            <ThemeSelector showPreferences={true} />
          </div>
        </motion.div>

        {/* Theme Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-serif text-center mb-8 text-gray-800">
            Spiritual Theme Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themeFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="sacred-card hover:shadow-glow"
              >
                <div className="flex items-center mb-3">
                  <div className="text-primary-600 mr-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                <div className="flex space-x-2">
                  {feature.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Component Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-serif text-center mb-8 text-gray-800">
            Spiritual UI Components
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {componentExamples.map((example, index) => (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 spiritual-text">
                  {example.title}
                </h3>
                {example.component}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-serif text-center mb-8 text-gray-800">
            Interactive Elements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="primary" className="spiritual-button">
              Primary Button
            </Button>
            <Button variant="secondary" className="spiritual-button">
              Secondary Button
            </Button>
            <Button variant="accent" className="spiritual-button">
              Accent Button
            </Button>
            <Button variant="outline" className="spiritual-button">
              Outline Button
            </Button>
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="sacred-card"
        >
          <h2 className="text-2xl font-serif text-center mb-8 text-gray-800">
            Theme System Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Palette className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Dynamic Theming</h3>
              <p className="text-sm text-gray-600">
                Seamlessly switch between themes with smooth transitions and animations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="font-semibold mb-2">Spiritual Aesthetics</h3>
              <p className="text-sm text-gray-600">
                Carefully crafted colors and typography that promote healing and peace.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="font-semibold mb-2">Accessibility First</h3>
              <p className="text-sm text-gray-600">
                WCAG 2.1 compliant with reduced motion and high contrast options.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThemeShowcasePage;
