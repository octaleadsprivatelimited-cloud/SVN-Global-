import { getDB } from '../config/mongodb.js'
import { MongoClient, ObjectId } from 'mongodb'

export const getProductsCollection = () => {
  return getDB().collection('products')
}

export const getAllProducts = async () => {
  try {
    const collection = getProductsCollection()
    const products = await collection.find({}).toArray()
    // Convert _id to id for compatibility
    return products.map(product => ({
      ...product,
      id: product._id.toString()
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const getProductById = async (id) => {
  try {
    const collection = getProductsCollection()
    const product = await collection.findOne({ _id: new ObjectId(id) })
    if (product) {
      return {
        ...product,
        id: product._id.toString()
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export const createProduct = async (productData) => {
  try {
    const collection = getProductsCollection()
    // Remove id if it exists (MongoDB will create _id)
    const { id, ...dataToInsert } = productData
    const result = await collection.insertOne(dataToInsert)
    return {
      ...dataToInsert,
      _id: result.insertedId,
      id: result.insertedId.toString()
    }
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export const updateProduct = async (id, productData) => {
  try {
    const collection = getProductsCollection()
    // Remove id from update data
    const { id: _, ...updateData } = productData
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    if (result) {
      return {
        ...result,
        id: result._id.toString()
      }
    }
    return null
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    const collection = getProductsCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

