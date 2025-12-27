# Vercel Deployment Fix for API Routes

## Problem
When accessing `https://svn-global.vercel.app/api/health`, the frontend HTML (header/footer) is shown instead of JSON API response.

## Solution

### Option 1: Separate Backend and Frontend Deployments (Recommended)

1. **Backend Deployment:**
   - Create a new Vercel project for backend
   - Root directory: `backend`
   - Environment variables:
     - `MONGODB_URI`
     - `SESSION_SECRET`
     - `NODE_ENV=production`
   - This will handle all `/api/*` routes

2. **Frontend Deployment:**
   - Create a separate Vercel project for frontend
   - Root directory: `frontend`
   - Update `frontend/vercel.json` to proxy `/api/*` to backend URL:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://your-backend-url.vercel.app/api/$1"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
   - Set environment variable: `VITE_API_URL=https://your-backend-url.vercel.app`

### Option 2: Monorepo Single Deployment

If both are in the same Vercel project:

1. **Update root `vercel.json`** (if exists):
```json
{
  "builds": [
    {
      "src": "backend/api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

2. **Ensure backend/vercel.json exists** with correct routing

## Verification

After deployment, test:
- `https://your-backend-url.vercel.app/api/health` should return JSON
- Should NOT show HTML/header/footer
- Should show: `{"status":"ok","message":"SVN Global API is running",...}`

## Current Configuration

- Backend: `backend/vercel.json` routes `/api/*` to `api/index.js`
- Frontend: `frontend/vercel.json` proxies `/api/*` to backend (if separate deployment)

