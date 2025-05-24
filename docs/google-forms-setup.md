# Google Forms Integration Setup Guide

This document provides comprehensive instructions for setting up Google Forms integration to replace Typeform in the Sacred Healing Hub application.

## Table of Contents
1. [Google Forms Setup](#google-forms-setup)
2. [Google Sheets Configuration](#google-sheets-configuration)
3. [Google Apps Script Webhook](#google-apps-script-webhook)
4. [Service Account Setup](#service-account-setup)
5. [Environment Variables](#environment-variables)
6. [Testing the Integration](#testing-the-integration)
7. [Troubleshooting](#troubleshooting)

## 1. Google Forms Setup

### 1.1 Create the Sacred Healing Intake Form

1. Go to [Google Forms](https://forms.google.com/)
2. Click "Create a new form" or use the "+" button
3. Title your form: "Sacred Healing Journey - Intake Form"
4. Add a description:
   ```
   Welcome to your Sacred Healing Journey. This form helps us understand your unique path and create a personalized experience for your healing journey.
   ```

### 1.2 Add Form Fields

Add the following questions in order:

#### Question 1: Healing Name
- **Type**: Short answer
- **Question**: "What is your Healing Name?"
- **Description**: "This can be your given name or a sacred name that represents your healing journey"
- **Required**: Yes
- **Validation**: None

#### Question 2: Email Address
- **Type**: Short answer
- **Question**: "Email Address"
- **Description**: "We'll use this to send you gentle guidance and milestone reminders"
- **Required**: Yes
- **Validation**: Email address

#### Question 3: Healing Goals
- **Type**: Paragraph
- **Question**: "What are your healing goals?"
- **Description**: "Share what you hope to achieve through your healing journey - physical, emotional, or spiritual aspirations"
- **Required**: No
- **Character limit**: 1000

#### Question 4: Fasting Experience
- **Type**: Multiple choice
- **Question**: "What is your experience with fasting or cleansing practices?"
- **Options**:
  - "Complete beginner - new to fasting"
  - "Some experience - tried fasting a few times"
  - "Experienced - regular fasting practice"
  - "Advanced practitioner - extensive fasting experience"
  - "Prefer not to answer"
- **Required**: No

#### Question 5: Email Consent
- **Type**: Multiple choice
- **Question**: "Would you like to receive email guidance during your journey?"
- **Description**: "We'll send gentle reminders and spiritual guidance at key milestones"
- **Options**:
  - "Yes, I'd like to receive email guidance"
  - "No, I prefer not to receive emails"
- **Required**: Yes

### 1.3 Form Settings

1. Click the Settings gear icon
2. **General**:
   - ✅ Collect email addresses
   - ✅ Limit to 1 response per person
   - ✅ Allow response editing
3. **Presentation**:
   - ✅ Show progress bar
   - ✅ Shuffle question order: Off
   - Confirmation message:
     ```
     Thank you for beginning your Sacred Healing Journey! 
     
     You'll receive a welcome email shortly with next steps. 
     If you don't see it, please check your spam folder.
     
     Your healing journey awaits. 🌟
     ```

### 1.4 Customize Theme

1. Click the palette icon to customize theme
2. Choose colors that match your brand:
   - Header color: #667eea (primary blue)
   - Background color: #f8f9fa (light gray)
3. Upload your logo if available

## 2. Google Sheets Configuration

### 2.1 Link Form to Sheets

1. In your Google Form, click the "Responses" tab
2. Click the green Sheets icon to "Create a new spreadsheet"
3. Name it: "Sacred Healing - Form Responses"
4. Click "Create"

### 2.2 Customize Sheet Headers

The sheet will automatically create headers based on your form questions. Verify they match:
- Timestamp
- Email Address
- Healing Name
- Healing Goals
- Fasting Experience
- Email Consent

### 2.3 Add Additional Columns (Optional)

Add these columns for tracking:
- **Status** (Column G): Track processing status
- **Mailchimp Added** (Column H): Track if added to Mailchimp
- **Welcome Email Sent** (Column I): Track welcome email status
- **Notes** (Column J): Any additional notes

## 3. Google Apps Script Webhook

### 3.1 Create Apps Script Project

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete the default code and replace with:

```javascript
/**
 * Sacred Healing Hub - Google Forms Webhook
 * Sends form submissions to the application webhook
 */

// Configuration
const WEBHOOK_URL = 'https://your-domain.com/api/webhook/google-forms';
const WEBHOOK_SECRET = 'your-webhook-secret'; // Set this in your environment

/**
 * Triggered when form is submitted
 */
function onFormSubmit(e) {
  try {
    console.log('Form submission triggered');
    
    // Get the submitted values
    const values = e.values;
    const timestamp = values[0];
    const email = values[1];
    const healingName = values[2];
    const healingGoals = values[3];
    const fastingExperience = values[4];
    const emailConsent = values[5];
    
    // Prepare webhook payload
    const payload = {
      timestamp: timestamp,
      email: email,
      healingName: healingName,
      healingGoals: healingGoals || '',
      fastingExperience: fastingExperience || '',
      emailConsent: emailConsent === 'Yes, I\'d like to receive email guidance',
      source: 'google_forms'
    };
    
    // Send to webhook
    const response = sendToWebhook(payload);
    
    if (response.getResponseCode() === 200) {
      console.log('Webhook sent successfully');
      updateSheetStatus(e.range.getRow(), 'Processed');
    } else {
      console.error('Webhook failed:', response.getContentText());
      updateSheetStatus(e.range.getRow(), 'Failed');
    }
    
  } catch (error) {
    console.error('Error in onFormSubmit:', error);
    updateSheetStatus(e.range.getRow(), 'Error');
  }
}

/**
 * Send data to webhook endpoint
 */
function sendToWebhook(payload) {
  const options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': WEBHOOK_SECRET
    },
    'payload': JSON.stringify(payload)
  };
  
  return UrlFetchApp.fetch(WEBHOOK_URL, options);
}

/**
 * Update processing status in sheet
 */
function updateSheetStatus(row, status) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    sheet.getRange(row, 7).setValue(status); // Column G (Status)
    sheet.getRange(row, 7).setNote(`Updated: ${new Date()}`);
  } catch (error) {
    console.error('Error updating sheet status:', error);
  }
}

/**
 * Test function for manual testing
 */
function testWebhook() {
  const testPayload = {
    timestamp: new Date().toISOString(),
    email: 'test@example.com',
    healingName: 'Test User',
    healingGoals: 'Test healing goals',
    fastingExperience: 'Some experience - tried fasting a few times',
    emailConsent: true,
    source: 'google_forms_test'
  };
  
  const response = sendToWebhook(testPayload);
  console.log('Test response:', response.getContentText());
}
```

### 3.2 Set Up Trigger

1. In Apps Script, click the clock icon (Triggers)
2. Click "Add Trigger"
3. Configure:
   - Function: `onFormSubmit`
   - Event source: "From spreadsheet"
   - Event type: "On form submit"
4. Click "Save"

### 3.3 Authorize Script

1. Run the `testWebhook` function once to authorize
2. Grant necessary permissions when prompted

## 4. Service Account Setup

### 4.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Sacred Healing Hub"
3. Enable the Google Sheets API:
   - Go to "APIs & Services > Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 4.2 Create Service Account

1. Go to "APIs & Services > Credentials"
2. Click "Create Credentials > Service Account"
3. Name: "sacred-healing-sheets-access"
4. Description: "Service account for accessing Google Sheets data"
5. Click "Create and Continue"
6. Skip role assignment for now
7. Click "Done"

### 4.3 Generate Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key > Create new key"
4. Choose "JSON" format
5. Download the key file
6. **Keep this file secure and never commit it to version control**

### 4.4 Share Sheet with Service Account

1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (from the JSON file)
4. Give "Viewer" permissions
5. Uncheck "Notify people"
6. Click "Share"

## 5. Environment Variables

Add these environment variables to your application:

```bash
# Google Forms Integration
GOOGLE_FORMS_URL=https://forms.gle/your-form-id
GOOGLE_SHEETS_ID=your-google-sheet-id

# Google Service Account (from JSON file)
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id

# Webhook Security
GOOGLE_FORMS_WEBHOOK_SECRET=your-secure-random-string

# Mailchimp Integration (existing)
MAILCHIMP_API_KEY=your-mailchimp-api-key
MAILCHIMP_LIST_ID=your-mailchimp-list-id
MAILCHIMP_SERVER_PREFIX=us6

# Internal API Security
INTERNAL_API_KEY=your-internal-api-key
```

### 5.1 Environment Variable Setup by Platform

#### Vercel
```bash
vercel env add GOOGLE_FORMS_URL
vercel env add GOOGLE_SHEETS_ID
# ... add all other variables
```

#### Heroku
```bash
heroku config:set GOOGLE_FORMS_URL=https://forms.gle/your-form-id
heroku config:set GOOGLE_SHEETS_ID=your-google-sheet-id
# ... add all other variables
```

#### Local Development
Create a `.env` file in your project root with all the variables.

## 6. Testing the Integration

### 6.1 Test Form Submission

1. Open your Google Form
2. Fill out a test submission
3. Check that:
   - Data appears in Google Sheets
   - Webhook is triggered (check Apps Script logs)
   - User is created in Airtable
   - User is added to Mailchimp (if consent given)
   - Welcome email is sent

### 6.2 Test Webhook Endpoint

```bash
curl -X POST https://your-domain.com/api/webhook/google-forms \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-webhook-secret" \
  -d '{
    "healingName": "Test User",
    "email": "test@example.com",
    "healingGoals": "Test goals",
    "fastingExperience": "Some experience",
    "emailConsent": true,
    "timestamp": "2024-01-01T00:00:00Z"
  }'
```

### 6.3 Test Analytics Tracking

```bash
curl -X POST https://your-domain.com/api/analytics/track/form-submission \
  -H "Content-Type: application/json" \
  -d '{
    "healingName": "Test User",
    "email": "test@example.com",
    "emailConsent": true,
    "completionTime": 120
  }'
```

## 7. Troubleshooting

### 7.1 Common Issues

#### Form Not Triggering Webhook
- Check Apps Script trigger is set up correctly
- Verify webhook URL is accessible
- Check Apps Script execution logs
- Ensure webhook secret matches

#### Service Account Access Issues
- Verify service account has access to the sheet
- Check that the Google Sheets API is enabled
- Ensure private key is properly formatted in environment variables

#### Mailchimp Integration Issues
- Verify Mailchimp API key and list ID
- Check that merge fields exist in Mailchimp
- Ensure email addresses are valid

### 7.2 Debugging Steps

1. **Check Apps Script Logs**:
   - Go to Apps Script > Executions
   - Review any error messages

2. **Test Webhook Manually**:
   - Use the `testWebhook()` function in Apps Script
   - Check server logs for webhook processing

3. **Verify Environment Variables**:
   - Ensure all required variables are set
   - Check for typos or formatting issues

4. **Monitor Server Logs**:
   - Check application logs for errors
   - Verify webhook requests are being received

### 7.3 Performance Optimization

1. **Batch Processing**:
   - For high volume, consider batching webhook calls
   - Implement retry logic for failed webhooks

2. **Caching**:
   - Cache Google Sheets API responses when possible
   - Use rate limiting to avoid API quotas

3. **Error Handling**:
   - Implement comprehensive error logging
   - Set up alerts for webhook failures

## 8. Migration from Typeform

### 8.1 Data Migration

1. Export existing Typeform responses
2. Import into Google Sheets format
3. Run migration script to process existing users

### 8.2 URL Updates

1. Update landing page to use new Google Forms URL
2. Update any marketing materials
3. Set up redirects from old Typeform URLs if needed

### 8.3 Analytics Migration

1. Update tracking codes
2. Set up conversion goals in Google Analytics
3. Implement A/B testing for form optimization

## 9. Maintenance

### 9.1 Regular Checks

- Monitor form submission rates
- Check webhook success rates
- Review error logs weekly
- Verify Mailchimp integration

### 9.2 Updates

- Keep Google Apps Script updated
- Monitor Google API changes
- Update form questions based on user feedback

### 9.3 Backup

- Regular backups of Google Sheets data
- Export form responses monthly
- Backup Apps Script code

## 10. Security Considerations

### 10.1 Data Protection

- Use HTTPS for all webhook communications
- Implement webhook signature verification
- Limit access to Google Sheets
- Regular security audits

### 10.2 Privacy Compliance

- Update privacy policy for Google Forms usage
- Ensure GDPR compliance
- Implement data retention policies
- Provide data deletion mechanisms

---

This setup provides a robust, scalable replacement for Typeform with enhanced analytics and user journey tracking capabilities.
