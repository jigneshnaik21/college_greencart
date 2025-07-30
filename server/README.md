# GreenCart Server

## Environment Setup

1. Create a `.env` file in the server directory
2. Add the following environment variables to your `.env` file:

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Alternative Cloudinary URL format
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
```

3. Replace the placeholder values with your actual credentials
4. Make sure `.env` is added to your `.gitignore` file

## Security Best Practices

1. Never commit the `.env` file to version control
2. Use different credentials for development and production
3. Regularly rotate your API keys and secrets
4. Store production credentials securely in your deployment platform

## Running the Server

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```
