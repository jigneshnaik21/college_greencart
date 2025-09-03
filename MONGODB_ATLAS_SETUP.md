# MongoDB Atlas Setup for Vercel Deployment

## Step 1: Whitelist Vercel IP Addresses

Vercel uses dynamic IP addresses. You need to whitelist all IP addresses (0.0.0.0/0) in MongoDB Atlas:

1. Go to your MongoDB Atlas dashboard
2. Click on "Network Access" in the left sidebar
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (this adds 0.0.0.0/0)
5. Click "Confirm"

**Note**: This allows access from anywhere. For production, you might want to be more restrictive, but for Vercel deployment, this is necessary.

## Step 2: Verify Database User

1. Go to "Database Access" in MongoDB Atlas
2. Ensure your database user has the correct permissions
3. The user should have "Read and write to any database" permissions

## Step 3: Check Connection String

Your connection string should look like this:
```
mongodb+srv://username:password@cluster.mongodb.net/greencart?retryWrites=true&w=majority
```

Make sure:
- Username and password are correct
- Database name is "greencart"
- The cluster name is correct

## Step 4: Environment Variables in Vercel

Set these environment variables in your Vercel backend deployment:

1. **MONGODB_URI**: Your complete MongoDB connection string
2. **JWT_SECRET**: A strong secret for JWT tokens
3. **CLOUDINARY_CLOUD_NAME**: Your Cloudinary cloud name
4. **CLOUDINARY_API_KEY**: Your Cloudinary API key
5. **CLOUDINARY_API_SECRET**: Your Cloudinary API secret
6. **CORS_ORIGINS**: `http://localhost:5173,http://localhost:3000,https://greencartfrontend-zeta.vercel.app`

## Step 5: Test the Connection

After setting up the IP whitelist and environment variables:

1. Redeploy your backend
2. Test the health endpoint: `https://greencartbackend-jignesh-naiks-projects.vercel.app/api/health`
3. Check the response for database connection status

## Troubleshooting

If you still get connection errors:
1. Double-check your MongoDB URI in Vercel environment variables
2. Ensure the database user has correct permissions
3. Try connecting from a different location to test the whitelist
4. Check Vercel function logs for detailed error messages 