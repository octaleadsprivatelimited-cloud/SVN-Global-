# Start Backend Server
Write-Host "Starting Backend Server on http://localhost:5000" -ForegroundColor Green
cd "$PSScriptRoot\backend"
node server.js

