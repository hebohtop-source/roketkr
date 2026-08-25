#!/bin/bash

# ─────────────────────────────────────────
# MySQL Docker Dump Script
# ─────────────────────────────────────────

DATABASE_URL="mysql://appuser:apppassword@localhost:3306/appdb"

# Parse DATABASE_URL
DB_USER=$(echo $DATABASE_URL | sed 's|mysql://||' | cut -d':' -f1)
DB_PASS=$(echo $DATABASE_URL | sed 's|mysql://||' | cut -d':' -f2 | cut -d'@' -f1)
DB_HOST=$(echo $DATABASE_URL | sed 's|mysql://||' | cut -d'@' -f2 | cut -d':' -f1)
DB_PORT=$(echo $DATABASE_URL | sed 's|mysql://||' | cut -d'@' -f2 | cut -d':' -f2 | cut -d'/' -f1)
DB_NAME=$(echo $DATABASE_URL | sed 's|mysql://||' | cut -d'/' -f2)

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="./backups"
OUTPUT_FILE="$OUTPUT_DIR/${DB_NAME}_${TIMESTAMP}.sql"

# ─────────────────────────────────────────
# Find the running MySQL container
# ─────────────────────────────────────────
CONTAINER=$(docker ps --filter "expose=3306" --format "{{.Names}}" | head -n 1)

if [ -z "$CONTAINER" ]; then
  echo "❌ No running MySQL container found on port 3306"
  exit 1
fi

echo "✅ Found container: $CONTAINER"
echo "📦 Dumping database: $DB_NAME"
echo "📁 Output: $OUTPUT_FILE"

# Create backups dir if it doesn't exist
mkdir -p $OUTPUT_DIR

# ─────────────────────────────────────────
# Run the dump
# ─────────────────────────────────────────
docker exec $CONTAINER mysqldump \
  -u "$DB_USER" \
  -p"$DB_PASS" \
  --single-transaction \
  --routines \
  --triggers \
  "$DB_NAME" >"$OUTPUT_FILE"

if [ $? -eq 0 ]; then
  SIZE=$(du -sh "$OUTPUT_FILE" | cut -f1)
  echo "✅ Dump complete: $OUTPUT_FILE ($SIZE)"
else
  echo "❌ Dump failed"
  rm -f "$OUTPUT_FILE"
  exit 1
fi
