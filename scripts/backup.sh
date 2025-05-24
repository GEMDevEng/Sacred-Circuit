#!/bin/bash

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
