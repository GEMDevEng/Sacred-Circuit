# Sacred Circuit - Spiritual Theme System Documentation

## Overview

The Sacred Circuit Spiritual Theme System is a comprehensive, WordPress-style theming solution that provides five beautifully crafted spiritual themes. Each theme is designed to enhance the user's healing journey and create a sacred digital space.

## Architecture

### Core Components

1. **Theme Context & Provider** (`src/contexts/ThemeContext.tsx`)
   - Manages global theme state
   - Handles theme switching and persistence
   - Provides accessibility preferences

2. **Theme Configuration** (`src/themes/`)
   - JSON-based theme definitions
   - CSS custom properties integration
   - Type-safe theme structure

3. **Enhanced Tailwind Configuration** (`tailwind.config.js`)
   - Dynamic color system using CSS variables
   - Theme-aware utility classes
   - Sacred geometry patterns and animations

4. **Theme Hooks** (`src/hooks/useTheme.ts`)
   - Convenient access to theme functionality
   - Theme-aware CSS classes and styles
   - Responsive and accessibility utilities

## Available Themes

### 1. Sacred Lotus Theme
- **Colors**: Soft purples, golds, lotus motifs
- **Concept**: Spiritual awakening and enlightenment
- **Primary**: `#B48CFF` (Purple)
- **Secondary**: `#FFE4AF` (Gold)
- **Accent**: `#EBB969` (Warm Gold)
- **Animations**: Lotus bloom, spiritual glow, floating elements

### 2. Forest Sanctuary Theme
- **Colors**: Earth tones, greens, nature elements
- **Concept**: Grounding and natural healing
- **Primary**: `#69C369` (Forest Green)
- **Secondary**: `#C3AF91` (Earth Beige)
- **Accent**: `#EBC387` (Warm Earth)
- **Animations**: Leaf rustle, growth pulse, natural flow

### 3. Celestial Healing Theme
- **Colors**: Deep blues, silvers, star patterns
- **Concept**: Cosmic connection and divine healing
- **Primary**: `#6991FF` (Cosmic Blue)
- **Secondary**: `#B9C3D7` (Silver Blue)
- **Accent**: `#CDD5E1` (Light Silver)
- **Animations**: Star twinkle, cosmic pulse, celestial float

### 4. Desert Wisdom Theme
- **Colors**: Warm sands, terracotta, minimalist
- **Concept**: Ancient wisdom and inner strength
- **Primary**: `#EBB987` (Desert Sand)
- **Secondary**: `#D7AF87` (Warm Sand)
- **Accent**: `#CDA57D` (Terracotta)
- **Animations**: Sand shift, wisdom glow, desert breeze

### 5. Ocean Depths Theme
- **Colors**: Aqua blues, flowing animations
- **Concept**: Emotional healing and fluidity
- **Primary**: `#69EBFF` (Ocean Blue)
- **Secondary**: `#AFE1EB` (Soft Aqua)
- **Accent**: `#9BD7E1` (Light Aqua)
- **Animations**: Ocean wave, fluid pulse, current flow

## Usage

### Basic Theme Usage

```tsx
import { useTheme } from '../hooks/useTheme';

const MyComponent = () => {
  const { theme, setTheme, mode, toggleMode } = useTheme();
  
  return (
    <div className="bg-primary-500 text-white">
      <h1>Current theme: {theme.name}</h1>
      <button onClick={() => setTheme('sacred-lotus')}>
        Switch to Sacred Lotus
      </button>
      <button onClick={toggleMode}>
        Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>
  );
};
```

### Theme-Aware Styling

```tsx
import { useThemeClasses, useThemeStyles } from '../hooks/useTheme';

const StyledComponent = () => {
  const classes = useThemeClasses();
  const styles = useThemeStyles();
  
  return (
    <div className={`${classes.primary.bg} ${classes.animations.glow}`}>
      <div style={styles.gradient.spiritual}>
        Spiritual gradient background
      </div>
    </div>
  );
};
```

### Spiritual Components

```tsx
// Sacred Card
<div className="sacred-card">
  <h3 className="spiritual-text">Sacred Wisdom</h3>
  <p>Content with spiritual styling</p>
</div>

// Spiritual Quote
<div className="spiritual-quote">
  "The lotus flower blooms most beautifully from the deepest mud."
</div>

// Meditation Box
<div className="meditation-box">
  <h4 className="spiritual-text">Mindful Moment</h4>
  <p>Meditation content</p>
</div>

// Healing Highlight
<p>Text with <span className="healing-highlight">healing highlight</span></p>
```

## Theme Selector Component

The `ThemeSelector` component provides a beautiful interface for theme switching:

```tsx
import ThemeSelector from '../components/common/ThemeSelector';

// Full theme selector with preferences
<ThemeSelector showPreferences={true} />

// Compact version for headers
<ThemeSelector compact={true} showPreferences={false} />
```

## Accessibility Features

### WCAG 2.1 Compliance
- High contrast mode support
- Reduced motion preferences
- Focus-visible indicators
- Keyboard navigation support

### Accessibility Preferences

```tsx
const { preferences, updatePreferences } = useTheme();

// Enable high contrast
updatePreferences({ highContrast: true });

// Reduce motion for sensitive users
updatePreferences({ reducedMotion: true });

// Enable sound effects
updatePreferences({ soundEnabled: true });

// Auto dark mode based on system preference
updatePreferences({ autoMode: true });
```

## CSS Custom Properties

The theme system uses CSS custom properties for dynamic theming:

```css
/* Color variables */
--color-primary-500: #6A9BD8;
--color-secondary-500: #F5F5DC;
--color-accent-500: #A8D5BA;

/* Gradient variables */
--gradient-primary: linear-gradient(135deg, #F8F4FF 0%, #D2BAFF 50%, #B48CFF 100%);
--gradient-spiritual: radial-gradient(circle, rgba(180, 140, 255, 0.1) 0%, rgba(235, 185, 105, 0.05) 100%);

/* Animation variables */
--duration-normal: 300ms;
--easing-spiritual: cubic-bezier(0.4, 0, 0.2, 1);

/* Shadow variables */
--shadow-spiritual: 0 0 20px rgba(180, 140, 255, 0.3);
--shadow-glow: 0 0 15px rgba(180, 140, 255, 0.4);
```

## Animations

### Theme-Specific Animations

Each theme includes unique animations that reflect its spiritual essence:

```css
/* Sacred Lotus */
.theme-sacred-lotus .animate-theme {
  animation: lotus-bloom 2s ease-in-out infinite;
}

/* Forest Sanctuary */
.theme-forest-sanctuary .animate-theme {
  animation: leaf-rustle 4s ease-in-out infinite;
}

/* Celestial Healing */
.theme-celestial-healing .animate-theme {
  animation: star-twinkle 2s ease-in-out infinite;
}

/* Desert Wisdom */
.theme-desert-wisdom .animate-theme {
  animation: sand-shift 5s ease-in-out infinite;
}

/* Ocean Depths */
.theme-ocean-depths .animate-theme {
  animation: ocean-wave 4s ease-in-out infinite;
}
```

### Accessibility Considerations

```css
/* Respect user's motion preferences */
.reduce-motion .animate-theme,
.reduce-motion [class*="animate-"] {
  animation: none !important;
  transition-duration: 0.01ms !important;
}
```

## Performance Optimization

### CSS Variable Caching
- CSS variables are generated once and cached
- Smooth transitions between themes
- Minimal layout shifts during theme changes

### Lazy Loading
- Theme configurations are loaded on demand
- Optimized bundle sizes
- Progressive enhancement

### Memory Management
- Efficient state management with React Context
- Cleanup of event listeners
- Optimized re-renders with useMemo and useCallback

## Browser Support

- Modern browsers with CSS custom properties support
- Graceful fallbacks for older browsers
- Progressive enhancement approach

## Testing

### Unit Tests
```bash
npm run test:client -- --testPathPattern=theme
```

### E2E Tests
```bash
npm run cypress:run -- --spec "cypress/e2e/theme*.cy.js"
```

### Accessibility Testing
- Automated accessibility testing with axe-core
- Manual testing with screen readers
- Color contrast validation

## Customization

### Creating Custom Themes

1. Create a new theme configuration file:

```typescript
// src/themes/my-custom-theme.ts
import { ThemeConfig } from '../types/theme';

const myCustomTheme: ThemeConfig = {
  id: 'my-custom-theme',
  name: 'My Custom Theme',
  description: 'A custom spiritual theme',
  category: 'spiritual',
  colors: {
    // Define your color palette
  },
  // ... other configuration
};

export default myCustomTheme;
```

2. Add to available themes:

```typescript
// src/themes/index.ts
import myCustomTheme from './my-custom-theme';

export const AVAILABLE_THEMES: ThemeConfig[] = [
  // ... existing themes
  myCustomTheme,
];
```

### Extending Components

```tsx
// Create theme-aware components
const MyComponent = () => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="p-4 rounded-spiritual"
      style={{ 
        backgroundColor: theme.colors.primary[100],
        color: theme.colors.primary[800]
      }}
    >
      Theme-aware content
    </div>
  );
};
```

## Best Practices

### Theme Design
1. Maintain consistent color relationships across themes
2. Ensure sufficient color contrast for accessibility
3. Use meaningful color semantics (primary, secondary, accent)
4. Test themes in both light and dark modes

### Performance
1. Use CSS custom properties for dynamic values
2. Minimize theme switching overhead
3. Implement proper loading states
4. Cache theme preferences in localStorage

### Accessibility
1. Always provide high contrast alternatives
2. Respect user's motion preferences
3. Ensure keyboard navigation works
4. Test with screen readers

### Development
1. Use TypeScript for type safety
2. Follow the established naming conventions
3. Document new theme features
4. Write tests for theme functionality

## Troubleshooting

### Common Issues

1. **Theme not applying**: Check if ThemeProvider wraps your app
2. **CSS variables not working**: Ensure modern browser support
3. **Animations not showing**: Check reduced motion preferences
4. **Colors not updating**: Verify CSS custom property names

### Debug Mode

```tsx
const { getCSSVariables } = useTheme();

// Log current CSS variables
console.log('Current theme variables:', getCSSVariables());
```

## Future Enhancements

### Planned Features
- Theme marketplace for community themes
- Advanced customization tools
- Theme preview mode
- Seasonal theme variations
- Integration with user mood tracking

### API Improvements
- Theme validation utilities
- Theme migration tools
- Performance monitoring
- Analytics integration

## Contributing

To contribute to the theme system:

1. Follow the established patterns
2. Add comprehensive tests
3. Update documentation
4. Ensure accessibility compliance
5. Test across different devices and browsers

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
