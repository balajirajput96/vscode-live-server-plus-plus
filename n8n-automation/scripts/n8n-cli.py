#!/usr/bin/env python3
"""
n8n CLI Management Script
Provides command-line interface for managing n8n workflows and automation
"""

import os
import sys
import json
import requests
import argparse
from typing import Dict, List, Optional
import subprocess

class N8nCLI:
    def __init__(self, base_url: str = "http://localhost:5678"):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        
    def health_check(self) -> bool:
        """Check if n8n is running and accessible"""
        try:
            response = self.session.get(f"{self.base_url}/healthz", timeout=5)
            return response.status_code == 200
        except requests.RequestException:
            return False
    
    def list_workflows(self) -> List[Dict]:
        """List all workflows"""
        try:
            response = self.session.get(f"{self.base_url}/api/v1/workflows")
            response.raise_for_status()
            return response.json().get('data', [])
        except requests.RequestException as e:
            print(f"Error fetching workflows: {e}")
            return []
    
    def get_workflow(self, workflow_id: str) -> Optional[Dict]:
        """Get specific workflow by ID"""
        try:
            response = self.session.get(f"{self.base_url}/api/v1/workflows/{workflow_id}")
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching workflow {workflow_id}: {e}")
            return None
    
    def activate_workflow(self, workflow_id: str) -> bool:
        """Activate a workflow"""
        try:
            response = self.session.post(f"{self.base_url}/api/v1/workflows/{workflow_id}/activate")
            response.raise_for_status()
            return True
        except requests.RequestException as e:
            print(f"Error activating workflow {workflow_id}: {e}")
            return False
    
    def deactivate_workflow(self, workflow_id: str) -> bool:
        """Deactivate a workflow"""
        try:
            response = self.session.post(f"{self.base_url}/api/v1/workflows/{workflow_id}/deactivate")
            response.raise_for_status()
            return True
        except requests.RequestException as e:
            print(f"Error deactivating workflow {workflow_id}: {e}")
            return False
    
    def trigger_webhook(self, webhook_path: str, data: Dict = None) -> Optional[Dict]:
        """Trigger a webhook"""
        try:
            url = f"{self.base_url}/webhook/{webhook_path}"
            response = self.session.post(url, json=data or {})
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error triggering webhook {webhook_path}: {e}")
            return None
    
    def list_executions(self, workflow_id: str = None, limit: int = 10) -> List[Dict]:
        """List workflow executions"""
        try:
            params = {'limit': limit}
            if workflow_id:
                params['workflowId'] = workflow_id
            
            response = self.session.get(f"{self.base_url}/api/v1/executions", params=params)
            response.raise_for_status()
            return response.json().get('data', [])
        except requests.RequestException as e:
            print(f"Error fetching executions: {e}")
            return []

def cmd_status(args):
    """Check n8n status"""
    cli = N8nCLI(args.url)
    
    if cli.health_check():
        print("✅ n8n is running and accessible")
        
        # Show Docker container status
        try:
            result = subprocess.run(['docker-compose', 'ps'], 
                                  capture_output=True, text=True, cwd='.')
            if result.returncode == 0:
                print("\n📦 Docker Services Status:")
                print(result.stdout)
        except Exception as e:
            print(f"Could not get Docker status: {e}")
    else:
        print("❌ n8n is not accessible")
        print(f"Check if n8n is running at {args.url}")

def cmd_workflows(args):
    """List all workflows"""
    cli = N8nCLI(args.url)
    
    if not cli.health_check():
        print("❌ n8n is not accessible")
        return
    
    workflows = cli.list_workflows()
    
    if not workflows:
        print("No workflows found")
        return
    
    print(f"📋 Found {len(workflows)} workflows:")
    print("-" * 80)
    
    for workflow in workflows:
        status = "🟢 Active" if workflow.get('active') else "🔴 Inactive"
        print(f"ID: {workflow.get('id', 'N/A')}")
        print(f"Name: {workflow.get('name', 'Unnamed')}")
        print(f"Status: {status}")
        print(f"Created: {workflow.get('createdAt', 'N/A')}")
        print(f"Updated: {workflow.get('updatedAt', 'N/A')}")
        print("-" * 40)

def cmd_activate(args):
    """Activate a workflow"""
    cli = N8nCLI(args.url)
    
    if not cli.health_check():
        print("❌ n8n is not accessible")
        return
    
    if cli.activate_workflow(args.workflow_id):
        print(f"✅ Workflow {args.workflow_id} activated successfully")
    else:
        print(f"❌ Failed to activate workflow {args.workflow_id}")

def cmd_deactivate(args):
    """Deactivate a workflow"""
    cli = N8nCLI(args.url)
    
    if not cli.health_check():
        print("❌ n8n is not accessible")
        return
    
    if cli.deactivate_workflow(args.workflow_id):
        print(f"✅ Workflow {args.workflow_id} deactivated successfully")
    else:
        print(f"❌ Failed to deactivate workflow {args.workflow_id}")

def cmd_webhook(args):
    """Trigger a webhook"""
    cli = N8nCLI(args.url)
    
    if not cli.health_check():
        print("❌ n8n is not accessible")
        return
    
    # Parse data if provided
    data = {}
    if args.data:
        try:
            data = json.loads(args.data)
        except json.JSONDecodeError:
            print("❌ Invalid JSON data provided")
            return
    
    result = cli.trigger_webhook(args.path, data)
    
    if result:
        print("✅ Webhook triggered successfully")
        print(f"Response: {json.dumps(result, indent=2)}")
    else:
        print("❌ Failed to trigger webhook")

def cmd_executions(args):
    """List workflow executions"""
    cli = N8nCLI(args.url)
    
    if not cli.health_check():
        print("❌ n8n is not accessible")
        return
    
    executions = cli.list_executions(args.workflow_id, args.limit)
    
    if not executions:
        print("No executions found")
        return
    
    print(f"📊 Found {len(executions)} executions:")
    print("-" * 80)
    
    for execution in executions:
        status = execution.get('finished', False)
        status_icon = "✅" if status else "⏳"
        
        print(f"ID: {execution.get('id', 'N/A')}")
        print(f"Workflow: {execution.get('workflowId', 'N/A')}")
        print(f"Status: {status_icon} {'Finished' if status else 'Running'}")
        print(f"Started: {execution.get('startedAt', 'N/A')}")
        if status:
            print(f"Finished: {execution.get('stoppedAt', 'N/A')}")
        print("-" * 40)

def cmd_career_automation(args):
    """Trigger career automation workflows"""
    cli = N8nCLI(args.url)
    
    if not cli.health_check():
        print("❌ n8n is not accessible")
        return
    
    # Career automation specific data
    automation_data = {
        "action": args.action,
        "target": args.target,
        "timestamp": __import__('datetime').datetime.now().isoformat()
    }
    
    # Add specific data based on action
    if args.action == "linkedin_post":
        automation_data.update({
            "project_name": getattr(args, 'project_name', ''),
            "skills": getattr(args, 'skills', ''),
            "description": getattr(args, 'description', '')
        })
    elif args.action == "job_search":
        automation_data.update({
            "keywords": getattr(args, 'keywords', ''),
            "companies": getattr(args, 'companies', ''),
            "location": getattr(args, 'location', '')
        })
    
    result = cli.trigger_webhook("career-automation", automation_data)
    
    if result:
        print("✅ Career automation triggered successfully")
        print(f"Action: {args.action}")
        print(f"Target: {args.target}")
        print(f"Response: {json.dumps(result, indent=2)}")
    else:
        print("❌ Failed to trigger career automation")

def main():
    parser = argparse.ArgumentParser(description="n8n CLI Management Tool")
    parser.add_argument("--url", default="http://localhost:5678", 
                       help="n8n base URL (default: http://localhost:5678)")
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Status command
    status_parser = subparsers.add_parser("status", help="Check n8n status")
    
    # Workflows command
    workflows_parser = subparsers.add_parser("workflows", help="List all workflows")
    
    # Activate command
    activate_parser = subparsers.add_parser("activate", help="Activate a workflow")
    activate_parser.add_argument("workflow_id", help="Workflow ID to activate")
    
    # Deactivate command
    deactivate_parser = subparsers.add_parser("deactivate", help="Deactivate a workflow")
    deactivate_parser.add_argument("workflow_id", help="Workflow ID to deactivate")
    
    # Webhook command
    webhook_parser = subparsers.add_parser("webhook", help="Trigger a webhook")
    webhook_parser.add_argument("path", help="Webhook path")
    webhook_parser.add_argument("--data", help="JSON data to send")
    
    # Executions command
    executions_parser = subparsers.add_parser("executions", help="List workflow executions")
    executions_parser.add_argument("--workflow-id", help="Filter by workflow ID")
    executions_parser.add_argument("--limit", type=int, default=10, help="Limit number of results")
    
    # Career automation command
    career_parser = subparsers.add_parser("career", help="Trigger career automation")
    career_parser.add_argument("action", choices=["linkedin_post", "job_search", "portfolio_update", "github_sync"],
                              help="Automation action to trigger")
    career_parser.add_argument("target", help="Target for the action")
    career_parser.add_argument("--project-name", help="Project name (for linkedin_post)")
    career_parser.add_argument("--skills", help="Skills to highlight")
    career_parser.add_argument("--description", help="Description text")
    career_parser.add_argument("--keywords", help="Search keywords (for job_search)")
    career_parser.add_argument("--companies", help="Target companies")
    career_parser.add_argument("--location", help="Job location")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Execute command
    command_map = {
        "status": cmd_status,
        "workflows": cmd_workflows,
        "activate": cmd_activate,
        "deactivate": cmd_deactivate,
        "webhook": cmd_webhook,
        "executions": cmd_executions,
        "career": cmd_career_automation
    }
    
    if args.command in command_map:
        command_map[args.command](args)
    else:
        print(f"Unknown command: {args.command}")

if __name__ == "__main__":
    main()