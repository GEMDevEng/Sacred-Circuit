# Product Requirements Document (PRD) for Sacred Healing Companion & Journey Hub

## 1. Product Overview
The Sacred Healing Companion & Journey Hub is a spiritual wellness platform designed to guide users through personalized healing journeys focused on fasting, detoxification, and emotional/spiritual growth. It integrates a private GPT-4 Healing Companion (a chatbot) with a Sacred Healing Journey Hub (using Typeform for onboarding and Mailchimp for email sequences). The platform prioritizes user privacy and sovereignty, ensuring a sanctuary-like experience for its initial 50–100 users by June 2025.

## 2. User Stories
The following user stories capture the core functionality of the MVP in Gherkin format, tailored to the needs of young adults aged 18–35 who value spirituality and privacy:

1. **As a new user**, I want to sign up for the Sacred Healing Journey by filling out an intake form via Typeform so that I can begin my personalized healing journey.
   - **Given** I am on the landing page, **when** I click "Start Your Healing Journey," **then** I am redirected to a Typeform intake form.
2. **As a user**, I want my intake form data to be securely stored in Airtable so that my information is organized and accessible for my journey.
   - **Given** I submit the intake form, **when** the form is processed, **then** my data is stored in an Airtable Users table.
3. **As a user**, I want to receive a welcome email with instructions on how to access the Healing Companion so that I can start interacting with the chatbot.
   - **Given** I submit the intake form, **when** my data is added to Mailchimp, **then** I receive a welcome email with a chatbot access link.
4. **As a user**, I want to access the Private Healing Companion chatbot through a web interface so that I can engage in spiritual conversations.
   - **Given** I click the chatbot link, **when** the page loads, **then** I see the chatbot interface.
5. **As a user**, I want the chatbot to greet me with my Healing Name for anonymity so that I feel safe and respected.
   - **Given** I access the chatbot, **when** the interface loads, **then** the chatbot greets me with my Healing Name.
6. **As a user**, I want the chatbot to engage in conversations that reflect sacred healing principles so that I receive meaningful spiritual support.
   - **Given** I send a message, **when** the chatbot responds, **then** the response aligns with sacred healing principles.
7. **As a user**, I want the chatbot to provide emotional support and spiritual guidance based on my inputs so that my needs are addressed.
   - **Given** I share my feelings, **when** the chatbot processes my input, **then** it offers empathetic, spiritual guidance.
8. **As a user**, I want to ask questions about fasting, detoxification, and spiritual healing so that I can learn and grow.
   - **Given** I ask a question, **when** the chatbot responds, **then** it provides relevant, supportive information.
9. **As a user**, I want the chatbot to remember my preferences and previous conversations if I consent to data storage so that my experience is personalized.
   - **Given** I consent to data storage, **when** I interact with the chatbot, **then** it recalls my previous inputs.
10. **As a user**, I want to have the option to disable data storage for my conversations so that I maintain control over my privacy.
    - **Given** I access the chatbot, **when** I choose to disable storage, **then** no conversation data is saved.
11. **As a user**, I want to ensure that my conversation data is not used to train OpenAI's models so that my privacy is protected.
    - **Given** I use the chatbot, **when** I send messages, **then** my data is shielded from OpenAI training.
12. **As a user**, I want to receive daily or weekly emails with guidance and reflections during my healing journey so that I stay engaged.
    - **Given** I am enrolled in the journey, **when** a scheduled time arrives, **then** I receive a guidance email.
13. **As a user**, I want to submit healing reflections and feedback through Airtable forms so that I can share my progress.
    - **Given** I receive a reflection email, **when** I click the link, **then** I am taken to an Airtable form.
14. **As a user**, I want to have control over what data I submit and be assured of its privacy so that I feel safe sharing.
    - **Given** I access the reflection form, **when** I submit data, **then** I can choose what to share, and it’s handled privately.
15. **As a user**, I want the platform to be accessible on mobile devices so that I can use it conveniently.
    - **Given** I use a mobile device, **when** I access the platform, **then** it is responsive and functional.
16. **As a user**, I want the interface to be intuitive and easy to navigate so that I can focus on my healing.
    - **Given** I access any page, **when** I interact with the UI, **then** it is user-friendly and clear.
17. **As a user**, I want to contact support if I have issues or questions so that I can get help.
    - **Given** I encounter an issue, **when** I use the contact form, **then** I can send a support request.
18. **As a user**, I want to be informed about updates or changes to the platform so that I stay aware.
    - **Given** an update occurs, **when** I am enrolled, **then** I receive a notification email.
19. **As a user**, I want to opt-out of the program at any time so that I have control over my participation.
    - **Given** I want to leave, **when** I request to opt-out, **then** my data is removed.
20. **As a user**, I want to provide testimonials if I choose to, to help improve the platform.
    - **Given** I want to share feedback, **when** I submit a testimonial, **then** it is stored for review.
21. **As a user**, I want the chatbot to understand and respond appropriately to my emotional state so that I feel supported.
    - **Given** I express emotions, **when** the chatbot responds, **then** it reflects empathy.
22. **As a user**, I want to set goals for my healing journey and track my progress so that I stay motivated.
    - **Given** I submit the intake form, **when** I set goals, **then** I can track them via emails or chatbot.
23. **As a user**, I want personalized guidance based on my intake form responses so that my journey is tailored.
    - **Given** I submit the form, **when** I interact with the platform, **then** guidance reflects my inputs.
24. **As a user**, I want the platform to respect my privacy and not share my data without consent so that I trust the system.
    - **Given** I use the platform, **when** data is handled, **then** it requires my explicit consent.
25. **As a user**, I want to delete my account and all associated data if I choose so that I maintain sovereignty.
    - **Given** I want to delete my account, **when** I request deletion, **then** all my data is removed.

## 3. User Flows
The following user flows outline the primary interactions for the MVP, ensuring a seamless experience for users.

### Onboarding Flow
1. User visits the landing page and clicks "Start Your Healing Journey."
2. User is redirected to the Typeform intake form.
3. User fills out fields (Healing Name, email, healing goals, etc.) and submits the form.
4. Typeform sends data to Airtable via webhook and adds the user to Mailchimp.
5. Mailchimp sends a welcome email with a link to the Healing Companion.
6. User clicks the link and accesses the chatbot interface.

### Chatbot Interaction Flow
1. User navigates to the chatbot page via the email link or direct access.
2. Chatbot greets the user with their Healing Name.
3. User types a message in the input field and clicks send.
4. Frontend sends the message to the backend, which calls the OpenAI API with custom prompts.
5. Backend returns the chatbot’s response to the frontend for display.
6. If consented, conversation data is temporarily stored; otherwise, it’s discarded post-session.

### Reflection Submission Flow
1. At predefined milestones (e.g., Day 7), Mailchimp sends an email inviting the user to submit a reflection.
2. User clicks the link and is directed to an Airtable form.
3. User completes the form (reflection text, optional symptom tracking) and submits.
4. Airtable stores the submission, linked to the user’s record.

## 4. Screens and UI/UX
The MVP includes minimal screens to ensure simplicity and focus on core functionality, designed to be intuitive and mobile-responsive for young, tech-savvy users.

### Landing Page
- **Description**: Introduces the platform, emphasizing its sacred, privacy-focused mission.
- **Key Elements**:
  - Title: "Sacred Healing Companion & Journey Hub"
  - Brief description of the program’s purpose and benefits.
  - Call-to-action button: "Start Your Healing Journey" (links to Typeform).
  - Optional testimonials or visuals reflecting spiritual themes.
- **Interactions**: Click button to begin onboarding.

### Intake Form (Typeform)
- **Description**: Collects user data to personalize the healing journey.
- **Key Elements**:
  - Fields: Healing Name (text), Email (email), Healing Goals (text), Experience with Fasting (multiple choice), etc.
  - Submission button.
- **Interactions**: Fill fields, submit form.

### Chatbot Interface
- **Description**: Web-based interface for interacting with the Healing Companion.
- **Key Elements**:
  - Chat window displaying conversation history.
  - Input field for user messages.
  - Send button.
  - Header with program name and user’s Healing Name.
  - Optional toggle for enabling/disabling conversation storage.
- **Interactions**: Type message, send, view responses.

### Reflection Form (Airtable)
- **Description**: Form for submitting reflections and feedback at milestones.
- **Key Elements**:
  - Fields: Reflection Text (text), Date (date), Optional Symptom Tracking (text or multiple choice).
  - Submission button.
- **Interactions**: Fill fields, submit form.

### Email Templates
- **Description**: Automated emails for onboarding, guidance, and reflection prompts.
- **Key Elements**:
  - **Welcome Email**: Subject: "Welcome to Your Sacred Healing Journey"; body: introduction, chatbot access link.
  - **Guidance Emails**: Subjects: e.g., "Day 3: Reflection on Your Journey"; body: prompts, resources.
  - **Reflection Invitation**: Subject: "Share Your Healing Reflections"; body: link to Airtable form.
- **Interactions**: Click links to access chatbot or forms.

## 5. Features and Functionality
The MVP focuses on three core features, implemented with technical precision to meet user needs and privacy requirements.

### Private GPT-4 Healing Companion
- **Technology**: Built using OpenAI’s API (GPT-4o preferred) for advanced natural language processing.
- **Hosting**: Deployed on Vercel or Railway for simplicity and scalability.
- **Customization**: Uses Sacred Circuit’s custom system prompts to ensure responses align with sacred healing principles.
- **Privacy**:
  - No persistent logging of conversation data unless user explicitly consents.
  - Data shielded from OpenAI’s model training using Zero Data Retention (ZDR) options.
  - Option to disable history and storage via UI toggle.
- **Functionality**:
  - Accepts user input via text and generates empathetic, spiritual responses.
  - Maintains conversational flow with a warm, non-clinical tone.
  - Supports queries on fasting, detoxification, and emotional/spiritual healing.

### Sacred Healing Journey Hub
- **Intake Form**:
  - Implemented via Typeform, with fields for Healing Name, email, and healing preferences.
  - Configured to send data to Airtable and Mailchimp via webhooks or integrations.
- **Data Storage**:
  - Airtable stores user data in a Users table, ensuring secure, organized management.
- **Email Sequence**:
  - Mailchimp automates a 7–14 day email sequence, including welcome, guidance, and reflection prompts.
  - Emails triggered by Typeform submissions or scheduled milestones.

### Light Data Collection
- **Reflection Forms**:
  - Airtable forms for users to submit reflections at milestones (e.g., Day 7, Day 14).
  - Fields include reflection text and optional symptom tracking, with no medical claims.
- **Privacy**:
  - Users control submissions, with explicit consent required.
  - Data handled under a sacred privacy pledge, ensuring anonymity and security.

## 6. Technical Architecture
The system is designed for simplicity, privacy, and rapid deployment, leveraging modern web technologies and third-party services.

- **Frontend**: Web application built with HTML, CSS, JavaScript, and React for dynamic UI, hosted on Vercel for seamless deployment.
- **Backend**: Node.js with Express.js, deployed as Vercel serverless functions, handling:
  - API calls to OpenAI for chatbot responses.
  - Interactions with Airtable API for data storage and retrieval.
  - Optional Mailchimp API calls for email management (if not handled via integrations).
- **Databases**: Airtable serves as the primary database, accessed via its REST API.
- **Third-party Services**:
  - Typeform for intake forms, integrated with Airtable and Mailchimp.
  - Mailchimp for automated email sequences.
  - OpenAI API for chatbot functionality.

**Architecture Diagram** (Conceptual):
```
[User] --> [Frontend (React, Vercel)]
                |
                v
[Backend (Node.js, Vercel)] --> [OpenAI API]
                |
                v
[Airtable (Database)] <--> [Typeform (Intake)]
                |
                v
[Mailchimp (Emails)]
```

## 7. System Design
The system is modular, with clear separation of concerns to ensure maintainability and privacy.

- **Frontend**:
  - Framework: React for state management and component-based UI.
  - Components:
    - `ChatWindow`: Displays conversation history.
    - `Message`: Renders individual messages (user or chatbot).
    - `InputBox`: Handles user input and send functionality.
  - State Management: Local state for chat history (if consented) or session-based.
  - Responsive design using CSS frameworks like Tailwind CSS for mobile compatibility.

- **Backend**:
  - Framework: Node.js with Express.js, deployed as Vercel serverless functions.
  - Endpoints:
    - `POST /api/chat`: Receives user message, calls OpenAI API with custom prompt, returns response.
    - `GET /api/user`: Retrieves user data from Airtable (if authenticated).
    - `POST /api/reflection`: Submits reflection data to Airtable.
  - Middleware: Optional JWT authentication for user-specific data access.
  - Environment Variables: Secure storage for API keys (OpenAI, Airtable, Mailchimp).
  - Error Handling: Graceful handling of API failures with user-friendly messages.

- **Integrations**:
  - **Typeform**: Configured to send form submissions to Airtable and Mailchimp via webhooks or Zapier.
  - **Mailchimp**: Automations for email sequences, triggered by Typeform or backend events.
  - **Airtable**: REST API for CRUD operations on Users and Reflections tables.

## 8. API Specifications
The MVP relies on third-party APIs and minimal custom APIs for simplicity.

### OpenAI API
- **Endpoint**: `completions` (or equivalent for GPT-4o)
- **Method**: POST
- **Payload**:
  ```json
  {
    "model": "gpt-4o",
    "prompt": "[Custom Sacred Circuit Prompt] + [User Input]",
    "max_tokens": 150,
    "temperature": 0.7
  }
  ```
- **Response**:
  ```json
  {
    "choices": [
      {
        "text": "Generated response"
      }
    ]
  }
  ```

### Airtable API
- **Endpoint**: `/v1/bases/{baseId}/tables/{tableId}/records`
- **Methods**: POST (create), GET (read), PATCH (update), DELETE (delete)
- **Example Payload (Create User)**:
  ```json
  {
    "fields": {
      "Healing Name": "Serenity",
      "Email": "user@example.com",
      "Consent to Data Storage": false
    }
  }
  ```

### Custom Backend APIs
- **POST /api/chat**
  - **Body**: `{ "message": "User input" }`
  - **Response**: `{ "response": "Chatbot response" }`
- **POST /api/reflection**
  - **Body**: `{ "reflection": "Reflection text", "milestone": "Day 7" }`
  - **Response**: `{ "status": "success" }`

## 9. Data Model
The data model is implemented in Airtable for simplicity and flexibility.

### Users Table
- **Fields**:
  - Healing Name (text): User’s chosen pseudonym.
  - Email (email): Contact email for emails.
  - Consent to Data Storage (yes/no): User’s preference for conversation storage.
  - Created At (date): Timestamp of user creation.
  - Healing Goals (text): User’s stated goals from intake form.
  - Experience with Fasting (multiple choice): User’s fasting background.

### Reflections Table
- **Fields**:
  - User (linked record to Users): Associates reflection with user.
  - Reflection Text (text): User’s submitted reflection.
  - Date (date): Submission date.
  - Milestone (text): E.g., "Day 7", "Day 14".

**Relationships**:
- One-to-many: One User can have multiple Reflections.

## 10. Security Considerations
Privacy and security are paramount, given the platform’s sacred privacy pledge and target audience’s concerns.

- **HTTPS**: All communications use HTTPS to encrypt data in transit.
- **API Key Security**: Store OpenAI, Airtable, and Mailchimp API keys in Vercel environment variables, inaccessible to frontend.
- **Authentication**: Optional JWT-based authentication for user-specific data access (if implemented).
- **Data Encryption**: Airtable handles data encryption at rest; ensure no sensitive data is stored unnecessarily.
- **Consent Management**: Explicit user consent required for conversation storage, with clear UI toggles.
- **Privacy Compliance**: Align with GDPR and other relevant privacy laws, providing a clear privacy policy.
- **Anonymization**: Use Healing Names instead of real names to protect user identity.

## 11. Performance Requirements
The MVP must deliver a responsive experience for 50–100 users.

- **Chatbot Response Time**: < 2 seconds for 90% of requests.
- **Page Load Time**: < 3 seconds for initial load.
- **API Response Time**: < 1 second for backend API calls.
- **Email Delivery**: Near-instant delivery via Mailchimp automations.

## 12. Scalability Considerations
While designed for 50–100 users, the system should support potential growth.

- **Serverless Architecture**: Vercel functions scale automatically with load.
- **Database Efficiency**: Optimize Airtable queries to minimize latency.
- **Monitoring**: Use Vercel analytics to track usage and adjust resources if needed.

## 13. Testing Strategy
A robust testing approach ensures reliability and user satisfaction.

- **Unit Testing**: Test backend functions (e.g., chatbot response generation) and frontend components.
- **Integration Testing**: Verify integrations (Typeform to Airtable, Mailchimp email triggers).
- **End-to-End Testing**: Simulate user flows (onboarding, chatbot interaction, reflection submission).
- **Security Testing**: Conduct penetration testing to identify vulnerabilities (e.g., API key exposure).
- **User Acceptance Testing**: Engage a small group of users to validate functionality and usability.

## 14. Deployment Plan
The MVP will be deployed using Vercel for simplicity and speed.

1. Develop locally using Git for version control.
2. Push code to a Vercel-connected repository.
3. Vercel automatically builds and deploys the application.
4. Configure environment variables in Vercel dashboard for API keys.
5. Set up custom domain (if required).
6. Test the deployed application to ensure all features work as expected.

## 15. Maintenance and Support
Post-launch maintenance ensures the platform remains reliable and user-friendly.

- **Monitoring**: Use Vercel logs and analytics to detect errors or performance issues.
- **Updates**: Regularly update dependencies to address security vulnerabilities.
- **Data Backup**: Rely on Airtable’s built-in backup features; export data periodically.
- **Support**: Provide an email-based support channel or contact form for user inquiries.
- **Feedback Loop**: Incorporate user feedback to plan future updates, potentially expanding to a full app in 2025.

## Key Technical Specifications
| Component | Technology | Function |
|-----------|------------|----------|
| Frontend | React, Vercel | Hosts chatbot interface and landing page |
| Backend | Node.js, Express.js, Vercel | Manages API calls and integrations |
| Database | Airtable | Stores user data and reflections |
| Chatbot | OpenAI GPT-4o API | Provides spiritual and emotional guidance |
| Intake Form | Typeform | Collects user onboarding data |
| Email Sequence | Mailchimp | Sends automated guidance emails |