#!/bin/bash
# MongoDB Data Import Script
# Usage: ./import-data.sh <PASSWORD>
# Example: ./import-data.sh Svnglobal@2025

PASSWORD=$1
DATABASE="svnglobal"
URI="mongodb+srv://svnglobal:${PASSWORD}@svnglobal.5vlys7w.mongodb.net/${DATABASE}?retryWrites=true&w=majority&appName=svnglobal"

if [ -z "$PASSWORD" ]; then
  echo "❌ Error: Password is required"
  echo "Usage: ./import-data.sh <PASSWORD>"
  echo "Example: ./import-data.sh Svnglobal@2025"
  exit 1
fi

# URL encode the password (replace @ with %40)
ENCODED_PASSWORD=$(echo "$PASSWORD" | sed 's/@/%40/g')
ENCODED_URI="mongodb+srv://svnglobal:${ENCODED_PASSWORD}@svnglobal.5vlys7w.mongodb.net/${DATABASE}?retryWrites=true&w=majority&appName=svnglobal"

echo "🔄 Starting MongoDB data import..."
echo "📊 Database: ${DATABASE}"
echo ""

# Import Admin data
echo "📥 Importing admin data..."
mongoimport --uri "${ENCODED_URI}" \
  --collection admin \
  --type json \
  --file data/admin.json \
  --jsonArray

# Import Products data
echo "📥 Importing products data..."
mongoimport --uri "${ENCODED_URI}" \
  --collection products \
  --type json \
  --file data/products.json \
  --jsonArray

# Import Test Reports data
echo "📥 Importing test reports data..."
mongoimport --uri "${ENCODED_URI}" \
  --collection testreports \
  --type json \
  --file data/testReports.json \
  --jsonArray

echo ""
echo "✅ Data import completed!"
echo ""
echo "📋 Imported collections:"
echo "   - admin"
echo "   - products"
echo "   - testreports"

