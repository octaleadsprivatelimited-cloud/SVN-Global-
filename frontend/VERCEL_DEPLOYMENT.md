# Vercel Deployment Guide

## Fixing White Blank Page Issue

The white blank page on Vercel is usually caused by missing environment variables or build errors.

## Step 1: Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

### Required Firebase Variables:
```
VITE_FIREBASE_API_KEY=AIzaSyA4yfTDtFbbUw3SDV_Fmczqs2h-h_mb9a8
VITE_FIREBASE_AUTH_DOMAIN=svn-global.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=svn-global
VITE_FIREBASE_STORAGE_BUCKET=svn-global.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=91693017114
VITE_FIREBASE_APP_ID=1:91693017114:web:a5447bc5f081c0fbcb49a3
VITE_FIREBASE_MEASUREMENT_ID=G-HK7CE7TK7J
```

### Required API URL:
```
VITE_API_URL=https://your-backend-url.vercel.app
```
(Replace with your actual backend Vercel URL)

## Step 2: Configure Build Settings

Vercel should auto-detect Vite, but verify these settings:

1. Go to **Settings** → **General** → **Build & Development Settings**
2. Ensure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 3: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

## Step 4: Check Build Logs

If still seeing white page:
1. Go to **Deployments** → Click on the deployment
2. Check **Build Logs** for errors
3. Common issues:
   - Missing environment variables
   - Build errors
   - JavaScript runtime errors

## Step 5: Check Browser Console

1. Open your deployed site
2. Press F12 to open Developer Tools
3. Check **Console** tab for errors
4. Check **Network** tab to see if files are loading

## Troubleshooting

### White Blank Page
- ✅ Check environment variables are set in Vercel
- ✅ Check build logs for errors
- ✅ Check browser console for JavaScript errors
- ✅ Verify `vercel.json` is in the frontend directory

### Build Fails
- Check Node.js version (should be 18.x or 20.x)
- Check `package.json` has correct build script
- Check for missing dependencies

### Runtime Errors
- Check browser console
- Verify all environment variables are set
- Check Firebase configuration

## Quick Fix Checklist

- [ ] All `VITE_FIREBASE_*` variables added to Vercel
- [ ] `VITE_API_URL` set to backend URL
- [ ] Build settings configured correctly
- [ ] Redeployed after adding variables
- [ ] Checked build logs for errors
- [ ] Checked browser console for errors

## Need Help?

1. Check Vercel deployment logs
2. Check browser console (F12)
3. Verify all environment variables are set
4. Try redeploying after fixing issues
