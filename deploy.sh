#!/bin/bash

# GreenCart Deployment Script
# This script helps deploy both frontend and backend to Vercel

echo "🚀 Starting GreenCart Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

# Function to deploy backend
deploy_backend() {
    echo "📦 Deploying Backend..."
    cd server
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        echo "⚠️  Warning: .env file not found in server directory"
        echo "Please create a .env file with your environment variables"
        echo "See server/env.example for reference"
        read -p "Continue anyway? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Deploy backend
    vercel --prod --yes
    
    # Get the deployment URL
    BACKEND_URL=$(vercel ls --json | jq -r '.projects[] | select(.name | contains("server")) | .url' | head -1)
    
    if [ -z "$BACKEND_URL" ]; then
        echo "❌ Could not get backend URL. Please check deployment manually."
        exit 1
    fi
    
    echo "✅ Backend deployed to: $BACKEND_URL"
    cd ..
}

# Function to deploy frontend
deploy_frontend() {
    echo "🎨 Deploying Frontend..."
    cd client
    
    # Update .env.local with backend URL if provided
    if [ ! -z "$BACKEND_URL" ]; then
        echo "Updating frontend environment with backend URL: $BACKEND_URL"
        echo "VITE_API_URL=$BACKEND_URL" > .env.local
    fi
    
    # Deploy frontend
    vercel --prod --yes
    
    # Get the deployment URL
    FRONTEND_URL=$(vercel ls --json | jq -r '.projects[] | select(.name | contains("client")) | .url' | head -1)
    
    if [ -z "$FRONTEND_URL" ]; then
        echo "❌ Could not get frontend URL. Please check deployment manually."
        exit 1
    fi
    
    echo "✅ Frontend deployed to: $FRONTEND_URL"
    cd ..
}

# Function to setup environment variables
setup_env_vars() {
    echo "🔧 Setting up environment variables..."
    
    # Backend environment variables
    echo "Please set the following environment variables in your Vercel dashboard:"
    echo ""
    echo "Backend Environment Variables:"
    echo "- MONGODB_URI"
    echo "- JWT_SECRET"
    echo "- CLOUDINARY_CLOUD_NAME"
    echo "- CLOUDINARY_API_KEY"
    echo "- CLOUDINARY_API_SECRET"
    echo "- CORS_ORIGINS"
    echo ""
    echo "Frontend Environment Variables:"
    echo "- VITE_API_URL"
    echo ""
    echo "You can set these in the Vercel dashboard under Project Settings → Environment Variables"
}

# Main deployment flow
echo "Choose deployment option:"
echo "1) Deploy Backend Only"
echo "2) Deploy Frontend Only"
echo "3) Deploy Both (Backend First)"
echo "4) Setup Environment Variables Guide"
echo "5) Exit"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        deploy_backend
        ;;
    2)
        deploy_frontend
        ;;
    3)
        deploy_backend
        deploy_frontend
        ;;
    4)
        setup_env_vars
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Test your deployment"
echo "3. Configure custom domains if needed"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md" 