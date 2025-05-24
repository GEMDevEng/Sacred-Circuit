#!/usr/bin/env node

/**
 * Deployment Optimization Script
 * 
 * This script optimizes the application for production deployment:
 * - Bundle analysis and optimization
 * - Asset compression and CDN preparation
 * - Environment configuration validation
 * - Performance optimization
 * - Security hardening
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  buildDir: path.join(__dirname, '../dist'),
  publicDir: path.join(__dirname, '../public'),
  serverDir: path.join(__dirname, '../server'),
  optimizationLevel: process.env.OPTIMIZATION_LEVEL || 'production',
  enableCompression: process.env.ENABLE_COMPRESSION !== 'false',
  enableCDN: process.env.ENABLE_CDN !== 'false',
  enableCaching: process.env.ENABLE_CACHING !== 'false',
};

/**
 * Validate environment configuration
 */
const validateEnvironment = async () => {
  console.log('🔍 Validating environment configuration...');
  
  const requiredEnvVars = [
    'NODE_ENV',
    'VITE_API_URL',
    'OPENAI_API_KEY',
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID',
    'JWT_SECRET',
  ];

  const optionalEnvVars = [
    'VITE_SENTRY_DSN',
    'VITE_GA_MEASUREMENT_ID',
    'MAILCHIMP_API_KEY',
    'TYPEFORM_SECRET',
  ];

  const missingRequired = [];
  const missingOptional = [];

  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missingRequired.push(envVar);
    }
  });

  optionalEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missingOptional.push(envVar);
    }
  });

  if (missingRequired.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingRequired.forEach(envVar => console.error(`   - ${envVar}`));
    throw new Error('Missing required environment variables');
  }

  if (missingOptional.length > 0) {
    console.warn('⚠️  Missing optional environment variables:');
    missingOptional.forEach(envVar => console.warn(`   - ${envVar}`));
  }

  console.log('✅ Environment configuration validated');
};

/**
 * Optimize build assets
 */
const optimizeBuildAssets = async () => {
  console.log('🚀 Optimizing build assets...');

  try {
    // Run production build
    console.log('   Building application...');
    execSync('npm run build', { stdio: 'inherit' });

    // Analyze bundle size
    await analyzeBundleSize();

    // Compress assets if enabled
    if (CONFIG.enableCompression) {
      await compressAssets();
    }

    // Generate asset manifest
    await generateAssetManifest();

    console.log('✅ Build assets optimized');
  } catch (error) {
    console.error('❌ Failed to optimize build assets:', error);
    throw error;
  }
};

/**
 * Analyze bundle size
 */
const analyzeBundleSize = async () => {
  console.log('   Analyzing bundle size...');

  try {
    const buildDir = CONFIG.buildDir;
    const files = await fs.readdir(buildDir, { recursive: true });
    
    const assetSizes = {};
    let totalSize = 0;

    for (const file of files) {
      const filePath = path.join(buildDir, file);
      try {
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          const size = stats.size;
          const ext = path.extname(file);
          
          if (!assetSizes[ext]) {
            assetSizes[ext] = { count: 0, size: 0 };
          }
          
          assetSizes[ext].count++;
          assetSizes[ext].size += size;
          totalSize += size;
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    console.log('   Bundle analysis:');
    console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    Object.keys(assetSizes).forEach(ext => {
      const { count, size } = assetSizes[ext];
      console.log(`   ${ext || 'no extension'}: ${count} files, ${(size / 1024).toFixed(2)} KB`);
    });

    // Check for large files
    const largeFileThreshold = 1024 * 1024; // 1MB
    const largeFiles = [];

    for (const file of files) {
      const filePath = path.join(buildDir, file);
      try {
        const stats = await fs.stat(filePath);
        if (stats.isFile() && stats.size > largeFileThreshold) {
          largeFiles.push({
            file,
            size: (stats.size / 1024 / 1024).toFixed(2) + ' MB',
          });
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    if (largeFiles.length > 0) {
      console.warn('   ⚠️  Large files detected:');
      largeFiles.forEach(({ file, size }) => {
        console.warn(`      ${file}: ${size}`);
      });
    }

    // Save bundle analysis
    const analysisPath = path.join(__dirname, '../build-analysis.json');
    await fs.writeFile(analysisPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalSize,
      assetSizes,
      largeFiles,
    }, null, 2));

  } catch (error) {
    console.warn('   ⚠️  Could not analyze bundle size:', error.message);
  }
};

/**
 * Compress assets
 */
const compressAssets = async () => {
  console.log('   Compressing assets...');

  try {
    // Install compression tools if not available
    try {
      execSync('which gzip', { stdio: 'ignore' });
    } catch {
      console.warn('   ⚠️  gzip not available, skipping compression');
      return;
    }

    const buildDir = CONFIG.buildDir;
    const files = await fs.readdir(buildDir, { recursive: true });

    const compressibleExtensions = ['.js', '.css', '.html', '.json', '.svg'];
    let compressedCount = 0;

    for (const file of files) {
      const filePath = path.join(buildDir, file);
      const ext = path.extname(file);

      if (compressibleExtensions.includes(ext)) {
        try {
          const stats = await fs.stat(filePath);
          if (stats.isFile() && stats.size > 1024) { // Only compress files > 1KB
            execSync(`gzip -9 -c "${filePath}" > "${filePath}.gz"`, { stdio: 'ignore' });
            compressedCount++;
          }
        } catch (error) {
          // Skip files that can't be compressed
        }
      }
    }

    console.log(`   Compressed ${compressedCount} files`);
  } catch (error) {
    console.warn('   ⚠️  Asset compression failed:', error.message);
  }
};

/**
 * Generate asset manifest
 */
const generateAssetManifest = async () => {
  console.log('   Generating asset manifest...');

  try {
    const buildDir = CONFIG.buildDir;
    const files = await fs.readdir(buildDir, { recursive: true });
    
    const manifest = {
      timestamp: new Date().toISOString(),
      assets: {},
    };

    for (const file of files) {
      const filePath = path.join(buildDir, file);
      try {
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          manifest.assets[file] = {
            size: stats.size,
            modified: stats.mtime.toISOString(),
            hash: await generateFileHash(filePath),
          };
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    const manifestPath = path.join(buildDir, 'asset-manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`   Asset manifest generated with ${Object.keys(manifest.assets).length} files`);
  } catch (error) {
    console.warn('   ⚠️  Could not generate asset manifest:', error.message);
  }
};

/**
 * Generate file hash for cache busting
 */
const generateFileHash = async (filePath) => {
  try {
    const crypto = await import('crypto');
    const content = await fs.readFile(filePath);
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
  } catch (error) {
    return 'unknown';
  }
};

/**
 * Optimize Vercel configuration
 */
const optimizeVercelConfig = async () => {
  console.log('🔧 Optimizing Vercel configuration...');

  const vercelConfig = {
    version: 2,
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm ci',
    framework: null,
    functions: {
      'server/index.js': {
        runtime: 'nodejs18.x',
        maxDuration: 30,
      },
    },
    rewrites: [
      { source: '/api/(.*)', destination: '/server/index.js' },
      { source: '/(.*)', destination: '/index.html' },
    ],
    headers: [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/(.+)\\.(js|css|svg|jpg|png|webp|woff2|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ],
    env: {
      NODE_ENV: 'production',
    },
  };

  // Add CDN configuration if enabled
  if (CONFIG.enableCDN) {
    vercelConfig.headers.push({
      source: '/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
        {
          key: 'CDN-Cache-Control',
          value: 'public, max-age=31536000',
        },
      ],
    });
  }

  const vercelConfigPath = path.join(__dirname, '../vercel.json');
  await fs.writeFile(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));

  console.log('✅ Vercel configuration optimized');
};

/**
 * Generate deployment checklist
 */
const generateDeploymentChecklist = async () => {
  console.log('📋 Generating deployment checklist...');

  const checklist = `
# Deployment Checklist

## Pre-deployment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations applied (if any)
- [ ] Security scan completed
- [ ] Performance testing completed

## Build Optimization
- [ ] Bundle size analyzed
- [ ] Assets compressed
- [ ] CDN configuration verified
- [ ] Cache headers configured
- [ ] Asset manifest generated

## Security
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] API rate limiting enabled
- [ ] Input validation implemented
- [ ] Error handling secured

## Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring enabled
- [ ] Health checks implemented
- [ ] Logging configured
- [ ] Alerts set up

## Post-deployment
- [ ] Deployment verification completed
- [ ] Health checks passing
- [ ] Performance metrics within thresholds
- [ ] Error rates normal
- [ ] User acceptance testing completed

## Rollback Plan
- [ ] Previous version tagged
- [ ] Rollback procedure documented
- [ ] Database rollback plan (if needed)
- [ ] Monitoring for issues post-deployment

Generated on: ${new Date().toISOString()}
`;

  const checklistPath = path.join(__dirname, '../deployment-checklist.md');
  await fs.writeFile(checklistPath, checklist);

  console.log(`✅ Deployment checklist generated: ${checklistPath}`);
};

/**
 * Create backup and disaster recovery procedures
 */
const createBackupProcedures = async () => {
  console.log('💾 Creating backup and disaster recovery procedures...');

  const backupScript = `#!/bin/bash

# Backup and Disaster Recovery Script for Sacred Healing Hub

set -e

# Configuration
BACKUP_DIR="/tmp/sacred-healing-backup"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="sacred-healing-backup_$TIMESTAMP"

echo "🔄 Starting backup process..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup environment variables (excluding secrets)
echo "📋 Backing up configuration..."
cat > "$BACKUP_DIR/environment.txt" << EOF
# Sacred Healing Hub Environment Configuration
# Generated on: $(date)

NODE_ENV=production
VITE_API_URL=$VITE_API_URL
VITE_ENVIRONMENT=$VITE_ENVIRONMENT
VITE_RELEASE_VERSION=$VITE_RELEASE_VERSION

# Note: Secrets are not included in this backup
# Restore the following from secure storage:
# - OPENAI_API_KEY
# - AIRTABLE_API_KEY
# - JWT_SECRET
# - MAILCHIMP_API_KEY
# - TYPEFORM_SECRET
# - VITE_SENTRY_DSN
EOF

# Backup application code (if needed)
echo "📦 Backing up application code..."
if [ -d "../.git" ]; then
    git rev-parse HEAD > "$BACKUP_DIR/git_commit.txt"
    git status --porcelain > "$BACKUP_DIR/git_status.txt"
else
    echo "No git repository found" > "$BACKUP_DIR/git_status.txt"
fi

# Create backup archive
echo "🗜️  Creating backup archive..."
cd "$BACKUP_DIR/.."
tar -czf "$BACKUP_NAME.tar.gz" "$(basename $BACKUP_DIR)"

echo "✅ Backup completed: $BACKUP_NAME.tar.gz"
echo "📍 Backup location: $(pwd)/$BACKUP_NAME.tar.gz"

# Cleanup
rm -rf "$BACKUP_DIR"

echo "🎉 Backup process completed successfully!"
`;

  const recoveryScript = `#!/bin/bash

# Disaster Recovery Script for Sacred Healing Hub

set -e

echo "🚨 Starting disaster recovery process..."

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide backup file path"
    echo "Usage: $0 <backup-file.tar.gz>"
    exit 1
fi

BACKUP_FILE="$1"
RECOVERY_DIR="/tmp/sacred-healing-recovery"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Validate backup file
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "📦 Extracting backup: $BACKUP_FILE"
mkdir -p "$RECOVERY_DIR"
tar -xzf "$BACKUP_FILE" -C "$RECOVERY_DIR"

# Recovery steps
echo "🔄 Starting recovery steps..."

echo "1. Verify environment configuration..."
if [ -f "$RECOVERY_DIR/*/environment.txt" ]; then
    echo "   ✅ Environment configuration found"
    cat "$RECOVERY_DIR/*/environment.txt"
else
    echo "   ⚠️  Environment configuration not found"
fi

echo "2. Check git commit information..."
if [ -f "$RECOVERY_DIR/*/git_commit.txt" ]; then
    COMMIT=$(cat "$RECOVERY_DIR/*/git_commit.txt")
    echo "   ✅ Git commit: $COMMIT"
    echo "   📝 To restore code: git checkout $COMMIT"
else
    echo "   ⚠️  Git commit information not found"
fi

echo "3. Recovery checklist:"
echo "   - [ ] Restore environment variables from secure storage"
echo "   - [ ] Deploy application code (git checkout if needed)"
echo "   - [ ] Verify all services are running"
echo "   - [ ] Run health checks"
echo "   - [ ] Verify data integrity"
echo "   - [ ] Test critical functionality"

# Cleanup
rm -rf "$RECOVERY_DIR"

echo "✅ Disaster recovery process completed!"
echo "📋 Please follow the recovery checklist above"
`;

  // Save backup and recovery scripts
  const scriptsDir = path.join(__dirname, '../scripts');
  await fs.mkdir(scriptsDir, { recursive: true });

  const backupScriptPath = path.join(scriptsDir, 'backup.sh');
  await fs.writeFile(backupScriptPath, backupScript);
  
  const recoveryScriptPath = path.join(scriptsDir, 'disaster-recovery.sh');
  await fs.writeFile(recoveryScriptPath, recoveryScript);

  // Make scripts executable
  try {
    execSync(`chmod +x "${backupScriptPath}"`);
    execSync(`chmod +x "${recoveryScriptPath}"`);
  } catch (error) {
    console.warn('   ⚠️  Could not make scripts executable:', error.message);
  }

  console.log(`✅ Backup script created: ${backupScriptPath}`);
  console.log(`✅ Recovery script created: ${recoveryScriptPath}`);
};

/**
 * Run comprehensive deployment optimization
 */
const optimizeDeployment = async () => {
  console.log('🚀 Starting deployment optimization...');
  console.log(`Configuration:`);
  console.log(`  Optimization Level: ${CONFIG.optimizationLevel}`);
  console.log(`  Compression: ${CONFIG.enableCompression ? 'enabled' : 'disabled'}`);
  console.log(`  CDN: ${CONFIG.enableCDN ? 'enabled' : 'disabled'}`);
  console.log(`  Caching: ${CONFIG.enableCaching ? 'enabled' : 'disabled'}`);

  try {
    // Step 1: Validate environment
    await validateEnvironment();

    // Step 2: Optimize build assets
    await optimizeBuildAssets();

    // Step 3: Optimize Vercel configuration
    await optimizeVercelConfig();

    // Step 4: Generate deployment checklist
    await generateDeploymentChecklist();

    // Step 5: Create backup procedures
    await createBackupProcedures();

    console.log('\n🎉 Deployment optimization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review the deployment checklist');
    console.log('2. Run final tests');
    console.log('3. Deploy to production');
    console.log('4. Monitor deployment health');

  } catch (error) {
    console.error('\n❌ Deployment optimization failed:', error);
    process.exit(1);
  }
};

// Run the optimization if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeDeployment().catch(console.error);
}

export {
  optimizeDeployment,
  validateEnvironment,
  optimizeBuildAssets,
  optimizeVercelConfig,
  generateDeploymentChecklist,
  createBackupProcedures,
};
