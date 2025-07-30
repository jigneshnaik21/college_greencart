# 🚀 Quick Deployment Reference

## Prerequisites (5 minutes)
- [ ] MongoDB Atlas account & cluster
- [ ] Cloudinary account & credentials  
- [ ] Vercel account (GitHub login)

## Backend Deployment

### 1. Create Backend Project
- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- New Project → Import `jigneshnaik21/greencart`
- **Root Directory**: `server`
- **Framework**: Node.js

### 2. Environment Variables
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greencart?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

### 3. Deploy & Note URL
- Click "Deploy"
- **Backend URL**: `https://greencart-backend.vercel.app`

## Frontend Deployment

### 1. Create Frontend Project
- New Project → Import `jigneshnaik21/greencart` (again)
- **Root Directory**: `client`
- **Framework**: Vite

### 2. Environment Variables
```
VITE_API_URL=https://your-backend-url.vercel.app
```

### 3. Deploy & Note URL
- Click "Deploy"
- **Frontend URL**: `https://greencart-frontend.vercel.app`

## Update CORS
- Go to backend project settings
- Update `CORS_ORIGINS` with frontend URL
- Redeploy backend

## Test Deployment
- Backend: `https://backend-url/api/health`
- Frontend: Visit URL and test features

## Troubleshooting
- **CORS Errors**: Update CORS_ORIGINS
- **DB Issues**: Check MongoDB connection
- **Build Errors**: Check Vercel logs
- **Env Issues**: Redeploy after adding variables

## Success Indicators
- ✅ Backend health check works
- ✅ Frontend loads without errors
- ✅ User registration works
- ✅ Cart functionality works
- ✅ Orders can be placed

---
**Repository**: https://github.com/jigneshnaik21/greencart
**Full Guide**: See `VERCEL_DEPLOYMENT_GUIDE.md` 