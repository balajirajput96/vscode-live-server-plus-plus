#!/usr/bin/env python3
"""
AI Career Automation Dashboard - Simple Server
A lightweight HTTP server to run the career automation dashboard locally.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler with CORS support and better error handling."""
    
    def end_headers(self):
        """Add CORS headers to allow cross-origin requests."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Custom logging to show only important messages."""
        if "GET /" in format % args or "POST /" in format % args:
            print(f"📡 {format % args}")

def get_port():
    """Get available port starting from 8000."""
    port = 8000
    while port < 8010:
        try:
            with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
                return port
        except OSError:
            port += 1
    return 8000

def main():
    """Main function to start the server."""
    print("🚀 AI Career Automation Dashboard Server")
    print("=" * 50)
    
    # Change to the directory containing this script
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Check if index.html exists
    if not Path("index.html").exists():
        print("❌ Error: index.html not found in the current directory!")
        print("Please make sure you're running this script from the career-automation-system folder.")
        sys.exit(1)
    
    # Get available port
    port = get_port()
    
    # Create server
    with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
        print(f"✅ Server started successfully!")
        print(f"🌐 Dashboard URL: http://localhost:{port}")
        print(f"📁 Serving files from: {os.getcwd()}")
        print("\n🎯 Available Features:")
        print("   • Portfolio Builder")
        print("   • Social Media Generator")
        print("   • Resume Optimizer")
        print("   • Job Tracker")
        print("   • AI Prompt Library")
        print("   • Analytics Dashboard")
        print("\n💡 Tips:")
        print("   • Press Ctrl+C to stop the server")
        print("   • Keep this terminal open while using the dashboard")
        print("   • The dashboard will automatically open in your browser")
        
        # Open browser automatically
        try:
            webbrowser.open(f"http://localhost:{port}")
            print(f"\n🌐 Opening dashboard in your default browser...")
        except Exception as e:
            print(f"\n⚠️  Could not open browser automatically: {e}")
            print(f"   Please manually open: http://localhost:{port}")
        
        print("\n" + "=" * 50)
        print("🚀 Your AI Career Automation journey starts now!")
        print("=" * 50)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped by user (Ctrl+C)")
            print("👋 Thank you for using AI Career Automation Dashboard!")
            sys.exit(0)

if __name__ == "__main__":
    main()