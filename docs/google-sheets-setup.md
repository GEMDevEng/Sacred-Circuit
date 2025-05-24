# Google Sheets Integration Setup Guide

This guide walks you through setting up Google Sheets API integration for the Sacred Healing Companion & Journey Hub application.

## Overview

The application has been migrated from Airtable to Google Sheets for data storage. This provides:

- **Cost-effective solution**: Google Sheets API has generous free tier limits
- **Familiar interface**: Easy to view and manage data in Google Sheets
- **Backup and export**: Built-in Google Drive integration for backups
- **Collaboration**: Easy sharing and collaboration on data

## Prerequisites

1. Google Cloud Platform account
2. Google Sheets spreadsheet for data storage
3. Service account for server-side access
4. OAuth2 credentials for user-specific access (optional)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `sacred-healing-sheets-service`
   - Description: `Service account for Sacred Healing app data access`
4. Click "Create and Continue"
5. Grant the service account the "Editor" role (or create a custom role with Sheets access)
6. Click "Done"

## Step 3: Generate Service Account Key

1. In the "Credentials" page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format
6. Download the key file (keep it secure!)

## Step 4: Create Google Sheets Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Sacred Healing Data" (or your preferred name)
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
5. Share the spreadsheet with your service account email:
   - Click "Share" button
   - Add the service account email (from step 2)
   - Give "Editor" permissions

## Step 5: Configure Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Google Sheets API Configuration
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=base64_encoded_private_key_here
GOOGLE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### Extracting Values from Service Account JSON

From the downloaded JSON file, extract these values:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `client_email`
- `GOOGLE_CLIENT_EMAIL` = `client_email`
- `GOOGLE_CLIENT_ID` = `client_id`
- `GOOGLE_PRIVATE_KEY` = Base64 encoded `private_key`

To encode the private key:
```bash
echo -n "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n" | base64
```

## Step 6: Sheet Structure

The application will automatically create the following sheets with proper headers:

### Users Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | ID | Unique user identifier |
| B | Healing Name | User's chosen healing name |
| C | Email | User's email address |
| D | Password Hash | Hashed password for authentication |
| E | Role | User role (user/admin) |
| F | Registration Date | When user registered |
| G | Journey Status | Current journey status |
| H | Email Consent | Email communication consent |
| I | Healing Goals | User's healing goals |
| J | Last Updated | Last modification timestamp |

### Reflections Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | ID | Unique reflection identifier |
| B | User ID | Reference to user |
| C | Healing Name | User's healing name |
| D | Reflection Text | The reflection content |
| E | Journey Day | Journey milestone |
| F | Email Consent | Email consent for this reflection |
| G | Timestamp | When reflection was created |

### Conversations Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | ID | Unique conversation identifier |
| B | User ID | Reference to user |
| C | Healing Name | User's healing name |
| D | User Message | User's message |
| E | AI Response | AI's response |
| F | Timestamp | When conversation occurred |

### Feedback Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | ID | Unique feedback identifier |
| B | Type | Feedback type (bug/feature/etc) |
| C | Title | Feedback title |
| D | Description | Feedback description |
| E | Email | User's email (optional) |
| F | Status | Feedback status |
| G | Timestamp | When feedback was submitted |
| H | Client IP | Hashed client IP |
| I | User Agent | User's browser info |

## Step 7: Test the Integration

1. Start your application:
   ```bash
   npm run dev:server
   ```

2. Check the logs for successful Google Sheets initialization:
   ```
   Google Sheets API initialized successfully
   Google Sheets service initialized
   ```

3. Test the health endpoint:
   ```bash
   curl http://localhost:3002/api/health
   ```

4. Test user registration:
   ```bash
   curl -X POST http://localhost:3002/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"healingName":"TestUser","email":"test@example.com","password":"testpass123"}'
   ```

## Step 8: Data Migration

If you're migrating from Airtable, use the migration script:

```bash
# Dry run to preview migration
node server/scripts/migrateToGoogleSheets.js --dry-run

# Migrate all data
node server/scripts/migrateToGoogleSheets.js

# Migrate specific table only
node server/scripts/migrateToGoogleSheets.js --table=users
```

## Security Considerations

1. **Service Account Key**: Keep the JSON key file secure and never commit it to version control
2. **Environment Variables**: Use secure environment variable management in production
3. **Spreadsheet Permissions**: Only share with necessary service accounts and users
4. **Data Validation**: The service includes input validation and sanitization
5. **Rate Limiting**: Google Sheets API has rate limits - the service includes error handling

## Monitoring and Maintenance

### API Quotas
- Google Sheets API: 100 requests per 100 seconds per user
- Read requests: 100 requests per 100 seconds per user
- Write requests: 100 requests per 100 seconds per user

### Best Practices
1. **Batch Operations**: Use batch updates when possible
2. **Caching**: Consider caching frequently accessed data
3. **Error Handling**: Monitor for API errors and implement retry logic
4. **Backup**: Regular backups of the spreadsheet
5. **Monitoring**: Set up alerts for API quota usage

### Troubleshooting

#### Common Issues

1. **"Sheets not initialized" errors**
   - Check service account credentials
   - Verify spreadsheet ID
   - Ensure spreadsheet is shared with service account

2. **"Permission denied" errors**
   - Verify service account has Editor access to spreadsheet
   - Check if Google Sheets API is enabled

3. **"Invalid credentials" errors**
   - Verify private key is correctly base64 encoded
   - Check service account email is correct

4. **Rate limit errors**
   - Implement exponential backoff
   - Consider caching strategies
   - Monitor API usage

#### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will provide detailed logging of Google Sheets operations.

## Backup and Recovery

### Automated Backups
The Google Sheets data is automatically backed up by Google Drive. You can also:

1. **Export Data**: Use Google Sheets export functionality
2. **Version History**: Google Sheets maintains version history
3. **Programmatic Backup**: Create scheduled exports using the API

### Recovery Procedures
1. **Data Corruption**: Restore from Google Sheets version history
2. **Accidental Deletion**: Recover from Google Drive trash
3. **Complete Loss**: Restore from exported backups

## Performance Optimization

### Caching Strategy
Consider implementing caching for:
- User authentication data
- Frequently accessed reflections
- Admin statistics

### Batch Operations
- Group multiple writes into single API calls
- Use batch update operations for bulk changes
- Implement queue system for high-volume operations

## Support

For issues with Google Sheets integration:

1. Check the application logs for detailed error messages
2. Verify Google Cloud Console for API usage and errors
3. Review Google Sheets API documentation
4. Contact the development team with specific error details

## Migration Checklist

- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] Service account created and configured
- [ ] Spreadsheet created and shared
- [ ] Environment variables configured
- [ ] Application tested with new integration
- [ ] Data migrated from Airtable (if applicable)
- [ ] Old Airtable integration disabled
- [ ] Monitoring and alerts configured
- [ ] Team trained on new system
