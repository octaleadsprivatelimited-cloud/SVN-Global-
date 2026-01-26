# Firebase Setup Guide

This guide explains how to set up Firebase Firestore for the SVN Global backend.

## Prerequisites

1. A Firebase project (create one at https://console.firebase.google.com/)
2. Firebase Admin SDK service account key

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard
4. Enable **Firestore Database**:
   - Go to Firestore Database in the left sidebar
   - Click "Create database"
   - Choose "Start in production mode" (you can change security rules later)
   - Select a location for your database

## Step 2: Get Service Account Key

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Go to the **Service Accounts** tab
3. Click **Generate new private key**
4. Save the JSON file securely (this contains sensitive credentials)

## Step 3: Configure Environment Variables

You have three options for configuring Firebase credentials:

### Option 1: Service Account JSON String (Recommended for Vercel)

Convert your service account JSON file to a single-line string and set it as an environment variable:

```bash
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id",...}'
```

**For Vercel:**
- Go to your project settings → Environment Variables
- Add `FIREBASE_SERVICE_ACCOUNT` with the JSON string as the value

### Option 2: Individual Environment Variables

Extract values from your service account JSON and set them individually:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

**Note:** The private key must include the `\n` characters for newlines.

### Option 3: Local Development with Service Account File

For local development, you can use the service account JSON file directly:

1. Place your service account JSON file in the `backend` directory (e.g., `serviceAccountKey.json`)
2. Update `backend/config/firebase.js` to load from file:

```javascript
import serviceAccount from './serviceAccountKey.json'

firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
```

**⚠️ Important:** Never commit the service account file to git! Add it to `.gitignore`.

## Step 4: Set Up Firestore Collections

The application uses three collections:

1. **products** - Product catalog
2. **testReports** - Test reports
3. **admin** - Admin user credentials

These collections will be created automatically when you first add data. However, you may want to set up indexes:

### Create Indexes (Optional but Recommended)

1. Go to Firestore Database → Indexes
2. Create a composite index for `testReports` collection:
   - Collection ID: `testReports`
   - Fields: `date` (Descending)
   - Query scope: Collection

This will improve performance when fetching test reports sorted by date.

## Step 5: Set Up Security Rules

Go to Firestore Database → Rules and set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Adjust based on your auth setup
    }
    
    // Test Reports - public read, admin write
    match /testReports/{reportId} {
      allow read: if true;
      allow write: if request.auth != null; // Adjust based on your auth setup
    }
    
    // Admin - no public access
    match /admin/{adminId} {
      allow read, write: if false; // Only accessible via Admin SDK
    }
  }
}
```

**Note:** Since we're using Firebase Admin SDK (server-side), these rules mainly protect against direct client access. The Admin SDK bypasses security rules.

## Step 6: Migrate Existing Data (Optional)

If you have existing data in JSON files, use the migration script:

```bash
cd backend
node scripts/migrate-to-firebase.js
```

This will:
- Import products from `data/products.json`
- Import test reports from `data/testReports.json`
- Create/update admin credentials from `data/admin.json` or create default admin

## Step 7: Test Firebase Connection

Test your Firebase setup:

```bash
cd backend
node test-firebase.js
```

You should see:
```
✅ Successfully connected to Firebase!
✅ Test document created with ID: ...
✅ Test document retrieved: ...
🧹 Test document cleaned up
✅ All Firebase tests passed!
```

## Troubleshooting

### Error: "Firebase Admin SDK initialization failed"

- Check that your environment variables are set correctly
- Verify your service account JSON is valid
- Ensure `FIREBASE_PROJECT_ID` matches your Firebase project ID

### Error: "Permission denied" or "Missing or insufficient permissions"

- Check Firestore security rules
- Verify your service account has the correct permissions
- Ensure Firestore API is enabled in Google Cloud Console

### Error: "Could not order by date (index may not exist)"

- This is a warning, not an error
- The app will still work but may be slower
- Create the index as described in Step 4

### Local Development Issues

- Make sure you have a `.env` file in the `backend` directory
- Check that environment variables are loaded correctly
- Try using Option 3 (service account file) for easier local setup

## Environment Variables Reference

See `backend/.env.example` for a complete list of environment variables.

## Next Steps

- Set up Firebase Authentication if you want client-side auth
- Configure Firebase Storage if you need file uploads
- Set up Firebase Cloud Functions for serverless operations
- Configure Firebase Hosting if deploying frontend to Firebase

## Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
