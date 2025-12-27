import { connectDB, closeDB } from '../config/mongodb.js'
import { createOrUpdateAdmin } from '../models/admin.js'
import bcrypt from 'bcryptjs'

const updateAdmin = async () => {
  try {
    console.log('🔄 Updating admin credentials...')
    
    // Connect to MongoDB
    const db = await connectDB()
    
    // Create/update admin with new credentials
    const username = 'svnglobal'
    const password = 'Svnglobal@2025'
    
    await createOrUpdateAdmin(username, password)
    
    console.log('✅ Admin credentials updated successfully!')
    console.log(`   Username: ${username}`)
    console.log(`   Password: ${password}`)
    
    await closeDB()
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to update admin credentials:', error)
    await closeDB()
    process.exit(1)
  }
}

updateAdmin()

