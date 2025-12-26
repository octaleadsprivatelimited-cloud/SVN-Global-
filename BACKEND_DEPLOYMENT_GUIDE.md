# Backend Deployment Guide - Real-time Production Setup

This guide will help you deploy the SVN Global backend server so the admin panel works in production.

## Prerequisites

- Node.js installed on your server (v16 or higher)
- Git installed
- Access to your deployment platform (Heroku, Railway, DigitalOcean, AWS, etc.)

---

## Step 1: Choose Your Deployment Platform

### Option A: Railway (Recommended - Easiest)
- Free tier available
- Automatic deployments from GitHub
- Built-in environment variables
- URL: https://railway.app

### Option B: Render
- Free tier available
- Easy setup
- URL: https://render.com

### Option C: Heroku
- Paid service (no free tier anymore)
- Well-established platform
- URL: https://heroku.com

### Option D: DigitalOcean App Platform
- Pay-as-you-go
- Good performance
- URL: https://www.digitalocean.com/products/app-platform

### Option E: AWS EC2 / VPS
- Full control
- Requires server management
- Most flexible

---

## Step 2: Prepare Your Backend for Deployment

### 2.1 Update package.json Scripts

Make sure your `backend/package.json` has a start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

### 2.2 Create .env File Template

Create `backend/.env.example` (don't commit actual .env):

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com

# Session Secret (generate a random string)
SESSION_SECRET=your-very-secure-random-string-here-min-32-chars

# Optional: Email Configuration (if using contact form)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=contact@svnglobal.com
```

### 2.3 Generate Session Secret

Generate a secure random string for SESSION_SECRET:

**On Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**On Linux/Mac:**
```bash
openssl rand -base64 32
```

Or use an online generator: https://randomkeygen.com/

---

## Step 3: Deploy to Railway (Recommended Method)

### 3.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

### 3.2 Connect Repository
1. Select "Deploy from GitHub repo"
2. Choose your repository: `octaleadsprivatelimited-cloud/SVN-Global-`
3. Select the `backend` folder as the root directory

### 3.3 Configure Environment Variables
1. Go to your project → Variables tab
2. Add these variables:

```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
SESSION_SECRET=your-generated-secret-here
```

### 3.4 Deploy
1. Railway will automatically detect Node.js
2. It will run `npm install` and `npm start`
3. Wait for deployment to complete
4. Copy your backend URL (e.g., `https://your-app.railway.app`)

### 3.5 Update Frontend
1. In your frontend hosting platform (Vercel/Netlify), add environment variable:
   ```
   VITE_API_URL=https://your-app.railway.app
   ```
2. Rebuild and redeploy frontend

---

## Step 4: Deploy to Render (Alternative)

### 4.1 Create Account
1. Go to https://render.com
2. Sign up with GitHub

### 4.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: svn-global-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 4.3 Set Environment Variables
In the Environment tab, add:
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
SESSION_SECRET=your-generated-secret-here
```

### 4.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment
3. Copy your backend URL

---

## Step 5: Deploy to Heroku

### 5.1 Install Heroku CLI
Download from: https://devcenter.heroku.com/articles/heroku-cli

### 5.2 Login
```bash
heroku login
```

### 5.3 Create App
```bash
cd backend
heroku create svn-global-backend
```

### 5.4 Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
heroku config:set SESSION_SECRET=your-generated-secret-here
```

### 5.5 Deploy
```bash
git push heroku main
```

---

## Step 6: Deploy to VPS/EC2 (Manual Deployment)

### 6.1 Connect to Server
```bash
ssh user@your-server-ip
```

### 6.2 Install Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

### 6.3 Clone Repository
```bash
git clone https://github.com/octaleadsprivatelimited-cloud/SVN-Global-.git
cd SVN-Global-/backend
```

### 6.4 Install Dependencies
```bash
npm install --production
```

### 6.5 Create .env File
```bash
nano .env
```
Add your environment variables (see Step 2.2)

### 6.6 Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### 6.7 Start Backend
```bash
pm2 start server.js --name svn-global-backend
pm2 save
pm2 startup
```

### 6.8 Setup Nginx (Reverse Proxy)
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-backend-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

---

## Step 7: Configure CORS for Production

### 7.1 Update backend/server.js

The CORS is already configured, but verify it includes your frontend URL:

```javascript
const allowedOrigins = [
  'http://localhost:3003',
  process.env.FRONTEND_URL,
  process.env.VITE_FRONTEND_URL
].filter(Boolean)
```

### 7.2 For HTTPS, Update Session Cookie

In `backend/server.js`, update the session cookie settings:

```javascript
cookie: {
  secure: true,  // Only send cookies over HTTPS
  httpOnly: true,
  sameSite: 'none',  // Required for cross-origin requests
  maxAge: 24 * 60 * 60 * 1000
}
```

---

## Step 8: Test Your Backend

### 8.1 Health Check
Visit: `https://your-backend-url.com/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "SVN Global API is running"
}
```

### 8.2 Test Admin Login
1. Go to your frontend: `https://your-frontend-url.com/admin`
2. Try logging in with: `admin` / `admin123`
3. Check browser console for any errors

### 8.3 Test API Endpoints
```bash
# Test products endpoint
curl https://your-backend-url.com/api/products

# Test admin check (should return unauthorized)
curl https://your-backend-url.com/api/admin/check-auth
```

---

## Step 9: Data Persistence

### Important: Data Files Location

The backend stores data in `backend/data/` folder:
- `products.json` - Product data
- `testReports.json` - Test report data
- `admin.json` - Admin credentials

### For Cloud Platforms (Railway, Render, Heroku):
- **Issue**: These platforms have ephemeral filesystems (data gets deleted on restart)
- **Solution**: Use a database or external storage

### Quick Fix: Use GitHub as Storage
1. Commit data files to GitHub
2. Backend reads from GitHub on startup
3. Or use a database service (MongoDB Atlas, PostgreSQL, etc.)

### Recommended: Add Database Support
Consider migrating to:
- **MongoDB Atlas** (Free tier available)
- **PostgreSQL** (via Railway/Render)
- **Supabase** (Free tier available)

---

## Step 10: Update Frontend Configuration

### 10.1 Set VITE_API_URL

In your frontend hosting platform (Vercel/Netlify):

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://your-backend-url.com`
3. Redeploy

**Netlify:**
1. Go to Site Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://your-backend-url.com`
3. Redeploy

### 10.2 If Same Domain
If backend and frontend are on the same domain:
- Leave `VITE_API_URL` empty
- Backend will serve frontend static files automatically

---

## Step 11: Monitoring & Maintenance

### 11.1 Check Logs

**Railway:**
- Go to your project → Deployments → View Logs

**Render:**
- Go to your service → Logs tab

**PM2 (VPS):**
```bash
pm2 logs svn-global-backend
pm2 monit
```

### 11.2 Restart Backend

**Railway/Render:**
- Automatic on code push

**PM2:**
```bash
pm2 restart svn-global-backend
```

### 11.3 Update Backend

```bash
git pull origin main
npm install
pm2 restart svn-global-backend
```

---

## Troubleshooting

### Issue: CORS Errors
**Solution:**
- Check `FRONTEND_URL` is set correctly in backend
- Verify frontend domain matches exactly
- Check browser console for CORS error details

### Issue: Session Not Persisting
**Solution:**
- Verify `SESSION_SECRET` is set
- Check cookie settings (secure, sameSite)
- Ensure credentials: 'include' in fetch requests

### Issue: 404 on API Routes
**Solution:**
- Verify backend is running
- Check backend URL is correct
- Test health endpoint first

### Issue: Data Not Saving
**Solution:**
- Check file permissions on server
- Verify data folder exists
- Check server logs for errors

### Issue: Port Already in Use
**Solution:**
- Change PORT in .env
- Or kill process using port: `lsof -ti:5000 | xargs kill`

---

## Quick Checklist

- [ ] Backend deployed and accessible
- [ ] Environment variables set (PORT, NODE_ENV, FRONTEND_URL, SESSION_SECRET)
- [ ] Health endpoint working (`/api/health`)
- [ ] CORS configured correctly
- [ ] Frontend `VITE_API_URL` set (if different domain)
- [ ] Admin login tested
- [ ] Data persistence configured (database or file storage)
- [ ] HTTPS enabled (for production)
- [ ] Monitoring/logging set up

---

## Support

If you encounter issues:
1. Check backend logs
2. Check browser console
3. Test API endpoints directly
4. Verify environment variables
5. Check CORS configuration

---

## Next Steps

After backend is deployed:
1. Test admin panel login
2. Add/edit products via admin panel
3. Test test report management
4. Monitor logs for any errors
5. Set up automated backups for data

