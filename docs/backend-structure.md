# Backend Structure Document for Sacred Healing Companion & Journey Hub

## Table of Contents
1. [Introduction](#1-introduction)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [API Endpoints](#4-api-endpoints)
5. [Data Model](#5-data-model)
6. [Integrations](#6-integrations)
7. [Security and Privacy](#7-security-and-privacy)
8. [Performance and Scalability](#8-performance-and-scalability)
9. [Testing and Quality Assurance](#9-testing-and-quality-assurance)
10. [Deployment](#10-deployment)
11. [Maintenance and Monitoring](#11-maintenance-and-monitoring)
12. [Conclusion](#12-conclusion)

---

## 1. Introduction
The backend of the Sacred Healing Companion & Journey Hub is designed to support the platform's core features, including an AI-powered chatbot, user data management, and email automation. It ensures that all interactions are handled securely and privately, aligning with the platform's commitment to user sovereignty and sacred healing principles. This document provides a comprehensive overview of the backend's structure, detailing its components, architecture, and implementation strategies to guide developers and stakeholders.

---

## 2. Technology Stack
The backend leverages the following technologies:

- **Node.js with Express.js**: A lightweight, efficient framework for building server functions that excel at handling asynchronous requests.
- **Vercel**: A serverless platform for deploying functions, offering automatic scaling and simplified maintenance.
- **Airtable**: A flexible, user-friendly database for storing user and reflection data, chosen for its ease of integration.
- **OpenAI API**: Powers the chatbot with advanced natural language processing capabilities.
- **Mailchimp**: Manages automated email sequences to support the user journey.
- **Typeform**: Collects user intake data through customizable, intuitive forms.

These tools were selected for their reliability, scalability, and compatibility with the platform's privacy-focused requirements.

---

## 3. Architecture Overview
The backend adopts a serverless architecture, with each API endpoint deployed as an independent function on Vercel. This design ensures scalability and isolates functionality for easier maintenance. Key components include:

- **API Endpoints**: Process requests from the frontend, such as chatbot interactions and reflection submissions.
- **Database**: Airtable stores user and reflection data, accessed via its REST API.
- **Third-Party Integrations**: OpenAI for chatbot responses, Mailchimp for email automation, and Typeform for intake forms.

### Data Flow
- **Chatbot Interaction**: The frontend sends requests to `/api/chat`, which calls the OpenAI API and returns responses.
- **Reflection Submission**: The frontend submits data to `/api/reflection`, which stores it in Airtable.
- **Intake Process**: Typeform submissions are sent to Airtable and Mailchimp via webhooks or Zapier.

**Conceptual Diagram**:
```
[Frontend] <--> [Vercel Serverless Functions] <--> [Airtable]
                           |
                         [OpenAI API]
[Typeform] --> [Airtable] --> [Mailchimp]
```

---

## 4. API Endpoints
The backend provides the following endpoints:

### 4.1 POST /api/chat
- **Purpose**: Facilitates chatbot interactions.
- **Request Body**:
  ```json
  {
    "message": "User's message",
    "healingName": "User's Healing Name",
    "consent": true
  }
  ```
- **Response**:
  ```json
  {
    "response": "Chatbot's response"
  }
  ```
- **Functionality**: Calls the OpenAI API with the user’s message and custom prompts. Stores conversations temporarily if `consent` is `true`.

### 4.2 POST /api/reflection
- **Purpose**: Submits user reflections to Airtable.
- **Request Body**:
  ```json
  {
    "healingName": "User's Healing Name",
    "reflection": "Reflection text",
    "milestone": "Day 7"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success"
  }
  ```
- **Functionality**: Stores the reflection in Airtable, linked to the user via their Healing Name.

Both endpoints include error handling for scenarios like invalid inputs or API failures, returning descriptive error messages.

---

## 5. Data Model
Airtable serves as the database with two primary tables:

### 5.1 Users Table
- **Fields**:
  - `Healing Name` (text): User’s pseudonym.
  - `Email` (email): Contact email.
  - `Consent to Data Storage` (yes/no): Consent status.
  - `Created At` (date): Record creation timestamp.
  - `Healing Goals` (text): User’s goals from intake.
  - `Experience with Fasting` (multiple choice): Fasting background.

### 5.2 Reflections Table
- **Fields**:
  - `User` (linked to Users): Links to the user record.
  - `Reflection Text` (text): Submitted reflection.
  - `Date` (date): Submission date.
  - `Milestone` (text): E.g., "Day 7".

These tables support the platform’s data needs, with relationships managed via Airtable’s linking feature.

---

## 6. Integrations
The backend integrates with third-party services as follows:

- **OpenAI API**: The `/api/chat` endpoint uses OpenAI’s completions API with custom prompts for chatbot responses.
- **Airtable API**: Handles CRUD operations for Users and Reflections tables, authenticated via a secure API key.
- **Mailchimp**: Triggered by Typeform submissions through webhooks or Zapier for email automation.
- **Typeform**: Sends intake form data to Airtable and Mailchimp via webhooks or Zapier.

For reflections, users submit forms via `/api/reflection`, which the backend processes and stores in Airtable.

---

## 7. Security and Privacy
Privacy and security are paramount, enforced through:
- **HTTPS**: Encrypts all communications.
- **Environment Variables**: Securely store API keys in Vercel.
- **Consent-Based Storage**: Conversations are stored only with user consent.
- **OpenAI ZDR**: Uses Zero Data Retention to prevent data use in training.
- **GDPR Compliance**: Adheres to privacy regulations with a transparent policy.
- **Anonymization**: Uses Healing Names instead of real identities.
- **Minimal Logging**: Logs only non-sensitive data (e.g., timestamps, endpoint names).

---

## 8. Performance and Scalability
The backend supports 50–100 initial users, with Vercel’s serverless scaling handling growth. Performance optimizations include:
- **Efficient API Calls**: Minimizes and batches requests.
- **Response Time Goal**: Chatbot responses within 2 seconds.
- **Caching**: Applied to static assets, not dynamic responses.

---

## 9. Testing and Quality Assurance
Testing ensures reliability:
- **Unit Tests**: Validate individual functions (e.g., with Jest).
- **Integration Tests**: Verify endpoint interactions with Airtable and OpenAI.
- **End-to-End Tests**: Test user flows (e.g., with Cypress).
- **Security Tests**: Confirm data protection and consent functionality.

Edge cases like API downtime or invalid inputs are addressed.

---

## 10. Deployment
Deployment occurs on Vercel:
1. Push code to a Git repository linked to Vercel.
2. Vercel builds and deploys functions automatically.
3. Set environment variables in Vercel’s dashboard.
4. Configure for production use.

CI/CD ensures seamless updates.

---

## 11. Maintenance and Monitoring
Ongoing maintenance includes:
- **Monitoring**: Use Vercel’s dashboard for logs and metrics.
- **Alerts**: Set for errors or performance issues.
- **Updates**: Patch dependencies for security.
- **Support**: Address user issues promptly.
- **Backups**: Regularly save Airtable data.

---

## 12. Conclusion
The backend provides a robust, scalable foundation for the Sacred Healing Companion & Journey Hub, balancing functionality with stringent privacy standards. This document ensures clarity for implementation and maintenance, supporting the platform’s mission of sacred, user-focused healing.