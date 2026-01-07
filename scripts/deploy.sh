#!/bin/bash
set -e

APP_NAME="frontend"
APP_DIR="$HOME/website/frontend"
PORT=3000

echo "🚀 Starting deployment..."

cd $APP_DIR

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building application..."
npm run build

echo "♻️ Restarting application with PM2..."
pm2 restart $APP_NAME || pm2 start "npm run preview -- --port $PORT" --name $APP_NAME

pm2 save

echo "✅ Deployment completed successfully!"
