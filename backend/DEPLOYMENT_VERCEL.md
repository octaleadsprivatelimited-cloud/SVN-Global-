# Vercel Deployment Guide

## Environment Variables Setup in Vercel

Go to your Vercel project settings and add these environment variables:

### Required Environment Variables:

1. **Firebase Configuration** (Choose one option):

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

2. **SESSION_SECRET**
   ```
   your-strong-random-secret-key-here-change-this
   ```
   Generate a strong random string for production (use a password generator)

3. **NODE_ENV**
   ```
   production
   ```

4. **FRONTEND_URL** (Optional but recommended)
   ```
   https://your-frontend-domain.vercel.app
   ```
   Or your custom domain if you have one

## Deployment Steps

1. **Install Vercel CLI** (optional, if deploying via CLI):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   - Via Vercel Dashboard: Connect your GitHub repo and deploy
   - Via CLI: `vercel` in the backend directory

3. **Set Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required variables listed above
   - Redeploy after adding variables

4. **Verify Deployment**:
   - Check health endpoint: `https://your-backend.vercel.app/api/health`
   - Should return: `{"status":"ok","message":"SVN Global API is running","firebase":"connected"}`

## Frontend Configuration

Update your frontend's API configuration to use the Vercel backend URL:

```javascript
// In frontend/.env or Vercel environment variables
VITE_API_URL=https://your-backend.vercel.app
```

Or update `frontend/src/config/api.js` to detect Vercel deployment automatically.

## Troubleshooting

### Connection Errors
- Check that Firebase environment variables are set correctly in Vercel
- Verify Firebase service account has proper permissions
- Check Vercel function logs for Firebase connection errors

### Session/Auth Issues
- Ensure `SESSION_SECRET` is set in Vercel
- Check that cookies are being sent with credentials: true
- Verify CORS is allowing your frontend domain

### CORS Errors
- Add your frontend domain to `FRONTEND_URL` environment variable
- Check that `credentials: true` is set in frontend fetch requests
- Verify `sameSite: 'none'` and `secure: true` in cookie-session config

## File Structure for Vercel

```
backend/
├── api/
│   └── index.js          # Vercel serverless entry point
├── config/
│   └── firebase.js       # Firebase Admin SDK connection
├── models/               # Firestore models
├── server.js             # Express app (exports default)
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```
