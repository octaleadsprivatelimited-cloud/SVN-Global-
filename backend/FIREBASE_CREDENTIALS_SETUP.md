# Firebase Credentials Setup - Quick Guide

## Error: "Could not load the default credentials"

This error means Firebase Admin SDK credentials are not configured. Follow these steps:

## Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **svn-global**
3. Click the **gear icon** (⚙️) → **Project Settings**
4. Go to the **Service Accounts** tab
5. Click **Generate new private key**
6. A JSON file will download - **keep this secure!**

## Step 2: Configure Your .env File

You have **two options**:

### Option 1: Use Service Account JSON String (Recommended)

1. Open the downloaded JSON file
2. Copy the entire JSON content
3. In your `backend/.env` file, set:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"svn-global",...}
```

**Important:** The entire JSON must be on one line, properly escaped if needed.

### Option 2: Use Individual Environment Variables

Extract these values from the JSON file:

1. `project_id` → `FIREBASE_PROJECT_ID`
2. `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)
3. `client_email` → `FIREBASE_CLIENT_EMAIL`

Example `.env` file:

```env
FIREBASE_PROJECT_ID=svn-global
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@svn-global.iam.gserviceaccount.com
```

## Step 3: Restart Your Server

After updating `.env`, restart your backend server:

```bash
cd backend
npm start
# or
npm run dev
```

## Verification

You should see this message when the server starts:
```
✅ Firebase Admin SDK initialized successfully
```

If you see an error, check:
- JSON is valid (if using Option 1)
- Private key includes `\n` characters (if using Option 2)
- No extra spaces or quotes around values
- File is saved as `.env` (not `.env.txt`)

## Security Notes

- ⚠️ **Never commit** your `.env` file to git
- ⚠️ **Never share** your service account key
- ✅ The `.env` file is already in `.gitignore`
- ✅ For production, use environment variables in your hosting platform
