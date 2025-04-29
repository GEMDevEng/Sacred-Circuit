# Sacred Circuit Modularization Report

## Identified Issues

### React Frontend
- Several components (e.g., `ChatbotPage`, `FeedbackForm`, `AdminOverview`) handle both UI rendering and business logic (API calls, state management), violating the single responsibility principle.
- Shared logic (API calls, form handling) is not consistently extracted into custom hooks, leading to code duplication.
- Components are generally organized by feature, but some logic could be further modularized for reusability.

### Node.js Backend
- Route handlers in `server/routes` often contain business logic, such as direct calls to OpenAI, Airtable, or user management, instead of delegating to service modules.
- Some service files (e.g., `openaiService.js`, `airtableService.js`) mix integration logic with business logic, which could be further separated.
- Middleware is present and generally focused, but some cross-cutting concerns (e.g., rate limiting, validation) could be more reusable.

## Suggested Changes

### React Frontend
1. **Split Large Components**: Refactor components like `ChatbotPage` to separate UI and logic. Example: create `ChatbotUI` for rendering and a `useChatbot` hook for API/state logic.
2. **Extract Custom Hooks**: Move shared logic (API calls, form handling) into hooks in `src/hooks` (e.g., `useChatbot`, `useReflection`).
3. **Directory Organization**: Continue grouping by feature in `src/components`, and ensure page-level components are in `src/pages`.
4. **Single Responsibility**: Ensure each component does one thing (e.g., `ChatMessage` for rendering a message, `ChatbotInterface` for layout).

### Node.js Backend
1. **Route Organization**: Keep route handlers minimal, delegating business logic to services in `server/services`.
2. **Service Layer**: Move all business logic (OpenAI, Airtable, Mailchimp, Typeform) into dedicated service files. Example: `openaiService.js` for OpenAI API calls, `airtableService.js` for Airtable CRUD.
3. **Middleware**: Ensure middleware in `server/middleware` is reusable and focused on a single concern.
4. **Third-Party Integrations**: Abstract integrations into their own services for type safety and maintainability.

### General
- Eliminate duplicated code by extracting reusable functions/components.
- Use TypeScript interfaces for clear module boundaries.
- Add Jest unit tests in `src/__tests__` and `server/__tests__` for at least 80% coverage.
- Add JSDoc comments to all functions, components, and services.

## Example Refactored Code Snippets

### 1. Component Split (React)
**Before (`ChatbotPage.tsx`):**
```tsx
const ChatbotPage = () => {
  // UI rendering and API logic mixed
  // ...
};
```
**After:**
```tsx
// src/components/chatbot/ChatbotUI.tsx
export const ChatbotUI = ({ messages, onSend }) => (
  <div>{/* Render messages and input */}</div>
);

// src/hooks/useChatbot.ts
import { useState } from 'react';
export function useChatbot() {
  const [messages, setMessages] = useState([]);
  const sendMessage = async (msg) => {
    // API call logic
  };
  return { messages, sendMessage };
}

// src/pages/ChatbotPage.tsx
import { ChatbotUI } from '../components/chatbot/ChatbotUI';
import { useChatbot } from '../hooks/useChatbot';
const ChatbotPage = () => {
  const { messages, sendMessage } = useChatbot();
  return <ChatbotUI messages={messages} onSend={sendMessage} />;
};
```

### 2. Custom Hook Example
```ts
// src/hooks/useReflection.ts
import { useState } from 'react';
export function useReflection() {
  const [reflection, setReflection] = useState('');
  const submitReflection = async (data) => {
    // API call logic
  };
  return { reflection, setReflection, submitReflection };
}
```

### 3. Service Layer Example (Backend)
```js
// server/services/openaiService.js
export async function processChat(message, healingName, storeConversation = false, userId = null) {
  // OpenAI API logic
}

// server/routes/chat.js
router.post('/chat', async (req, res) => {
  const { message, healingName } = req.body;
  const response = await processChat(message, healingName);
  res.json(response);
});
```

## Updated Directory Structure (Key Parts)
```
src/
  components/
    chatbot/
      ChatbotUI.tsx
    reflection/
      ReflectionForm.tsx
  hooks/
    useChatbot.ts
    useReflection.ts
  pages/
    ChatbotPage.tsx
    ReflectionPage.tsx
server/
  routes/
    chat.js
    reflection.js
  services/
    openaiService.js
    airtableService.js
    mailchimpService.js
    typeformService.js
  middleware/
    authMiddleware.js
    loggerMiddleware.js
```

## Next Steps
- Refactor large/multi-responsibility components and route handlers as shown above.
- Extract and document shared logic into hooks/services.
- Add/expand unit tests and TypeScript types.
- Review and update documentation as code structure evolves.