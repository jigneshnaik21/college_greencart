# 🚀 Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Setup

- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created and configured
- [ ] MongoDB connection string obtained
- [ ] Cloudinary account created
- [ ] Cloudinary credentials obtained
- [ ] Vercel account created

### ✅ Backend Configuration

- [ ] `server/.env` file created with production values
- [ ] MongoDB URI configured correctly
- [ ] JWT secret set (strong password)
- [ ] Cloudinary credentials configured
- [ ] CORS origins set to frontend URL
- [ ] NODE_ENV set to production

### ✅ Frontend Configuration

- [ ] `client/.env.local` file created
- [ ] VITE_API_URL set to backend URL (after backend deployment)
- [ ] All environment variables configured

### ✅ Code Quality

- [ ] Cart functionality working locally
- [ ] User authentication working
- [ ] Product listing working
- [ ] Image uploads working
- [ ] No console errors
- [ ] All features tested

## Deployment Steps

### Step 1: Deploy Backend

```bash
cd server
vercel --prod
```

### Step 2: Configure Backend Environment Variables

1. Go to Vercel Dashboard
2. Select backend project
3. Go to Settings → Environment Variables
4. Add all variables from `server/.env`

### Step 3: Deploy Frontend

```bash
cd client
vercel --prod
```

### Step 4: Configure Frontend Environment Variables

1. Go to Vercel Dashboard
2. Select frontend project
3. Go to Settings → Environment Variables
4. Add `VITE_API_URL` with backend URL

## Post-Deployment Testing

### ✅ Backend Tests

- [ ] Health check endpoint working
- [ ] User registration working
- [ ] User login working
- [ ] Product listing working
- [ ] Cart operations working
- [ ] Image uploads working

### ✅ Frontend Tests

- [ ] Homepage loads correctly
- [ ] User registration form works
- [ ] User login form works
- [ ] Product browsing works
- [ ] Cart functionality works
- [ ] Checkout process works

### ✅ Integration Tests

- [ ] Frontend can communicate with backend
- [ ] CORS issues resolved
- [ ] Authentication flow works
- [ ] Cart persistence works
- [ ] Image uploads work

## Troubleshooting Common Issues

### ❌ CORS Errors

- Check CORS_ORIGINS environment variable
- Ensure frontend URL is included
- Redeploy backend after changes

### ❌ Database Connection Issues

- Verify MongoDB connection string
- Check network access settings
- Ensure database user has proper permissions

### ❌ Environment Variables Not Working

- Redeploy after adding variables
- Check variable names (case-sensitive)
- Verify in Vercel dashboard

### ❌ Build Errors

- Check Vercel build logs
- Ensure all dependencies in package.json
- Verify Node.js version compatibility

## Performance Optimization

### ✅ Backend Optimization

- [ ] Database indexes configured
- [ ] Image compression enabled
- [ ] Caching implemented (if needed)
- [ ] Error handling improved

### ✅ Frontend Optimization

- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Bundle size optimized
- [ ] Loading states added

## Security Checklist

### ✅ Backend Security

- [ ] JWT secret is strong
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Rate limiting considered

### ✅ Frontend Security

- [ ] API keys not exposed
- [ ] HTTPS enforced
- [ ] XSS protection enabled
- [ ] CSRF protection implemented

## Monitoring Setup

### ✅ Vercel Analytics

- [ ] Analytics enabled
- [ ] Performance monitoring active
- [ ] Error tracking configured

### ✅ Database Monitoring

- [ ] MongoDB Atlas monitoring enabled
- [ ] Connection pool configured
- [ ] Backup strategy in place

## Final Steps

### ✅ Documentation

- [ ] API documentation updated
- [ ] Deployment guide completed
- [ ] Troubleshooting guide created

### ✅ Maintenance Plan

- [ ] Regular backup schedule
- [ ] Update strategy defined
- [ ] Monitoring alerts configured

---

## 🎉 Deployment Complete!

Your GreenCart application is now live!

**Frontend URL**: https://your-frontend.vercel.app
**Backend URL**: https://your-backend.vercel.app

### Next Steps:

1. Set up custom domain (optional)
2. Configure monitoring and alerts
3. Set up regular backups
4. Plan for scaling

### Support:

- Check Vercel documentation
- Review deployment logs
- Test all features thoroughly
- Monitor performance metrics
