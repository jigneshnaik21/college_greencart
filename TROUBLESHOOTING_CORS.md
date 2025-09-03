# CORS Troubleshooting Guide

## Current Issue

- Backend returning 404 for `/api/cors-test`
- CORS errors still occurring
- Backend needs to be redeployed with latest changes

## Step-by-Step Solution

### 1. Redeploy Backend

```bash
# Make the script executable
chmod +x redeploy-backend.sh

# Run the deployment script
./redeploy-backend.sh
```

### 2. Set Environment Variables in Vercel

Go to your Vercel backend project dashboard and set these environment variables:

#### Required Variables:

- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A strong secret for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `CORS_ORIGINS` - `http://localhost:5173,http://localhost:3000,https://greencartfrontend-zeta.vercel.app,https://greencartfrontend-git-clean-main-jignesh-naiks-projects.vercel.app`

### 3. Test Backend Deployment

After redeployment, test these endpoints:

```bash
# Health check
curl https://greencartbackend-jignesh-naiks-projects.vercel.app/api/health

# CORS test
curl https://greencartbackend-jignesh-naiks-projects.vercel.app/api/cors-test
```

### 4. Test Frontend

Visit: https://greencartfrontend-git-clean-main-jignesh-naiks-projects.vercel.app

Check browser console for CORS errors.

## Alternative: Manual Deployment

If the script doesn't work, deploy manually:

```bash
cd server
vercel --prod
```

## Debugging Steps

### Check if Backend is Deployed

```bash
curl -I https://greencartbackend-jignesh-naiks-projects.vercel.app/api/health
```

### Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your backend project
3. Go to Functions tab
4. Check for any errors

### Test CORS Headers

```bash
curl -H "Origin: https://greencartfrontend-git-clean-main-jignesh-naiks-projects.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://greencartbackend-jignesh-naiks-projects.vercel.app/api/health
```

## Common Issues

### 1. Environment Variables Not Set

- Check Vercel dashboard
- Redeploy after setting variables

### 2. MongoDB Connection Issues

- Whitelist IP 0.0.0.0/0 in MongoDB Atlas
- Verify connection string

### 3. CORS Still Blocking

- Check if backend is actually redeployed
- Verify environment variables are set
- Check Vercel function logs

## Expected Results

After successful deployment:

1. **Health endpoint** should return:

```json
{
  "status": "ok",
  "dbConnected": true,
  "cors": {
    "origins": "your-cors-origins",
    "requestOrigin": "https://greencartfrontend-git-clean-main-jignesh-naiks-projects.vercel.app"
  }
}
```

2. **CORS test endpoint** should return:

```json
{
  "message": "CORS is working!",
  "requestOrigin": "https://greencartfrontend-git-clean-main-jignesh-naiks-projects.vercel.app"
}
```

3. **Frontend** should load without CORS errors in console
