import { createOrUpdateAdmin } from '../models/admin.js'

const updateAdmin = async () => {
  try {
    console.log('🔄 Updating admin credentials...')
    
    // Create/update admin with new credentials
    const username = 'svnglobal'
    const password = 'Svnglobal@2025'
    
    await createOrUpdateAdmin(username, password)
    
    console.log('✅ Admin credentials updated successfully!')
    console.log(`   Username: ${username}`)
    console.log(`   Password: ${password}`)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to update admin credentials:', error)
    process.exit(1)
  }
}

updateAdmin()
