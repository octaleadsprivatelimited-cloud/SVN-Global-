/**
 * Script to set admin custom claim for a Firebase user
 * Usage: node scripts/set-admin-claim.js <email>
 */

import admin from 'firebase-admin'
import dotenv from 'dotenv'
import '../config/firebase.js' // Initialize Firebase Admin SDK

dotenv.config()

const email = process.argv[2] || 'nagarajuwill@gmail.com'

async function setAdminClaim() {
  try {
    console.log(`Setting admin claim for: ${email}`)
    
    // Get user by email
    const user = await admin.auth().getUserByEmail(email)
    
    if (!user) {
      console.error(`User with email ${email} not found`)
      process.exit(1)
    }
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true })
    
    console.log(`✅ Successfully set admin claim for ${email} (UID: ${user.uid})`)
    console.log('Note: User may need to sign out and sign in again for the claim to take effect.')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error setting admin claim:', error.message)
    process.exit(1)
  }
}

setAdminClaim()
