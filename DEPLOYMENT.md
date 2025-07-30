# GreenCart Deployment Guide

This guide will help you deploy both the frontend and backend of GreenCart to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a MongoDB database at [mongodb.com](https://mongodb.com)
3. **Cloudinary Account**: Set up image hosting at [cloudinary.com](https://cloudinary.com)
4. **GitHub Account**: Your code should be in a GitHub repository

## Step 1: Prepare Your Environment Variables

### Backend Environment Variables (Server)

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Connection String (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greencart?retryWrites=true&w=majority

# JWT Secret (generate a strong secret)
JWT_SECRET=your_super_secure_jwt_secret_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=4000
NODE_ENV=production

# CORS Origins (your frontend URL)
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

### Frontend Environment Variables (Client)

Create a `.env.local` file in the `client` directory:

```env
# API Base URL (will be your backend URL after deployment)
VITE_API_URL=https://your-backend-domain.vercel.app
```

## Step 2: Deploy Backend to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Backend**:
   ```bash
   cd server
   vercel --prod
   ```

4. **Configure Environment Variables**:
   - Go to your Vercel dashboard
   - Select your backend project
   - Go to Settings → Environment Variables
   - Add all the environment variables from the server `.env` file

5. **Note the Backend URL**:
   - After deployment, note the URL (e.g., `https://greencart-backend.vercel.app`)

## Step 3: Deploy Frontend to Vercel

1. **Update Frontend Environment**:
   - Update the `VITE_API_URL` in your frontend `.env.local` with your backend URL

2. **Deploy Frontend**:
   ```bash
   cd client
   vercel --prod
   ```

3. **Configure Environment Variables** (if needed):
   - Go to your Vercel dashboard
   - Select your frontend project
   - Go to Settings → Environment Variables
   - Add `VITE_API_URL` with your backend URL

## Step 4: Alternative Deployment Method (GitHub Integration)

### Option A: Deploy via GitHub

1. **Push your code to GitHub**

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Backend Deployment**:
   - Set Root Directory to `server`
   - Set Build Command to `npm install`
   - Set Output Directory to `.`
   - Add environment variables

4. **Configure Frontend Deployment**:
   - Create another project
   - Set Root Directory to `client`
   - Set Build Command to `npm run build`
   - Set Output Directory to `dist`
   - Add environment variables

## Step 5: Database Setup

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**:
   - Go to [mongodb.com](https://mongodb.com)
   - Create a free account

2. **Create Cluster**:
   - Create a new cluster (free tier is fine)
   - Choose your preferred region

3. **Set Up Database Access**:
   - Go to Database Access
   - Create a new database user
   - Set username and password

4. **Set Up Network Access**:
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allows all IPs)

5. **Get Connection String**:
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Step 6: Cloudinary Setup

1. **Create Cloudinary Account**:
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for a free account

2. **Get Credentials**:
   - Go to Dashboard
   - Note your Cloud Name, API Key, and API Secret

## Step 7: Testing Your Deployment

1. **Test Backend**:
   - Visit `https://your-backend-url.vercel.app/api/health`
   - Should return a health status

2. **Test Frontend**:
   - Visit your frontend URL
   - Test user registration, login, and cart functionality

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Make sure `CORS_ORIGINS` includes your frontend URL
   - Update the environment variable in Vercel

2. **Database Connection Issues**:
   - Check your MongoDB connection string
   - Ensure network access is configured correctly

3. **Environment Variables Not Working**:
   - Redeploy after adding environment variables
   - Check variable names (case-sensitive)

4. **Build Errors**:
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are in package.json

### Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Redeploy
vercel --prod

# Remove deployment
vercel remove
```

## Final Notes

- **Security**: Use strong JWT secrets and keep them secure
- **Monitoring**: Use Vercel's built-in monitoring and analytics
- **Custom Domain**: You can add custom domains in Vercel settings
- **SSL**: Vercel provides automatic SSL certificates

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB and Cloudinary configurations 