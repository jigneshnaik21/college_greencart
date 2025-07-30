# 🔧 Backend Deployment Troubleshooting Guide

## Common Backend Deployment Issues

### 1. Environment Variables Missing
**Symptoms**: Build fails or server crashes
**Solution**: 
- Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables
- Add all required variables:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greencart?retryWrites=true&w=majority
  JWT_SECRET=your_super_secure_jwt_secret_here
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  NODE_ENV=production
  CORS_ORIGINS=https://your-frontend-domain.vercel.app
  ```

### 2. MongoDB Connection Issues
**Symptoms**: Server starts but database operations fail
**Solution**:
- Verify MongoDB Atlas connection string
- Check Network Access (should be `0.0.0.0/0`)
- Ensure database user has proper permissions
- Test connection string locally

### 3. Build Errors
**Symptoms**: Deployment fails during build
**Solution**:
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify Node.js version (>=18.0.0)
- Check for syntax errors in server.js

### 4. CORS Issues
**Symptoms**: Frontend can't connect to backend
**Solution**:
- Update CORS_ORIGINS with your frontend URL
- Redeploy backend after updating environment variables
- Check that frontend URL is correct

### 5. Function Timeout
**Symptoms**: Requests timeout or fail
**Solution**:
- Check vercel.json maxDuration setting
- Optimize database queries
- Add proper error handling

## Debugging Steps

### Step 1: Check Build Logs
1. Go to Vercel Dashboard
2. Click on your backend project
3. Go to "Deployments" tab
4. Click on the failed deployment
5. Check "Build Logs" for errors

### Step 2: Test Health Endpoint
After deployment, test:
```
https://your-backend-url.vercel.app/api/health
```
Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "env": "production",
  "dbConnected": true,
  "services": {
    "mongodb": true,
    "cloudinary": true
  }
}
```

### Step 3: Check Environment Variables
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify all variables are set correctly
3. Check for typos in variable names
4. Ensure values are not empty

### Step 4: Test Database Connection
If health check fails, check:
- MongoDB connection string format
- Network access settings
- Database user permissions
- Cluster status

## Quick Fixes

### Fix 1: Update vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Fix 2: Check package.json
Ensure these scripts exist:
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'Build step completed'",
    "vercel-build": "echo 'Vercel build completed'"
  }
}
```

### Fix 3: Verify Dependencies
All required dependencies should be in package.json:
- express
- mongoose
- cors
- dotenv
- jsonwebtoken
- bcryptjs
- cloudinary
- cookie-parser
- multer

## Success Indicators

✅ **Backend Health Check Works**
- Visit: `https://your-backend-url.vercel.app/api/health`
- Should return success response

✅ **Database Connection Works**
- Health check shows `"dbConnected": true`
- No database errors in logs

✅ **CORS Configuration Correct**
- Frontend can make requests to backend
- No CORS errors in browser console

✅ **Environment Variables Set**
- All required variables configured
- No undefined variable errors

## Need Help?

1. **Check Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Review Build Logs**: Look for specific error messages
3. **Test Locally**: Run `npm start` to test server locally
4. **Check Dependencies**: Ensure all packages are installed

## Common Error Messages

- **"Module not found"**: Check import paths and dependencies
- **"Connection refused"**: Check MongoDB connection string
- **"CORS error"**: Update CORS_ORIGINS environment variable
- **"Function timeout"**: Increase maxDuration in vercel.json
- **"Environment variable not found"**: Add missing environment variables 