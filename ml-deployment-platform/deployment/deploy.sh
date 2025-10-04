#!/bin/bash

# 🚀 ML Deployment Platform - Automated Deployment Script
# Complete deployment automation for multiple platforms

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   🚀 ML Deployment Platform - Auto Deployment   🚀   ║"
echo "╔═══════════════════════════════════════════════════════╗"
echo -e "${NC}"

# Check if we're in the right directory
if [ ! -f "requirements.txt" ]; then
    echo -e "${RED}❌ Error: requirements.txt not found. Please run from ml-deployment-platform directory${NC}"
    exit 1
fi

echo -e "${CYAN}Select deployment platform:${NC}"
echo "1. Railway (Recommended - Fastest)"
echo "2. Render"
echo "3. Heroku"
echo "4. Docker (Local)"
echo "5. Python (Local Development)"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo -e "${GREEN}🚂 Deploying to Railway...${NC}"
        echo ""
        echo -e "${YELLOW}Prerequisites:${NC}"
        echo "  1. Railway CLI installed: npm i -g @railway/cli"
        echo "  2. Railway account created"
        echo ""
        read -p "Press Enter to continue with deployment..."
        
        # Check if Railway CLI is installed
        if ! command -v railway &> /dev/null; then
            echo -e "${YELLOW}Installing Railway CLI...${NC}"
            npm i -g @railway/cli
        fi
        
        echo -e "${GREEN}Starting Railway deployment...${NC}"
        railway login
        railway init
        railway up
        
        echo -e "${GREEN}✅ Deployment to Railway complete!${NC}"
        echo -e "${CYAN}Your app will be available at the Railway URL shown above${NC}"
        ;;
        
    2)
        echo -e "${GREEN}🎨 Deploying to Render...${NC}"
        echo ""
        echo -e "${YELLOW}Steps to deploy to Render:${NC}"
        echo "  1. Push code to GitHub"
        echo "  2. Go to https://render.com"
        echo "  3. Click 'New' -> 'Web Service'"
        echo "  4. Connect your GitHub repository"
        echo "  5. Render will automatically detect Dockerfile or render.yaml"
        echo "  6. Click 'Create Web Service'"
        echo ""
        echo -e "${CYAN}Configuration:${NC}"
        echo "  - Environment: Docker"
        echo "  - Build Command: (auto-detected)"
        echo "  - Start Command: uvicorn backend.main:app --host 0.0.0.0 --port \$PORT"
        echo ""
        echo -e "${GREEN}✅ Manual deployment instructions provided${NC}"
        ;;
        
    3)
        echo -e "${GREEN}🟣 Deploying to Heroku...${NC}"
        echo ""
        
        # Check if Heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            echo -e "${YELLOW}Please install Heroku CLI first:${NC}"
            echo "  curl https://cli-assets.heroku.com/install.sh | sh"
            exit 1
        fi
        
        echo -e "${GREEN}Starting Heroku deployment...${NC}"
        heroku login
        heroku create ml-deployment-$(date +%s)
        
        # Add Python buildpack
        heroku buildpacks:add heroku/python
        
        # Deploy
        git add .
        git commit -m "Deploy to Heroku" || true
        git push heroku main || git push heroku master
        
        echo -e "${GREEN}✅ Deployment to Heroku complete!${NC}"
        heroku open
        ;;
        
    4)
        echo -e "${GREEN}🐳 Deploying with Docker...${NC}"
        echo ""
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}Building Docker image...${NC}"
        docker build -t ml-deployment-platform .
        
        echo -e "${GREEN}Starting container...${NC}"
        docker run -d -p 8000:8000 --name ml-api ml-deployment-platform
        
        echo -e "${GREEN}✅ Docker deployment complete!${NC}"
        echo -e "${CYAN}API available at: http://localhost:8000${NC}"
        echo -e "${CYAN}Dashboard available at: frontend/index.html${NC}"
        echo ""
        echo -e "${YELLOW}Useful commands:${NC}"
        echo "  - View logs: docker logs ml-api"
        echo "  - Stop: docker stop ml-api"
        echo "  - Remove: docker rm ml-api"
        ;;
        
    5)
        echo -e "${GREEN}🐍 Starting local development server...${NC}"
        echo ""
        
        # Check if Python is installed
        if ! command -v python3 &> /dev/null; then
            echo -e "${RED}❌ Python 3 is not installed.${NC}"
            exit 1
        fi
        
        # Create virtual environment if it doesn't exist
        if [ ! -d "venv" ]; then
            echo -e "${GREEN}Creating virtual environment...${NC}"
            python3 -m venv venv
        fi
        
        # Activate virtual environment
        echo -e "${GREEN}Activating virtual environment...${NC}"
        source venv/bin/activate
        
        # Install dependencies
        echo -e "${GREEN}Installing dependencies...${NC}"
        pip install -r requirements.txt
        
        # Start server
        echo -e "${GREEN}Starting FastAPI server...${NC}"
        echo -e "${CYAN}API will be available at: http://localhost:8000${NC}"
        echo -e "${CYAN}API docs at: http://localhost:8000/docs${NC}"
        echo -e "${CYAN}Dashboard: Open frontend/index.html in browser${NC}"
        echo ""
        echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
        echo ""
        cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000
        ;;
        
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${PURPLE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║             🎉 Deployment Complete! 🎉               ║${NC}"
echo -e "${PURPLE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "  1. Open the dashboard (frontend/index.html)"
echo "  2. Upload your ML models"
echo "  3. Start making predictions!"
echo "  4. Check API documentation at /docs endpoint"
echo ""
