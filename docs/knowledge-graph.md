# Knowledge Graph for Sacred Healing Companion & Journey Hub

## 1. Introduction

### 1.1 Purpose
This Knowledge Graph document provides a detailed and comprehensive representation of the entities, relationships, and processes involved in developing the Sacred Healing Companion & Journey Hub, a web-based spiritual wellness platform. The graph serves as a structured knowledge base for the AI Coding Agent, enabling contextual understanding of tasks, dependencies, and system interactions to support efficient code generation, testing, and documentation. It integrates information from the Work Breakdown Structure (WBS), Implementation Plan, Task List, Tickets, Directory Structure, and other project documents, ensuring alignment with the platform’s goal of delivering a secure, user-focused Minimum Viable Product (MVP) by June 2025.

### 1.2 Scope
The Knowledge Graph covers:
- **User Journey**: Entities and interactions related to user onboarding, chatbot conversations, and reflection submissions.
- **Technical Components**: Frontend, backend, APIs, integrations, and testing frameworks.
- **Project Management**: Tasks, milestones, and artifacts (e.g., code files, documentation).
- **Security/Privacy**: Mechanisms ensuring GDPR compliance, Zero Data Retention (ZDR), and user anonymity via Healing Names.

The graph models the platform’s architecture, workflows, and development process, emphasizing relationships critical to functionality, security, and user experience.

### 1.3 Audience
This document is intended for:
- **AI Coding Agent**: To understand system context and generate code/test/documentation aligned with relationships.
- **Developers**: To navigate the system’s structure and integrate AI-generated outputs.
- **Project Managers**: To track dependencies and ensure task alignment.
- **Stakeholders**: To gain insight into the platform’s components and interactions.

### 1.4 Assumptions
- The Knowledge Graph is a high-level abstraction, focusing on key entities and relationships rather than exhaustive code-level details.
- The AI Coding Agent can interpret the graph to prioritize tasks and generate outputs based on relationships (e.g., “Chatbot interacts with OpenAI API”).
- The project timeline is 12 weeks (April 7, 2025, to June 29, 2025), as per the Gantt Chart.
- All referenced project documents (e.g., PRD, SRS, Tickets) are accessible to the AI and team.

## 2. Knowledge Graph Overview
The Knowledge Graph is a directed graph comprising nodes (entities) and edges (relationships). It is organized into four domains to reflect the platform’s structure:
- **User Journey**: Captures user interactions (e.g., onboarding, chatbot, reflections).
- **Technical Components**: Models the system architecture (e.g., frontend, backend, integrations).
- **Project Management**: Represents development tasks, artifacts, and milestones.
- **Security/Privacy**: Highlights mechanisms for data protection and compliance.

### 2.1 Node Types
Nodes represent entities with the following attributes:
- **ID**: Unique identifier (e.g., N1).
- **Name**: Descriptive label (e.g., User).
- **Type**: Category (e.g., Entity, Component, Task, Artifact).
- **Description**: Purpose or role in the project.
- **Properties**: Key attributes (e.g., Healing Name for User, URL for API Endpoint).

### 2.2 Edge Types
Edges represent relationships with:
- **Source**: Starting node.
- **Target**: Ending node.
- **Type**: Relationship type (e.g., interacts with, depends on).
- **Description**: Context of the relationship.

## 3. Knowledge Graph Structure
The following table lists the nodes and edges, followed by a detailed description of each domain and a visual representation using Mermaid syntax.

### 3.1 Nodes
| Node ID | Name                     | Type        | Description                                                                 | Properties                                                                 |
|---------|--------------------------|-------------|-----------------------------------------------------------------------------|---------------------------------------------------------------------------|
| N1      | User                     | Entity      | Represents a young adult (18–35) engaging with the platform.                | Healing Name, Email, Healing Goals, Consent Status                        |
| N2      | Chatbot                  | Component   | Conversational interface for spiritual guidance, powered by OpenAI.         | Consent Toggle, Custom Prompt (placeholder)                               |
| N3      | Reflection               | Entity      | User-submitted reflection tied to milestones (e.g., Day 7).                 | Healing Name, Reflection Text, Milestone                                  |
| N4      | Landing Page             | Component   | Frontend page introducing the platform and linking to Typeform.             | URL: `/`, Button: “Start Your Healing Journey”                            |
| N5      | Frontend                 | Component   | React-based UI with Tailwind CSS styling.                                   | Tech: React, TypeScript, Tailwind CSS, Routes: `/`, `/chatbot`            |
| N6      | Backend                  | Component   | Node.js/Express server handling API requests and integrations.              | Tech: Node.js, Express, Endpoints: `/api/chat`, `/api/reflection`         |
| N7      | /api/chat Endpoint       | Component   | API endpoint for chatbot interactions, calling OpenAI.                     | Method: POST, Inputs: message, healingName, consent                       |
| N8      | /api/reflection Endpoint | Component   | API endpoint for storing reflections in Airtable.                          | Method: POST, Inputs: healingName, reflection, milestone                  |
| N9      | /api/webhook/typeform    | Component   | Webhook endpoint for Typeform submissions (optional if using Zapier).      | Method: POST, Inputs: form data, Secret Token                             |
| N10     | OpenAI API               | Integration | External API for generating chatbot responses.                             | API Key, Model: GPT-4o, ZDR Enabled                                       |
| N11     | Airtable                 | Integration | Database for storing user data and reflections.                             | Base ID, API Key, Tables: Users, Reflections                              |
| N12     | Typeform                 | Integration | Form platform for user onboarding.                                         | Form Fields: Healing Name, Email, Healing Goals, Experience with Fasting |
| N13     | Mailchimp                | Integration | Email service for automated 7–14 day sequences.                            | API Key, Sequences: Welcome, Guidance, Reflection                         |
| N14     | Zapier                   | Integration | Optional automation tool for Typeform-to-Airtable/Mailchimp integration.   | Triggers: Form Submission, Actions: Store in Airtable, Add to Mailchimp   |
| N15     | Vercel                   | Component   | Hosting platform for frontend and backend deployment.                       | Environment Variables, URL: `https://<app>.vercel.app`                    |
| N16     | Sentry                   | Component   | Monitoring tool for error tracking post-launch.                            | API Key, Tracks: API Errors, Frontend Crashes                            |
| N17     | Task                     | Task        | Development task from WBS (e.g., Build Landing Page).                      | Task ID, Duration, Dependencies, Assigned To: AI/Team                     |
| N18     | Milestone                | Milestone   | Key project checkpoint (e.g., Frontend Complete).                          | Date, Description (e.g., “Chatbot Interface Implemented”)                 |
| N19     | Artifact                 | Artifact    | Deliverable like code file or documentation (e.g., `ChatbotInterface.tsx`). | Path (e.g., `src/components/chatbot`), Type: Code/Documentation           |
| N20     | Security Policy          | Policy      | Rules ensuring GDPR compliance and data protection.                        | Rules: ZDR, Consent Toggle, Input Validation, HTTPS                      |
| N21     | Privacy Mechanism        | Mechanism   | Features like Healing Names and consent toggle for user privacy.            | Features: Anonymity, Optional Data Storage                                |

### 3.2 Edges
| Edge ID | Source | Target | Type              | Description                                                                 |
|---------|--------|--------|-------------------|-----------------------------------------------------------------------------|
| E1      | N1     | N2     | interacts with    | User engages with the chatbot for spiritual guidance.                       |
| E2      | N1     | N3     | submits           | User submits reflections at milestones.                                     |
| E3      | N1     | N4     | accesses          | User visits the landing page to start their journey.                        |
| E4      | N1     | N12    | completes         | User fills out the Typeform intake form during onboarding.                  |
| E5      | N2     | N7     | sends request to  | Chatbot sends user messages to the /api/chat endpoint.                      |
| E6      | N3     | N8     | sends data to     | Reflection data is sent to the /api/reflection endpoint.                    |
| E7      | N4     | N5     | part of           | Landing page is a component of the frontend.                                |
| E8      | N2     | N5     | part of           | Chatbot interface is a component of the frontend.                           |
| E9      | N7     | N6     | hosted by         | /api/chat endpoint is part of the backend.                                  |
| E10     | N8     | N6     | hosted by         | /api/reflection endpoint is part of the backend.                            |
| E11     | N9     | N6     | hosted by         | /api/webhook/typeform endpoint is part of the backend.                      |
| E12     | N7     | N10    | calls             | /api/chat endpoint calls the OpenAI API for responses.                      |
| E13     | N8     | N11    | stores data in    | /api/reflection endpoint stores reflections in Airtable.                    |
| E14     | N9     | N11    | stores data in    | Webhook endpoint stores Typeform data in Airtable.                          |
| E15     | N9     | N13    | adds user to      | Webhook endpoint adds users to Mailchimp lists.                             |
| E16     | N12    | N14    | triggers          | Typeform submissions trigger Zapier actions (if used).                      |
| E17     | N14    | N11    | stores data in    | Zapier stores Typeform data in Airtable.                                    |
| E18     | N14    | N13    | adds user to      | Zapier adds users to Mailchimp lists.                                      |
| E19     | N13    | N1     | sends email to    | Mailchimp sends automated emails to users.                                  |
| E20     | N5     | N15    | deployed on       | Frontend is deployed on Vercel.                                             |
| E21     | N6     | N15    | deployed on       | Backend is deployed on Vercel.                                              |
| E22     | N5     | N16    | monitored by      | Frontend errors are tracked by Sentry.                                      |
| E23     | N6     | N16    | monitored by      | Backend errors are tracked by Sentry.                                       |
| E24     | N17    | N19    | produces          | Tasks produce artifacts like code files or documentation.                   |
| E25     | N17    | N18    | contributes to    | Tasks contribute to achieving milestones.                                   |
| E26     | N19    | N5     | part of           | Frontend artifacts (e.g., `ChatbotInterface.tsx`) are part of the frontend. |
| E27     | N19    | N6     | part of           | Backend artifacts (e.g., `chat.js`) are part of the backend.                |
| E28     | N1     | N21    | protected by      | User data is protected by privacy mechanisms like Healing Names.            |
| E29     | N2     | N21    | enforces          | Chatbot enforces privacy via consent toggle.                                |
| E30     | N5     | N20    | complies with     | Frontend complies with security policies (e.g., HTTPS).                     |
| E31     | N6     | N20    | complies with     | Backend complies with security policies (e.g., input validation).           |
| E32     | N10    | N20    | complies with     | OpenAI API complies with ZDR policy.                                        |

## 4. Domain Descriptions

### 4.1 User Journey
This domain models how users interact with the platform:
- **Nodes**: User (N1), Chatbot (N2), Reflection (N3), Landing Page (N4), Typeform (N12), Mailchimp (N13).
- **Key Relationships**:
  - User accesses the Landing Page (E3) to start their journey.
  - User completes a Typeform form (E4) for onboarding.
  - User interacts with the Chatbot (E1) for guidance and submits Reflections (E2).
  - Mailchimp sends emails to Users (E19) for engagement.
- **Purpose**: Captures the end-to-end user experience, from onboarding to ongoing engagement, emphasizing privacy through Healing Names (N21).

### 4.2 Technical Components
This domain represents the system’s architecture:
- **Nodes**: Frontend (N5), Backend (N6), /api/chat Endpoint (N7), /api/reflection Endpoint (N8), /api/webhook/typeform (N9), OpenAI API (N10), Airtable (N11), Typeform (N12), Mailchimp (N13), Zapier (N14), Vercel (N15), Sentry (N16).
- **Key Relationships**:
  - Frontend components (Landing Page, Chatbot) are part of Frontend (E7, E8).
  - API endpoints are hosted by Backend (E9–E11).
  - /api/chat calls OpenAI API (E12), /api/reflection stores data in Airtable (E13).
  - Webhook/Zapier integrates Typeform with Airtable and Mailchimp (E14–E18).
  - Frontend and Backend are deployed on Vercel (E20, E21) and monitored by Sentry (E22, E23).
- **Purpose**: Defines the technical infrastructure, highlighting integrations and deployment.

### 4.3 Project Management
This domain tracks development activities:
- **Nodes**: Task (N17), Milestone (N18), Artifact (N19).
- **Key Relationships**:
  - Tasks produce Artifacts (E24) like code files or documentation.
  - Tasks contribute to Milestones (E25) like “Frontend Complete.”
  - Artifacts are part of Frontend or Backend (E26, E27).
- **Purpose**: Organizes development tasks and deliverables, linking them to system components.

### 4.4 Security/Privacy
This domain ensures data protection:
- **Nodes**: Security Policy (N20), Privacy Mechanism (N21).
- **Key Relationships**:
  - User is protected by Privacy Mechanisms (E28) like Healing Names.
  - Chatbot enforces privacy via consent toggle (E29).
  - Frontend, Backend, and OpenAI API comply with Security Policy (E30–E32).
- **Purpose**: Emphasizes GDPR compliance, ZDR, and user anonymity.

## 5. Visual Representation
The following Mermaid code generates a simplified visual representation of the Knowledge Graph, focusing on key entities and relationships for clarity. Due to Mermaid’s limitations, it includes a subset of nodes and edges; the full graph is described in the tables above.

```mermaid
graph TD
    N1[User] -->|interacts with| N2[Chatbot]
    N1 -->|submits| N3[Reflection]
    N1 -->|accesses| N4[Landing Page]
    N1 -->|completes| N12[Typeform]
    N2 -->|sends request to| N7[/api/chat]
    N3 -->|sends data to| N8[/api/reflection]
    N4 -->|part of| N5[Frontend]
    N2 -->|part of| N5
    N7 -->|hosted by| N6[Backend]
    N8 -->|hosted by| N6
    N7 -->|calls| N10[OpenAI API]
    N8 -->|stores data in| N11[Airtable]
    N12 -->|triggers| N14[Zapier]
    N14 -->|stores data in| N11
    N14 -->|adds user to| N13[Mailchimp]
    N13 -->|sends email to| N1
    N5 -->|deployed on| N15[Vercel]
    N6 -->|deployed on| N15
    N5 -->|monitored by| N16[Sentry]
    N6 -->|monitored by| N16
    N1 -->|protected by| N21[Privacy Mechanism]
    N2 -->|enforces| N21
    N5 -->|complies with| N20[Security Policy]
    N6 -->|complies with| N20
    N10 -->|complies with| N20
```

## 6. Guidelines for AI Coding Agent
To leverage the Knowledge Graph effectively, the AI Coding Agent should:
- **Understand Context**: Use the graph to map relationships (e.g., Chatbot → /api/chat → OpenAI API) before generating code.
- **Prioritize Relationships**: Focus on critical edges (e.g., E5, E12 for chatbot functionality) when executing tasks.
- **Generate Aligned Outputs**:
  - For N2 (Chatbot), create `ChatbotInterface.tsx` (N19) with a consent toggle (N21).
  - For N7 (/api/chat), generate `chat.js` (N19) calling N10 (OpenAI API) with ZDR (N20).
- **Respect Dependencies**: Ensure tasks align with edges (e.g., T2.2.2 depends on T2.2.5 for OpenAI integration).
- **Document Relationships**: Include JSDoc comments referencing related nodes (e.g., “Calls OpenAI API (N10)”) in code.
- **Validate Privacy/Security**: Implement N21 (Privacy Mechanism) and N20 (Security Policy) in relevant components (e.g., consent toggle in N2, HTTPS in N5/N6).
- **Update Graph**: If new entities or relationships arise, suggest updates to the Knowledge Graph for team review.

## 7. Use Cases
The Knowledge Graph supports the AI Coding Agent in:
- **Code Generation**: Understanding that N2 (Chatbot) sends requests to N7 (/api/chat), which calls N10 (OpenAI API), to generate `ChatbotInterface.tsx` and `chat.js`.
- **Testing**: Mapping N5 (Frontend) and N6 (Backend) to N16 (Sentry) for error monitoring tests.
- **Documentation**: Referencing N12 (Typeform) and N13 (Mailchimp) relationships to generate `typeform-setup.md` and `mailchimp-setup.md`.
- **Debugging**: Tracing issues from N1 (User) interactions through N2, N7, and N10 to identify API call failures.

## 8. References
The Knowledge Graph integrates information from:
- Product Requirements Document (PRD)
- Software Requirements Specification (SRS)
- App Flow Document
- Features Results Document
- Frontend Guidelines
- Backend Structure Document
- Tech Stack Document
- Security Guidelines
- Work Breakdown Structure (WBS)
- Project Rules Document
- Implementation Plan
- Task List
- Tickets Document
- Directory Structure
- Gantt Chart

## 9. Conclusion
This Knowledge Graph document provides a detailed, comprehensive, and complete representation of the Sacred Healing Companion & Journey Hub’s entities, relationships, and processes. By modeling the user journey, technical components, project management, and security/privacy domains, it equips the AI Coding Agent with the context needed to generate high-quality code, tests, and documentation. The graph ensures alignment with project goals, facilitating the delivery of a secure, spiritually-aligned MVP by June 2025.