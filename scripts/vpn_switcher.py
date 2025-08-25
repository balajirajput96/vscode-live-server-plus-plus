#!/usr/bin/env python3
"""
VPN Switcher Script for n8n Career Automation System
Supports multiple VPN providers and countries for accessing different offers and discounts
"""

import os
import sys
import json
import subprocess
import random
import logging
from typing import List, Dict, Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class VPNSwitcher:
    def __init__(self):
        self.vpn_providers = os.getenv('VPN_PROVIDERS', 'nordvpn,expressvpn,surfshark').split(',')
        self.countries = os.getenv('VPN_COUNTRIES', 'US,UK,DE,IN,SG,JP,AU,CA').split(',')
        self.current_connection = None
        
    def get_available_servers(self, provider: str, country: str) -> List[str]:
        """Get available servers for a specific provider and country"""
        servers = {
            'nordvpn': {
                'US': ['us1.nordvpn.com', 'us2.nordvpn.com', 'us3.nordvpn.com'],
                'UK': ['uk1.nordvpn.com', 'uk2.nordvpn.com'],
                'DE': ['de1.nordvpn.com', 'de2.nordvpn.com'],
                'IN': ['in1.nordvpn.com', 'in2.nordvpn.com'],
                'SG': ['sg1.nordvpn.com', 'sg2.nordvpn.com'],
                'JP': ['jp1.nordvpn.com', 'jp2.nordvpn.com'],
                'AU': ['au1.nordvpn.com', 'au2.nordvpn.com'],
                'CA': ['ca1.nordvpn.com', 'ca2.nordvpn.com']
            },
            'expressvpn': {
                'US': ['us-east.expressvpn.com', 'us-west.expressvpn.com'],
                'UK': ['uk-london.expressvpn.com', 'uk-manchester.expressvpn.com'],
                'DE': ['de-frankfurt.expressvpn.com', 'de-berlin.expressvpn.com'],
                'IN': ['in-mumbai.expressvpn.com', 'in-delhi.expressvpn.com'],
                'SG': ['sg-singapore.expressvpn.com'],
                'JP': ['jp-tokyo.expressvpn.com', 'jp-osaka.expressvpn.com'],
                'AU': ['au-sydney.expressvpn.com', 'au-melbourne.expressvpn.com'],
                'CA': ['ca-toronto.expressvpn.com', 'ca-vancouver.expressvpn.com']
            },
            'surfshark': {
                'US': ['us-east.surfshark.com', 'us-west.surfshark.com'],
                'UK': ['uk.surfshark.com'],
                'DE': ['de.surfshark.com'],
                'IN': ['in.surfshark.com'],
                'SG': ['sg.surfshark.com'],
                'JP': ['jp.surfshark.com'],
                'AU': ['au.surfshark.com'],
                'CA': ['ca.surfshark.com']
            }
        }
        
        return servers.get(provider, {}).get(country, [])
    
    def connect_vpn(self, provider: str, country: str) -> Dict[str, any]:
        """Connect to VPN server"""
        try:
            servers = self.get_available_servers(provider, country)
            if not servers:
                logger.error(f"No servers available for {provider} in {country}")
                return {"status": "error", "message": f"No servers available for {provider} in {country}"}
            
            server = random.choice(servers)
            logger.info(f"Connecting to {provider} server in {country}: {server}")
            
            # Simulate VPN connection (replace with actual VPN client commands)
            if provider == 'nordvpn':
                result = self._connect_nordvpn(country)
            elif provider == 'expressvpn':
                result = self._connect_expressvpn(country)
            elif provider == 'surfshark':
                result = self._connect_surfshark(country)
            else:
                return {"status": "error", "message": f"Unsupported VPN provider: {provider}"}
            
            if result.get("status") == "success":
                self.current_connection = {"provider": provider, "country": country, "server": server}
                
            return result
            
        except Exception as e:
            logger.error(f"Error connecting to VPN: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def _connect_nordvpn(self, country: str) -> Dict[str, any]:
        """Connect to NordVPN"""
        try:
            # Command to connect to NordVPN (requires nordvpn CLI)
            cmd = f"nordvpn connect {country}"
            result = subprocess.run(cmd.split(), capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                logger.info(f"Successfully connected to NordVPN in {country}")
                return {"status": "success", "output": result.stdout, "provider": "nordvpn", "country": country}
            else:
                logger.error(f"Failed to connect to NordVPN: {result.stderr}")
                return {"status": "error", "message": result.stderr}
                
        except subprocess.TimeoutExpired:
            return {"status": "error", "message": "Connection timeout"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def _connect_expressvpn(self, country: str) -> Dict[str, any]:
        """Connect to ExpressVPN"""
        try:
            # Command to connect to ExpressVPN (requires expressvpn CLI)
            cmd = f"expressvpn connect {country.lower()}"
            result = subprocess.run(cmd.split(), capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                logger.info(f"Successfully connected to ExpressVPN in {country}")
                return {"status": "success", "output": result.stdout, "provider": "expressvpn", "country": country}
            else:
                logger.error(f"Failed to connect to ExpressVPN: {result.stderr}")
                return {"status": "error", "message": result.stderr}
                
        except subprocess.TimeoutExpired:
            return {"status": "error", "message": "Connection timeout"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def _connect_surfshark(self, country: str) -> Dict[str, any]:
        """Connect to Surfshark"""
        try:
            # Command to connect to Surfshark (requires surfshark CLI or OpenVPN)
            cmd = f"surfshark-vpn connect {country.lower()}"
            result = subprocess.run(cmd.split(), capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                logger.info(f"Successfully connected to Surfshark in {country}")
                return {"status": "success", "output": result.stdout, "provider": "surfshark", "country": country}
            else:
                logger.error(f"Failed to connect to Surfshark: {result.stderr}")
                return {"status": "error", "message": result.stderr}
                
        except subprocess.TimeoutExpired:
            return {"status": "error", "message": "Connection timeout"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def disconnect_vpn(self) -> Dict[str, any]:
        """Disconnect from current VPN"""
        try:
            if not self.current_connection:
                return {"status": "success", "message": "No active VPN connection"}
            
            provider = self.current_connection["provider"]
            
            if provider == 'nordvpn':
                cmd = "nordvpn disconnect"
            elif provider == 'expressvpn':
                cmd = "expressvpn disconnect"
            elif provider == 'surfshark':
                cmd = "surfshark-vpn disconnect"
            else:
                return {"status": "error", "message": f"Unknown provider: {provider}"}
            
            result = subprocess.run(cmd.split(), capture_output=True, text=True, timeout=15)
            
            if result.returncode == 0:
                logger.info(f"Successfully disconnected from {provider}")
                self.current_connection = None
                return {"status": "success", "output": result.stdout}
            else:
                logger.error(f"Failed to disconnect: {result.stderr}")
                return {"status": "error", "message": result.stderr}
                
        except Exception as e:
            logger.error(f"Error disconnecting VPN: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def get_current_ip(self) -> Dict[str, any]:
        """Get current IP address and location"""
        try:
            import requests
            
            # Get IP info
            response = requests.get('https://httpbin.org/ip', timeout=10)
            ip_data = response.json()
            
            # Get location info
            location_response = requests.get(f'https://ipapi.co/{ip_data["origin"]}/json/', timeout=10)
            location_data = location_response.json()
            
            return {
                "status": "success",
                "ip": ip_data["origin"],
                "country": location_data.get("country_name", "Unknown"),
                "country_code": location_data.get("country_code", "Unknown"),
                "city": location_data.get("city", "Unknown"),
                "region": location_data.get("region", "Unknown"),
                "vpn_connection": self.current_connection
            }
            
        except Exception as e:
            logger.error(f"Error getting IP info: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def switch_for_offers(self, target_countries: List[str] = None) -> Dict[str, any]:
        """Switch VPN to access different regional offers"""
        try:
            if target_countries is None:
                target_countries = ['US', 'UK', 'DE', 'SG', 'AU']
            
            results = []
            
            for country in target_countries:
                logger.info(f"Switching to {country} for regional offers...")
                
                # Try different providers for the country
                for provider in self.vpn_providers:
                    if self.get_available_servers(provider, country):
                        result = self.connect_vpn(provider, country)
                        if result.get("status") == "success":
                            # Get IP verification
                            ip_info = self.get_current_ip()
                            results.append({
                                "country": country,
                                "provider": provider,
                                "connection_status": "success",
                                "ip_info": ip_info
                            })
                            break
                        else:
                            logger.warning(f"Failed to connect to {provider} in {country}")
                
                # Small delay between connections
                import time
                time.sleep(2)
            
            return {
                "status": "success",
                "message": f"Tested VPN connections for {len(target_countries)} countries",
                "results": results
            }
            
        except Exception as e:
            logger.error(f"Error switching VPN for offers: {str(e)}")
            return {"status": "error", "message": str(e)}

def main():
    """Main function for command-line usage"""
    vpn = VPNSwitcher()
    
    if len(sys.argv) < 2:
        print("Usage: python vpn_switcher.py <command> [args]")
        print("Commands:")
        print("  connect <provider> <country>  - Connect to VPN")
        print("  disconnect                    - Disconnect VPN")
        print("  status                        - Show current status")
        print("  switch-offers                 - Switch between countries for offers")
        print("  test-all                      - Test all provider/country combinations")
        return
    
    command = sys.argv[1].lower()
    
    if command == 'connect':
        if len(sys.argv) < 4:
            print("Usage: python vpn_switcher.py connect <provider> <country>")
            return
        
        provider = sys.argv[2]
        country = sys.argv[3].upper()
        result = vpn.connect_vpn(provider, country)
        print(json.dumps(result, indent=2))
        
    elif command == 'disconnect':
        result = vpn.disconnect_vpn()
        print(json.dumps(result, indent=2))
        
    elif command == 'status':
        ip_info = vpn.get_current_ip()
        print(json.dumps(ip_info, indent=2))
        
    elif command == 'switch-offers':
        result = vpn.switch_for_offers()
        print(json.dumps(result, indent=2))
        
    elif command == 'test-all':
        # Test all combinations
        for provider in vpn.vpn_providers:
            for country in vpn.countries:
                result = vpn.connect_vpn(provider, country)
                print(f"{provider} - {country}: {result.get('status', 'unknown')}")
                if result.get('status') == 'success':
                    vpn.disconnect_vpn()
    
    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main()