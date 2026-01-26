#!/bin/bash
# Firebase Firestore Data Export Script for Linux/Mac
# Usage: ./export-data.sh

OUTPUT_DIR="data/exports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "🔄 Starting Firebase Firestore data export..."
echo "📁 Output directory: ${OUTPUT_DIR}"
echo ""
echo "⚠️  Note: This script requires Node.js and Firebase Admin SDK"
echo "   Run: node scripts/export-firestore-data.js"
echo ""
echo "📋 Collections to export:"
echo "   - products"
echo "   - testReports"
echo "   - admin"
echo ""
echo "💡 For manual export, use Firebase Console:"
echo "   1. Go to Firebase Console → Firestore Database"
echo "   2. Select collection → Export data"
echo ""
