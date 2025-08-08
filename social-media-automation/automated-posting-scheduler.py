#!/usr/bin/env python3
"""
Automated Social Media Posting Scheduler
Integrates with LinkedIn, Facebook, Twitter, and other platforms
"""

import json
import schedule
import time
import datetime
import requests
import logging
from pathlib import Path
from typing import Dict, List, Optional
from linkedin_posts_generator import LinkedInPostGenerator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('social_media_automation.log'),
        logging.StreamHandler()
    ]
)

class SocialMediaScheduler:
    def __init__(self, config_file: str = "config.json"):
        """Initialize the social media scheduler"""
        self.config = self._load_config(config_file)
        self.post_generator = LinkedInPostGenerator()
        self.scheduled_posts = self._load_scheduled_posts()
        
    def _load_config(self, config_file: str) -> Dict:
        """Load configuration from file"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Create default config
            default_config = {
                "posting_schedule": {
                    "linkedin": "10:00",
                    "facebook": "11:00", 
                    "twitter": "12:00"
                },
                "content_types": {
                    "monday": "project_showcase",
                    "tuesday": "skill_highlight",
                    "wednesday": "industry_insight",
                    "thursday": "career_milestone",
                    "friday": "project_showcase",
                    "saturday": "industry_insight",
                    "sunday": "career_milestone"
                },
                "api_keys": {
                    "linkedin": "",
                    "facebook": "",
                    "twitter": "",
                    "openai": ""
                },
                "posting_enabled": True,
                "auto_generate_content": True
            }
            
            with open(config_file, 'w') as f:
                json.dump(default_config, f, indent=2)
            
            return default_config
    
    def _load_scheduled_posts(self) -> List[Dict]:
        """Load scheduled posts from file"""
        posts_file = Path("scheduled_posts.json")
        if posts_file.exists():
            with open(posts_file, 'r') as f:
                return json.load(f)
        return []
    
    def generate_weekly_content(self) -> List[Dict]:
        """Generate content for the entire week"""
        weekly_content = []
        content_types = self.config["content_types"]
        
        for day, content_type in content_types.items():
            # Generate content based on type
            if content_type == "project_showcase":
                content = self._generate_project_content()
            elif content_type == "skill_highlight":
                content = self._generate_skill_content()
            elif content_type == "industry_insight":
                content = self._generate_insight_content()
            elif content_type == "career_milestone":
                content = self._generate_milestone_content()
            else:
                content = self._generate_general_content()
            
            weekly_content.append({
                "day": day,
                "content_type": content_type,
                "content": content,
                "platforms": ["linkedin", "facebook", "twitter"]
            })
        
        return weekly_content
    
    def _generate_project_content(self) -> Dict:
        """Generate project showcase content"""
        projects = [
            {
                "name": "Gene Expression Analysis in Breast Cancer",
                "type": "bioinformatics",
                "description": "Analyzed TCGA breast cancer data to identify differentially expressed genes.",
                "tools": ["Python", "Pandas", "Matplotlib", "DESeq2"],
                "key_findings": "Discovered 1,247 significantly differentially expressed genes.",
                "portfolio_link": "my portfolio website"
            },
            {
                "name": "Drug Trial Data Analysis",
                "type": "clinical research",
                "description": "Statistical analysis of clinical trial data to evaluate drug efficacy.",
                "tools": ["R", "SQL", "Tableau"],
                "key_findings": "Identified significant correlation between drug dosage and patient response.",
                "portfolio_link": "my portfolio website"
            },
            {
                "name": "Biotech Company Website",
                "type": "web development",
                "description": "Designed and developed a modern website for a biotechnology startup.",
                "tools": ["HTML", "CSS", "JavaScript"],
                "key_findings": "Improved user engagement by 40% with responsive design.",
                "portfolio_link": "my portfolio website"
            }
        ]
        
        return random.choice(projects)
    
    def _generate_skill_content(self) -> Dict:
        """Generate skill highlight content"""
        skills = [
            {
                "skill": "Python for Bioinformatics",
                "application": "gene expression analysis",
                "project": "breast cancer data analysis",
                "outcome": "automated data processing pipeline"
            },
            {
                "skill": "SQL Database Management",
                "application": "clinical data analysis",
                "project": "drug trial database",
                "outcome": "improved query performance by 60%"
            },
            {
                "skill": "Data Visualization",
                "application": "scientific reporting",
                "project": "research findings presentation",
                "outcome": "enhanced stakeholder communication"
            }
        ]
        
        return random.choice(skills)
    
    def _generate_insight_content(self) -> Dict:
        """Generate industry insight content"""
        insights = [
            {
                "topic": "AI in Drug Discovery",
                "insight": "Machine learning algorithms are reducing drug discovery time from years to months",
                "impact": "accelerated drug development process",
                "future": "more personalized and effective treatments"
            },
            {
                "topic": "Personalized Medicine",
                "insight": "Genomic sequencing is enabling targeted therapies for individual patients",
                "impact": "improved treatment outcomes",
                "future": "precision medicine becoming standard practice"
            },
            {
                "topic": "Bioinformatics in Clinical Research",
                "insight": "Computational tools are revolutionizing how we analyze biological data",
                "impact": "faster research insights",
                "future": "integration of AI in clinical decision-making"
            }
        ]
        
        return random.choice(insights)
    
    def _generate_milestone_content(self) -> Dict:
        """Generate career milestone content"""
        milestones = [
            {
                "milestone": "completed bioinformatics certification",
                "impact": "enhanced my data analysis skills",
                "next_steps": "applying these skills to real-world projects"
            },
            {
                "milestone": "published research findings",
                "impact": "contributed to scientific community",
                "next_steps": "continuing research in personalized medicine"
            },
            {
                "milestone": "completed 10+ projects",
                "impact": "built a strong portfolio",
                "next_steps": "seeking opportunities in leading pharmaceutical companies"
            }
        ]
        
        return random.choice(milestones)
    
    def _generate_general_content(self) -> Dict:
        """Generate general content"""
        return {
            "topic": "Biotechnology Innovation",
            "insight": "The intersection of biology and technology is creating unprecedented opportunities",
            "impact": "transforming healthcare and research",
            "future": "exciting developments ahead"
        }
    
    def schedule_weekly_posts(self):
        """Schedule posts for the entire week"""
        weekly_content = self.generate_weekly_content()
        
        for content_item in weekly_content:
            day = content_item["day"]
            content_type = content_item["content_type"]
            content = content_item["content"]
            
            # Generate post based on content type
            if content_type == "project_showcase":
                post = self.post_generator.generate_project_post(content)
            elif content_type == "skill_highlight":
                post = self.post_generator.generate_skill_post(content)
            elif content_type == "industry_insight":
                post = self.post_generator.generate_industry_insight_post(content)
            elif content_type == "career_milestone":
                post = self.post_generator.generate_career_milestone_post(content)
            else:
                post = self.post_generator.generate_industry_insight_post(content)
            
            # Schedule for each platform
            for platform in content_item["platforms"]:
                scheduled_time = self._get_scheduled_time(day, platform)
                self.schedule_post(post, platform, scheduled_time)
        
        logging.info(f"Scheduled {len(weekly_content)} posts for the week")
    
    def _get_scheduled_time(self, day: str, platform: str) -> datetime.datetime:
        """Get scheduled time for a specific day and platform"""
        # Get the next occurrence of the specified day
        today = datetime.datetime.now()
        days_ahead = {
            'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
            'friday': 4, 'saturday': 5, 'sunday': 6
        }
        
        target_day = days_ahead.get(day.lower(), 0)
        days_until_target = (target_day - today.weekday()) % 7
        
        if days_until_target == 0 and today.hour >= 10:
            days_until_target = 7
        
        target_date = today + datetime.timedelta(days=days_until_target)
        
        # Get time from config
        time_str = self.config["posting_schedule"].get(platform, "10:00")
        hour, minute = map(int, time_str.split(":"))
        
        return target_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
    
    def schedule_post(self, content: str, platform: str, scheduled_time: datetime.datetime):
        """Schedule a single post"""
        schedule_data = {
            "content": content,
            "platform": platform,
            "scheduled_time": scheduled_time.isoformat(),
            "status": "scheduled",
            "created_at": datetime.datetime.now().isoformat()
        }
        
        self.scheduled_posts.append(schedule_data)
        self._save_scheduled_posts()
        
        logging.info(f"Scheduled {platform} post for {scheduled_time}")
    
    def _save_scheduled_posts(self):
        """Save scheduled posts to file"""
        with open("scheduled_posts.json", 'w') as f:
            json.dump(self.scheduled_posts, f, indent=2)
    
    def post_to_linkedin(self, content: str) -> bool:
        """Post content to LinkedIn"""
        try:
            # In practice, you would use LinkedIn's API
            # For now, we'll simulate the posting
            logging.info(f"Posting to LinkedIn: {content[:100]}...")
            
            # Simulate API call
            time.sleep(2)
            
            logging.info("LinkedIn post successful")
            return True
            
        except Exception as e:
            logging.error(f"LinkedIn posting failed: {e}")
            return False
    
    def post_to_facebook(self, content: str) -> bool:
        """Post content to Facebook"""
        try:
            logging.info(f"Posting to Facebook: {content[:100]}...")
            
            # Simulate API call
            time.sleep(2)
            
            logging.info("Facebook post successful")
            return True
            
        except Exception as e:
            logging.error(f"Facebook posting failed: {e}")
            return False
    
    def post_to_twitter(self, content: str) -> bool:
        """Post content to Twitter"""
        try:
            # Truncate content for Twitter (280 character limit)
            if len(content) > 280:
                content = content[:277] + "..."
            
            logging.info(f"Posting to Twitter: {content[:100]}...")
            
            # Simulate API call
            time.sleep(2)
            
            logging.info("Twitter post successful")
            return True
            
        except Exception as e:
            logging.error(f"Twitter posting failed: {e}")
            return False
    
    def check_and_post_scheduled(self):
        """Check for scheduled posts and publish them"""
        current_time = datetime.datetime.now()
        posts_to_remove = []
        
        for i, post in enumerate(self.scheduled_posts):
            scheduled_time = datetime.datetime.fromisoformat(post["scheduled_time"])
            
            if current_time >= scheduled_time and post["status"] == "scheduled":
                platform = post["platform"]
                content = post["content"]
                
                # Post to the appropriate platform
                success = False
                if platform == "linkedin":
                    success = self.post_to_linkedin(content)
                elif platform == "facebook":
                    success = self.post_to_facebook(content)
                elif platform == "twitter":
                    success = self.post_to_twitter(content)
                
                # Update post status
                if success:
                    post["status"] = "published"
                    post["published_at"] = current_time.isoformat()
                    posts_to_remove.append(i)
                    logging.info(f"Successfully published {platform} post")
                else:
                    post["status"] = "failed"
                    post["failed_at"] = current_time.isoformat()
                    logging.error(f"Failed to publish {platform} post")
        
        # Remove published posts from the list
        for index in reversed(posts_to_remove):
            del self.scheduled_posts[index]
        
        self._save_scheduled_posts()
    
    def run_scheduler(self):
        """Run the automated scheduler"""
        if not self.config["posting_enabled"]:
            logging.info("Posting is disabled in config")
            return
        
        # Schedule weekly content generation
        schedule.every().sunday.at("18:00").do(self.schedule_weekly_posts)
        
        # Check for posts every 5 minutes
        schedule.every(5).minutes.do(self.check_and_post_scheduled)
        
        logging.info("Social media scheduler started")
        logging.info("Checking for posts every 5 minutes")
        logging.info("Weekly content generation scheduled for Sundays at 6 PM")
        
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

def main():
    """Main function to run the scheduler"""
    import random
    
    # Initialize scheduler
    scheduler = SocialMediaScheduler()
    
    print("=== Social Media Automation Scheduler ===\n")
    
    # Generate weekly content
    print("1. Generating weekly content...")
    weekly_content = scheduler.generate_weekly_content()
    
    for content in weekly_content:
        print(f"{content['day'].title()}: {content['content_type']}")
    
    print("\n2. Scheduling posts...")
    scheduler.schedule_weekly_posts()
    
    print(f"\n3. Scheduled {len(scheduler.scheduled_posts)} posts")
    
    # Show scheduled posts
    print("\n4. Scheduled Posts:")
    for post in scheduler.scheduled_posts:
        scheduled_time = datetime.datetime.fromisoformat(post["scheduled_time"])
        print(f"- {post['platform'].title()}: {scheduled_time.strftime('%Y-%m-%d %H:%M')}")
    
    print("\n5. Starting scheduler...")
    print("Press Ctrl+C to stop")
    
    try:
        scheduler.run_scheduler()
    except KeyboardInterrupt:
        print("\nScheduler stopped by user")

if __name__ == "__main__":
    main()