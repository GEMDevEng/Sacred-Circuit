#!/bin/bash

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
