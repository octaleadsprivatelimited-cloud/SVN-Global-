import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('\n=== Firebase Credentials Setup Helper ===\n')
console.log('This script will help you add Firebase credentials to your .env file.\n')

// Read current .env file
const envPath = join(__dirname, '.env')
let envContent = readFileSync(envPath, 'utf8')

console.log('Current .env file status:')
const hasServiceAccount = envContent.includes('FIREBASE_SERVICE_ACCOUNT=') && 
                         !envContent.match(/FIREBASE_SERVICE_ACCOUNT=\s*$/m)
const hasPrivateKey = envContent.includes('FIREBASE_PRIVATE_KEY=') && 
                     !envContent.match(/FIREBASE_PRIVATE_KEY=\s*$/m)
const hasClientEmail = envContent.includes('FIREBASE_CLIENT_EMAIL=') && 
                      !envContent.match(/FIREBASE_CLIENT_EMAIL=\s*$/m)

console.log('  FIREBASE_SERVICE_ACCOUNT:', hasServiceAccount ? '✅ SET' : '❌ NOT SET')
console.log('  FIREBASE_PRIVATE_KEY:', hasPrivateKey ? '✅ SET' : '❌ NOT SET')
console.log('  FIREBASE_CLIENT_EMAIL:', hasClientEmail ? '✅ SET' : '❌ NOT SET')
console.log('')

if (hasServiceAccount || (hasPrivateKey && hasClientEmail)) {
  console.log('✅ Credentials appear to be set in the file!')
  console.log('   If you\'re still getting errors, make sure:')
  console.log('   1. The file is saved (Ctrl+S)')
  console.log('   2. Your server was restarted after adding credentials')
  console.log('   3. The JSON is valid (if using FIREBASE_SERVICE_ACCOUNT)')
  console.log('')
  process.exit(0)
}

console.log('❌ No credentials found in .env file!\n')
console.log('To add credentials manually:')
console.log('')
console.log('1. Get Firebase Service Account Key:')
console.log('   - Go to: https://console.firebase.google.com/')
console.log('   - Select project: svn-global')
console.log('   - ⚙️ Settings → Project Settings → Service Accounts')
console.log('   - Click "Generate new private key"')
console.log('   - Download the JSON file')
console.log('')
console.log('2. Add to .env file:')
console.log('   Option A: Add JSON string to line 5:')
console.log('   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}')
console.log('')
console.log('   Option B: Add individual values to lines 8-10:')
console.log('   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"')
console.log('   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@svn-global.iam.gserviceaccount.com')
console.log('')
console.log('3. Save the file (Ctrl+S)')
console.log('4. Restart your server')
console.log('')
