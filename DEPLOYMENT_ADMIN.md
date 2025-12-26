# Admin Panel Deployment Guide

## Configuration for Production

### Frontend Configuration

1. **Set API URL (if frontend and backend are on different domains):**

   Create a `.env.production` file in the `frontend` directory:
   ```env
   VITE_API_URL=https://your-backend-domain.com
   ```

   **OR** set it in your hosting platform's environment variables:
   - Vercel: Add `VITE_API_URL` in project settings
   - Netlify: Add `VITE_API_URL` in site settings > Environment variables
   - Other platforms: Add as build-time environment variable

   **Important:** 
   - If frontend and backend are on the **same domain**, leave `VITE_API_URL` empty (uses relative URLs automatically)
   - If frontend and backend are on **different domains**, set `VITE_API_URL` to your backend URL
   - After setting the variable, **rebuild** the frontend: `npm run build`

2. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

### Backend Configuration

1. **Set Frontend URL in backend:**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   FRONTEND_URL=https://your-frontend-domain.com
   NODE_ENV=production
   SESSION_SECRET=your-secret-key-here
   ```

2. **Update CORS in `backend/server.js`:**

   The CORS is already configured to accept requests from:
   - `http://localhost:3003` (development)
   - `FRONTEND_URL` environment variable (production)
   - Or allow all origins in production (current setting)

### Deployment Scenarios

#### Scenario 1: Same Domain (Recommended)
- Frontend: `https://yourdomain.com`
- Backend: `https://yourdomain.com/api` (or subdomain)

**Configuration:**
- Frontend `.env`: Leave `VITE_API_URL` empty
- Backend will serve frontend static files automatically

#### Scenario 2: Different Domains
- Frontend: `https://yourdomain.com`
- Backend: `https://api.yourdomain.com`

**Configuration:**
- Frontend `.env`: `VITE_API_URL=https://api.yourdomain.com`
- Backend `.env`: `FRONTEND_URL=https://yourdomain.com`

### Session Configuration

The admin panel uses session-based authentication. For production:

1. **Set a strong session secret:**
   ```env
   SESSION_SECRET=your-very-secure-random-string-here
   ```

2. **For HTTPS, update cookie settings in `backend/server.js`:**
   ```javascript
   cookie: {
     secure: true,  // Only send cookies over HTTPS
     httpOnly: true,
     sameSite: 'none',  // Required for cross-origin requests
     maxAge: 24 * 60 * 60 * 1000
   }
   ```

### Testing After Deployment

1. **Test Admin Login:**
   - Navigate to: `https://yourdomain.com/admin`
   - Login with: `admin` / `admin123`

2. **Test API Connection:**
   - Check browser console for any CORS errors
   - Verify API calls are going to the correct URL

3. **Test Session Persistence:**
   - Login and refresh the page
   - Should remain logged in

### Troubleshooting

**Issue: CORS errors**
- Check `FRONTEND_URL` in backend `.env`
- Verify CORS origin includes your frontend domain

**Issue: Session not persisting**
- Check cookie settings (secure, sameSite)
- Verify credentials: 'include' in fetch requests
- Check browser console for cookie warnings

**Issue: API calls failing**
- Verify `VITE_API_URL` is set correctly
- Check backend server is running
- Verify API endpoints are accessible

