# Types Directory

This directory contains TypeScript type definitions used throughout the Sacred Healing Companion & Journey Hub application.

## Files

- `index.ts`: Main type definitions file

## Type Definitions

The `index.ts` file defines the following types:

- `User`: Represents a user in the system
- `ChatMessage`: Represents a chat message in the chatbot interface
- `Reflection`: Represents a reflection submission
- `ApiResponse<T>`: Generic type for standardized API responses
- `ChatRequest`: Request type for sending messages to the chatbot
- `ChatResponse`: Response type from the chatbot API
- `ReflectionRequest`: Request type for submitting reflections
- `TypeformWebhookPayload`: Webhook payload from Typeform for user onboarding

## Guidelines for Adding Types

1. **Naming**: Use PascalCase for type and interface names
2. **Documentation**: Include JSDoc comments for all types and interfaces
3. **Organization**: Keep related types together
4. **Exports**: Export all types from the `index.ts` file
5. **Consistency**: Follow the existing pattern for type definitions

## Example Type Definition

```typescript
/**
 * Example type representing a feature in the system
 */
export interface Feature {
  /** Unique identifier for the feature */
  id: string;
  /** Name of the feature */
  name: string;
  /** Description of the feature */
  description: string;
  /** Whether the feature is enabled */
  enabled: boolean;
  /** Date the feature was created */
  createdAt: string;
}
```
