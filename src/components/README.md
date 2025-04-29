# Components Directory

This directory contains all React components used in the Sacred Healing Companion & Journey Hub application.

## Directory Structure

```
components/
├── chatbot/           # Chatbot-related components
├── common/            # Shared UI components
└── landing/           # Landing page components
```

## Component Categories

### Chatbot Components

The `chatbot/` directory contains components related to the chatbot interface, including:

- `ChatbotPage.tsx`: Main page component for the chatbot interface

### Common Components

The `common/` directory contains shared UI components used across multiple pages:

- `Button.tsx`: Reusable button component with consistent styling
- `Footer.tsx`: Footer component used across all pages
- `Header.tsx`: Header component with navigation links
- `Layout.tsx`: Layout wrapper component that includes header and footer
- `PageTransition.tsx`: Component for page transition animations

### Landing Page Components

The `landing/` directory contains components for the various pages of the application:

- `AboutPage.tsx`: About page with information about the platform
- `LandingPage.tsx`: Main landing page component
- `NotFoundPage.tsx`: 404 error page component
- `PrivacyPage.tsx`: Privacy policy page component
- `ReflectionPage.tsx`: Page for users to submit reflections

## Component Guidelines

1. **Naming**: Use PascalCase for component names (e.g., `ButtonComponent.tsx`)
2. **Structure**: Follow the component structure defined in the development guidelines
3. **Props**: Define prop interfaces with descriptive names and comments
4. **Documentation**: Include JSDoc comments for each component
5. **Testing**: Create corresponding test files in the `__tests__/components` directory

## Example Component

```tsx
import React from 'react';

interface ExampleProps {
  /** Text to display in the component */
  text: string;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Example component that displays text and handles clicks
 */
const Example: React.FC<ExampleProps> = ({ text, onClick }) => {
  return (
    <div className="p-4 bg-blue-100 rounded" onClick={onClick}>
      {text}
    </div>
  );
};

export default Example;
```
