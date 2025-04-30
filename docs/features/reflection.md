# Reflection Feature Documentation

## Overview

The Reflection feature allows users to record and review their insights and growth as they progress on their healing journey. Reflections are tied to specific milestones (e.g., Day 7, Day 14) and provide users with a way to track their progress and deepen their healing experience.

## User Experience

### Submitting Reflections

Users can submit reflections through:
1. The "Submit Reflection" link in the navigation menu
2. The reflection form linked from emails at milestone points
3. The "Submit Reflection" button on the chatbot page

### Reflection Form

The reflection form includes:
1. Healing Name field (pre-filled for returning users)
2. Milestone selection (Day 7, Day 14, Day 21, Day 30, Other)
3. Reflection text area for detailed insights
4. Email consent toggle for receiving follow-up guidance
5. Submit button

### Reflection History

Users can view their past reflections through:
1. The "View Your Reflection History" link on the reflection page
2. The reflection history page accessible from the navigation menu

The reflection history page displays:
1. A chronological list of past reflections
2. The milestone and date for each reflection
3. A preview of the reflection content
4. Detailed view when clicking on a reflection

## Features

### Reflection Submission

- **Milestone Tracking**: Reflections are tied to specific journey milestones
- **Rich Text Input**: Users can enter detailed reflections with formatting
- **Privacy Controls**: Users can control whether they receive emails about their reflections
- **Success Feedback**: Clear confirmation when reflections are successfully submitted

### Reflection History

- **Chronological Display**: Reflections are displayed in reverse chronological order
- **Milestone Filtering**: Users can filter reflections by milestone
- **Detailed View**: Users can view the full content of each reflection
- **Empty State**: Clear guidance when no reflections have been submitted yet

### Authentication Integration

- **Secure Reflections**: Authenticated users can access a secure version of the reflection feature
- **User-Specific History**: Authenticated users see only their own reflections
- **Enhanced Privacy**: Reflections are linked to user accounts for better security

## Technical Implementation

### Frontend Components

- **ReflectionPage.tsx**: Main component for the reflection submission form
- **ReflectionHistory.tsx**: Component for viewing past reflections
- **ReflectionDetail.tsx**: Component for viewing a single reflection in detail
- **FormTextarea.tsx**: Reusable component for the reflection text input

### Backend Services

- **airtableService.js**: Service for storing and retrieving reflections from Airtable
- **reflection.js**: API route handler for reflection submissions and retrieval

### API Endpoints

#### POST /api/reflection

Submits a new reflection.

**Request Body:**
```json
{
  "healingName": "User's healing name",
  "content": "Reflection text",
  "milestone": "Day 7",
  "emailConsent": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reflection_id",
    "healingName": "User's healing name",
    "journeyDay": "Day 7",
    "timestamp": "2023-06-01T12:00:00Z",
    "success": true
  }
}
```

#### POST /api/reflection/secure

Submits a new reflection for an authenticated user.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "healingName": "User's healing name",
  "content": "Reflection text",
  "milestone": "Day 7",
  "emailConsent": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reflection_id",
    "healingName": "User's healing name",
    "journeyDay": "Day 7",
    "timestamp": "2023-06-01T12:00:00Z",
    "success": true
  }
}
```

#### GET /api/reflection?healingName=UserName

Retrieves reflections for a specific healing name.

**Response:**
```json
{
  "success": true,
  "data": {
    "reflections": [
      {
        "id": "reflection_id",
        "healingName": "User's healing name",
        "content": "Reflection text",
        "journeyDay": "Day 7",
        "createdAt": "2023-06-01T12:00:00Z"
      }
    ]
  }
}
```

#### GET /api/reflection/secure

Retrieves reflections for the authenticated user.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reflections": [
      {
        "id": "reflection_id",
        "healingName": "User's healing name",
        "content": "Reflection text",
        "journeyDay": "Day 7",
        "createdAt": "2023-06-01T12:00:00Z"
      }
    ]
  }
}
```

### Data Flow

#### Submission Flow

1. User fills out the reflection form in the frontend
2. Frontend validates the input and sends it to the appropriate API endpoint
3. Backend validates the request and user information
4. Backend stores the reflection in Airtable
5. Backend returns a success response to the frontend
6. Frontend displays a success message to the user

#### Retrieval Flow

1. User navigates to the reflection history page
2. Frontend sends a request to the appropriate API endpoint
3. Backend validates the request and user information
4. Backend retrieves the reflections from Airtable
5. Backend returns the reflections to the frontend
6. Frontend displays the reflections to the user

## Database Schema

Reflections are stored in Airtable with the following schema:

| Field | Type | Description |
|-------|------|-------------|
| Healing Name | Text | The user's healing name |
| Reflection Text | Long Text | The content of the reflection |
| Journey Day | Text | The milestone (e.g., "Day 7") |
| Timestamp | Date/Time | When the reflection was submitted |
| Email Consent | Boolean | Whether the user consents to emails |
| User | Link | Link to the Users table (if authenticated) |

## Testing

### Unit Tests

Unit tests for the reflection components are located in:
- `src/__tests__/components/ReflectionPage.test.tsx`
- `src/__tests__/components/ReflectionHistory.test.tsx`
- `server/__tests__/routes/reflection.test.js`
- `server/__tests__/routes/reflection-secure.test.js`

### End-to-End Tests

End-to-end tests for the reflection feature are located in:
- `cypress/e2e/reflection.cy.js`
- `cypress/e2e/reflection-edge-cases.cy.js`
- `cypress/e2e/reflection-history.cy.js`

## Security Considerations

- **Rate Limiting**: The reflection API endpoints use rate limiting to prevent abuse
- **Input Validation**: All user inputs are validated to prevent injection attacks
- **Authentication**: Secure endpoints require JWT authentication
- **Authorization**: Users can only access their own reflections
- **CSRF Protection**: All POST endpoints are protected against CSRF attacks

## Future Enhancements

Planned enhancements for the reflection feature include:
- **Rich Text Formatting**: Adding support for formatting in reflections
- **Media Attachments**: Allowing users to attach images or audio to reflections
- **Guided Prompts**: Providing prompts to help users structure their reflections
- **Sharing Options**: Allowing users to share reflections with trusted guides
- **Export Functionality**: Enabling users to export their reflections as PDF or text
