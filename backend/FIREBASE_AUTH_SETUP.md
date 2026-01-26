# Firebase Authentication Setup Guide

This guide explains how to set up Firebase Authentication for admin access.

## Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** in the left sidebar
4. Click **Get Started**
5. Enable **Email/Password** sign-in method:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 2: Create Admin User

1. In Firebase Console, go to **Authentication** → **Users**
2. Click **Add user**
3. Enter admin email and password
4. Click **Add user**

**Note:** You can also create users programmatically or let them sign up (if you enable sign-up).

## Step 3: Set Custom Claims (Optional but Recommended)

To mark admin users, you can set custom claims using Firebase Admin SDK:

```javascript
// Run this script once to set admin claim
const admin = require('firebase-admin');
admin.auth().setCustomUserClaims(userId, { admin: true });
```

Or use Firebase Console → Authentication → Users → Select user → Custom claims

## Step 4: Configure Firestore Security Rules

Copy the contents of `firestore.rules` to Firebase Console:
1. Go to **Firestore Database** → **Rules**
2. Paste the rules from `firestore.rules`
3. Click **Publish**

## Step 5: Configure Storage Security Rules

Copy the contents of `storage.rules` to Firebase Console:
1. Go to **Storage** → **Rules**
2. Paste the rules from `storage.rules`
3. Click **Publish**

## Step 6: Test Admin Login

1. Start your frontend: `cd frontend && npm run dev`
2. Navigate to `/admin`
3. Login with the email/password you created
4. You should be redirected to the admin dashboard

## Troubleshooting

### "User not authenticated" error
- Make sure Firebase Auth is enabled
- Check that email/password sign-in is enabled
- Verify the user exists in Firebase Console

### "Unauthorized" error when accessing admin routes
- Check Firestore/Storage security rules are published
- Verify custom claims are set (if using them)
- Check backend is receiving the Authorization header

### Images not uploading
- Check Storage rules allow authenticated writes
- Verify Firebase Storage is enabled
- Check browser console for errors

## Security Best Practices

1. **Use Custom Claims**: Set `admin: true` custom claim for admin users
2. **Restrict Email Domains**: Update rules to only allow specific email domains
3. **Enable 2FA**: Consider enabling two-factor authentication for admin accounts
4. **Regular Audits**: Regularly review Firebase Console → Authentication → Users
5. **Monitor Usage**: Use Firebase Analytics to monitor admin access

## Environment Variables

No additional environment variables needed for Firebase Auth - it uses the same Firebase config as Firestore.
