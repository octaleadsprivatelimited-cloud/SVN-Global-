# 🔥 Firebase Setup - Step by Step

## Current Error
```
Could not load the default credentials
```

This means Firebase Admin SDK credentials are **not configured** in your `.env` file.

## ✅ Quick Fix (5 minutes)

### Step 1: Get Firebase Service Account Key

1. **Open Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `svn-global`
3. **Click the gear icon** ⚙️ (top left) → **Project Settings**
4. **Click the "Service Accounts" tab**
5. **Click "Generate new private key"** button
6. **Click "Generate key"** in the popup
7. A JSON file will download (e.g., `svn-global-firebase-adminsdk-xxxxx.json`)

### Step 2: Configure Your .env File

Open `backend/.env` and add **ONE** of these options:

#### Option A: Use JSON String (Easiest)

1. Open the downloaded JSON file in a text editor
2. Copy the **entire content** (it's one JSON object)
3. In `backend/.env`, find the line:
   ```env
   FIREBASE_SERVICE_ACCOUNT=
   ```
4. Paste the JSON after the `=` sign:
   ```env
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"svn-global","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@svn-global.iam.gserviceaccount.com",...}
   ```

**Important**: The entire JSON must be on **one line** with no line breaks.

#### Option B: Use Individual Variables

1. Open the downloaded JSON file
2. Copy these values:

   - `project_id` → Use for `FIREBASE_PROJECT_ID`
   - `private_key` → Use for `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)
   - `client_email` → Use for `FIREBASE_CLIENT_EMAIL`

3. In `backend/.env`, update:
   ```env
   FIREBASE_PROJECT_ID=svn-global
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@svn-global.iam.gserviceaccount.com
   ```

### Step 3: Restart Your Server

1. **Stop** your backend server (Ctrl+C)
2. **Start** it again:
   ```bash
   cd backend
   npm start
   ```

### Step 4: Verify

You should see:
```
✅ Firebase Admin SDK initialized successfully
```

If you see an error, check:
- ✅ JSON is valid (no syntax errors)
- ✅ No extra spaces before/after the `=` sign
- ✅ Private key includes `\n` characters (if using Option B)
- ✅ File is saved as `.env` (not `.env.txt` or `.env.example`)

## 🎯 Example .env File

Here's what your `backend/.env` should look like (with Option A):

```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"svn-global","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@svn-global.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40svn-global.iam.gserviceaccount.com"}

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:3000
```

## ⚠️ Security Reminder

- **Never commit** `.env` to git (it's already in `.gitignore`)
- **Never share** your service account key
- **Delete** the downloaded JSON file after adding it to `.env`

## 🆘 Still Having Issues?

1. Check the backend console for the exact error message
2. Verify the JSON is valid: https://jsonlint.com/
3. Make sure there are no quotes around the JSON string (if using Option A)
4. Try Option B if Option A doesn't work
