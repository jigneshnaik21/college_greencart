# Vercel Environment Setup Guide

## Backend Environment Variables

You need to set these environment variables in your Vercel backend deployment:

### Required Variables:
1. **MONGODB_URI** - Your MongoDB connection string
2. **JWT_SECRET** - A strong secret for JWT tokens
3. **CLOUDINARY_CLOUD_NAME** - Your Cloudinary cloud name
4. **CLOUDINARY_API_KEY** - Your Cloudinary API key
5. **CLOUDINARY_API_SECRET** - Your Cloudinary API secret
6. **CORS_ORIGINS** - Comma-separated list of allowed origins

### Example CORS_ORIGINS value:
```
http://localhost:5173,http://localhost:3000,https://greencartfrontend-zeta.vercel.app,https://greencartfrontend-git-clean-main-jignesh-naiks-projects.vercel.app
```

## Frontend Environment Variables

For the frontend, you can either:

### Option 1: Set VITE_API_URL in Vercel
Set `VITE_API_URL=https://greencartbackend-jignesh-naiks-projects.vercel.app` in your frontend Vercel environment variables.

### Option 2: Use the hardcoded URL (already implemented)
The code has been updated to use the backend URL directly.

## How to Set Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its corresponding value
5. Redeploy your application

## Testing the Fix:

After setting up the environment variables and redeploying:

1. Check if the backend health endpoint works: `https://greencartbackend-jignesh-naiks-projects.vercel.app/api/health`
2. Test the frontend: `https://greencartfrontend-zeta.vercel.app`
3. Check browser console for CORS errors

## Troubleshooting:

If you still see CORS errors:
1. Verify all environment variables are set correctly
2. Check that the backend URL in the frontend matches your actual backend URL
3. Ensure the CORS_ORIGINS includes your frontend URL
4. Redeploy both frontend and backend after making changes 