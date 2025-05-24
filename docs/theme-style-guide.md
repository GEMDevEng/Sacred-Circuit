# Sacred Circuit - Theme Style Guide

## Design Philosophy

The Sacred Circuit theme system is built on the principle of creating sacred digital spaces that promote healing, peace, and spiritual growth. Each theme is carefully crafted to evoke specific emotional and spiritual responses while maintaining accessibility and usability.

## Color Psychology & Spiritual Meaning

### Sacred Lotus Theme
**Spiritual Significance**: Represents purity, enlightenment, and spiritual awakening
- **Purple (#B48CFF)**: Spirituality, wisdom, transformation
- **Gold (#FFE4AF)**: Divine light, illumination, sacred knowledge
- **Warm Gold (#EBB969)**: Abundance, prosperity, inner wealth

### Forest Sanctuary Theme
**Spiritual Significance**: Grounding, natural healing, connection to Earth
- **Forest Green (#69C369)**: Growth, renewal, heart chakra healing
- **Earth Beige (#C3AF91)**: Stability, grounding, natural wisdom
- **Warm Earth (#EBC387)**: Nurturing, comfort, earthly abundance

### Celestial Healing Theme
**Spiritual Significance**: Cosmic connection, divine guidance, higher consciousness
- **Cosmic Blue (#6991FF)**: Infinite sky, divine communication, throat chakra
- **Silver Blue (#B9C3D7)**: Clarity, intuition, lunar energy
- **Light Silver (#CDD5E1)**: Purity, reflection, spiritual insight

### Desert Wisdom Theme
**Spiritual Significance**: Ancient wisdom, inner strength, minimalist clarity
- **Desert Sand (#EBB987)**: Timeless wisdom, endurance, solar plexus chakra
- **Warm Sand (#D7AF87)**: Comfort, warmth, grounding energy
- **Terracotta (#CDA57D)**: Earth connection, stability, root chakra

### Ocean Depths Theme
**Spiritual Significance**: Emotional healing, fluidity, cleansing
- **Ocean Blue (#69EBFF)**: Emotional flow, healing waters, sacral chakra
- **Soft Aqua (#AFE1EB)**: Gentle healing, emotional balance
- **Light Aqua (#9BD7E1)**: Clarity, purification, renewal

## Typography

### Font Families

#### Primary Fonts
- **Lora** (Serif): Elegant, readable, spiritual texts
- **Open Sans** (Sans-serif): Clean, modern, body text

#### Spiritual Fonts
- **Cinzel**: Sacred texts, headings, ceremonial content
- **Cormorant Garamond**: Elegant quotes, poetry, reflections
- **Playfair Display**: Decorative headings, special occasions

### Typography Scale

```css
/* Font Sizes */
--font-xs: 0.75rem;    /* 12px - Small labels */
--font-sm: 0.875rem;   /* 14px - Body text small */
--font-base: 1rem;     /* 16px - Body text */
--font-lg: 1.125rem;   /* 18px - Large body text */
--font-xl: 1.25rem;    /* 20px - Small headings */
--font-2xl: 1.5rem;    /* 24px - Medium headings */
--font-3xl: 1.875rem;  /* 30px - Large headings */
--font-4xl: 2.25rem;   /* 36px - Extra large headings */
--font-5xl: 3rem;      /* 48px - Display headings */

/* Line Heights */
--leading-tight: 1.25;   /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Comfortable reading */
```

### Typography Usage Guidelines

#### Headings
```css
h1 { font-family: var(--font-spiritual); font-size: var(--font-4xl); }
h2 { font-family: var(--font-serif); font-size: var(--font-3xl); }
h3 { font-family: var(--font-serif); font-size: var(--font-2xl); }
h4 { font-family: var(--font-sans); font-size: var(--font-xl); }
```

#### Body Text
```css
p { font-family: var(--font-sans); font-size: var(--font-base); }
.large-text { font-size: var(--font-lg); }
.small-text { font-size: var(--font-sm); }
```

## Spacing System

### Sacred Proportions
Based on the golden ratio and sacred geometry principles:

```css
--spacing-xs: 0.25rem;   /* 4px - Micro spacing */
--spacing-sm: 0.5rem;    /* 8px - Small spacing */
--spacing-md: 1rem;      /* 16px - Base spacing */
--spacing-lg: 1.5rem;    /* 24px - Medium spacing */
--spacing-xl: 2rem;      /* 32px - Large spacing */
--spacing-2xl: 3rem;     /* 48px - Extra large spacing */
--spacing-3xl: 4rem;     /* 64px - Section spacing */
--spacing-4xl: 6rem;     /* 96px - Page spacing */
--spacing-5xl: 8rem;     /* 128px - Hero spacing */
```

### Spacing Usage

#### Component Spacing
- **Micro elements**: `xs` (4px) - Icon margins, small gaps
- **Text elements**: `sm` (8px) - Line spacing, small margins
- **Components**: `md` (16px) - Default component padding
- **Sections**: `lg-xl` (24-32px) - Section margins
- **Pages**: `2xl-3xl` (48-64px) - Page sections

#### Responsive Spacing
```css
/* Mobile */
.section-spacing { padding: var(--spacing-lg) var(--spacing-md); }

/* Tablet */
@media (min-width: 768px) {
  .section-spacing { padding: var(--spacing-xl) var(--spacing-lg); }
}

/* Desktop */
@media (min-width: 1024px) {
  .section-spacing { padding: var(--spacing-2xl) var(--spacing-xl); }
}
```

## Shadows & Depth

### Shadow System
Creating depth while maintaining spiritual lightness:

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* Spiritual shadows with theme colors */
--shadow-spiritual: 0 0 20px var(--color-spiritual-glow);
--shadow-glow: 0 0 15px var(--color-spiritual-glow);
```

### Shadow Usage
- **Cards**: `shadow-md` for subtle elevation
- **Modals**: `shadow-xl` for prominent elevation
- **Interactive elements**: `shadow-glow` on hover
- **Sacred components**: `shadow-spiritual` for mystical effect

## Border Radius

### Radius System
Inspired by natural forms and sacred geometry:

```css
--radius-none: 0;
--radius-sm: 0.25rem;     /* 4px - Small elements */
--radius-md: 0.5rem;      /* 8px - Standard elements */
--radius-lg: 0.75rem;     /* 12px - Cards, containers */
--radius-xl: 1rem;        /* 16px - Large containers */
--radius-full: 9999px;    /* Circular elements */
--radius-spiritual: 1.5rem; /* 24px - Sacred components */
```

### Radius Usage
- **Buttons**: `radius-md` for standard, `radius-full` for pills
- **Cards**: `radius-lg` for gentle curves
- **Sacred components**: `radius-spiritual` for special elements
- **Images**: `radius-xl` for soft, welcoming appearance

## Animation & Motion

### Animation Principles
1. **Purposeful**: Every animation serves a spiritual or functional purpose
2. **Gentle**: Movements are soft and non-jarring
3. **Natural**: Inspired by natural phenomena (water, wind, growth)
4. **Respectful**: Honors users with motion sensitivity

### Duration System
```css
--duration-fast: 150ms;    /* Quick feedback */
--duration-normal: 300ms;  /* Standard transitions */
--duration-slow: 500ms;    /* Deliberate movements */
--duration-slower: 1000ms; /* Meditative pace */
```

### Easing Functions
```css
--easing-ease: ease;
--easing-ease-in: ease-in;
--easing-ease-out: ease-out;
--easing-ease-in-out: ease-in-out;
--easing-spiritual: cubic-bezier(0.4, 0, 0.2, 1); /* Custom spiritual easing */
```

### Theme-Specific Animations

#### Sacred Lotus
- **Lotus Bloom**: Gentle scaling and rotation
- **Spiritual Glow**: Pulsing light effect
- **Float Up**: Gentle vertical movement

#### Forest Sanctuary
- **Leaf Rustle**: Subtle swaying motion
- **Growth Pulse**: Organic scaling
- **Natural Flow**: Flowing movement patterns

#### Celestial Healing
- **Star Twinkle**: Sparkling light effects
- **Cosmic Pulse**: Expanding energy rings
- **Celestial Float**: Orbital movements

#### Desert Wisdom
- **Sand Shift**: Subtle horizontal movement
- **Wisdom Glow**: Warm pulsing light
- **Desert Breeze**: Gentle swaying

#### Ocean Depths
- **Ocean Wave**: Fluid wave-like motion
- **Fluid Pulse**: Liquid-like scaling
- **Current Flow**: Flowing transitions

## Component Patterns

### Sacred Card Pattern
```css
.sacred-card {
  background: var(--color-spiritual-light);
  border: 1px solid var(--color-spiritual-medium);
  border-radius: var(--radius-spiritual);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-spiritual);
  transition: all var(--duration-normal) var(--easing-spiritual);
}

.sacred-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}
```

### Spiritual Quote Pattern
```css
.spiritual-quote {
  border-left: 4px solid var(--color-primary-300);
  padding-left: var(--spacing-md);
  padding-top: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  margin: var(--spacing-md) 0;
  font-style: italic;
  background: var(--gradient-primary);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}
```

### Meditation Box Pattern
```css
.meditation-box {
  background: var(--gradient-secondary);
  border: 1px solid var(--color-secondary-300);
  border-radius: var(--radius-spiritual);
  padding: var(--spacing-lg);
  margin: var(--spacing-md) 0;
  box-shadow: var(--shadow-spiritual);
}
```

## Accessibility Guidelines

### Color Contrast
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast ratio

### High Contrast Mode
```css
.high-contrast {
  filter: contrast(1.5);
}

.high-contrast .sacred-card,
.high-contrast .spiritual-quote,
.high-contrast .meditation-box {
  border-width: 2px;
  border-color: currentColor;
}
```

### Reduced Motion
```css
.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}
```

### Focus Indicators
```css
*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
--breakpoint-2xl: 1536px; /* Extra large screens */
```

### Responsive Typography
```css
/* Mobile */
h1 { font-size: var(--font-2xl); }
h2 { font-size: var(--font-xl); }
h3 { font-size: var(--font-lg); }

/* Desktop */
@media (min-width: 768px) {
  h1 { font-size: var(--font-4xl); }
  h2 { font-size: var(--font-3xl); }
  h3 { font-size: var(--font-2xl); }
}
```

### Responsive Spacing
```css
/* Mobile */
.container { padding: var(--spacing-md); }
.section { padding: var(--spacing-lg) 0; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: var(--spacing-lg); }
  .section { padding: var(--spacing-xl) 0; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: var(--spacing-xl); }
  .section { padding: var(--spacing-2xl) 0; }
}
```

## Dark Mode Considerations

### Color Adaptations
- Maintain spiritual essence in dark mode
- Ensure sufficient contrast
- Soften bright colors for night viewing
- Preserve color relationships

### Dark Mode Variables
```css
body.mode-dark {
  --color-neutral-50: #1a1a1a;
  --color-neutral-100: #2d2d2d;
  --color-neutral-900: #f5f5f5;
  
  /* Adjust spiritual colors for dark mode */
  --color-spiritual-light: rgba(180, 140, 255, 0.1);
  --color-spiritual-medium: rgba(180, 140, 255, 0.3);
  --color-spiritual-dark: rgba(180, 140, 255, 0.8);
}
```

## Performance Guidelines

### CSS Optimization
- Use CSS custom properties for dynamic values
- Minimize repaints and reflows
- Optimize animation performance
- Use `transform` and `opacity` for animations

### Loading Strategies
- Progressive enhancement
- Critical CSS inlining
- Lazy load non-critical animations
- Optimize font loading

## Testing Guidelines

### Visual Testing
- Test all themes in light and dark modes
- Verify color contrast ratios
- Check responsive behavior
- Validate animation performance

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- High contrast mode
- Reduced motion preferences

### Cross-Browser Testing
- Modern browser support
- Graceful degradation
- CSS custom property fallbacks
- Animation fallbacks

## Maintenance

### Version Control
- Document theme changes
- Maintain backward compatibility
- Version theme configurations
- Track performance metrics

### Updates
- Regular accessibility audits
- Performance monitoring
- User feedback integration
- Seasonal theme variations

This style guide ensures consistency, accessibility, and spiritual authenticity across all themes in the Sacred Circuit application.
