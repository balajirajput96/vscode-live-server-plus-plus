#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
n8n Workflow Setup Verification Script
बालाजी के लिए comprehensive system verification
"""

import os
import sys
import json
import requests
import subprocess
import time
from datetime import datetime
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

class N8NVerifier:
    def __init__(self):
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'tests': {},
            'overall_status': 'unknown',
            'recommendations': []
        }
        self.load_env_vars()
    
    def load_env_vars(self):
        """Load environment variables"""
        env_file = Path('.env')
        if env_file.exists():
            with open(env_file) as f:
                for line in f:
                    if line.strip() and not line.startswith('#'):
                        key, value = line.strip().split('=', 1)
                        os.environ[key] = value
    
    def print_header(self, text):
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
        print(f"{Colors.BOLD}{Colors.CYAN}{text.center(60)}{Colors.END}")
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")
    
    def print_success(self, text):
        print(f"{Colors.GREEN}✅ {text}{Colors.END}")
    
    def print_error(self, text):
        print(f"{Colors.RED}❌ {text}{Colors.END}")
    
    def print_warning(self, text):
        print(f"{Colors.YELLOW}⚠️ {text}{Colors.END}")
    
    def print_info(self, text):
        print(f"{Colors.BLUE}ℹ️ {text}{Colors.END}")
    
    def test_docker_services(self):
        """Test Docker services status"""
        self.print_header("Docker Services Verification")
        
        try:
            # Check if Docker is running
            result = subprocess.run(['docker', 'ps'], capture_output=True, text=True)
            if result.returncode == 0:
                self.print_success("Docker is running")
                
                # Check specific containers
                containers = [
                    'n8n-balaji-automation',
                    'local-ai-balaji', 
                    'redis-balaji',
                    'vpn-balaji'
                ]
                
                running_containers = result.stdout
                container_status = {}
                
                for container in containers:
                    if container in running_containers:
                        self.print_success(f"Container {container} is running")
                        container_status[container] = 'running'
                    else:
                        self.print_error(f"Container {container} is not running")
                        container_status[container] = 'stopped'
                
                self.results['tests']['docker_services'] = {
                    'status': 'success',
                    'container_status': container_status
                }
            else:
                self.print_error("Docker is not running or not accessible")
                self.results['tests']['docker_services'] = {
                    'status': 'failed',
                    'error': 'Docker not accessible'
                }
        except FileNotFoundError:
            self.print_error("Docker is not installed")
            self.results['tests']['docker_services'] = {
                'status': 'failed',
                'error': 'Docker not installed'
            }
    
    def test_n8n_connectivity(self):
        """Test n8n service connectivity"""
        self.print_header("n8n Service Connectivity")
        
        n8n_url = os.getenv('WEBHOOK_URL', 'http://localhost:5678')
        if not n8n_url.endswith('/'):
            n8n_url += '/'
        
        try:
            # Test n8n health endpoint
            health_url = f"{n8n_url}healthz"
            response = requests.get(health_url, timeout=10)
            
            if response.status_code == 200:
                self.print_success(f"n8n is accessible at {n8n_url}")
                self.results['tests']['n8n_connectivity'] = {
                    'status': 'success',
                    'url': n8n_url,
                    'response_time': response.elapsed.total_seconds()
                }
            else:
                self.print_error(f"n8n health check failed: {response.status_code}")
                self.results['tests']['n8n_connectivity'] = {
                    'status': 'failed',
                    'error': f"HTTP {response.status_code}"
                }
        
        except requests.exceptions.RequestException as e:
            self.print_error(f"Cannot connect to n8n: {str(e)}")
            self.results['tests']['n8n_connectivity'] = {
                'status': 'failed',
                'error': str(e)
            }
    
    def test_local_ai(self):
        """Test Local AI service"""
        self.print_header("Local AI Service Verification")
        
        ai_endpoint = os.getenv('LOCAL_AI_ENDPOINT', 'http://localhost:8080')
        
        try:
            # Test AI health endpoint
            health_url = f"{ai_endpoint}/health"
            response = requests.get(health_url, timeout=15)
            
            if response.status_code == 200:
                self.print_success("Local AI service is running")
                
                # Test AI models endpoint
                try:
                    models_url = f"{ai_endpoint}/v1/models"
                    models_response = requests.get(models_url, timeout=10)
                    
                    if models_response.status_code == 200:
                        models_data = models_response.json()
                        available_models = [model['id'] for model in models_data.get('data', [])]
                        
                        if 'gemma-3n' in available_models or 'shakti' in available_models:
                            self.print_success(f"Required AI models available: {available_models}")
                        else:
                            self.print_warning(f"Required models not found. Available: {available_models}")
                        
                        self.results['tests']['local_ai'] = {
                            'status': 'success',
                            'endpoint': ai_endpoint,
                            'available_models': available_models
                        }
                    else:
                        self.print_warning("AI service running but models endpoint not accessible")
                        self.results['tests']['local_ai'] = {
                            'status': 'partial',
                            'error': 'Models endpoint not accessible'
                        }
                
                except Exception as e:
                    self.print_warning(f"AI service running but models check failed: {str(e)}")
                    self.results['tests']['local_ai'] = {
                        'status': 'partial',
                        'error': str(e)
                    }
            
            else:
                self.print_error(f"Local AI health check failed: {response.status_code}")
                self.results['tests']['local_ai'] = {
                    'status': 'failed',
                    'error': f"HTTP {response.status_code}"
                }
        
        except requests.exceptions.RequestException as e:
            self.print_error(f"Cannot connect to Local AI: {str(e)}")
            self.results['tests']['local_ai'] = {
                'status': 'failed',
                'error': str(e)
            }
    
    def test_credentials(self):
        """Test credential configuration"""
        self.print_header("Credentials Verification")
        
        required_vars = [
            'N8N_ENCRYPTION_KEY',
            'GMAIL_CLIENT_ID',
            'GMAIL_CLIENT_SECRET', 
            'GITHUB_TOKEN',
            'GOOGLE_DOCS_API_KEY'
        ]
        
        missing_vars = []
        present_vars = []
        
        for var in required_vars:
            if os.getenv(var):
                present_vars.append(var)
                self.print_success(f"{var} is configured")
            else:
                missing_vars.append(var)
                self.print_error(f"{var} is missing")
        
        if not missing_vars:
            self.print_success("All required credentials are configured")
            status = 'success'
        elif len(missing_vars) < len(required_vars) / 2:
            self.print_warning("Some credentials are missing")
            status = 'partial'
        else:
            self.print_error("Most credentials are missing")
            status = 'failed'
        
        self.results['tests']['credentials'] = {
            'status': status,
            'present_vars': present_vars,
            'missing_vars': missing_vars
        }
    
    def test_webhook_endpoint(self):
        """Test webhook endpoint"""
        self.print_header("Webhook Endpoint Testing")
        
        webhook_url = os.getenv('WEBHOOK_URL', 'http://localhost:5678/webhook/balaji-automation')
        
        test_payload = {
            'test': True,
            'github_username': 'balajirajput96',
            'repo_name': 'test-repo',
            'email_subject': 'Test Email',
            'ai_prompt': 'Test AI prompt'
        }
        
        try:
            response = requests.post(webhook_url, json=test_payload, timeout=30)
            
            if response.status_code in [200, 201, 202]:
                self.print_success(f"Webhook endpoint is accessible and responsive")
                self.results['tests']['webhook'] = {
                    'status': 'success',
                    'url': webhook_url,
                    'response_code': response.status_code
                }
            else:
                self.print_warning(f"Webhook endpoint responded but with status: {response.status_code}")
                self.results['tests']['webhook'] = {
                    'status': 'partial',
                    'url': webhook_url,
                    'response_code': response.status_code
                }
        
        except requests.exceptions.RequestException as e:
            self.print_error(f"Webhook endpoint not accessible: {str(e)}")
            self.results['tests']['webhook'] = {
                'status': 'failed',
                'error': str(e)
            }
    
    def test_file_structure(self):
        """Test required file structure"""
        self.print_header("File Structure Verification")
        
        required_files = [
            '.env.example',
            'docker-compose.basic.yml',
            'docker-compose.reverse-proxy.yml',
            'Caddyfile',
            'workflows/balaji-automation-workflow.json',
            'README-n8n-setup.md'
        ]
        
        missing_files = []
        present_files = []
        
        for file_path in required_files:
            if Path(file_path).exists():
                present_files.append(file_path)
                self.print_success(f"{file_path} exists")
            else:
                missing_files.append(file_path)
                self.print_error(f"{file_path} is missing")
        
        # Check directories
        required_dirs = ['workflows', 'scripts', 'credentials', 'models']
        for dir_path in required_dirs:
            if Path(dir_path).is_dir():
                self.print_success(f"Directory {dir_path}/ exists")
            else:
                self.print_warning(f"Directory {dir_path}/ is missing")
        
        status = 'success' if not missing_files else 'partial' if len(missing_files) < len(required_files) / 2 else 'failed'
        
        self.results['tests']['file_structure'] = {
            'status': status,
            'present_files': present_files,
            'missing_files': missing_files
        }
    
    def test_system_requirements(self):
        """Test system requirements"""
        self.print_header("System Requirements Check")
        
        requirements = {
            'python3': ['python3', '--version'],
            'node': ['node', '--version'],
            'docker': ['docker', '--version'],
            'curl': ['curl', '--version'],
            'git': ['git', '--version']
        }
        
        system_status = {}
        
        for tool, command in requirements.items():
            try:
                result = subprocess.run(command, capture_output=True, text=True)
                if result.returncode == 0:
                    version = result.stdout.strip().split('\n')[0]
                    self.print_success(f"{tool} is available: {version}")
                    system_status[tool] = {'status': 'available', 'version': version}
                else:
                    self.print_error(f"{tool} is not working properly")
                    system_status[tool] = {'status': 'error', 'error': result.stderr}
            except FileNotFoundError:
                self.print_error(f"{tool} is not installed")
                system_status[tool] = {'status': 'missing'}
        
        self.results['tests']['system_requirements'] = {
            'status': 'success' if all(s['status'] == 'available' for s in system_status.values()) else 'partial',
            'tools': system_status
        }
    
    def test_performance(self):
        """Test system performance"""
        self.print_header("Performance Testing")
        
        import psutil
        
        # CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        self.print_info(f"CPU Usage: {cpu_percent}%")
        self.print_info(f"Memory Usage: {memory.percent}%")
        self.print_info(f"Disk Usage: {disk.percent}%")
        
        # Performance status
        performance_issues = []
        if cpu_percent > 80:
            performance_issues.append("High CPU usage")
        if memory.percent > 85:
            performance_issues.append("High memory usage")
        if disk.percent > 90:
            performance_issues.append("Low disk space")
        
        if not performance_issues:
            self.print_success("System performance is good")
            status = 'success'
        else:
            for issue in performance_issues:
                self.print_warning(issue)
            status = 'warning'
        
        self.results['tests']['performance'] = {
            'status': status,
            'cpu_percent': cpu_percent,
            'memory_percent': memory.percent,
            'disk_percent': disk.percent,
            'issues': performance_issues
        }
    
    def generate_recommendations(self):
        """Generate recommendations based on test results"""
        self.print_header("Recommendations")
        
        recommendations = []
        
        # Check overall test results
        failed_tests = [test for test, result in self.results['tests'].items() if result['status'] == 'failed']
        partial_tests = [test for test, result in self.results['tests'].items() if result['status'] == 'partial']
        
        if failed_tests:
            self.print_error(f"Failed tests: {', '.join(failed_tests)}")
            recommendations.append("Fix failed components before proceeding")
        
        if partial_tests:
            self.print_warning(f"Tests with issues: {', '.join(partial_tests)}")
            recommendations.append("Review and optimize components with issues")
        
        # Specific recommendations
        if 'docker_services' in failed_tests:
            recommendations.append("Start Docker services: docker compose up -d")
        
        if 'credentials' in failed_tests:
            recommendations.append("Configure missing credentials in .env file")
        
        if 'local_ai' in failed_tests:
            recommendations.append("Check Local AI service and model files")
        
        if 'n8n_connectivity' in failed_tests:
            recommendations.append("Verify n8n service configuration and networking")
        
        # Performance recommendations
        if 'performance' in self.results['tests'] and self.results['tests']['performance']['status'] == 'warning':
            recommendations.append("Monitor system resources and optimize if needed")
        
        # Success recommendations
        if not failed_tests and not partial_tests:
            recommendations.extend([
                "✅ All systems are working properly!",
                "🚀 Ready to import and run the workflow",
                "📧 Configure email notifications",
                "🔄 Set up monitoring and alerts",
                "📊 Review performance metrics regularly"
            ])
        
        self.results['recommendations'] = recommendations
        
        for rec in recommendations:
            if rec.startswith('✅') or rec.startswith('🚀'):
                self.print_success(rec)
            elif 'Fix' in rec or 'missing' in rec:
                self.print_error(rec)
            else:
                self.print_info(rec)
    
    def save_results(self):
        """Save verification results to file"""
        results_file = Path('verification-results.json')
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        
        self.print_info(f"Results saved to {results_file}")
    
    def run_all_tests(self):
        """Run all verification tests"""
        self.print_header("🤖 n8n Workflow Setup Verification")
        self.print_info("बालाजी के लिए comprehensive system check")
        
        # Run all tests
        try:
            self.test_system_requirements()
            self.test_file_structure()
            self.test_credentials()
            self.test_docker_services()
            self.test_n8n_connectivity()
            self.test_local_ai()
            self.test_webhook_endpoint()
            
            # Import psutil for performance testing
            try:
                self.test_performance()
            except ImportError:
                self.print_warning("psutil not available for performance testing")
                self.print_info("Install with: pip install psutil")
            
            # Generate overall status
            failed_count = len([t for t in self.results['tests'].values() if t['status'] == 'failed'])
            total_count = len(self.results['tests'])
            
            if failed_count == 0:
                self.results['overall_status'] = 'success'
                overall_message = "🎉 All tests passed! System is ready."
            elif failed_count < total_count / 2:
                self.results['overall_status'] = 'partial'
                overall_message = "⚠️ Some issues found but system is mostly functional."
            else:
                self.results['overall_status'] = 'failed'
                overall_message = "❌ Multiple issues found. System needs attention."
            
            self.generate_recommendations()
            self.save_results()
            
            # Final status
            self.print_header("Verification Complete")
            if self.results['overall_status'] == 'success':
                self.print_success(overall_message)
            elif self.results['overall_status'] == 'partial':
                self.print_warning(overall_message)
            else:
                self.print_error(overall_message)
            
            return self.results['overall_status'] == 'success'
        
        except Exception as e:
            self.print_error(f"Verification failed with error: {str(e)}")
            return False

def main():
    """Main function"""
    print(f"{Colors.BOLD}{Colors.PURPLE}")
    print("🤖 n8n Workflow Verification Script")
    print("बालाजी के automation system के लिए")
    print("="*50)
    print(f"{Colors.END}")
    
    verifier = N8NVerifier()
    success = verifier.run_all_tests()
    
    if success:
        print(f"\n{Colors.GREEN}{Colors.BOLD}✅ Verification completed successfully!{Colors.END}")
        print(f"{Colors.GREEN}Your n8n workflow system is ready to use.{Colors.END}")
        print(f"{Colors.CYAN}Next step: Import the workflow and configure credentials.{Colors.END}")
        sys.exit(0)
    else:
        print(f"\n{Colors.RED}{Colors.BOLD}❌ Verification found issues.{Colors.END}")
        print(f"{Colors.RED}Please fix the reported issues before proceeding.{Colors.END}")
        print(f"{Colors.YELLOW}Check verification-results.json for detailed results.{Colors.END}")
        sys.exit(1)

if __name__ == "__main__":
    main()