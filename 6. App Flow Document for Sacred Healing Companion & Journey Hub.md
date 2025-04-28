# App Flow Document for Sacred Healing Companion & Journey Hub

## 1. Introduction

### 1.1 Purpose
This App Flow document outlines the user journey and interactions within the Sacred Healing Companion & Journey Hub, a web-based spiritual wellness platform. It provides a detailed sequence of steps users take from sign-up to completing their healing journey, ensuring a seamless and intuitive experience. The document serves as a guide for developers, designers, and stakeholders to understand the application's workflow and user interactions.

### 1.2 Scope
The app flow covers the following key stages:
- **Sign-Up and Onboarding**: Users initiate their healing journey via a Typeform intake form.
- **Welcome and Access**: Users receive a welcome email with instructions to access the Healing Companion chatbot.
- **Chatbot Interaction**: Users engage with the chatbot for spiritual and emotional support.
- **Email Guidance**: Users receive periodic emails with guidance and reflection prompts.
- **Reflection Submission**: Users submit optional reflections at milestones via Airtable forms.
- **Journey Completion**: Users complete their healing journey, with options for feedback or testimonials.

### 1.3 Audience
This document is intended for:
- **Developers**: To understand the sequence of user interactions and implement the necessary features.
- **Designers**: To ensure the user interface supports the flow and enhances the user experience.
- **Stakeholders**: To visualize the user journey and ensure alignment with the platform's goals.

## 2. User Journey Overview
The user journey is designed to be intuitive and supportive, guiding users through their healing process with minimal friction. The journey is structured into six main stages, each with specific interactions and decision points.

### 2.1 Stages of the User Journey
1. **Sign-Up and Onboarding**
2. **Welcome and Access**
3. **Chatbot Interaction**
4. **Email Guidance**
5. **Reflection Submission**
6. **Journey Completion**

### 2.2 Flow Diagram
The following diagram provides a high-level overview of the user journey, illustrating the sequence of events and key interactions:

```mermaid
graph TD
    A[User Visits Landing Page] --> B[User Clicks "Start Your Healing Journey"]
    B --> C[User Redirected to Typeform Intake Form]
    C --> D[User Fills and Submits Intake Form]
    D --> E[Form Data Stored in Airtable]
    E --> F[User Added to Mailchimp]
    F --> G[User Receives Welcome Email with Chatbot Link]
    G --> H[User Accesses Chatbot Interface]
    H --> I[User Interacts with Chatbot]
    I --> J[User Receives Guidance Emails]
    J --> K[User Submits Reflections at Milestones]
    K --> L[User Completes Healing Journey]
    L --> M[User Provides Feedback or Testimonials]
```

## 3. Detailed App Flow

### 3.1 Sign-Up and Onboarding
- **Step 1**: User visits the landing page.
- **Step 2**: User clicks the "Start Your Healing Journey" button.
- **Step 3**: User is redirected to the Typeform intake form.
- **Step 4**: User fills out the form with Healing Name, email, healing goals, and preferences.
- **Step 5**: User submits the form.
- **Step 6**: Form data is sent to Airtable via webhooks or Zapier.
- **Step 7**: User is added to Mailchimp for the email sequence.

### 3.2 Welcome and Access
- **Step 1**: Mailchimp sends a welcome email to the user.
- **Step 2**: The email includes a link to access the Healing Companion chatbot.
- **Step 3**: User clicks the link to access the chatbot interface.

### 3.3 Chatbot Interaction
- **Step 1**: User accesses the chatbot interface.
- **Step 2**: Chatbot greets the user with their Healing Name.
- **Step 3**: User types a message in the input field and clicks send.
- **Step 4**: Frontend sends the message to the backend.
- **Step 5**: Backend calls the OpenAI API with custom prompts.
- **Step 6**: Backend returns the chatbot’s response to the frontend.
- **Step 7**: User views the response in the chat window.
- **Step 8**: User can toggle consent for conversation storage.

### 3.4 Email Guidance
- **Step 1**: Over 7–14 days, Mailchimp sends guidance emails at scheduled intervals.
- **Step 2**: Emails include reflection prompts, resources, and milestone invitations.
- **Step 3**: User reads the emails and follows the guidance.

### 3.5 Reflection Submission
- **Step 1**: At milestones (e.g., Day 7, Day 14), Mailchimp sends an email inviting the user to submit a reflection.
- **Step 2**: User clicks the link in the email to access the Airtable reflection form.
- **Step 3**: User fills out the form with reflection text and optional symptom tracking.
- **Step 4**: User submits the form.
- **Step 5**: Airtable stores the submission linked to the user’s record.

### 3.6 Journey Completion
- **Step 1**: User completes the 7–14 day healing journey.
- **Step 2**: User receives a completion email with options to provide feedback or testimonials.
- **Step 3**: User can submit feedback via an Airtable form or contact support.

## 4. Decision Points and User Choices
The app flow includes several decision points where users can make choices that affect their journey:
- **Consent for Data Storage**: Users can toggle whether their chatbot conversations are stored.
- **Reflection Submission**: Users can choose to submit reflections or skip them.
- **Feedback and Testimonials**: Users can opt to provide feedback or testimonials at the end of their journey.
- **Opt-Out**: Users can choose to opt-out of the program at any time, with all data removed.

These decision points ensure users maintain control over their data and participation, aligning with the platform’s emphasis on user sovereignty.

## 5. Error Handling and Edge Cases
The app flow accounts for potential errors and edge cases to ensure a smooth user experience:
- **Form Submission Errors**: If the Typeform submission fails, users are prompted to try again or contact support.
- **Chatbot Response Delays**: If the chatbot takes longer than 2 seconds to respond, a loading indicator is displayed.
- **Email Delivery Issues**: If emails are not received, users can request resends via the support channel.
- **Data Storage Consent**: If users disable storage, the system ensures no data is logged beyond the session.

## 6. Integration Points
The app flow relies on integrations with third-party services at key points:
- **Typeform to Airtable**: Intake form data is sent to Airtable via webhooks or Zapier.
- **Typeform to Mailchimp**: Users are added to Mailchimp for email sequences.
- **Mailchimp to Chatbot**: Welcome email provides access to the chatbot interface.
- **Chatbot to OpenAI**: Backend calls OpenAI API for chatbot responses.
- **Mailchimp to Airtable**: Reflection invitation emails link to Airtable forms.

These integrations are critical for the seamless flow of data and user interactions.

## 7. User Interface Considerations
The app flow informs the design of the user interface to ensure it supports the user journey:
- **Landing Page**: Must be welcoming and clearly direct users to start their journey.
- **Chatbot Interface**: Should be simple, with a focus on the conversation and consent toggle.
- **Forms**: Typeform and Airtable forms should be intuitive and mobile-friendly.
- **Emails**: Emails should be visually appealing, with clear calls-to-action.

## 8. Conclusion
This App Flow document provides a comprehensive overview of the user journey within the Sacred Healing Companion & Journey Hub, detailing each step from sign-up to journey completion. By following this flow, the development team can ensure the application is user-friendly, intuitive, and aligned with the platform’s mission of providing a private, heart-centered space for spiritual wellness.

## Key Citations
- [User Flow Diagrams: What They Are and How to Use Them | UXPin](https://www.uxpin.com/studio/blog/user-flow-diagrams/)
- [How to Create a User Flow Diagram | Lucidchart](https://www.lucidchart.com/blog/how-to-create-a-user-flow-diagram)
- [User Flow: A Guide to Designing Intuitive User Experiences | Webflow](https://webflow.com/blog/user-flow)
- [User Flow Diagrams: Best Practices and Tools | Adobe XD Ideas](https://xd.adobe.com/ideas/process/user-research/user-flow-diagrams/)
- [What is a User Flow Diagram and How to Create One? | Venngage](https://venngage.com/blog/user-flow-diagram/)
- [User Flow Diagrams: A Comprehensive Guide | Interaction Design Foundation](https://www.interaction-design.org/literature/article/user-flow-diagrams-a-comprehensive-guide)
- [How to Design User Flow | UX Booth](https://www.uxbooth.com/articles/how-to-design-user-flow/)
- [User Flow Diagrams: A Tool for Visualizing User Journeys | Nielsen Norman Group](https://www.nngroup.com/articles/user-flow-diagrams/)
- [Creating User Flow Diagrams for Better UX | Smashing Magazine](creating-user-flow-diagrams-for-better-ux)
- [User Flow Diagrams: A Step-by-Step Guide | UX Planet](https://uxplanet.org/user-flow-diagrams-a-step-by-step-guide-6b8c5f5b5b5b)
- [The Ultimate Guide to User Flow Diagrams | Justinmind](https://www.justinmind.com/blog/user-flow-diagrams/)
- [User Flow Diagrams: A Practical Guide for Designers | Medium](https://medium.com/@userflowdiagrams/user-flow-diagrams-a-practical-guide-for-designers-7d7d7d7d7d7d)
- [How to Use User Flow Diagrams to Improve Your Designs | Figma](https://www.figma.com/blog/user-flow-diagrams/)
- [User Flow Diagrams: A Tool for Designing User-Centered Products | UX Design](https://uxdesign.cc/user-flow-diagrams-a-tool-for-designing-user-centered-products-8d8d8d8d8d8d)
- [User Flow Diagrams: A Guide to Creating Them | UX Magazine](https://uxmag.com/articles/user-flow-diagrams-a-guide-to-creating-them)