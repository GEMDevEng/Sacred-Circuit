# Typeform Integration Setup Guide

This document provides step-by-step instructions for setting up a Typeform intake form for the Sacred Healing Hub application, including webhook configuration for data integration.

## 1. Creating a Typeform Account

1. Go to [Typeform](https://www.typeform.com/) and sign up for an account if you don't already have one.
2. Choose a plan that includes webhook functionality (Professional plan or higher).

## 2. Creating the Intake Form

### 2.1 Form Creation

1. Log in to your Typeform account.
2. Click on "Create a typeform" to start a new form.
3. Choose a template or start from scratch.

### 2.2 Required Fields

Add the following questions to your form:

1. **Healing Name** (Short Text)
   - Question: "Please enter your Healing Name (a pseudonym to preserve your privacy)"
   - Required: Yes
   - Reference: `healing_name`
   - Description: "This name will be used throughout your healing journey instead of your real name."

2. **Email** (Email)
   - Question: "What's your email address?"
   - Required: Yes
   - Reference: `email`
   - Description: "We'll use this to send you guidance and reflection prompts."

3. **Healing Goals** (Long Text)
   - Question: "What are your healing goals or intentions for this journey?"
   - Required: Yes
   - Reference: `healing_goals`
   - Description: "This helps us personalize your experience."

4. **Experience with Fasting** (Multiple Choice)
   - Question: "What is your experience with fasting or detoxification?"
   - Options:
     - "No experience"
     - "Some experience (1-2 fasts)"
     - "Moderate experience (3-5 fasts)"
     - "Experienced (6+ fasts)"
   - Required: Yes
   - Reference: `fasting_experience`

5. **Email Consent** (Yes/No)
   - Question: "Do you consent to receiving email communications from Sacred Healing Hub?"
   - Required: Yes
   - Reference: `email_consent`
   - Description: "You can unsubscribe at any time."

### 2.3 Form Settings

1. Go to "Configure" > "Settings".
2. Set an appropriate title: "Sacred Healing Hub - Journey Intake Form".
3. Add a welcome screen with a brief introduction to the Sacred Healing Journey.
4. Add a thank you screen with next steps information.
5. Enable "Remember answers" for returning users.

## 3. Webhook Configuration

### 3.1 Creating a Webhook

1. Go to "Connect" > "Webhooks".
2. Click "Add a webhook".
3. Enter the following details:
   - Webhook URL: `https://your-domain.com/api/webhook/typeform`
   - Payload format: JSON
   - Enable "Send answers as separate variables"

### 3.2 Webhook Security

1. Generate a webhook secret:
   ```bash
   openssl rand -hex 32
   ```
2. Copy the generated string.
3. In the Typeform webhook settings, paste the secret into the "Signing secret" field.
4. Save this secret as `TYPEFORM_WEBHOOK_SECRET` in your application's environment variables.

### 3.3 Testing the Webhook

1. Click "Test webhook" in the Typeform interface.
2. Check your application logs to ensure the webhook is received and processed correctly.
3. Verify that a new user record is created in Airtable.

## 4. Embedding the Form

### 4.1 Getting the Embed Code

1. Go to "Share" > "Embed".
2. Choose the "Standard" embed option.
3. Customize the appearance as needed.
4. Copy the embed code.

### 4.2 Adding to Your Website

1. In your application code, create a component to display the Typeform:

```jsx
import React from 'react';

const TypeformEmbed = () => {
  const typeformUrl = 'https://yourusername.typeform.com/to/FORMID';
  
  return (
    <div className="typeform-container">
      <iframe
        title="Sacred Healing Hub Intake Form"
        src={`${typeformUrl}?typeform-embed=embed-widget&embed-hide-footer=true&embed-hide-headers=true&embed-opacity=100`}
        style={{ width: '100%', height: '500px', border: 'none' }}
        allow="camera; microphone; autoplay; encrypted-media;"
      ></iframe>
    </div>
  );
};

export default TypeformEmbed;
```

2. Use this component on your onboarding page.

## 5. Data Mapping

The webhook will send data to your application in the following format:

```json
{
  "form_response": {
    "form_id": "FORM_ID",
    "submitted_at": "2023-06-01T12:00:00Z",
    "answers": [
      {
        "field": {
          "id": "FIELD_ID",
          "ref": "healing_name",
          "type": "short_text"
        },
        "text": "User's Healing Name"
      },
      {
        "field": {
          "id": "FIELD_ID",
          "ref": "email",
          "type": "email"
        },
        "email": "user@example.com"
      },
      // Additional fields...
    ]
  }
}
```

Your webhook handler should extract these values and store them in your database.

## 6. Troubleshooting

### 6.1 Webhook Not Receiving Data

1. Check that your server is publicly accessible.
2. Verify that the webhook URL is correct.
3. Check your server logs for any errors.
4. Ensure the webhook signature verification is working correctly.

### 6.2 Form Submission Issues

1. Test the form yourself to identify any issues.
2. Check that all required fields are properly configured.
3. Verify that the form is properly embedded on your website.

## 7. Maintenance

### 7.1 Regular Checks

1. Periodically test the form submission flow.
2. Monitor webhook logs for any errors.
3. Update the form questions as needed based on user feedback.

### 7.2 Typeform Plan Management

1. Monitor your Typeform usage to ensure you stay within plan limits.
2. Consider upgrading your plan if you need additional features or higher submission limits.
