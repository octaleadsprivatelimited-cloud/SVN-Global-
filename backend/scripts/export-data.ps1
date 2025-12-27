# MongoDB Data Export Script for Windows PowerShell
# Usage: .\export-data.ps1 -Password "Svnglobal@2025"

param(
    [Parameter(Mandatory=$true)]
    [string]$Password
)

$Database = "svnglobal"
$OutputDir = "data\exports"
# URL encode the password (replace @ with %40, and other special characters)
$EncodedPassword = [System.Web.HttpUtility]::UrlEncode($Password)
$Uri = "mongodb+srv://svnglobal:${EncodedPassword}@svnglobal.5vlys7w.mongodb.net/${Database}?retryWrites=true&w=majority&appName=svnglobal"

# Create output directory if it doesn't exist
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

Write-Host "🔄 Starting MongoDB data export..." -ForegroundColor Cyan
Write-Host "📊 Database: ${Database}" -ForegroundColor Cyan
Write-Host "📁 Output directory: ${OutputDir}" -ForegroundColor Cyan
Write-Host ""

# Export Admin data
Write-Host "📤 Exporting admin data..." -ForegroundColor Yellow
$AdminFile = "${OutputDir}\admin_export_${Timestamp}.json"
mongoexport --uri $Uri `
  --collection admin `
  --type json `
  --out $AdminFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to export admin data" -ForegroundColor Red
    exit 1
}

# Export Products data
Write-Host "📤 Exporting products data..." -ForegroundColor Yellow
$ProductsFile = "${OutputDir}\products_export_${Timestamp}.json"
mongoexport --uri $Uri `
  --collection products `
  --type json `
  --out $ProductsFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to export products data" -ForegroundColor Red
    exit 1
}

# Export Test Reports data
Write-Host "📤 Exporting test reports data..." -ForegroundColor Yellow
$TestReportsFile = "${OutputDir}\testreports_export_${Timestamp}.json"
mongoexport --uri $Uri `
  --collection testreports `
  --type json `
  --out $TestReportsFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to export test reports data" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Data export completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Exported collections:" -ForegroundColor Cyan
Write-Host "   - admin"
Write-Host "   - products"
Write-Host "   - testreports"
Write-Host ""
Write-Host "📁 Files saved to: ${OutputDir}\" -ForegroundColor Cyan

