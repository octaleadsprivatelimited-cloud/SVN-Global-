import admin from 'firebase-admin'
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.development if it exists, otherwise .env
const envDevelopmentPath = join(__dirname, '..', '.env.development')
const envPath = join(__dirname, '..', '.env')

if (existsSync(envDevelopmentPath)) {
  dotenv.config({ path: envDevelopmentPath })
} else if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  dotenv.config() // Default behavior
}

// Initialize Firebase Admin SDK
// Priority: FIREBASE_SERVICE_ACCOUNT (JSON string) > FIREBASE_PROJECT_ID + FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL
let firebaseApp = null

try {
  // Check if FIREBASE_SERVICE_ACCOUNT is set and not empty
  const hasServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT && 
                           process.env.FIREBASE_SERVICE_ACCOUNT.trim() !== ''
  
  // Check if individual credentials are set and not empty
  const hasIndividualCreds = process.env.FIREBASE_PROJECT_ID && 
                              process.env.FIREBASE_PROJECT_ID.trim() !== '' &&
                              process.env.FIREBASE_PRIVATE_KEY && 
                              process.env.FIREBASE_PRIVATE_KEY.trim() !== '' &&
                              process.env.FIREBASE_CLIENT_EMAIL && 
                              process.env.FIREBASE_CLIENT_EMAIL.trim() !== ''

  if (hasServiceAccount) {
    // Option 1: Service account as JSON string (recommended for Vercel)
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      })
      console.log('✅ Firebase Admin SDK initialized with FIREBASE_SERVICE_ACCOUNT')
    } catch (parseError) {
      throw new Error(
        'Failed to parse FIREBASE_SERVICE_ACCOUNT JSON. Please ensure it is valid JSON.\n' +
        'Error: ' + parseError.message
      )
    }
  } else if (hasIndividualCreds) {
    // Option 2: Individual environment variables
    try {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        })
      })
      console.log('✅ Firebase Admin SDK initialized with individual credentials')
    } catch (certError) {
      throw new Error(
        'Failed to initialize Firebase with individual credentials.\n' +
        'Please verify FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are correct.\n' +
        'Error: ' + certError.message
      )
    }
  } else {
    // No credentials provided - fail with helpful error message
    throw new Error(
      '❌ Firebase Admin SDK credentials not configured!\n\n' +
      'Please set up Firebase credentials in your .env file using one of these options:\n\n' +
      'Option 1 (Recommended): Set FIREBASE_SERVICE_ACCOUNT as a JSON string\n' +
      '  Get it from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key\n' +
      '  Then set: FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}\n\n' +
      'Option 2: Set individual environment variables:\n' +
      '  FIREBASE_PROJECT_ID=your-project-id\n' +
      '  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"\n' +
      '  FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com\n\n' +
      'Current values:\n' +
      `  FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID || '(not set)'}\n` +
      `  FIREBASE_PRIVATE_KEY: ${process.env.FIREBASE_PRIVATE_KEY ? '(set but may be empty)' : '(not set)'}\n` +
      `  FIREBASE_CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL || '(not set)'}\n` +
      `  FIREBASE_SERVICE_ACCOUNT: ${process.env.FIREBASE_SERVICE_ACCOUNT ? '(set but may be empty)' : '(not set)'}`
    )
  }

  console.log('✅ Firebase Admin SDK initialized successfully')
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message)
  // Don't throw immediately - allow server to start but log the error
  // This way the health check endpoint can still respond
  console.error('\n⚠️  Server will start but Firebase operations will fail until credentials are configured.\n')
}

// Get Firestore database instance
export const getDB = () => {
  if (!firebaseApp) {
    throw new Error(
      'Firebase Admin SDK not initialized. Please configure Firebase credentials in your .env file.\n' +
      'See the error message above for setup instructions.'
    )
  }
  return admin.firestore()
}

// Get Firestore collections
export const getCollection = (collectionName) => {
  const db = getDB()
  return db.collection(collectionName)
}

// Health check function
export const checkFirebaseConnection = async () => {
  try {
    const db = getDB()
    // Try to read from a test collection to verify connection
    await db.collection('_health').limit(1).get()
    return true
  } catch (error) {
    console.error('Firebase connection check failed:', error.message)
    return false
  }
}

export default firebaseApp
