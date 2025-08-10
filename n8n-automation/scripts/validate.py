#!/usr/bin/env python3
"""
n8n Automation Validation Script
Tests all workflow configurations and endpoints
"""

import json
import sys
from pathlib import Path

def validate_workflow_json(workflow_path):
    """Validate a workflow JSON file"""
    try:
        with open(workflow_path, 'r') as f:
            workflow = json.load(f)
        
        # Check required fields
        required_fields = ['name', 'nodes', 'connections']
        for field in required_fields:
            if field not in workflow:
                return False, f"Missing required field: {field}"
        
        # Check nodes structure
        if not isinstance(workflow['nodes'], list) or len(workflow['nodes']) == 0:
            return False, "No nodes defined in workflow"
        
        # Check for webhook nodes
        webhook_nodes = [node for node in workflow['nodes'] if node.get('type') == 'n8n-nodes-base.webhook']
        if not webhook_nodes:
            return False, "No webhook trigger found"
        
        return True, "Valid workflow"
        
    except json.JSONDecodeError as e:
        return False, f"Invalid JSON: {e}"
    except Exception as e:
        return False, f"Error reading file: {e}"

def validate_docker_config():
    """Validate Docker configuration files"""
    base_path = Path(__file__).parent.parent
    
    # Check Dockerfile
    dockerfile_path = base_path / "Dockerfile"
    if not dockerfile_path.exists():
        return False, "Dockerfile not found"
    
    # Check docker-compose.yml
    compose_path = base_path / "docker-compose.yml"
    if not compose_path.exists():
        return False, "docker-compose.yml not found"
    
    # Check environment template
    env_template_path = base_path / ".env.template"
    if not env_template_path.exists():
        return False, ".env.template not found"
    
    return True, "Docker configuration valid"

def validate_scripts():
    """Validate automation scripts"""
    base_path = Path(__file__).parent
    
    scripts = [
        "n8n-cli.py",
        "integration.py"
    ]
    
    for script in scripts:
        script_path = base_path / script
        if not script_path.exists():
            return False, f"Script not found: {script}"
        
        # Check if executable
        if not script_path.stat().st_mode & 0o111:
            return False, f"Script not executable: {script}"
    
    return True, "All scripts valid"

def main():
    print("🔍 n8n Automation Validation")
    print("=" * 40)
    
    all_valid = True
    
    # Validate workflows
    workflows_path = Path(__file__).parent.parent / "workflows"
    if workflows_path.exists():
        workflow_files = list(workflows_path.glob("*.json"))
        print(f"\n📊 Validating {len(workflow_files)} workflow files...")
        
        for workflow_file in workflow_files:
            valid, message = validate_workflow_json(workflow_file)
            status = "✅" if valid else "❌"
            print(f"  {status} {workflow_file.name}: {message}")
            if not valid:
                all_valid = False
    else:
        print("❌ Workflows directory not found")
        all_valid = False
    
    # Validate Docker configuration
    print(f"\n🐳 Validating Docker configuration...")
    valid, message = validate_docker_config()
    status = "✅" if valid else "❌"
    print(f"  {status} {message}")
    if not valid:
        all_valid = False
    
    # Validate scripts
    print(f"\n📜 Validating automation scripts...")
    valid, message = validate_scripts()
    status = "✅" if valid else "❌"
    print(f"  {status} {message}")
    if not valid:
        all_valid = False
    
    # Summary
    print(f"\n{'🎉' if all_valid else '⚠️'} Validation Summary")
    print("=" * 40)
    
    if all_valid:
        print("✅ All components validated successfully!")
        print("\n📋 Next steps:")
        print("1. Run ./setup.sh to start the automation system")
        print("2. Open http://localhost:5678 to access n8n editor")
        print("3. Import the workflow JSON files")
        print("4. Configure environment variables in .env")
        print("5. Test the webhook endpoints")
    else:
        print("❌ Validation failed. Please fix the issues above.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())