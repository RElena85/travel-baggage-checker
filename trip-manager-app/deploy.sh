#!/bin/bash

echo "============================================"
echo "   Trip Manager - GitHub Pages Deploy"
echo "============================================"
echo

echo "[1/4] Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies! Deployment cancelled."
    exit 1
fi

echo
echo "[2/4] Running tests..."
npm run test:coverage

if [ $? -ne 0 ]; then
    echo "❌ Tests failed! Deployment cancelled."
    exit 1
fi

echo
echo "[3/4] Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Deployment cancelled."
    exit 1
fi

echo
echo "[4/4] Deploying to GitHub Pages..."
npm run deploy

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo
echo "✅ Successfully deployed to GitHub Pages!"
echo "🌐 Your app will be available at: https://relena85.github.io/travel-baggage-checker"
echo