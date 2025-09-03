#!/bin/bash

echo "🚀 Redeploying GreenCart Backend..."

# Navigate to server directory
cd server

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Deploy to production
echo "📦 Deploying to production..."
vercel --prod

echo "✅ Backend deployment complete!"
echo ""
echo "🔍 Test the deployment:"
echo "Health check: https://greencartbackend-jignesh-naiks-projects.vercel.app/api/health"
echo "CORS test: https://greencartbackend-jignesh-naiks-projects.vercel.app/api/cors-test"
echo ""
echo "⚠️  Don't forget to set environment variables in Vercel dashboard!" 