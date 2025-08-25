#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
n8n Workflow Quick Start Setup
बालाजी के लिए one-click setup script
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def setup_environment():
    """Set up the environment for n8n workflow"""
    print("🚀 Setting up n8n workflow environment...")
    
    # Check prerequisites
    required_tools = ['docker', 'docker-compose', 'python3', 'curl']
    missing_tools = []
    
    for tool in required_tools:
        if not shutil.which(tool):
            missing_tools.append(tool)
    
    if missing_tools:
        print(f"❌ Missing required tools: {', '.join(missing_tools)}")
        print("Please install them before proceeding.")
        sys.exit(1)
    
    print("✅ All required tools are available")
    
    # Create .env from example if it doesn't exist
    if not Path('.env').exists():
        if Path('.env.example').exists():
            shutil.copy('.env.example', '.env')
            print("✅ Created .env file from example")
            print("⚠️ Please edit .env file with your actual credentials")
        else:
            print("❌ .env.example file not found")
            sys.exit(1)
    
    # Install Python dependencies
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True, capture_output=True)
        print("✅ Python dependencies installed")
    except subprocess.CalledProcessError:
        print("⚠️ Some Python dependencies may have failed to install")
    
    # Create necessary directories
    directories = ['workflows', 'credentials', 'models', 'scripts', 'monitoring']
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
    print("✅ Created necessary directories")
    
    print("\n🎉 Environment setup complete!")
    print("\nNext steps:")
    print("1. Edit .env file with your credentials")
    print("2. Run: npm run n8n:start")
    print("3. Run: npm run n8n:test")
    print("4. Import workflow from workflows/balaji-automation-workflow.json")

if __name__ == "__main__":
    setup_environment()