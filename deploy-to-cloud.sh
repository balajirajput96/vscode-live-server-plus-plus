#!/bin/bash

# 🚀 One-Click Cloud Deployment Script
# Deploy to Railway, Render, or other cloud platforms

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Banner
clear
echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════╗
║                                                        ║
║        🚀 One-Click Cloud Deployment                  ║
║                                                        ║
║        Complete Deploy Karo - Automated               ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""

print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ️${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Main menu
echo -e "${BLUE}Choose your deployment platform:${NC}"
echo ""
echo "  1) 🚂 Railway (Fastest - 30 seconds)"
echo "  2) 🎨 Render (Free tier available)"
echo "  3) ⚡ Vercel (Static content only)"
echo "  4) 🌐 Netlify (Static content only)"
echo "  5) 🐳 Local Docker (Current system)"
echo "  6) 📖 Show deployment guide"
echo "  0) Exit"
echo ""

read -p "Enter your choice (0-6): " choice

case $choice in
    1)
        echo ""
        print_info "Deploying to Railway..."
        echo ""
        
        # Check if Railway CLI is installed
        if ! command -v railway &> /dev/null; then
            print_warning "Railway CLI not found. Installing..."
            echo ""
            echo "Run: npm i -g @railway/cli"
            echo ""
            read -p "Press Enter after installing Railway CLI..."
        fi
        
        print_status "Railway CLI detected"
        echo ""
        print_info "Step 1: Login to Railway"
        railway login
        
        echo ""
        print_info "Step 2: Initialize project"
        railway init
        
        echo ""
        print_info "Step 3: Link project (if existing) or create new"
        railway link
        
        echo ""
        print_info "Step 4: Deploy to Railway"
        railway up
        
        echo ""
        print_status "Deployment initiated!"
        echo ""
        print_info "To check status: railway status"
        print_info "To view logs: railway logs"
        print_info "To open dashboard: railway open"
        ;;
        
    2)
        echo ""
        print_info "Deploying to Render..."
        echo ""
        
        print_status "render.yaml configuration found!"
        echo ""
        echo "To deploy to Render:"
        echo ""
        echo "Option A - One-Click Deploy:"
        echo "  1. Push this code to GitHub"
        echo "  2. Visit: https://render.com"
        echo "  3. Click 'New' → 'Blueprint'"
        echo "  4. Connect your GitHub repository"
        echo "  5. Render will auto-detect render.yaml"
        echo ""
        echo "Option B - Deploy Button:"
        echo "  Add to your README.md:"
        echo '  [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)]'
        echo '  (https://render.com/deploy?repo=YOUR_GITHUB_REPO_URL)'
        echo ""
        print_info "render.yaml is already configured for n8n + static web!"
        ;;
        
    3)
        echo ""
        print_info "Deploying to Vercel (Static Content Only)..."
        echo ""
        
        if ! command -v vercel &> /dev/null; then
            print_warning "Vercel CLI not found."
            echo ""
            echo "Install: npm i -g vercel"
            echo ""
        else
            print_status "Vercel CLI detected"
            echo ""
            print_info "Deploying static content..."
            vercel --prod
        fi
        ;;
        
    4)
        echo ""
        print_info "Deploying to Netlify (Static Content Only)..."
        echo ""
        
        if ! command -v netlify &> /dev/null; then
            print_warning "Netlify CLI not found."
            echo ""
            echo "Install: npm i -g netlify-cli"
            echo ""
        else
            print_status "Netlify CLI detected"
            echo ""
            print_info "Deploying static content..."
            netlify deploy --prod
        fi
        ;;
        
    5)
        echo ""
        print_info "Starting local Docker deployment..."
        echo ""
        ./deploy-complete.sh
        ;;
        
    6)
        echo ""
        print_info "Opening deployment guide..."
        echo ""
        cat << 'GUIDE'
╔════════════════════════════════════════════════════════════════╗
║                  📖 CLOUD DEPLOYMENT GUIDE                     ║
╚════════════════════════════════════════════════════════════════╝

🚂 RAILWAY (Recommended for n8n)
═══════════════════════════════════════════════════════════════
✓ Fastest deployment (30 seconds)
✓ Automatic SSL
✓ Free $5/month credit
✓ Perfect for n8n automation

Commands:
  npm i -g @railway/cli
  railway login
  railway init
  railway up

More: https://railway.app


🎨 RENDER (Great Free Tier)
═══════════════════════════════════════════════════════════════
✓ Free tier available
✓ Automatic SSL
✓ Auto-deploy from GitHub
✓ render.yaml pre-configured

Steps:
  1. Push code to GitHub
  2. Go to https://render.com
  3. Connect GitHub repo
  4. Deploy automatically

More: https://render.com


⚡ VERCEL (Static Only)
═══════════════════════════════════════════════════════════════
✓ Perfect for static websites
✓ GitHub Pages alternative
✓ Instant global CDN
✓ Free for personal projects

Commands:
  npm i -g vercel
  vercel --prod

More: https://vercel.com


🌐 NETLIFY (Static Only)
═══════════════════════════════════════════════════════════════
✓ Easy static hosting
✓ Drag & drop deploy
✓ Continuous deployment
✓ Free tier

Commands:
  npm i -g netlify-cli
  netlify deploy --prod

More: https://netlify.com


🐳 LOCAL DOCKER
═══════════════════════════════════════════════════════════════
✓ Full control
✓ No cost
✓ All features
✓ Pre-configured

Commands:
  ./deploy-complete.sh

More: See DEPLOYMENT.md

╔════════════════════════════════════════════════════════════════╗
║  For detailed guides, see: CLOUD-DEPLOYMENT.md                 ║
╚════════════════════════════════════════════════════════════════╝
GUIDE
        ;;
        
    0)
        echo ""
        print_info "Exiting..."
        exit 0
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ Deployment Process Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
