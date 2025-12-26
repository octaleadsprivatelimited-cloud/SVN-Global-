# Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Step-by-Step Setup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Start the Backend Server

In the `backend` directory:

```bash
npm start
```

The backend will run on `http://localhost:5000`

**Note**: For development with auto-reload, use:
```bash
npm run dev
```

### 4. Start the Frontend Development Server

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Testing the Contact Form

1. Navigate to `http://localhost:3000/contact`
2. Fill out the contact form
3. Submit the form
4. Check the backend console for the form submission data

**Note**: The contact form currently logs submissions to the console. To enable email sending, see the README.md for email configuration.

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Backend

The backend is ready to deploy as-is. Make sure to configure environment variables for production.

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

- **Frontend**: Update the port in `frontend/vite.config.js`
- **Backend**: Set `PORT` environment variable or update `backend/server.js`

### CORS Errors

If you see CORS errors, make sure:
1. Backend is running on port 5000
2. Frontend proxy is configured in `vite.config.js`
3. Backend CORS is enabled in `backend/server.js`

### Module Not Found Errors

Make sure you've installed all dependencies:
```bash
cd frontend && npm install
cd ../backend && npm install
```

## Next Steps

- Update contact information in `frontend/src/pages/Contact.jsx`
- Update WhatsApp number in `frontend/src/pages/Contact.jsx`
- Configure email sending in `backend/server.js`
- Add real product images
- Customize branding colors if needed

