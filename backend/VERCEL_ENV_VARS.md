# Vercel Environment Variables Setup

## Required Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

### 1. MONGO_URI (Primary - Recommended)
```
mongodb+srv://svnglobal:Svnglobal%402025@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal
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
   - **Key**: `MONGO_URI`
   - **Value**: (paste connection string)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your project after adding variables

## Verification

After deployment, test:
- `https://your-backend.vercel.app/api/health`
- Should return JSON with `mongodb: "connected"`

## Notes

- `MONGO_URI` is checked first, then `MONGODB_URI` as fallback
- Password `Svnglobal@2025` is URL encoded as `Svnglobal%402025`
- Make sure MongoDB Atlas allows network access for `0.0.0.0/0` (all IPs)

