import { connectDB, closeDB } from '../config/mongodb.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createOrUpdateAdmin } from '../models/admin.js'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.join(__dirname, '..', 'data')

async function migrateData() {
  try {
    console.log('🔄 Starting data migration to MongoDB...')
    
    // Connect to MongoDB
    const db = await connectDB()
    
    // Migrate Products
    console.log('📦 Migrating products...')
    const productsPath = path.join(dataPath, 'products.json')
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
      const productsCollection = db.collection('products')
      
      // Clear existing products (optional - remove if you want to keep existing)
      await productsCollection.deleteMany({})
      
      // Insert products, converting id to _id for MongoDB
      const productsToInsert = products.map(product => {
        const { id, ...productData } = product
        return productData
      })
      
      if (productsToInsert.length > 0) {
        await productsCollection.insertMany(productsToInsert)
        console.log(`✅ Migrated ${productsToInsert.length} products`)
      }
    }
    
    // Migrate Test Reports
    console.log('📄 Migrating test reports...')
    const testReportsPath = path.join(dataPath, 'testReports.json')
    if (fs.existsSync(testReportsPath)) {
      const reports = JSON.parse(fs.readFileSync(testReportsPath, 'utf8'))
      const testReportsCollection = db.collection('testReports')
      
      // Clear existing reports (optional - remove if you want to keep existing)
      await testReportsCollection.deleteMany({})
      
      // Insert reports, converting id to _id for MongoDB
      const reportsToInsert = reports.map(report => {
        const { id, ...reportData } = report
        return reportData
      })
      
      if (reportsToInsert.length > 0) {
        await testReportsCollection.insertMany(reportsToInsert)
        console.log(`✅ Migrated ${reportsToInsert.length} test reports`)
      }
    }
    
    // Migrate Admin
    console.log('👤 Migrating admin...')
    const adminPath = path.join(dataPath, 'admin.json')
    if (fs.existsSync(adminPath)) {
      const admin = JSON.parse(fs.readFileSync(adminPath, 'utf8'))
      
      // If password is not hashed, hash it
      let password = admin.password
      if (password && !password.startsWith('$2b$')) {
        // Default password is 'admin123'
        if (password === 'admin123' || !password) {
          password = await bcrypt.hash('admin123', 10)
        } else {
          password = await bcrypt.hash(password, 10)
        }
      }
      
      await createOrUpdateAdmin(admin.username || 'admin', password)
      console.log('✅ Migrated admin credentials')
    } else {
      // Create default admin if no admin.json exists
      const defaultPassword = await bcrypt.hash('admin123', 10)
      await createOrUpdateAdmin('admin', defaultPassword)
      console.log('✅ Created default admin (username: admin, password: admin123)')
    }
    
    console.log('✅ Data migration completed successfully!')
    await closeDB()
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    await closeDB()
    process.exit(1)
  }
}

migrateData()

