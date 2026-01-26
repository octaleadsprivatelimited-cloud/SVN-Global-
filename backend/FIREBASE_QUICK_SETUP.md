# Quick Firebase Setup Guide

## The Problem
You're getting "Authentication failed" errors because Firebase Admin SDK credentials are missing.

## Quick Solution (5 minutes)

### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **svn-global**
3. Click the **⚙️ Settings** icon (top left) → **Project settings**
4. Go to the **Service accounts** tab
5. Click **Generate new private key**
6. Click **Generate key** in the popup
7. A JSON file will download (e.g., `svn-global-firebase-adminsdk-xxxxx.json`)

### Step 2: Add Credentials to .env.development

Open `backend/.env.development` and add the service account JSON to line 6:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"svn-global","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Important:**
- Copy the ENTIRE JSON content from the downloaded file
- Paste it as ONE LINE (remove all line breaks)
- Keep the quotes around it
- The JSON should start with `{"type":"service_account"...`

### Step 3: Restart Backend Server

After saving `.env.development`, restart your backend server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
npm start
```

You should see: `✅ Firebase Admin SDK initialized successfully`

### Step 4: Test

1. Refresh your admin page
2. Try saving a product again
3. It should work now! ✅

## Alternative: Individual Variables

If you prefer using individual variables instead of JSON:

```env
FIREBASE_PROJECT_ID=svn-global
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@svn-global.iam.gserviceaccount.com
```

**Note:** Keep the `\n` characters in the private key - they're important!

## Troubleshooting

- **"Firebase Admin SDK not initialized"**: Check that the JSON is valid and on one line
- **"Invalid credentials"**: Make sure you copied the entire JSON correctly
- **Still not working**: Check backend console for specific error messages

## Need Help?

Check the backend console logs when you try to save a product - they will show the exact error.
