// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// All configuration values are loaded from .env.development file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate that all required Firebase config values are present
const hasValidConfig = firebaseConfig.apiKey && 
                       firebaseConfig.authDomain && 
                       firebaseConfig.projectId &&
                       firebaseConfig.apiKey !== 'undefined' &&
                       firebaseConfig.authDomain !== 'undefined' &&
                       firebaseConfig.projectId !== 'undefined';

if (!hasValidConfig) {
  console.error('❌ Firebase configuration is missing required environment variables.');
  console.error('Missing values:', {
    apiKey: !firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined',
    authDomain: !firebaseConfig.authDomain || firebaseConfig.authDomain === 'undefined',
    projectId: !firebaseConfig.projectId || firebaseConfig.projectId === 'undefined'
  });
  
  // In production, show a warning but don't crash - allow app to load
  if (import.meta.env.PROD) {
    console.warn('⚠️  Firebase not configured - some features may not work. Please set VITE_FIREBASE_* environment variables in Vercel.');
    console.warn('⚠️  App will continue to load but Firebase features will be disabled.');
  } else {
    // In development, throw to catch issues early
    throw new Error('Firebase configuration is incomplete. Please set all VITE_FIREBASE_* environment variables in .env.development.');
  }
}

// Initialize Firebase
let app;
let db;
let auth;
let analytics = null;

try {
  if (hasValidConfig) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Initialize Analytics (only in browser environment)
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
      } catch (error) {
        console.warn('Analytics initialization failed:', error);
      }
    }
    console.log('✅ Firebase initialized successfully');
  } else {
    console.warn('⚠️  Firebase not initialized - using fallback values');
    // Create minimal fallback to prevent crashes
    app = null;
    db = null;
    auth = null;
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  // In production, don't crash the app
  if (import.meta.env.PROD) {
    console.warn('⚠️  Continuing without Firebase - some features will be disabled.');
    app = null;
    db = null;
    auth = null;
  } else {
    throw error;
  }
}

// Export Firebase instances (may be null if not configured)
export { db, auth, app, analytics };
export default app;
