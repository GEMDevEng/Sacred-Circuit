# Mailchimp Integration Setup Guide

This document provides step-by-step instructions for setting up Mailchimp for the Sacred Healing Hub application, including email sequences, templates, and API integration.

## 1. Creating a Mailchimp Account

1. Go to [Mailchimp](https://mailchimp.com/) and sign up for an account if you don't already have one.
2. Choose a plan that includes automation features (Standard plan or higher).

## 2. Setting Up Your Audience

### 2.1 Creating an Audience

1. Go to "Audience" > "Audience dashboard".
2. Click "Create Audience" if you don't already have one.
3. Fill in the required information:
   - Audience name: "Sacred Healing Hub"
   - Default from email: your email address
   - Default from name: "Sacred Healing Hub"
   - Reminder of how they signed up: "You're receiving this email because you signed up for the Sacred Healing Journey."

### 2.2 Configuring Audience Fields

1. Go to "Audience" > "Settings" > "Audience fields and *|MERGE|* tags".
2. Add the following custom fields:
   - Field name: "Healing Name", Field type: Text, Tag: `*|HEALING_NAME|*`
   - Field name: "Journey Start Date", Field type: Date, Tag: `*|JOURNEY_START|*`
   - Field name: "Current Milestone", Field type: Text, Tag: `*|CURRENT_MILESTONE|*`

## 3. Creating Email Templates

### 3.1 Base Template

1. Go to "Brand" > "Content Studio".
2. Click "Create Template".
3. Choose a template or start from scratch.
4. Design a base template with:
   - Your logo at the top
   - A consistent color scheme matching your website
   - Social media links in the footer
   - Unsubscribe link in the footer

### 3.2 Email Templates

Create the following templates based on your base template:

1. **Welcome Email**
   - Subject: "Welcome to Your Sacred Healing Journey, *|HEALING_NAME|*"
   - Content: Introduction to the journey, what to expect, how to use the chatbot

2. **Day 1 Guidance**
   - Subject: "Your Sacred Healing Journey: Day 1"
   - Content: First day guidance, initial practices, encouragement

3. **Day 7 Reflection Prompt**
   - Subject: "Time to Reflect: 7 Days into Your Journey"
   - Content: Reflection prompts, link to the reflection submission form

4. **Day 14 Reflection Prompt**
   - Subject: "Midpoint Reflection: 14 Days into Your Journey"
   - Content: Deeper reflection prompts, encouragement, link to the reflection submission form

5. **Day 21 Reflection Prompt**
   - Subject: "Three Weeks In: Reflection Time"
   - Content: Progress reflection prompts, link to the reflection submission form

6. **Day 30 Completion**
   - Subject: "Congratulations on Completing Your 30-Day Journey!"
   - Content: Celebration of completion, final reflection prompts, next steps

## 4. Setting Up Automation Sequences

### 4.1 Welcome Sequence

1. Go to "Automations" > "Create Automation".
2. Choose "Welcome new subscribers".
3. Select your audience.
4. Configure the trigger: "Subscriber joins audience".
5. Add the Welcome Email as the first email.
6. Set it to send immediately after sign-up.

### 4.2 Journey Sequence

1. Go to "Automations" > "Create Automation".
2. Choose "Custom automation".
3. Select your audience.
4. Configure the trigger: "Date based".
5. Use the "Journey Start Date" field as the reference date.
6. Add emails at the following intervals:
   - Day 1: Day 1 Guidance email
   - Day 7: Day 7 Reflection Prompt email
   - Day 14: Day 14 Reflection Prompt email
   - Day 21: Day 21 Reflection Prompt email
   - Day 30: Day 30 Completion email

## 5. API Integration

### 5.1 Creating an API Key

1. Go to "Account" > "Extras" > "API keys".
2. Click "Create A Key".
3. Name your key "Sacred Healing Hub Integration".
4. Copy the generated API key.
5. Save this key as `MAILCHIMP_API_KEY` in your application's environment variables.

### 5.2 Getting Your List ID

1. Go to "Audience" > "Settings" > "Audience name and defaults".
2. Copy the "Audience ID" value.
3. Save this ID as `MAILCHIMP_LIST_ID` in your application's environment variables.

### 5.3 Getting Your Server Prefix

1. Look at your Mailchimp API key.
2. The last part of the key after the hyphen (e.g., "us6") is your server prefix.
3. Save this prefix as `MAILCHIMP_SERVER_PREFIX` in your application's environment variables.

## 6. Implementing the Integration

### 6.1 Adding Subscribers

Use the following code to add a new subscriber to your Mailchimp list:

```javascript
import Mailchimp from 'mailchimp-api-v3';

const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
const listId = process.env.MAILCHIMP_LIST_ID;

export async function addSubscriber(healingName, email, journeyStartDate) {
  try {
    const response = await mailchimp.post(`/lists/${listId}/members`, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        HEALING_NAME: healingName,
        JOURNEY_START: journeyStartDate,
        CURRENT_MILESTONE: 'Day 1'
      }
    });
    
    return {
      id: response.id,
      email: response.email_address,
      status: response.status
    };
  } catch (error) {
    console.error('Mailchimp error:', error);
    throw new Error('Failed to add subscriber to Mailchimp');
  }
}
```

### 6.2 Updating Subscriber Milestone

Use the following code to update a subscriber's milestone:

```javascript
export async function updateSubscriberMilestone(email, milestone) {
  try {
    // Get the subscriber hash (MD5 hash of lowercase email)
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');
    
    // Update the subscriber
    const response = await mailchimp.patch(`/lists/${listId}/members/${subscriberHash}`, {
      merge_fields: {
        CURRENT_MILESTONE: milestone
      }
    });
    
    return {
      id: response.id,
      email: response.email_address,
      currentMilestone: response.merge_fields.CURRENT_MILESTONE
    };
  } catch (error) {
    console.error('Mailchimp error:', error);
    throw new Error('Failed to update subscriber milestone');
  }
}
```

## 7. Testing the Integration

### 7.1 Testing Subscription

1. Use the API to add a test subscriber.
2. Check your Mailchimp audience to verify the subscriber was added.
3. Verify that the welcome email is sent.

### 7.2 Testing Automation

1. Add a test subscriber with a journey start date.
2. Verify that the appropriate emails are sent at the scheduled times.

## 8. Troubleshooting

### 8.1 API Connection Issues

1. Verify that your API key is correct.
2. Check that you're using the correct server prefix.
3. Ensure your IP address is not blocked by Mailchimp.

### 8.2 Email Delivery Issues

1. Check your Mailchimp campaign reports for delivery issues.
2. Verify that your sending domain is properly authenticated.
3. Check spam complaints and adjust your content if needed.

## 9. Compliance

### 9.1 GDPR Compliance

1. Ensure your sign-up form includes clear consent language.
2. Include your privacy policy in the sign-up process.
3. Provide an easy way to unsubscribe in all emails.

### 9.2 CAN-SPAM Compliance

1. Include your physical address in all email templates.
2. Ensure all emails have a clear unsubscribe link.
3. Honor unsubscribe requests promptly.

## 10. Maintenance

### 10.1 Regular Checks

1. Monitor email open and click rates.
2. Review any unsubscribes or complaints.
3. Test the automation sequences periodically.

### 10.2 Content Updates

1. Refresh email content based on user feedback.
2. A/B test subject lines to improve open rates.
3. Update templates to reflect any branding changes.
