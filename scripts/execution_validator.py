#!/usr/bin/env python3
"""
Execution Validation Script for n8n Career Automation System
Validates workflow execution and ensures all nodes are functioning correctly
"""

import os
import sys
import json
import logging
import requests
import subprocess
import time
from typing import Dict, List, Optional, Tuple
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ExecutionValidator:
    def __init__(self):
        self.n8n_base_url = os.getenv('N8N_BASE_URL', 'http://localhost:5678')
        self.webhook_base_url = os.getenv('WEBHOOK_URL', 'http://localhost:5678')
        self.api_key = os.getenv('N8N_API_KEY', '')
        self.validation_results = []
        
    def get_headers(self) -> Dict[str, str]:
        """Get headers for n8n API requests"""
        headers = {'Content-Type': 'application/json'}
        if self.api_key:
            headers['X-N8N-API-KEY'] = self.api_key
        return headers
    
    def validate_n8n_server(self) -> Dict[str, any]:
        """Validate that n8n server is running and accessible"""
        try:
            logger.info("Validating n8n server connection...")
            
            # Check if n8n server is running
            response = requests.get(f"{self.n8n_base_url}/healthz", timeout=10)
            
            if response.status_code == 200:
                logger.info("n8n server is running and healthy")
                return {
                    "status": "success",
                    "component": "n8n_server",
                    "message": "Server is running and healthy",
                    "response_time": response.elapsed.total_seconds()
                }
            else:
                return {
                    "status": "error",
                    "component": "n8n_server",
                    "message": f"Server returned status code: {response.status_code}"
                }
                
        except requests.exceptions.ConnectionError:
            return {
                "status": "error",
                "component": "n8n_server",
                "message": "Cannot connect to n8n server"
            }
        except Exception as e:
            return {
                "status": "error",
                "component": "n8n_server",
                "message": str(e)
            }
    
    def validate_workflows(self) -> Dict[str, any]:
        """Validate that workflows are loaded and active"""
        try:
            logger.info("Validating workflows...")
            
            # Get list of workflows
            response = requests.get(
                f"{self.n8n_base_url}/api/v1/workflows",
                headers=self.get_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                workflows = response.json()
                active_workflows = [w for w in workflows.get('data', []) if w.get('active', False)]
                
                return {
                    "status": "success",
                    "component": "workflows",
                    "message": f"Found {len(active_workflows)} active workflows out of {len(workflows.get('data', []))} total",
                    "total_workflows": len(workflows.get('data', [])),
                    "active_workflows": len(active_workflows),
                    "workflow_names": [w.get('name', 'Unnamed') for w in active_workflows]
                }
            else:
                return {
                    "status": "error",
                    "component": "workflows",
                    "message": f"Failed to fetch workflows: {response.status_code}"
                }
                
        except Exception as e:
            return {
                "status": "error",
                "component": "workflows",
                "message": str(e)
            }
    
    def validate_webhook_endpoints(self) -> Dict[str, any]:
        """Validate webhook endpoints are accessible"""
        try:
            logger.info("Validating webhook endpoints...")
            
            webhook_endpoints = [
                "test-workflow",
                "github-webhook",
                "gmail-webhook",
                "vpn-webhook"
            ]
            
            results = []
            
            for endpoint in webhook_endpoints:
                try:
                    url = f"{self.webhook_base_url}/webhook/{endpoint}"
                    response = requests.post(
                        url,
                        json={"test": True, "timestamp": datetime.now().isoformat()},
                        timeout=5
                    )
                    
                    results.append({
                        "endpoint": endpoint,
                        "status": "success" if response.status_code in [200, 201] else "error",
                        "status_code": response.status_code,
                        "response_time": response.elapsed.total_seconds()
                    })
                    
                except Exception as e:
                    results.append({
                        "endpoint": endpoint,
                        "status": "error",
                        "message": str(e)
                    })
            
            successful_endpoints = [r for r in results if r.get("status") == "success"]
            
            return {
                "status": "success" if len(successful_endpoints) > 0 else "error",
                "component": "webhooks",
                "message": f"{len(successful_endpoints)}/{len(webhook_endpoints)} webhook endpoints are working",
                "endpoint_results": results
            }
            
        except Exception as e:
            return {
                "status": "error",
                "component": "webhooks",
                "message": str(e)
            }
    
    def validate_external_services(self) -> Dict[str, any]:
        """Validate external service connections"""
        try:
            logger.info("Validating external services...")
            
            services = {
                "github": "https://api.github.com",
                "google_api": "https://www.googleapis.com",
                "gmail": "https://gmail.googleapis.com"
            }
            
            results = []
            
            for service_name, base_url in services.items():
                try:
                    response = requests.get(base_url, timeout=10)
                    
                    results.append({
                        "service": service_name,
                        "status": "success" if response.status_code < 400 else "error",
                        "status_code": response.status_code,
                        "response_time": response.elapsed.total_seconds()
                    })
                    
                except Exception as e:
                    results.append({
                        "service": service_name,
                        "status": "error",
                        "message": str(e)
                    })
            
            successful_services = [r for r in results if r.get("status") == "success"]
            
            return {
                "status": "success" if len(successful_services) > 0 else "error",
                "component": "external_services",
                "message": f"{len(successful_services)}/{len(services)} external services are accessible",
                "service_results": results
            }
            
        except Exception as e:
            return {
                "status": "error",
                "component": "external_services",
                "message": str(e)
            }
    
    def validate_scripts(self) -> Dict[str, any]:
        """Validate that automation scripts are working"""
        try:
            logger.info("Validating automation scripts...")
            
            scripts_dir = os.path.dirname(os.path.abspath(__file__))
            
            scripts = {
                "vpn_switcher": "vpn_switcher.py",
                "ai_content_generator": "ai_content_generator.py",
                "portfolio_generator": "portfolio_generator.py"
            }
            
            results = []
            
            for script_name, script_file in scripts.items():
                script_path = os.path.join(scripts_dir, script_file)
                
                if not os.path.exists(script_path):
                    results.append({
                        "script": script_name,
                        "status": "error",
                        "message": f"Script file not found: {script_path}"
                    })
                    continue
                
                try:
                    # Test script execution with --help or similar safe command
                    if script_name == "vpn_switcher":
                        cmd = [sys.executable, script_path, "status"]
                    elif script_name == "ai_content_generator":
                        cmd = [sys.executable, script_path, "check-models"]
                    elif script_name == "portfolio_generator":
                        # Test with minimal JSON
                        test_data = '{"name": "Test Project", "description": "Test"}'
                        cmd = [sys.executable, script_path, "readme", test_data]
                    
                    result = subprocess.run(
                        cmd,
                        capture_output=True,
                        text=True,
                        timeout=30
                    )
                    
                    results.append({
                        "script": script_name,
                        "status": "success" if result.returncode == 0 else "error",
                        "return_code": result.returncode,
                        "output_length": len(result.stdout) if result.stdout else 0
                    })
                    
                except subprocess.TimeoutExpired:
                    results.append({
                        "script": script_name,
                        "status": "error",
                        "message": "Script execution timeout"
                    })
                except Exception as e:
                    results.append({
                        "script": script_name,
                        "status": "error",
                        "message": str(e)
                    })
            
            successful_scripts = [r for r in results if r.get("status") == "success"]
            
            return {
                "status": "success" if len(successful_scripts) > 0 else "error",
                "component": "automation_scripts",
                "message": f"{len(successful_scripts)}/{len(scripts)} scripts are working",
                "script_results": results
            }
            
        except Exception as e:
            return {
                "status": "error",
                "component": "automation_scripts",
                "message": str(e)
            }
    
    def validate_database_connection(self) -> Dict[str, any]:
        """Validate database connection"""
        try:
            logger.info("Validating database connection...")
            
            # This would depend on your specific database setup
            # For now, we'll check if the database container is running
            
            try:
                # Check if PostgreSQL is accessible
                import psycopg2
                
                db_config = {
                    'host': os.getenv('DB_POSTGRESDB_HOST', 'localhost'),
                    'port': int(os.getenv('DB_POSTGRESDB_PORT', 5432)),
                    'database': os.getenv('DB_POSTGRESDB_DATABASE', 'n8n'),
                    'user': os.getenv('DB_POSTGRESDB_USER', 'n8n'),
                    'password': os.getenv('DB_POSTGRESDB_PASSWORD', '')
                }
                
                conn = psycopg2.connect(**db_config)
                cursor = conn.cursor()
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
                cursor.close()
                conn.close()
                
                return {
                    "status": "success",
                    "component": "database",
                    "message": "Database connection successful",
                    "database_version": version[0] if version else "Unknown"
                }
                
            except ImportError:
                return {
                    "status": "warning",
                    "component": "database",
                    "message": "psycopg2 not installed, cannot test PostgreSQL connection"
                }
            except Exception as e:
                return {
                    "status": "error",
                    "component": "database",
                    "message": f"Database connection failed: {str(e)}"
                }
                
        except Exception as e:
            return {
                "status": "error",
                "component": "database",
                "message": str(e)
            }
    
    def validate_email_configuration(self) -> Dict[str, any]:
        """Validate email configuration"""
        try:
            logger.info("Validating email configuration...")
            
            required_env_vars = [
                'N8N_SMTP_HOST',
                'N8N_SMTP_PORT',
                'N8N_SMTP_USER',
                'N8N_SMTP_PASS'
            ]
            
            missing_vars = [var for var in required_env_vars if not os.getenv(var)]
            
            if missing_vars:
                return {
                    "status": "warning",
                    "component": "email_config",
                    "message": f"Missing environment variables: {', '.join(missing_vars)}"
                }
            
            # Test SMTP connection
            import smtplib
            
            smtp_host = os.getenv('N8N_SMTP_HOST')
            smtp_port = int(os.getenv('N8N_SMTP_PORT', 587))
            smtp_user = os.getenv('N8N_SMTP_USER')
            smtp_pass = os.getenv('N8N_SMTP_PASS')
            
            try:
                server = smtplib.SMTP(smtp_host, smtp_port)
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.quit()
                
                return {
                    "status": "success",
                    "component": "email_config",
                    "message": "SMTP connection successful",
                    "smtp_host": smtp_host,
                    "smtp_port": smtp_port
                }
                
            except Exception as e:
                return {
                    "status": "error",
                    "component": "email_config",
                    "message": f"SMTP connection failed: {str(e)}"
                }
                
        except Exception as e:
            return {
                "status": "error",
                "component": "email_config",
                "message": str(e)
            }
    
    def run_comprehensive_validation(self) -> Dict[str, any]:
        """Run all validation checks"""
        try:
            logger.info("Starting comprehensive validation...")
            start_time = time.time()
            
            validations = [
                self.validate_n8n_server,
                self.validate_workflows,
                self.validate_webhook_endpoints,
                self.validate_external_services,
                self.validate_scripts,
                self.validate_database_connection,
                self.validate_email_configuration
            ]
            
            results = []
            for validation_func in validations:
                try:
                    result = validation_func()
                    results.append(result)
                except Exception as e:
                    results.append({
                        "status": "error",
                        "component": validation_func.__name__,
                        "message": f"Validation failed: {str(e)}"
                    })
            
            # Calculate summary statistics
            successful_checks = [r for r in results if r.get("status") == "success"]
            warning_checks = [r for r in results if r.get("status") == "warning"]
            failed_checks = [r for r in results if r.get("status") == "error"]
            
            overall_status = "success"
            if len(failed_checks) > 0:
                overall_status = "error"
            elif len(warning_checks) > 0:
                overall_status = "warning"
            
            execution_time = time.time() - start_time
            
            summary = {
                "status": overall_status,
                "timestamp": datetime.now().isoformat(),
                "execution_time": execution_time,
                "total_checks": len(results),
                "successful_checks": len(successful_checks),
                "warning_checks": len(warning_checks),
                "failed_checks": len(failed_checks),
                "success_rate": (len(successful_checks) / len(results)) * 100 if results else 0,
                "detailed_results": results
            }
            
            logger.info(f"Validation completed: {summary['success_rate']:.1f}% success rate")
            
            return summary
            
        except Exception as e:
            logger.error(f"Comprehensive validation failed: {str(e)}")
            return {
                "status": "error",
                "message": f"Validation failed: {str(e)}",
                "timestamp": datetime.now().isoformat()
            }
    
    def generate_validation_report(self, results: Dict[str, any]) -> str:
        """Generate a human-readable validation report"""
        
        report = f"""
# n8n Career Automation System - Validation Report

**Generated:** {results.get('timestamp', 'Unknown')}
**Execution Time:** {results.get('execution_time', 0):.2f} seconds
**Overall Status:** {results.get('status', 'Unknown').upper()}

## Summary
- **Total Checks:** {results.get('total_checks', 0)}
- **Successful:** {results.get('successful_checks', 0)} ✅
- **Warnings:** {results.get('warning_checks', 0)} ⚠️
- **Failed:** {results.get('failed_checks', 0)} ❌
- **Success Rate:** {results.get('success_rate', 0):.1f}%

## Detailed Results

"""
        
        for result in results.get('detailed_results', []):
            status_emoji = {
                'success': '✅',
                'warning': '⚠️',
                'error': '❌'
            }.get(result.get('status'), '❓')
            
            component = result.get('component', 'Unknown Component')
            message = result.get('message', 'No message')
            
            report += f"### {component} {status_emoji}\n"
            report += f"**Status:** {result.get('status', 'Unknown')}\n"
            report += f"**Message:** {message}\n"
            
            # Add additional details if available
            if 'response_time' in result:
                report += f"**Response Time:** {result['response_time']:.3f}s\n"
            
            if 'endpoint_results' in result:
                report += "**Endpoint Details:**\n"
                for endpoint in result['endpoint_results']:
                    status = endpoint.get('status', 'unknown')
                    endpoint_name = endpoint.get('endpoint', 'unknown')
                    report += f"  - {endpoint_name}: {status}\n"
            
            if 'service_results' in result:
                report += "**Service Details:**\n"
                for service in result['service_results']:
                    status = service.get('status', 'unknown')
                    service_name = service.get('service', 'unknown')
                    report += f"  - {service_name}: {status}\n"
            
            if 'script_results' in result:
                report += "**Script Details:**\n"
                for script in result['script_results']:
                    status = script.get('status', 'unknown')
                    script_name = script.get('script', 'unknown')
                    report += f"  - {script_name}: {status}\n"
            
            report += "\n"
        
        # Add recommendations
        if results.get('failed_checks', 0) > 0:
            report += """## Recommendations

Based on the validation results, please address the following issues:

"""
            for result in results.get('detailed_results', []):
                if result.get('status') == 'error':
                    component = result.get('component', 'Unknown')
                    message = result.get('message', 'No details available')
                    report += f"- **{component}:** {message}\n"
        
        report += """
## Next Steps

1. **Address Failed Checks:** Review and fix any components marked as failed
2. **Monitor Warnings:** Investigate warning conditions that may affect functionality
3. **Regular Validation:** Run this validation regularly to ensure system health
4. **Performance Optimization:** Consider optimizing components with slow response times

---
*Generated by n8n Career Automation System Validation Tool*
"""
        
        return report

def main():
    """Main function for command-line usage"""
    validator = ExecutionValidator()
    
    if len(sys.argv) < 2:
        print("Usage: python execution_validator.py <command>")
        print("Commands:")
        print("  validate-all      - Run comprehensive validation")
        print("  validate-server   - Validate n8n server only")
        print("  validate-scripts  - Validate scripts only")
        print("  validate-webhooks - Validate webhooks only")
        print("  generate-report   - Generate validation report")
        return
    
    command = sys.argv[1].lower()
    
    if command == 'validate-all':
        results = validator.run_comprehensive_validation()
        print(json.dumps(results, indent=2))
        
    elif command == 'validate-server':
        result = validator.validate_n8n_server()
        print(json.dumps(result, indent=2))
        
    elif command == 'validate-scripts':
        result = validator.validate_scripts()
        print(json.dumps(result, indent=2))
        
    elif command == 'validate-webhooks':
        result = validator.validate_webhook_endpoints()
        print(json.dumps(result, indent=2))
        
    elif command == 'generate-report':
        results = validator.run_comprehensive_validation()
        report = validator.generate_validation_report(results)
        print(report)
        
        # Also save to file
        report_file = f"validation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"\nReport saved to: {report_file}")
    
    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main()