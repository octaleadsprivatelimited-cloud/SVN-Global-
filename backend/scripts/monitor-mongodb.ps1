# MongoDB Monitoring Script using mongostat for Windows PowerShell
# Usage: .\monitor-mongodb.ps1 -Password "Svnglobal@2025" [-Interval 1] [-Count 10]

param(
    [Parameter(Mandatory=$true)]
    [string]$Password,
    
    [Parameter(Mandatory=$false)]
    [int]$Interval = 1,
    
    [Parameter(Mandatory=$false)]
    [int]$Count = 0
)

# URL encode the password
$EncodedPassword = [System.Web.HttpUtility]::UrlEncode($Password)
$Uri = "mongodb+srv://svnglobal:${EncodedPassword}@svnglobal.5vlys7w.mongodb.net/?retryWrites=true&w=majority&appName=svnglobal"

Write-Host "🔄 Starting MongoDB monitoring..." -ForegroundColor Cyan
Write-Host "📊 Cluster: svnglobal.5vlys7w.mongodb.net" -ForegroundColor Cyan
Write-Host "⏱️  Interval: ${Interval} second(s)" -ForegroundColor Cyan
if ($Count -gt 0) {
    Write-Host "🔢 Samples: ${Count}" -ForegroundColor Cyan
} else {
    Write-Host "🔢 Samples: Unlimited (Press Ctrl+C to stop)" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Yellow
Write-Host ""

# Build mongostat command
$CmdArgs = @(
    "--uri", $Uri,
    "--humanReadable"
)

if ($Interval -ne 1) {
    $CmdArgs += $Interval.ToString()
}

if ($Count -gt 0) {
    $CmdArgs += $Count.ToString()
}

# Execute mongostat
& mongostat $CmdArgs

