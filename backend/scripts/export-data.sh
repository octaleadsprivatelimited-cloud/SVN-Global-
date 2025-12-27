#!/bin/bash
# MongoDB Data Export Script
# Usage: ./export-data.sh <PASSWORD>
# Example: ./export-data.sh Svnglobal@2025

PASSWORD=$1
DATABASE="svnglobal"
OUTPUT_DIR="data/exports"
URI="mongodb+srv://svnglobal:${PASSWORD}@svnglobal.5vlys7w.mongodb.net/${DATABASE}?retryWrites=true&w=majority&appName=svnglobal"

if [ -z "$PASSWORD" ]; then
  echo "❌ Error: Password is required"
  echo "Usage: ./export-data.sh <PASSWORD>"
  echo "Example: ./export-data.sh Svnglobal@2025"
  exit 1
fi

# URL encode the password (replace @ with %40)
ENCODED_PASSWORD=$(echo "$PASSWORD" | sed 's/@/%40/g')
ENCODED_URI="mongodb+srv://svnglobal:${ENCODED_PASSWORD}@svnglobal.5vlys7w.mongodb.net/${DATABASE}?retryWrites=true&w=majority&appName=svnglobal"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "🔄 Starting MongoDB data export..."
echo "📊 Database: ${DATABASE}"
echo "📁 Output directory: ${OUTPUT_DIR}"
echo ""

# Export Admin data
echo "📤 Exporting admin data..."
mongoexport --uri "${ENCODED_URI}" \
  --collection admin \
  --type json \
  --out "${OUTPUT_DIR}/admin_export_$(date +%Y%m%d_%H%M%S).json"

# Export Products data
echo "📤 Exporting products data..."
mongoexport --uri "${ENCODED_URI}" \
  --collection products \
  --type json \
  --out "${OUTPUT_DIR}/products_export_$(date +%Y%m%d_%H%M%S).json"

# Export Test Reports data
echo "📤 Exporting test reports data..."
mongoexport --uri "${ENCODED_URI}" \
  --collection testreports \
  --type json \
  --out "${OUTPUT_DIR}/testreports_export_$(date +%Y%m%d_%H%M%S).json"

echo ""
echo "✅ Data export completed!"
echo ""
echo "📋 Exported collections:"
echo "   - admin"
echo "   - products"
echo "   - testreports"
echo ""
echo "📁 Files saved to: ${OUTPUT_DIR}/"

