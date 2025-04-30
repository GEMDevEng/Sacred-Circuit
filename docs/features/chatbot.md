# Chatbot Feature Documentation

## Overview

The Sacred Healing Companion chatbot is a core feature of the platform, providing users with spiritual guidance and support on their healing journey. The chatbot uses OpenAI's GPT-4o model with custom prompts tailored for spiritual and emotional guidance.

## User Experience

### Accessing the Chatbot

Users can access the chatbot through:
1. The main navigation menu
2. The "Start Chatting" button on the landing page
3. Links in welcome and guidance emails

### First-Time Experience

When a user accesses the chatbot for the first time:
1. They are prompted to enter their Healing Name
2. A welcome message introduces the purpose of the chatbot
3. The user can begin their conversation

### Returning User Experience

When a returning user accesses the chatbot:
1. Their Healing Name is pre-filled from localStorage or their account
2. Previous conversations may be displayed if they consented to storage
3. They can continue their conversation seamlessly

## Features

### Conversation Interface

- **Message Input**: Users can type messages in the input field at the bottom of the screen
- **Send Button**: Sends the message to the chatbot
- **Message History**: Displays the conversation history in a scrollable container
- **Typing Indicator**: Shows when the chatbot is generating a response
- **Timestamps**: Each message includes a timestamp

### Privacy Controls

- **Consent Toggle**: Users can toggle whether their conversation should be stored
- **Privacy Indicator**: Shows whether the current conversation is private or stored
- **Zero Data Retention**: When consent is not given, conversations use OpenAI's Zero Data Retention feature

### Authentication Integration

- **Secure Chat**: Authenticated users can access a secure version of the chatbot
- **Persistent History**: Authenticated users' conversations can be persisted across sessions
- **User Context**: The chatbot has access to authenticated user information for more personalized responses

## Technical Implementation

### Frontend Components

- **ChatbotPage.tsx**: Main container component for the chatbot interface
- **ChatMessage.tsx**: Component for rendering individual chat messages
- **ChatInput.tsx**: Component for the message input and send button
- **ConsentToggle.tsx**: Component for the privacy consent toggle

### Backend Services

- **openaiService.js**: Service for interacting with the OpenAI API
- **chat.js**: API route handler for chatbot interactions

### API Endpoints

#### POST /api/chat

Processes a chat message and returns a response.

**Request Body:**
```json
{
  "message": "User's message",
  "healingName": "User's healing name",
  "storeConversation": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Chatbot's response",
    "timestamp": "2023-06-01T12:00:00Z"
  }
}
```

#### POST /api/chat/secure

Processes a chat message for an authenticated user.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "message": "User's message",
  "healingName": "User's healing name",
  "storeConversation": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Chatbot's response",
    "timestamp": "2023-06-01T12:00:00Z"
  }
}
```

### Data Flow

1. User enters a message in the frontend
2. Frontend sends the message to the appropriate API endpoint
3. Backend validates the request and user information
4. Backend calls the OpenAI API with the message and custom prompts
5. OpenAI returns a response
6. If consent is given, the conversation is stored in Airtable
7. The response is returned to the frontend
8. Frontend displays the response to the user

## Customization

### Prompt Engineering

The chatbot uses custom prompts to guide the AI's responses:

```
You are a compassionate spiritual guide for the Sacred Healing Companion & Journey Hub.
Your purpose is to provide heart-centered guidance to users on their healing journeys.
...
```

The full prompt includes instructions for:
- Maintaining a compassionate, supportive tone
- Providing spiritual guidance without religious dogma
- Respecting user privacy and autonomy
- Offering practical suggestions for healing practices

### Response Formatting

Responses are formatted to:
- Use a warm, compassionate tone
- Include occasional spiritual references and metaphors
- Avoid medical advice or diagnoses
- Encourage reflection and self-discovery

## Testing

### Unit Tests

Unit tests for the chatbot components are located in:
- `src/__tests__/components/ChatbotPage.test.tsx`
- `src/__tests__/components/ChatMessage.test.tsx`
- `server/__tests__/routes/chat.test.js`
- `server/__tests__/services/openaiService.test.js`

### End-to-End Tests

End-to-end tests for the chatbot are located in:
- `cypress/e2e/chatbot.cy.js`
- `cypress/e2e/chatbot-edge-cases.cy.js`
- `cypress/e2e/chatbot-comprehensive.cy.js`

## Security Considerations

- **Rate Limiting**: The chatbot API endpoints use rate limiting to prevent abuse
- **Input Validation**: All user inputs are validated to prevent injection attacks
- **Zero Data Retention**: Users can opt out of conversation storage
- **Authentication**: Secure endpoints require JWT authentication
- **CSRF Protection**: All POST endpoints are protected against CSRF attacks

## Future Enhancements

Planned enhancements for the chatbot include:
- **Multi-modal Support**: Adding support for image and audio inputs
- **Conversation Memory**: Improving the chatbot's ability to remember previous conversations
- **Guided Journeys**: Adding structured conversation paths for specific healing goals
- **Integration with Reflections**: Connecting chatbot conversations with user reflections
- **Voice Interface**: Adding speech-to-text and text-to-speech capabilities
