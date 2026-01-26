import { getCollection } from '../config/firebase.js'
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
    console.log('🔄 Starting data migration to Firebase...')
    
    // Migrate Products
    console.log('📦 Migrating products...')
    const productsPath = path.join(dataPath, 'products.json')
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
      const productsCollection = getCollection('products')
      
      // Clear existing products (optional - remove if you want to keep existing)
      const existingProducts = await productsCollection.get()
      const deletePromises = existingProducts.docs.map(doc => doc.ref.delete())
      await Promise.all(deletePromises)
      
      // Insert products
      const insertPromises = products.map(product => {
        const { id, ...productData } = product
        return productsCollection.add(productData)
      })
      
      if (insertPromises.length > 0) {
        await Promise.all(insertPromises)
        console.log(`✅ Migrated ${insertPromises.length} products`)
      }
    }
    
    // Migrate Test Reports
    console.log('📄 Migrating test reports...')
    const testReportsPath = path.join(dataPath, 'testReports.json')
    if (fs.existsSync(testReportsPath)) {
      const reports = JSON.parse(fs.readFileSync(testReportsPath, 'utf8'))
      const testReportsCollection = getCollection('testReports')
      
      // Clear existing reports (optional - remove if you want to keep existing)
      const existingReports = await testReportsCollection.get()
      const deletePromises = existingReports.docs.map(doc => doc.ref.delete())
      await Promise.all(deletePromises)
      
      // Insert reports
      const insertPromises = reports.map(report => {
        const { id, ...reportData } = report
        return testReportsCollection.add(reportData)
      })
      
      if (insertPromises.length > 0) {
        await Promise.all(insertPromises)
        console.log(`✅ Migrated ${insertPromises.length} test reports`)
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
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateData()
