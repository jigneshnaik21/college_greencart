# 🚀 Vercel Deployment Guide - Step by Step

## Prerequisites (5 minutes setup)

### 1. MongoDB Atlas Setup

1. Go to [mongodb.com](https://mongodb.com) and create a free account
2. Create a new cluster (free tier is fine)
3. Set up database access:
   - Go to Database Access → Add New Database User
   - Create username and password
4. Set up network access:
   - Go to Network Access → Add IP Address
   - Add `0.0.0.0/0` (allows all IPs)
5. Get connection string:
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password

### 2. Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. Get credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 3. Vercel Account

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub

## Step 1: Deploy Backend to Vercel

### 1.1 Go to Vercel Dashboard

- Visit [vercel.com/dashboard](https://vercel.com/dashboard)
- Click "New Project"

### 1.2 Import Repository

- Click "Import Git Repository"
- Select your `jigneshnaik21/greencart` repository
- Click "Import"

### 1.3 Configure Backend Project

- **Framework Preset**: Node.js
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Output Directory**: `.` (leave empty)
- **Install Command**: `npm install`

### 1.4 Set Environment Variables

Click "Environment Variables" and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greencart?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

**Important**: Replace all placeholder values with your actual credentials!

### 1.5 Deploy Backend

- Click "Deploy"
- Wait for deployment to complete
- **Note the backend URL** (e.g., `https://greencart-backend.vercel.app`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Create New Project

- Go back to Vercel Dashboard
- Click "New Project"
- Import the same repository again

### 2.2 Configure Frontend Project

- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.3 Set Environment Variables

Add this environment variable:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

Replace `your-backend-url.vercel.app` with your actual backend URL from Step 1.

### 2.4 Deploy Frontend

- Click "Deploy"
- Wait for deployment to complete
- **Note the frontend URL** (e.g., `https://greencart-frontend.vercel.app`)

## Step 3: Update Backend CORS

### 3.1 Update CORS Origins

- Go to your backend project in Vercel
- Go to Settings → Environment Variables
- Update `CORS_ORIGINS` with your frontend URL:
  ```
  CORS_ORIGINS=https://your-frontend-domain.vercel.app
  ```
- Redeploy the backend

## Step 4: Test Your Deployment

### 4.1 Test Backend

Visit: `https://your-backend-url.vercel.app/api/health`
Should return: `{"status":"ok"}`

### 4.2 Test Frontend

1. Visit your frontend URL
2. Test user registration
3. Test adding items to cart
4. Test checkout process

## Troubleshooting

### Common Issues:

#### 1. CORS Errors

- Check that `CORS_ORIGINS` includes your frontend URL
- Redeploy backend after updating environment variables

#### 2. Database Connection Issues

- Verify MongoDB connection string
- Check network access settings
- Ensure database user has proper permissions

#### 3. Environment Variables Not Working

- Redeploy after adding environment variables
- Check variable names (case-sensitive)
- Verify in Vercel dashboard

#### 4. Build Errors

- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

## Alternative: Automated Deployment

You can also use the automated deployment script:

```bash
# Make sure you're in the project directory
cd /Users/soham/Downloads/greencart

# Run the deployment script
./deploy.sh
```

## Final Configuration

### 1. Custom Domains (Optional)

- Go to your Vercel project settings
- Add custom domain if needed

### 2. Monitoring

- Enable Vercel Analytics
- Set up error tracking
- Monitor performance metrics

### 3. Security

- Use strong JWT secrets
- Keep environment variables secure
- Regularly update dependencies

## Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] CORS issues resolved
- [ ] User registration working
- [ ] Cart functionality working
- [ ] Order processing working
- [ ] All features tested

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB and Cloudinary configurations

Your GreenCart e-commerce application should now be live and fully functional! 🎉
