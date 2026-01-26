# Vercel Environment Variables Setup

## Required Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

### 1. Firebase Configuration (Required)

**Option A: FIREBASE_SERVICE_ACCOUNT (Recommended)**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"svn-global",...}
```
Full JSON string of your Firebase service account key.

**Option B: Individual Variables**
```
FIREBASE_PROJECT_ID=svn-global
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@svn-global.iam.gserviceaccount.com
```

### 2. SESSION_SECRET
```
your-strong-random-secret-key-here-change-this-in-production
```
Generate a strong random string (use a password generator, at least 32 characters)

### 3. NODE_ENV
```
production
```

### 4. FRONTEND_URL (Optional but recommended)
```
https://your-frontend-domain.vercel.app
```
Your frontend Vercel deployment URL

## How to Set in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Click on **Environment Variables**
4. Add each variable:
   - **Key**: `FIREBASE_SERVICE_ACCOUNT` (or individual Firebase variables)
   - **Value**: (paste your Firebase credentials)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your project after adding variables

## Verification

After deployment, test:
- `https://your-backend.vercel.app/api/health`
- Should return JSON with `firebase: "connected"`

## Notes

- Firebase service account JSON can be obtained from Firebase Console → Project Settings → Service Accounts
- Make sure the service account has proper permissions (Firestore Admin, Storage Admin)
- For `FIREBASE_PRIVATE_KEY`, include the full key with `\n` for newlines
