# MongoDB Data Import Script for Windows PowerShell
# Usage: .\import-data.ps1 -Password "Svnglobal@2025"

param(
    [Parameter(Mandatory=$true)]
    [string]$Password
)

$Database = "svnglobal"
# URL encode the password (replace @ with %40, and other special characters)
$EncodedPassword = [System.Web.HttpUtility]::UrlEncode($Password)
$Uri = "mongodb+srv://svnglobal:${EncodedPassword}@svnglobal.5vlys7w.mongodb.net/${Database}?retryWrites=true&w=majority&appName=svnglobal"

Write-Host "🔄 Starting MongoDB data import..." -ForegroundColor Cyan
Write-Host "📊 Database: ${Database}" -ForegroundColor Cyan
Write-Host ""

# Import Admin data
Write-Host "📥 Importing admin data..." -ForegroundColor Yellow
mongoimport --uri $Uri `
  --collection admin `
  --type json `
  --file data/admin.json `
  --jsonArray

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to import admin data" -ForegroundColor Red
    exit 1
}

# Import Products data
Write-Host "📥 Importing products data..." -ForegroundColor Yellow
mongoimport --uri $Uri `
  --collection products `
  --type json `
  --file data/products.json `
  --jsonArray

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to import products data" -ForegroundColor Red
    exit 1
}

# Import Test Reports data
Write-Host "📥 Importing test reports data..." -ForegroundColor Yellow
mongoimport --uri $Uri `
  --collection testreports `
  --type json `
  --file data/testReports.json `
  --jsonArray

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to import test reports data" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Data import completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Imported collections:" -ForegroundColor Cyan
Write-Host "   - admin"
Write-Host "   - products"
Write-Host "   - testreports"

