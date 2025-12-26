# Admin Panel Setup Guide

## Backend Server Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Verify server is running:**
   - You should see: `Server is running on port 5000`
   - Test: Open http://localhost:5000/api/health in browser

## Admin Login

1. **Access Admin Panel:**
   - URL: http://localhost:3003/admin

2. **Default Credentials:**
   - Username: `admin`
   - Password: `admin123`

## Troubleshooting Connection Errors

If you see "Connection error" when logging in:

1. **Check if backend server is running:**
   - Make sure you see "Server is running on port 5000" in the terminal
   - Test: http://localhost:5000/api/health should return JSON

2. **Check port conflicts:**
   - Make sure port 5000 is not used by another application
   - You can change the port in `backend/.env` file: `PORT=5000`

3. **Check CORS settings:**
   - Backend is configured to accept requests from http://localhost:3003
   - If your frontend runs on a different port, update `backend/server.js` CORS origin

4. **Restart both servers:**
   - Stop backend server (Ctrl+C)
   - Restart backend: `npm start`
   - Restart frontend: `npm run dev`

## Admin Panel Features

- **Product Management:** Add, edit, delete products
- **Test Report Management:** Add, edit, delete test reports
- **Data Storage:** All data is stored in `backend/data/` as JSON files

## Security Note

⚠️ **Important:** Change the default password in production!
- Edit `backend/data/admin.json` and hash a new password using bcrypt

