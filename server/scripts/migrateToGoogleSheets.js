#!/usr/bin/env node

/**
 * Migration script to transfer data from Airtable to Google Sheets
 * 
 * Usage:
 * node server/scripts/migrateToGoogleSheets.js [--dry-run] [--table=tableName]
 * 
 * Options:
 * --dry-run: Preview the migration without actually transferring data
 * --table: Migrate only a specific table (users, reflections, conversations, feedback)
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import services
import { getAirtableBase } from '../services/airtableService.js';
import { 
  initializeGoogleSheetsService,
  createUser,
  saveReflection,
  storeConversation,
  saveFeedback
} from '../services/googleSheetsService.js';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const tableArg = args.find(arg => arg.startsWith('--table='));
const specificTable = tableArg ? tableArg.split('=')[1] : null;

console.log('🚀 Starting Airtable to Google Sheets Migration');
console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE MIGRATION'}`);
if (specificTable) {
  console.log(`Table: ${specificTable}`);
}
console.log('---');

/**
 * Migrate users from Airtable to Google Sheets
 */
async function migrateUsers(airtableBase) {
  console.log('📊 Migrating Users...');
  
  try {
    const usersTable = airtableBase('Users');
    const records = await usersTable.select().all();
    
    console.log(`Found ${records.length} user records`);
    
    let migrated = 0;
    let errors = 0;
    
    for (const record of records) {
      try {
        const userData = {
          healingName: record.fields['Healing Name'] || '',
          email: record.fields['Email'] || '',
          passwordHash: record.fields['Password Hash'] || '',
          role: record.fields['Role'] || 'user',
          registrationDate: record.fields['Registration Date'] || record.fields['Created At'] || new Date().toISOString(),
          journeyStatus: record.fields['Journey Status'] || 'Active',
          emailConsent: record.fields['Email Consent'] || record.fields['Consent to Data Storage'] || false,
          healingGoals: record.fields['Healing Goals'] || ''
        };
        
        if (isDryRun) {
          console.log(`  [DRY RUN] Would migrate user: ${userData.healingName}`);
        } else {
          await createUser(userData);
          console.log(`  ✅ Migrated user: ${userData.healingName}`);
        }
        
        migrated++;
      } catch (error) {
        console.error(`  ❌ Error migrating user ${record.fields['Healing Name']}: ${error.message}`);
        errors++;
      }
    }
    
    console.log(`Users migration complete: ${migrated} migrated, ${errors} errors`);
    return { migrated, errors };
  } catch (error) {
    console.error('Error migrating users:', error);
    return { migrated: 0, errors: 1 };
  }
}

/**
 * Migrate reflections from Airtable to Google Sheets
 */
async function migrateReflections(airtableBase) {
  console.log('📝 Migrating Reflections...');
  
  try {
    const reflectionsTable = airtableBase('Reflections');
    const records = await reflectionsTable.select().all();
    
    console.log(`Found ${records.length} reflection records`);
    
    let migrated = 0;
    let errors = 0;
    
    for (const record of records) {
      try {
        const reflectionData = {
          healingName: record.fields['Healing Name'] || '',
          reflectionText: record.fields['Reflection Text'] || '',
          journeyDay: record.fields['Journey Day'] || record.fields['Milestone'] || 'Not specified',
          emailConsent: record.fields['Email Consent'] || false,
          userId: record.fields['User'] ? record.fields['User'][0] : null // Airtable linked record
        };
        
        if (isDryRun) {
          console.log(`  [DRY RUN] Would migrate reflection for: ${reflectionData.healingName}`);
        } else {
          await saveReflection(reflectionData);
          console.log(`  ✅ Migrated reflection for: ${reflectionData.healingName}`);
        }
        
        migrated++;
      } catch (error) {
        console.error(`  ❌ Error migrating reflection: ${error.message}`);
        errors++;
      }
    }
    
    console.log(`Reflections migration complete: ${migrated} migrated, ${errors} errors`);
    return { migrated, errors };
  } catch (error) {
    console.error('Error migrating reflections:', error);
    return { migrated: 0, errors: 1 };
  }
}

/**
 * Migrate conversations from Airtable to Google Sheets
 */
async function migrateConversations(airtableBase) {
  console.log('💬 Migrating Conversations...');
  
  try {
    const conversationsTable = airtableBase('Conversations');
    const records = await conversationsTable.select().all();
    
    console.log(`Found ${records.length} conversation records`);
    
    let migrated = 0;
    let errors = 0;
    
    for (const record of records) {
      try {
        const conversationData = {
          healingName: record.fields['Healing Name'] || '',
          userMessage: record.fields['User Message'] || '',
          aiResponse: record.fields['AI Response'] || '',
          timestamp: record.fields['Timestamp'] || new Date().toISOString(),
          userId: record.fields['User'] ? record.fields['User'][0] : null
        };
        
        if (isDryRun) {
          console.log(`  [DRY RUN] Would migrate conversation for: ${conversationData.healingName}`);
        } else {
          await storeConversation(conversationData);
          console.log(`  ✅ Migrated conversation for: ${conversationData.healingName}`);
        }
        
        migrated++;
      } catch (error) {
        console.error(`  ❌ Error migrating conversation: ${error.message}`);
        errors++;
      }
    }
    
    console.log(`Conversations migration complete: ${migrated} migrated, ${errors} errors`);
    return { migrated, errors };
  } catch (error) {
    console.error('Error migrating conversations:', error);
    return { migrated: 0, errors: 1 };
  }
}

/**
 * Migrate feedback from Airtable to Google Sheets
 */
async function migrateFeedback(airtableBase) {
  console.log('📋 Migrating Feedback...');
  
  try {
    const feedbackTable = airtableBase('Feedback');
    const records = await feedbackTable.select().all();
    
    console.log(`Found ${records.length} feedback records`);
    
    let migrated = 0;
    let errors = 0;
    
    for (const record of records) {
      try {
        const feedbackData = {
          type: record.fields['Type'] || 'general',
          title: record.fields['Title'] || 'Migrated Feedback',
          description: record.fields['Description'] || record.fields['Message'] || '',
          email: record.fields['Email'] || '',
          timestamp: record.fields['Timestamp'] || record.fields['Created At'] || new Date().toISOString(),
          clientIp: record.fields['Client IP'] || '',
          userAgent: record.fields['User Agent'] || ''
        };
        
        if (isDryRun) {
          console.log(`  [DRY RUN] Would migrate feedback: ${feedbackData.title}`);
        } else {
          await saveFeedback(feedbackData);
          console.log(`  ✅ Migrated feedback: ${feedbackData.title}`);
        }
        
        migrated++;
      } catch (error) {
        console.error(`  ❌ Error migrating feedback: ${error.message}`);
        errors++;
      }
    }
    
    console.log(`Feedback migration complete: ${migrated} migrated, ${errors} errors`);
    return { migrated, errors };
  } catch (error) {
    console.error('Error migrating feedback:', error);
    return { migrated: 0, errors: 1 };
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  try {
    // Initialize Google Sheets service
    console.log('🔧 Initializing Google Sheets service...');
    await initializeGoogleSheetsService();
    
    // Get Airtable base
    console.log('🔧 Connecting to Airtable...');
    const airtableBase = getAirtableBase();
    
    if (!airtableBase) {
      throw new Error('Failed to connect to Airtable');
    }
    
    const results = {
      users: { migrated: 0, errors: 0 },
      reflections: { migrated: 0, errors: 0 },
      conversations: { migrated: 0, errors: 0 },
      feedback: { migrated: 0, errors: 0 }
    };
    
    // Run migrations based on specified table or all tables
    if (!specificTable || specificTable === 'users') {
      results.users = await migrateUsers(airtableBase);
    }
    
    if (!specificTable || specificTable === 'reflections') {
      results.reflections = await migrateReflections(airtableBase);
    }
    
    if (!specificTable || specificTable === 'conversations') {
      results.conversations = await migrateConversations(airtableBase);
    }
    
    if (!specificTable || specificTable === 'feedback') {
      results.feedback = await migrateFeedback(airtableBase);
    }
    
    // Summary
    console.log('\n📊 Migration Summary:');
    console.log('---');
    
    let totalMigrated = 0;
    let totalErrors = 0;
    
    Object.entries(results).forEach(([table, result]) => {
      console.log(`${table}: ${result.migrated} migrated, ${result.errors} errors`);
      totalMigrated += result.migrated;
      totalErrors += result.errors;
    });
    
    console.log('---');
    console.log(`Total: ${totalMigrated} migrated, ${totalErrors} errors`);
    
    if (isDryRun) {
      console.log('\n⚠️  This was a dry run. No data was actually migrated.');
      console.log('Run without --dry-run to perform the actual migration.');
    } else {
      console.log('\n✅ Migration completed!');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
