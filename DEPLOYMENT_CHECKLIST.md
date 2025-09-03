# Deployment Checklist

## Backend Environment Variables (Vercel)

Make sure these are set in your Vercel backend project:

### Required Variables:
- [ ] `MONGODB_URI` - Your MongoDB Atlas connection string
- [ ] `JWT_SECRET` - A strong secret for JWT tokens
- [ ] `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Your Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- [ ] `CORS_ORIGINS` - `http://localhost:5173,http://localhost:3000,https://greencartfrontend-zeta.vercel.app,https://greencartfrontend-git-clean-main-jignesh-naiks-projects.vercel.app`

## MongoDB Atlas Setup

- [ ] Whitelist IP addresses: Go to Network Access → Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)
- [ ] Verify database user has "Read and write to any database" permissions
- [ ] Test connection string locally

## Testing Steps

After deployment:

1. **Test Backend Health:**
   ```
   https://greencartbackend-jignesh-naiks-projects.vercel.app/api/health
   ```

2. **Test CORS:**
   ```
   https://greencartbackend-jignesh-naiks-projects.vercel.app/api/cors-test
   ```

3. **Test Frontend:**
   ```
   https://greencartfrontend-git-clean-main-jignesh-naiks-projects.vercel.app
   ```

4. **Check Browser Console:**
   - No CORS errors
   - API calls working
   - Products loading

## Troubleshooting

If CORS errors persist:
1. Check Vercel function logs for errors
2. Verify environment variables are set correctly
3. Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0
4. Redeploy both frontend and backend after changes
