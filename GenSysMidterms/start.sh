#!/bin/bash

# Color Picker Application Startup Script
# This script starts both the backend and frontend servers

echo "🚀 Starting Color Picker Application..."
echo ""

# Check if we're in the right directory
if [ ! -d "server" ]; then
    echo "❌ Error: Please run this script from the GenSysMidterms directory"
    exit 1
fi

# Start backend server in background
echo "📡 Starting backend server on port 3000..."
cd server
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend server in background
echo "🌐 Starting frontend server on port 8080..."
python3 -m http.server 8080 &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are running!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 Open your browser to: http://localhost:8080"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Keep script running
wait
