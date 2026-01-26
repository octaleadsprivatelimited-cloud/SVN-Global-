# Firebase Firestore Data Import Script for Windows PowerShell
# Usage: .\import-data.ps1

Write-Host "🔄 Starting Firebase Firestore data import..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Note: This script requires Node.js and Firebase Admin SDK" -ForegroundColor Yellow
Write-Host "   Run: node scripts/migrate-to-firebase.js" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Collections to import:" -ForegroundColor Cyan
Write-Host "   - products (from data/products.json)"
Write-Host "   - testReports (from data/testReports.json)"
Write-Host "   - admin (from data/admin.json)"
Write-Host ""
Write-Host "💡 For manual import, use the migration script:" -ForegroundColor Cyan
Write-Host "   node scripts/migrate-to-firebase.js" -ForegroundColor Gray
Write-Host ""
