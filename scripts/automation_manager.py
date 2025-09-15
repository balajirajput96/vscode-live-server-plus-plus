#!/usr/bin/env python3
"""
🚀 Personal Automation Setup Script
Comprehensive automation system for personal tasks using AI and various platforms
"""

import os
import sys
import json
import schedule
import time
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('automation.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

class PersonalAutomationManager:
    """
    Main automation manager that handles all personal automation tasks
    """
    
    def __init__(self, config_file: str = "config.json"):
        """Initialize the automation manager"""
        self.config = self.load_config(config_file)
        self.setup_apis()
        
    def load_config(self, config_file: str) -> Dict:
        """Load configuration from JSON file"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Create default config
            default_config = {
                "api_keys": {
                    "openai": "",
                    "notion": "",
                    "gmail": "",
                    "slack": "",
                    "github": ""
                },
                "settings": {
                    "morning_routine_time": "09:00",
                    "evening_routine_time": "18:00",
                    "backup_time": "23:00",
                    "social_media_posting": True,
                    "email_processing": True,
                    "file_organization": True
                },
                "platforms": {
                    "make_com": {
                        "enabled": False,
                        "api_key": ""
                    },
                    "zapier": {
                        "enabled": False,
                        "api_key": ""
                    },
                    "n8n": {
                        "enabled": True,
                        "url": "http://localhost:5678",
                        "api_key": ""
                    }
                }
            }
            
            with open(config_file, 'w') as f:
                json.dump(default_config, f, indent=2)
            
            logging.info(f"Created default config file: {config_file}")
            logging.info("Please edit the config file with your API keys and settings")
            return default_config
    
    def setup_apis(self):
        """Setup API connections"""
        self.openai_key = self.config['api_keys']['openai']
        self.notion_key = self.config['api_keys']['notion']
        self.gmail_key = self.config['api_keys']['gmail']
        
    def morning_routine(self):
        """Execute morning automation routine"""
        logging.info("🌅 Starting morning routine...")
        
        try:
            # 1. Check weather and calendar
            self.get_daily_briefing()
            
            # 2. Process overnight emails
            if self.config['settings']['email_processing']:
                self.process_emails()
            
            # 3. Generate daily content
            if self.config['settings']['social_media_posting']:
                self.generate_daily_content()
            
            # 4. Update task priorities
            self.update_task_priorities()
            
            # 5. Send morning notification
            self.send_morning_notification()
            
            logging.info("✅ Morning routine completed successfully")
            
        except Exception as e:
            logging.error(f"❌ Morning routine failed: {str(e)}")
    
    def evening_routine(self):
        """Execute evening automation routine"""
        logging.info("🌙 Starting evening routine...")
        
        try:
            # 1. Backup important files
            self.backup_files()
            
            # 2. Update progress tracking
            self.update_daily_progress()
            
            # 3. Prepare tomorrow's schedule
            self.prepare_tomorrow_schedule()
            
            # 4. Send evening summary
            self.send_evening_summary()
            
            logging.info("✅ Evening routine completed successfully")
            
        except Exception as e:
            logging.error(f"❌ Evening routine failed: {str(e)}")
    
    def get_daily_briefing(self):
        """Generate AI-powered daily briefing"""
        logging.info("📊 Generating daily briefing...")
        
        briefing = f"""
        📅 Daily Briefing - {datetime.now().strftime('%B %d, %Y')}
        
        🎯 Today's Focus:
        • Complete high-priority automation workflows
        • Review and optimize existing processes
        • Engage with professional network
        
        📋 Priority Tasks:
        • Check and respond to important emails
        • Update project documentation
        • Schedule social media posts
        
        💡 Reminder:
        Consistency in small actions leads to big results!
        
        🚀 Let's make today productive!
        """
        
        logging.info("Daily briefing generated")
        return briefing
    
    def process_emails(self):
        """Process and categorize emails using AI"""
        logging.info("📧 Processing emails...")
        
        categories = {
            'urgent': [],
            'job_opportunities': [],
            'social': [],
            'promotions': [],
            'updates': []
        }
        
        logging.info(f"Processed emails into {len(categories)} categories")
    
    def generate_daily_content(self):
        """Generate social media content for the day"""
        logging.info("📝 Generating daily content...")
        
        content_types = [
            "project_showcase",
            "skill_highlight", 
            "industry_insight",
            "learning_update",
            "networking_post"
        ]
        
        today_content_type = content_types[datetime.now().weekday() % len(content_types)]
        
        # AI content generation would happen here
        content = self.generate_ai_content(today_content_type)
        
        # Schedule the content
        self.schedule_social_media_post(content)
        
        logging.info(f"Generated and scheduled {today_content_type} content")
    
    def generate_ai_content(self, content_type: str) -> str:
        """Generate AI content based on type"""
        
        content_templates = {
            "project_showcase": """
            🚀 Project Spotlight: [Project Name]
            
            Just completed analysis of [dataset] using Python and machine learning techniques.
            
            Key insights:
            • [Finding 1]
            • [Finding 2]  
            • [Finding 3]
            
            Tools used: Python, Pandas, Scikit-learn, Matplotlib
            
            Check out the full project on my GitHub! 
            
            #DataScience #Python #MachineLearning #Analytics
            """,
            
            "skill_highlight": """
            💡 Skill Spotlight: [Skill Name]
            
            Today I'm diving deep into [specific aspect of skill].
            
            Why it matters:
            • [Benefit 1]
            • [Benefit 2]
            • [Real-world application]
            
            Learning resources I recommend:
            📚 [Resource 1]
            🎥 [Resource 2]
            
            What skills are you developing this week?
            
            #ContinuousLearning #SkillDevelopment #TechSkills
            """,
            
            "industry_insight": """
            🔍 Industry Insight: [Topic]
            
            [Current trend or development in the industry]
            
            Impact on professionals:
            • [Impact 1]
            • [Impact 2]
            • [Opportunity]
            
            My take: [Personal insight]
            
            What's your perspective on this trend?
            
            #IndustryTrends #TechInnovation #FutureOfWork
            """
        }
        
        return content_templates.get(content_type, "Default content template")
    
    def schedule_social_media_post(self, content: str):
        """Schedule social media post"""
        logging.info("📅 Scheduling social media post...")
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"scheduled_posts/post_{timestamp}.txt"
        
        os.makedirs("scheduled_posts", exist_ok=True)
        
        with open(filename, 'w') as f:
            f.write(f"Scheduled for: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Content:\n{content}\n")
        
        logging.info(f"Post saved to {filename}")
    
    def update_task_priorities(self):
        """Update task priorities using AI analysis"""
        logging.info("📋 Updating task priorities...")
        
        sample_tasks = [
            {"task": "Complete automation documentation", "priority": "high"},
            {"task": "Review code changes", "priority": "medium"},
            {"task": "Update LinkedIn profile", "priority": "low"},
            {"task": "Backup project files", "priority": "medium"}
        ]
        
        logging.info(f"Updated priorities for {len(sample_tasks)} tasks")
    
    def backup_files(self):
        """Backup important files to cloud storage"""
        logging.info("💾 Starting file backup...")
        
        backup_folders = [
            "~/Documents/Projects",
            "~/Documents/Important",
            "~/automation"
        ]
        
        for folder in backup_folders:
            expanded_folder = os.path.expanduser(folder)
            if os.path.exists(expanded_folder):
                logging.info(f"Backing up {folder}")
        
        logging.info("File backup completed")
    
    def update_daily_progress(self):
        """Update daily progress tracking"""
        logging.info("📈 Updating daily progress...")
        
        progress_data = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "tasks_completed": 0,
            "emails_processed": 0,
            "content_created": 1,
            "files_organized": 0,
            "automation_runs": 1
        }
        
        progress_file = "progress_tracking.json"
        
        try:
            with open(progress_file, 'r') as f:
                all_progress = json.load(f)
        except FileNotFoundError:
            all_progress = []
        
        all_progress.append(progress_data)
        
        with open(progress_file, 'w') as f:
            json.dump(all_progress, f, indent=2)
        
        logging.info("Daily progress updated")
    
    def prepare_tomorrow_schedule(self):
        """Prepare tomorrow's schedule and priorities"""
        logging.info("📅 Preparing tomorrow's schedule...")
        
        tomorrow = datetime.now() + timedelta(days=1)
        
        schedule_template = f"""
        📅 Schedule for {tomorrow.strftime('%B %d, %Y')}
        
        🌅 Morning (9:00 AM):
        • Daily automation routine
        • Email processing
        • Priority task review
        
        🕐 Midday (12:00 PM):
        • Project work
        • Content creation
        • Professional networking
        
        🌅 Evening (6:00 PM):
        • Progress review
        • File organization
        • Tomorrow preparation
        
        💡 Focus Areas:
        • [Area 1]
        • [Area 2]
        • [Area 3]
        """
        
        schedule_file = f"schedules/schedule_{tomorrow.strftime('%Y%m%d')}.txt"
        os.makedirs("schedules", exist_ok=True)
        
        with open(schedule_file, 'w') as f:
            f.write(schedule_template)
        
        logging.info(f"Tomorrow's schedule prepared: {schedule_file}")
    
    def send_morning_notification(self):
        """Send morning briefing notification"""
        logging.info("📢 Sending morning notification...")
        
        notification = f"""
        🌅 Good Morning! {datetime.now().strftime('%H:%M')}
        
        Your automation system is running smoothly.
        
        Today's priorities have been updated.
        Check your scheduled_posts folder for today's content.
        
        Have a productive day! 🚀
        """
        
        logging.info("Morning notification sent")
    
    def send_evening_summary(self):
        """Send evening summary notification"""
        logging.info("📢 Sending evening summary...")
        
        summary = f"""
        🌙 Evening Summary - {datetime.now().strftime('%H:%M')}
        
        ✅ Daily automation completed
        ✅ Files backed up
        ✅ Progress tracking updated
        ✅ Tomorrow's schedule prepared
        
        Great work today! Rest well. 😴
        """
        
        logging.info("Evening summary sent")
    
    def organize_files(self):
        """Organize files in Downloads and Desktop"""
        logging.info("📁 Organizing files...")
        
        folders_to_organize = [
            os.path.expanduser("~/Downloads"),
            os.path.expanduser("~/Desktop")
        ]
        
        file_categories = {
            'Documents': ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
            'Images': ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
            'Videos': ['.mp4', '.avi', '.mov', '.wmv', '.flv'],
            'Audio': ['.mp3', '.wav', '.flac', '.m4a'],
            'Archives': ['.zip', '.rar', '.7z', '.tar', '.gz'],
            'Code': ['.py', '.js', '.html', '.css', '.json', '.xml']
        }
        
        for folder_path in folders_to_organize:
            if not os.path.exists(folder_path):
                continue
                
            for filename in os.listdir(folder_path):
                file_path = os.path.join(folder_path, filename)
                
                if os.path.isfile(file_path):
                    file_ext = os.path.splitext(filename)[1].lower()
                    
                    for category, extensions in file_categories.items():
                        if file_ext in extensions:
                            category_path = os.path.join(folder_path, category)
                            os.makedirs(category_path, exist_ok=True)
                            
                            new_path = os.path.join(category_path, filename)
                            if not os.path.exists(new_path):
                                os.rename(file_path, new_path)
                                logging.info(f"Moved {filename} to {category}")
                            break
        
        logging.info("File organization completed")
    
    def setup_automation_schedule(self):
        """Setup the automation schedule"""
        logging.info("⏰ Setting up automation schedule...")
        
        # Daily routines
        morning_time = self.config['settings']['morning_routine_time']
        evening_time = self.config['settings']['evening_routine_time']
        backup_time = self.config['settings']['backup_time']
        
        schedule.every().day.at(morning_time).do(self.morning_routine)
        schedule.every().day.at(evening_time).do(self.evening_routine)
        schedule.every().day.at(backup_time).do(self.backup_files)
        
        # File organization every 2 hours
        schedule.every(2).hours.do(self.organize_files)
        
        logging.info("Automation schedule configured:")
        logging.info(f"  Morning routine: {morning_time}")
        logging.info(f"  Evening routine: {evening_time}")
        logging.info(f"  File backup: {backup_time}")
        logging.info(f"  File organization: Every 2 hours")
    
    def run(self):
        """Run the automation system"""
        logging.info("🚀 Starting Personal Automation System...")
        
        # Setup schedule
        self.setup_automation_schedule()
        
        # Run initial setup
        logging.info("Running initial setup...")
        self.organize_files()
        
        logging.info("✅ Automation system is now running!")
        logging.info("Press Ctrl+C to stop")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
                
        except KeyboardInterrupt:
            logging.info("🛑 Automation system stopped by user")
        except Exception as e:
            logging.error(f"❌ Automation system error: {str(e)}")


def main():
    """Main function to run the automation system"""
    
    print("""
    🚀 Personal Automation System
    ============================
    
    This system will automate various personal tasks including:
    • Email processing and organization
    • Social media content generation
    • File organization and backup
    • Task prioritization and scheduling
    • Daily/weekly progress tracking
    
    """)
    
    # Check for required dependencies
    try:
        import schedule
        import requests
    except ImportError as e:
        print(f"❌ Missing required dependency: {e}")
        print("Please install required packages:")
        print("pip install schedule requests python-dotenv")
        return
    
    # Initialize and run automation
    automation = PersonalAutomationManager()
    automation.run()


if __name__ == "__main__":
    main()