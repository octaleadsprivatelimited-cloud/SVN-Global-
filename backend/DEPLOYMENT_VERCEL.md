# Vercel Deployment Guide

## Environment Variables Setup in Vercel

Go to your Vercel project settings and add these environment variables:

### Required Environment Variables:

1. **MONGODB_URI** or **MONGO_URI**
   ```
   mongodb+srv://svnglobal:Svnglobal%402025@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal
   ```
   Note: The password `Svnglobal@2025` is URL encoded as `Svnglobal%402025`

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

### MongoDB Atlas Network Access

Make sure your MongoDB Atlas cluster allows network access:
1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (allows all IPs) OR add Vercel's IP ranges
3. Save changes

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
   - Should return: `{"status":"ok","message":"SVN Global API is running","mongodb":"connected"}`

## Frontend Configuration

Update your frontend's API configuration to use the Vercel backend URL:

```javascript
// In frontend/.env or Vercel environment variables
VITE_API_URL=https://your-backend.vercel.app
```

Or update `frontend/src/config/api.js` to detect Vercel deployment automatically.

## Troubleshooting

### Connection Errors
- Check that `MONGODB_URI` is set correctly in Vercel
- Verify MongoDB Atlas network access allows your IPs
- Check Vercel function logs for MongoDB connection errors

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
│   └── mongodb.js        # MongoDB connection (serverless optimized)
├── models/               # MongoDB models
├── server.js             # Express app (exports default)
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

