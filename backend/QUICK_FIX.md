# ⚡ Quick Fix - Add Firebase Credentials

## Current Status
Your `.env` file shows credentials are **NOT SET**. You need to add them.

## Steps to Fix

### 1. Open `backend/.env` file
Make sure you're editing the **correct file**: `backend/.env` (NOT `.env.example`)

### 2. Add ONE of these options:

#### Option A: JSON String (Easiest)

Find line 5:
```env
FIREBASE_SERVICE_ACCOUNT=
```

Replace with (paste your JSON from Firebase):
```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"svn-global",...}
```

**Get the JSON:**
1. Go to: https://console.firebase.google.com/
2. Select project: `svn-global`
3. ⚙️ Settings → Project Settings → Service Accounts tab
4. Click "Generate new private key"
5. Copy the entire JSON from the downloaded file
6. Paste it after `FIREBASE_SERVICE_ACCOUNT=` (on one line!)

#### Option B: Individual Variables

Fill in lines 8-10:
```env
FIREBASE_PROJECT_ID=svn-global
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[your key here]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@svn-global.iam.gserviceaccount.com
```

### 3. SAVE the file (Ctrl+S)

### 4. RESTART your backend server:
```bash
# Stop server (Ctrl+C)
# Then restart:
cd backend
npm start
```

### 5. Verify
You should see:
```
✅ Firebase Admin SDK initialized successfully
```

## Common Mistakes
- ❌ Editing `.env.example` instead of `.env`
- ❌ Not saving the file
- ❌ Not restarting the server
- ❌ JSON has line breaks (must be one line)
- ❌ Extra quotes around the JSON

## Still Not Working?
Run this to check:
```bash
cd backend
node -e "require('dotenv').config(); console.log('SERVICE_ACCOUNT:', process.env.FIREBASE_SERVICE_ACCOUNT ? 'SET' : 'NOT SET');"
```

If it says "NOT SET", the credentials aren't in the file.
