# 🚀 Quick Deployment Guide

## Prerequisites (5 minutes)

1. **MongoDB Atlas** (Free):
   - Go to [mongodb.com](https://mongodb.com)
   - Create free account
   - Create a cluster
   - Get connection string

2. **Cloudinary** (Free):
   - Go to [cloudinary.com](https://cloudinary.com)
   - Create free account
   - Get credentials from dashboard

3. **Vercel Account**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

## Step 1: Prepare Environment Variables

### Backend (.env file in server directory)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greencart?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

### Frontend (.env.local file in client directory)
```env
VITE_API_URL=https://your-backend-domain.vercel.app
```

## Step 2: Deploy Backend

```bash
cd server
vercel --prod
```

## Step 3: Deploy Frontend

```bash
cd client
vercel --prod
```

## Step 4: Configure Environment Variables

1. Go to Vercel Dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add all backend environment variables
5. Repeat for frontend project

## Step 5: Test

1. Visit your frontend URL
2. Register a new account
3. Test adding items to cart
4. Test checkout process

## Troubleshooting

- **CORS Errors**: Update CORS_ORIGINS in backend environment variables
- **Database Issues**: Check MongoDB connection string
- **Build Errors**: Check Vercel deployment logs

## Need Help?

See `DEPLOYMENT.md` for detailed instructions or run `./deploy.sh` for automated deployment. 