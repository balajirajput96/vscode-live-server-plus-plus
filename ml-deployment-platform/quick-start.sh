#!/bin/bash

# 🚀 ML Deployment Platform - Quick Start Script
# Automated setup and launch

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║    🚀 ML Deployment Platform - Quick Start 🚀        ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check Python
echo -e "${CYAN}Checking Python installation...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.11+${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo -e "${GREEN}✅ Python ${PYTHON_VERSION} found${NC}\n"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo -e "${CYAN}Creating virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}\n"
fi

# Activate virtual environment
echo -e "${CYAN}Activating virtual environment...${NC}"
source venv/bin/activate
echo -e "${GREEN}✅ Virtual environment activated${NC}\n"

# Install dependencies
echo -e "${CYAN}Installing dependencies...${NC}"
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✅ Dependencies installed${NC}\n"

# Create example models
echo -e "${CYAN}Creating example models...${NC}"
cd models
python create_example_model.py
cd ..
echo -e "${GREEN}✅ Example models created${NC}\n"

# Create necessary directories
mkdir -p predictions

echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║              🎉 Setup Complete! 🎉                    ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}What's Next:${NC}\n"
echo "1. Start the API server (in a new terminal):"
echo -e "   ${CYAN}cd backend && uvicorn main:app --reload${NC}\n"

echo "2. Open the dashboard:"
echo -e "   ${CYAN}Open frontend/index.html in your browser${NC}\n"

echo "3. Upload a model:"
echo "   - iris_classifier.pkl (4 features)"
echo "   - wine_classifier.pkl (13 features)"
echo "   - cancer_classifier.pkl (30 features)"
echo ""

echo -e "${BLUE}API Endpoints:${NC}"
echo "  - Health Check: http://localhost:8000/health"
echo "  - API Docs: http://localhost:8000/docs"
echo "  - Models List: http://localhost:8000/models"
echo ""

echo -e "${PURPLE}Press Enter to start the API server...${NC}"
read

echo -e "${GREEN}Starting FastAPI server...${NC}\n"
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
