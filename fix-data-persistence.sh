#!/bin/bash

# JFK Medical Portal - Data Persistence Fix Script
# This script sets up Firebase emulators with proper data persistence

echo "🔧 JFK Medical Portal - Data Persistence Fix"
echo "=========================================="

# Create firebase-data directory for persistence
echo "📁 Creating firebase-data directory..."
mkdir -p firebase-data

# Build functions
echo "🔨 Building Firebase functions..."
cd functions
npm run build
cd ..

# Start emulators with data persistence
echo "🚀 Starting Firebase emulators with data persistence..."
echo "   - Auth: http://localhost:9099"
echo "   - Firestore: http://localhost:8080"
echo "   - Functions: http://localhost:5001"
echo "   - Storage: http://localhost:9199"
echo "   - UI: http://localhost:4000"
echo ""
echo "📊 Data will be saved to ./firebase-data/"
echo "🔄 Emulators will persist data between restarts"
echo ""
echo "Press Ctrl+C to stop emulators and save data"
echo ""

firebase emulators:start --import=./firebase-data --export-on-exit=./firebase-data
