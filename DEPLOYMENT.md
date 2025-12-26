# Deployment Guide

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy:
```bash
vercel
```

### Option 2: Netlify

1. Build the project:
```bash
cd frontend
npm run build
```

2. Drag and drop the `dist` folder to Netlify dashboard, or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 3: AWS S3 + CloudFront

1. Build the project:
```bash
cd frontend
npm run build
```

2. Upload `dist` folder contents to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain

## Backend Deployment

### Option 1: Heroku

1. Install Heroku CLI
2. Login to Heroku:
```bash
heroku login
```

3. Create a new app:
```bash
cd backend
heroku create svn-global-api
```

4. Set environment variables:
```bash
heroku config:set PORT=5000
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password
heroku config:set CONTACT_EMAIL=contact@svnglobal.com
```

5. Deploy:
```bash
git push heroku main
```

### Option 2: Railway

1. Connect your GitHub repository to Railway
2. Select the backend folder
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Option 3: DigitalOcean App Platform

1. Create a new app in DigitalOcean
2. Connect your repository
3. Select the backend folder
4. Configure environment variables
5. Deploy

## Environment Variables

Make sure to set these environment variables in your backend hosting platform:

- `PORT` - Server port (default: 5000)
- `EMAIL_USER` - Email address for sending contact form submissions
- `EMAIL_PASS` - Email app password
- `CONTACT_EMAIL` - Email address to receive contact form submissions

## CORS Configuration

If your frontend and backend are on different domains, update the CORS configuration in `backend/server.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}))
```

## Contact Form Email Setup

To enable email sending from the contact form:

1. Uncomment the nodemailer code in `backend/server.js`
2. For Gmail, use an App Password (not your regular password)
3. Update the `.env` file with your credentials

## Production Checklist

- [ ] Update contact information in Contact page
- [ ] Update WhatsApp number in Contact page
- [ ] Configure email sending in backend
- [ ] Set up SSL certificates
- [ ] Configure custom domain
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Test contact form submission
- [ ] Test all pages and navigation
- [ ] Optimize images (if adding real images)
- [ ] Set up error monitoring (Sentry, etc.)

