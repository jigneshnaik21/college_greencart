#!/bin/bash

echo "🚀 Starting GreenCart Local Development Environment..."

# Kill any existing processes
pkill -f "node.*server.js" || true
pkill -f "npm.*dev" || true

# Start backend
echo "📦 Starting Backend Server..."
cd server
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -s http://localhost:4000/api/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:4000"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID
    exit 1
fi

# Start frontend
echo "🎨 Starting Frontend..."
cd ../client

# Create local environment file
echo "VITE_API_URL=http://localhost:4000" > .env.local

# Start frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 GreenCart is running locally!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
