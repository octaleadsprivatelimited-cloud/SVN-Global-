# Firebase Firestore Data Export Script for Windows PowerShell
# Usage: .\export-data.ps1

$OutputDir = "data\exports"

# Create output directory if it doesn't exist
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

Write-Host "🔄 Starting Firebase Firestore data export..." -ForegroundColor Cyan
Write-Host "📁 Output directory: ${OutputDir}" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Note: This script requires Node.js and Firebase Admin SDK" -ForegroundColor Yellow
Write-Host "   Run: node scripts/export-firestore-data.js" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Collections to export:" -ForegroundColor Cyan
Write-Host "   - products"
Write-Host "   - testReports"
Write-Host "   - admin"
Write-Host ""
Write-Host "💡 For manual export, use Firebase Console:" -ForegroundColor Cyan
Write-Host "   1. Go to Firebase Console → Firestore Database" -ForegroundColor Gray
Write-Host "   2. Select collection → Export data" -ForegroundColor Gray
Write-Host ""
