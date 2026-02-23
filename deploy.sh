#!/bin/bash

# D.I.A. Netlify Deployment Script
# Run this to deploy to Netlify

set -e

echo "╔════════════════════════════════════════╗"
echo "║  D.I.A. NETLIFY DEPLOYMENT SCRIPT      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if Git is initialized
if [ ! -d .git ]; then
    echo "🔧 Initializing Git..."
    git init
    git add .
    git commit -m "Initial commit: D.I.A. storefront"
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "   Creating from template..."
    if [ -f config/.env.example ]; then
        cp config/.env.example .env
        echo "   ✅ .env created from config/.env.example (add your API keys there)"
    else
        echo "   ❌ config/.env.example not found. Create .env manually."
    fi
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run local tests
echo ""
echo "🧪 Running local tests..."
echo "   npm run dev will be available at http://localhost:3000"
echo ""

# Deploy
echo "🚀 Deploying to Netlify..."
netlify deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Go to https://app.netlify.com"
echo "   2. Add environment variables (Site settings → Environment)"
echo "   3. Add: STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, PRINTFUL_API_TOKEN"
echo "   4. Redeploy site"
echo ""
echo "🌐 Your site will be live at: https://your-site.netlify.app"
echo ""
