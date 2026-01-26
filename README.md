# SVN Global - Corporate Website

A modern, professional static corporate website for SVN Global, a company specializing in Mica Covers Imports & Exports.

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express (for contact form only)
- **Icons**: Lucide React

## Project Structure

```
svn global/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components (Header, Footer)
│   │   ├── pages/         # Page components (Home, About, Products, Exports, Contact)
│   │   ├── App.jsx        # Main app component with routing
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   └── package.json
├── backend/           # Express backend for contact form
│   ├── server.js      # Express server
│   └── package.json
└── README.md
```

## Features

- ✅ Fully responsive design
- ✅ SEO optimized
- ✅ Smooth animations with Framer Motion
- ✅ Contact form with Express backend
- ✅ WhatsApp integration
- ✅ Professional corporate branding
- ✅ Fast and optimized performance

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Frontend Dependencies**

```bash
cd frontend
npm install
```

2. **Install Backend Dependencies**

```bash
cd backend
npm install
```

### Running the Application

1. **Start the Backend Server**

```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### Building for Production

**Frontend:**

```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

**Backend:**

The backend is ready to deploy. Make sure to set up environment variables (see `.env.example` in the backend folder).

## Environment Variables

Create a `.env` file in the `backend` directory:

```
# Firebase Configuration (required)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
# OR use individual variables:
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

# Server Configuration
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-secret-key-change-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (optional, for contact form)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=contact@svnglobal.com
```

**Note**: 
- Firebase configuration is required. See `backend/.env.example` for details.
- The contact form currently logs submissions to the console. To enable email sending, uncomment the nodemailer code in `backend/server.js` and configure your email credentials.

## Pages

1. **Home** - Hero section, key highlights, and CTA
2. **About Us** - Company profile, mission, vision, values, and global presence
3. **Products** - Mica covers product categories with descriptions
4. **Exports** - Countries served, certifications, and logistics information
5. **Contact** - Contact form, company information, and WhatsApp integration

## Branding

- **Primary Color**: Royal Blue (#003366)
- **Accent Color**: Metallic Gold (#C9A227)
- **Background**: White (#FFFFFF)
- **Light Background**: Light Grey (#E6E6E6)

## Deployment

### Frontend

The frontend can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Backend

The backend can be deployed to:
- Heroku
- AWS EC2
- DigitalOcean
- Railway
- Any Node.js hosting service

## Contact Form

The contact form sends data to the Express backend at `/api/contact`. The backend validates the data and can be configured to send emails using nodemailer.

## License

© SVN Global | All Rights Reserved

