import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file
dotenv.config({ path: join(__dirname, '.env') })

console.log('\n=== Firebase Credentials Check ===\n')

// Check what's in the .env file
try {
  const envContent = readFileSync(join(__dirname, '.env'), 'utf8')
  const saLine = envContent.split('\n').find(line => line.startsWith('FIREBASE_SERVICE_ACCOUNT='))
  const pkLine = envContent.split('\n').find(line => line.startsWith('FIREBASE_PRIVATE_KEY='))
  const ceLine = envContent.split('\n').find(line => line.startsWith('FIREBASE_CLIENT_EMAIL='))
  
  console.log('📄 In .env file:')
  console.log('  FIREBASE_SERVICE_ACCOUNT line:', saLine ? (saLine.length > 100 ? saLine.substring(0, 100) + '...' : saLine) : 'NOT FOUND')
  console.log('  FIREBASE_PRIVATE_KEY line:', pkLine ? (pkLine.length > 100 ? pkLine.substring(0, 100) + '...' : pkLine) : 'NOT FOUND')
  console.log('  FIREBASE_CLIENT_EMAIL line:', ceLine ? ceLine : 'NOT FOUND')
  console.log('')
} catch (error) {
  console.error('Error reading .env file:', error.message)
}

// Check what dotenv loaded
console.log('🔍 Loaded by dotenv:')
const sa = process.env.FIREBASE_SERVICE_ACCOUNT
const pk = process.env.FIREBASE_PRIVATE_KEY
const ce = process.env.FIREBASE_CLIENT_EMAIL
const pid = process.env.FIREBASE_PROJECT_ID

console.log('  FIREBASE_PROJECT_ID:', pid || 'NOT SET')
console.log('  FIREBASE_SERVICE_ACCOUNT:', sa ? `SET (${sa.length} chars)` : 'NOT SET or EMPTY')
console.log('  FIREBASE_PRIVATE_KEY:', pk ? `SET (${pk.length} chars)` : 'NOT SET or EMPTY')
console.log('  FIREBASE_CLIENT_EMAIL:', ce || 'NOT SET or EMPTY')
console.log('')

// Try to parse if service account is set
if (sa) {
  try {
    const parsed = JSON.parse(sa)
    console.log('✅ FIREBASE_SERVICE_ACCOUNT is valid JSON')
    console.log('   Project ID:', parsed.project_id || 'NOT FOUND')
    console.log('   Client Email:', parsed.client_email || 'NOT FOUND')
  } catch (e) {
    console.log('❌ FIREBASE_SERVICE_ACCOUNT is NOT valid JSON:', e.message)
    console.log('   First 100 chars:', sa.substring(0, 100))
  }
}

console.log('\n=== Recommendations ===\n')

if (!sa && !pk) {
  console.log('❌ No Firebase credentials found!')
  console.log('   1. Open backend/.env file')
  console.log('   2. Add credentials to line 5 (FIREBASE_SERVICE_ACCOUNT) or lines 8-10')
  console.log('   3. Save the file (Ctrl+S)')
  console.log('   4. Restart your server')
} else if (sa) {
  console.log('✅ FIREBASE_SERVICE_ACCOUNT is set')
  console.log('   Make sure your server was restarted after adding it!')
} else if (pk && ce) {
  console.log('✅ Individual credentials are set')
  console.log('   Make sure your server was restarted after adding them!')
}

console.log('')
