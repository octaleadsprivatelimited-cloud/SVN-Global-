import { MongoClient, MongoClientOptions } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';
import dotenv from 'dotenv';

dotenv.config();

// Validate MONGODB_URI environment variable
if (!process.env.MONGODB_URI) {
  throw new Error(
    'MongoDB connection string is required. Please set MONGODB_URI environment variable.\n' +
    'Example: mongodb+srv://username:password@cluster.mongodb.net/database?options'
  );
}

const options: MongoClientOptions = {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000
};

const client = new MongoClient(process.env.MONGODB_URI, options);
   
// Attach the client to ensure proper cleanup on function suspension
// Only attach if running on Vercel
if (process.env.VERCEL) {
  attachDatabasePool(client);
}

// Export a module-scoped MongoClient to ensure the client can be shared across functions.
export default client;

