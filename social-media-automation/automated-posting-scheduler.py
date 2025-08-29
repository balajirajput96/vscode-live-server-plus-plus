#!/usr/bin/env python3
"""
Social Media Automated Posting Scheduler
Research-Based Procrastination Solution Integration for Biotech Careers

Based on research from Harvard, Oxford, Stanford, MIT, and Cambridge universities
Plus YouTube expert methodologies (Dr. Joseph Ferrari, James Clear, Mel Robbins, etc.)
"""

import datetime
import json
import logging
import time
import random
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

@dataclass
class ResearchFinding:
    """Research finding from top universities"""
    university: str
    effectiveness: float
    technique: str
    description: str
    implementation: str

@dataclass
class ProcrastinationMetrics:
    """Tracks procrastination solution effectiveness"""
    mood_score: float
    productivity_score: float
    attention_span: int  # in seconds
    future_self_clarity: float
    habit_completion_rate: float
    timestamp: str

@dataclass
class PostContent:
    """Social media post content structure"""
    platform: str
    content: str
    hashtags: List[str]
    scheduled_time: str
    content_type: str
    research_backed: bool
    effectiveness_target: float

class ResearchDatabase:
    """Database of university research findings"""
    
    def __init__(self):
        self.findings = {
            'harvard': ResearchFinding(
                university='Harvard',
                effectiveness=77.0,
                technique='Future Self Visualization',
                description='Todd Rogers & Max Bazerman found we care too much about present self',
                implementation='Daily evening question: भविष्य के मुझे क्या चाहिए?'
            ),
            'oxford': ResearchFinding(
                university='Oxford',
                effectiveness=12.0,
                technique='Happiness-First Approach',
                description='Wellbeing Research Centre found direct happiness-productivity link',
                implementation='1 happiness point = 12% productivity boost tracking'
            ),
            'stanford': ResearchFinding(
                university='Stanford',
                effectiveness=28.0,
                technique='Strategic Procrastination',
                description='Adam Grant found moderate procrastination boosts creativity',
                implementation='Controlled delay for creative projects'
            ),
            'mit': ResearchFinding(
                university='MIT',
                effectiveness=37.0,
                technique='AI Tool Optimization',
                description='Danielle Li & Erik Brynjolfsson found proper AI usage boosts productivity',
                implementation='Use AI within capability limits, avoid overuse'
            ),
            'cambridge': ResearchFinding(
                university='Cambridge',
                effectiveness=47.0,
                technique='Attention Cycle Management',
                description='Gloria Mark found average attention span is 47 seconds',
                implementation='Work with natural attention rhythms, 25-minute refocus time'
            )
        }
        
        self.youtube_experts = {
            'ferrari': {
                'name': 'Dr. Joseph Ferrari',
                'expertise': 'CBT for Procrastination',
                'effectiveness': 70.0,
                'key_insight': 'Only CBT works long-term for procrastination',
                'implementation': 'Daily thought record + behavioral experiments'
            },
            'clear': {
                'name': 'James Clear',
                'expertise': 'Habit Stacking',
                'effectiveness': 65.0,
                'key_insight': 'Environment design beats willpower',
                'implementation': 'Stack new habits on existing ones'
            },
            'robbins': {
                'name': 'Mel Robbins',
                'expertise': '5-Second Rule',
                'effectiveness': 60.0,
                'key_insight': 'Procrastination is emotional management, not time management',
                'implementation': '5-4-3-2-1 countdown + physical movement'
            }
        }

class PostGenerator:
    """Generates research-backed social media content"""
    
    def __init__(self, research_db: ResearchDatabase):
        self.research_db = research_db
        self.biotech_hashtags = [
            '#Biotechnology', '#Bioinformatics', '#DataScience', 
            '#PharmaResearch', '#BiotechCareer', '#ComputationalBiology',
            '#DrugDiscovery', '#ClinicalResearch', '#PythonForBiotech'
        ]
        self.research_hashtags = [
            '#ProductivityResearch', '#HarvardStudy', '#OxfordResearch',
            '#MITFindings', '#CambridgeStudy', '#StanfordResearch',
            '#ProcrastinationSolution', '#EvidenceBasedProductivity'
        ]
    
    def generate_research_insight_post(self, research_key: str) -> PostContent:
        """Generate post about university research findings"""
        finding = self.research_db.findings[research_key]
        
        content = f"""🧠 {finding.university} Research Breakthrough!

{finding.technique} shows {finding.effectiveness}% effectiveness in overcoming procrastination.

🔬 **Key Finding:** {finding.description}

🎯 **How I'm applying this in my biotech career:**
{finding.implementation}

💡 **Result:** More focused bioinformatics work, better project outcomes, clearer career progression toward pharmaceutical innovation.

The science of productivity is revolutionizing how we approach professional growth! 📊

#ProductivityResearch #BiotechCareer #EvidenceBasedGrowth #ProcrastinationSolution"""

        return PostContent(
            platform='linkedin',
            content=content,
            hashtags=self.biotech_hashtags + self.research_hashtags[:3],
            scheduled_time=self._get_optimal_time('linkedin'),
            content_type='research_insight',
            research_backed=True,
            effectiveness_target=finding.effectiveness
        )
    
    def generate_mood_productivity_post(self, mood: float, productivity: float) -> PostContent:
        """Generate post based on Oxford mood-productivity research"""
        correlation = (productivity / mood) * 12
        mood_emoji = '😊' if mood >= 8 else '🙂' if mood >= 6 else '😐' if mood >= 4 else '😔'
        productivity_icon = '🚀' if productivity >= 8 else '⚡' if productivity >= 6 else '⚙️' if productivity >= 4 else '🐌'
        
        content = f"""{mood_emoji} Today's Mood-Productivity Check-in {productivity_icon}

Mood: {mood}/10 | Productivity: {productivity}/10

🔬 **Oxford Research Insight:** Every 1-point mood increase correlates with 12% productivity boost!

Current correlation: {correlation:.1f}% alignment with research predictions.

💡 **Today's strategy based on my levels:**
{self._get_mood_strategy(mood, productivity)}

Tracking this data helps optimize my bioinformatics work and career preparation. Science-backed self-improvement in action! 📊

#MoodProductivityResearch #OxfordStudy #DataDrivenCareer #BiotechMindset"""

        return PostContent(
            platform='facebook',
            content=content,
            hashtags=self.research_hashtags + self.biotech_hashtags[:2],
            scheduled_time=self._get_optimal_time('facebook'),
            content_type='mood_tracking',
            research_backed=True,
            effectiveness_target=12.0
        )
    
    def generate_habit_stack_post(self, existing_habit: str, new_habit: str, completion_count: int) -> PostContent:
        """Generate habit stacking success post (James Clear methodology)"""
        content = f"""🔗 Habit Stacking Success Story!

"{existing_habit} के बाद, मैं {new_habit}"

James Clear's research (followed by millions) shows 65% effectiveness for habit stacking!

📈 **Progress Update:** Completed this stack {completion_count} times this month.

💡 **Why it works:** Linking new productive habits to existing routines creates automatic behavior patterns. Perfect for building consistent bioinformatics practice and career development routines.

🎯 **Career Impact:** This habit directly contributes to my goal of landing a bioinformatics role at top pharmaceutical companies.

Building better habits = Building better career outcomes! 🚀

#HabitStacking #ProductivityHacks #BiotechCareer #JamesClear #ProcrastinationSolution"""

        return PostContent(
            platform='linkedin',
            content=content,
            hashtags=['#HabitStacking', '#ProductivityHacks'] + self.biotech_hashtags[:3],
            scheduled_time=self._get_optimal_time('linkedin'),
            content_type='habit_success',
            research_backed=True,
            effectiveness_target=65.0
        )
    
    def generate_attention_span_post(self, avg_attention: int, longest_session: int) -> PostContent:
        """Generate attention span tracking post (Cambridge research)"""
        improvement = ((avg_attention - 47) / 47 * 100)
        
        content = f"""🧠 Attention Span Analytics Update!

Cambridge research: Average attention span = 47 seconds
My average this week: {avg_attention//60}:{avg_attention%60:02d}
Personal best: {longest_session//60}:{longest_session%60:02d}

📊 **Key Insight:** Working WITH natural attention rhythms instead of fighting them has improved my bioinformatics analysis quality.

🎯 **Strategy:** Using 47-second awareness for complex data analysis tasks. When attention wavers, brief reset instead of forcing focus.

📈 **Improvement:** {improvement:+.1f}% above baseline attention span!

Result: Better code quality, fewer errors, more insightful biological interpretations! ⚡

#AttentionScience #CambridgeResearch #BioinformaticsProductivity #FocusTraining"""

        return PostContent(
            platform='twitter',
            content=content[:280],  # Twitter character limit
            hashtags=['#AttentionScience', '#CambridgeResearch', '#BioinformaticsProductivity'],
            scheduled_time=self._get_optimal_time('twitter'),
            content_type='attention_tracking',
            research_backed=True,
            effectiveness_target=47.0
        )
    
    def generate_future_self_post(self, future_goal: str, daily_action: str) -> PostContent:
        """Generate future self visualization post (Harvard research)"""
        content = f"""🎯 Future Self Visualization (Harvard Research - 77% Effectiveness)

🔮 **5-Year Vision:** {future_goal}

🚀 **Today's Action:** {daily_action}

🧠 **Research Insight:** Harvard's Todd Rogers & Max Bazerman found that focusing on future self vs present self increases task completion by 77% vs 30%.

💡 **Personal Application:** Before each bioinformatics project, I ask "भविष्य के मुझे क्या चाहिए?" (What does my future self need?)

🎪 **Career Connection:** Each data analysis skill I develop today brings my future pharmaceutical researcher self closer to reality.

The power of future-focused thinking in biotech career development! 🧬

#FutureSelfVisualization #HarvardResearch #BiotechCareer #CareerPlanning #ProcrastinationSolution"""

        return PostContent(
            platform='linkedin',
            content=content,
            hashtags=['#FutureSelfVisualization', '#HarvardResearch'] + self.biotech_hashtags[:3],
            scheduled_time=self._get_optimal_time('linkedin'),
            content_type='future_self',
            research_backed=True,
            effectiveness_target=77.0
        )
    
    def generate_project_post(self, project_data: Dict) -> PostContent:
        """Generate project showcase post with research integration"""
        research_insight = random.choice(list(self.research_db.findings.values()))
        
        content = f"""🚀 Project Showcase: {project_data['title']}

{project_data['description']}

🔬 **Technologies:** {', '.join(project_data.get('technologies', []))}

📊 **Key Finding:** {project_data.get('key_finding', 'Significant biological insights discovered')}

🧠 **Research Connection:** {research_insight.university} research shows {research_insight.technique} improves performance by {research_insight.effectiveness}%. Applied this approach during analysis!

💡 **Industry Application:** This methodology can enhance drug discovery processes at companies like Sun Pharma, Biocon, and Zydus Cadila.

Ready to bring data-driven solutions to pharmaceutical research! 🧬💊

#BioinformaticsProject #DataScience #PharmaResearch #ProjectShowcase"""

        return PostContent(
            platform='linkedin',
            content=content,
            hashtags=self.biotech_hashtags[:5],
            scheduled_time=self._get_optimal_time('linkedin'),
            content_type='project_showcase',
            research_backed=True,
            effectiveness_target=research_insight.effectiveness
        )
    
    def generate_skill_post(self, skill_data: Dict) -> PostContent:
        """Generate skill development post"""
        content = f"""📚 Skill Development Update: {skill_data['skill_name']}

🎯 **Learning Goal:** {skill_data.get('goal', 'Master advanced techniques')}
⚡ **Current Progress:** {skill_data.get('progress', '75')}% complete
🔧 **Tools Mastered:** {', '.join(skill_data.get('tools', []))}

💡 **Real-world Application:** Using these skills for pharmaceutical data analysis and drug discovery research.

🧠 **Learning Strategy:** Applying Cambridge research on 47-second attention cycles for optimal skill absorption.

Next milestone: {skill_data.get('next_milestone', 'Advanced bioinformatics certification')}! 🚀

#SkillDevelopment #ContinuousLearning #BiotechEducation #ProfessionalGrowth"""

        return PostContent(
            platform='facebook',
            content=content,
            hashtags=['#SkillDevelopment', '#ContinuousLearning'] + self.biotech_hashtags[:3],
            scheduled_time=self._get_optimal_time('facebook'),
            content_type='skill_highlight',
            research_backed=True,
            effectiveness_target=47.0
        )
    
    def generate_industry_insight_post(self, insight_data: Dict) -> PostContent:
        """Generate pharmaceutical industry insight post"""
        content = f"""🏭 Pharmaceutical Industry Insight

🔍 **Trend:** {insight_data.get('trend', 'AI-driven drug discovery is revolutionizing pharma')}

📈 **Impact:** {insight_data.get('impact', 'Reducing drug development time by 30-50%')}

🧬 **Opportunity:** Bioinformatics professionals are becoming essential for companies like:
• Sun Pharma (Mumbai)
• Biocon (Bangalore) 
• Zydus Cadila (Ahmedabad)
• Dr. Reddy's (Hyderabad)

💡 **My Preparation:** Building expertise in computational biology, Python programming, and clinical data analysis.

🎯 **Career Vision:** Contributing to breakthrough treatments through data science!

#PharmaIndustry #BioinformaticsCareers #DrugDiscovery #IndianPharma #BiotechOpportunities"""

        return PostContent(
            platform='linkedin',
            content=content,
            hashtags=['#PharmaIndustry', '#BioinformaticsCareers'] + self.biotech_hashtags[:3],
            scheduled_time=self._get_optimal_time('linkedin'),
            content_type='industry_insight',
            research_backed=False,
            effectiveness_target=0.0
        )
    
    def generate_career_milestone_post(self, milestone_data: Dict) -> PostContent:
        """Generate career milestone celebration post"""
        content = f"""🏆 Career Milestone Achieved!

🎉 **Achievement:** {milestone_data.get('achievement', 'Completed advanced bioinformatics project')}

📚 **Skills Gained:** {', '.join(milestone_data.get('skills', []))}

🎯 **Next Goal:** {milestone_data.get('next_goal', 'Land bioinformatics analyst role')}

🧠 **Research-Backed Approach:** Using Harvard's future self visualization technique - this milestone brings my pharmaceutical researcher future self closer to reality!

💪 **Motivation Level:** 📈📈📈

Ready for the next challenge in my biotech journey! 🚀

#CareerMilestone #BiotechJourney #ProfessionalGrowth #AchievementUnlocked"""

        return PostContent(
            platform='facebook',
            content=content,
            hashtags=['#CareerMilestone', '#BiotechJourney'] + self.biotech_hashtags[:2],
            scheduled_time=self._get_optimal_time('facebook'),
            content_type='career_milestone',
            research_backed=True,
            effectiveness_target=77.0
        )
    
    def _get_optimal_time(self, platform: str) -> str:
        """Get optimal posting time for platform based on research"""
        optimal_times = {
            'linkedin': ['09:00', '14:00'],  # 9 AM, 2 PM IST
            'facebook': ['11:00', '13:00'],  # 11 AM, 1 PM IST
            'twitter': ['08:00', '17:00']    # 8 AM, 5 PM IST
        }
        
        times = optimal_times.get(platform, ['12:00'])
        selected_time = random.choice(times)
        
        # Schedule for next occurrence of optimal time
        now = datetime.datetime.now()
        time_parts = selected_time.split(':')
        scheduled_time = now.replace(
            hour=int(time_parts[0]), 
            minute=int(time_parts[1]), 
            second=0, 
            microsecond=0
        )
        
        # If time has passed today, schedule for tomorrow
        if scheduled_time <= now:
            scheduled_time += datetime.timedelta(days=1)
        
        return scheduled_time.isoformat()
    
    def _get_mood_strategy(self, mood: float, productivity: float) -> str:
        """Get strategy recommendation based on mood and productivity levels"""
        if mood >= 8 and productivity >= 8:
            return "🎯 Peak performance mode! Tackling the most challenging bioinformatics problems today."
        elif mood >= 6 and productivity >= 6:
            return "⚡ Good energy for steady progress on portfolio projects and skill development."
        elif mood < 6 and productivity < 6:
            return "🧘 Oxford research suggests focusing on mood first. Taking time for activities that boost happiness before diving into technical work."
        elif mood > productivity:
            return "🔄 High mood, lower productivity - using Cambridge research on 47-second attention cycles to improve focus."
        else:
            return "💪 High productivity despite lower mood - leveraging this energy while monitoring happiness levels."

class SocialMediaScheduler:
    """Main scheduler class for automated posting"""
    
    def __init__(self, config_file: str = "scheduler_config.json"):
        self.config_file = Path(config_file)
        self.research_db = ResearchDatabase()
        self.post_generator = PostGenerator(self.research_db)
        self.scheduled_posts = []
        self.load_config()
        self._load_scheduled_posts()
    
    def load_config(self):
        """Load scheduler configuration"""
        default_config = {
            "platforms": ["linkedin", "facebook", "twitter"],
            "posting_frequency": {
                "linkedin": 3,  # posts per week
                "facebook": 2,  # posts per week
                "twitter": 5    # posts per week
            },
            "content_mix": {
                "research_insights": 0.3,
                "project_showcases": 0.2,
                "skill_highlights": 0.2,
                "industry_insights": 0.15,
                "career_milestones": 0.15
            },
            "research_focus": ["harvard", "oxford", "stanford", "mit", "cambridge"]
        }
        
        if self.config_file.exists():
            with open(self.config_file, 'r') as f:
                self.config = json.load(f)
        else:
            self.config = default_config
            self.save_config()
    
    def save_config(self):
        """Save scheduler configuration"""
        with open(self.config_file, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def schedule_post(self, content: PostContent, platform: str, scheduled_time: str):
        """Schedule a single post"""
        post_data = {
            "id": len(self.scheduled_posts) + 1,
            "platform": platform,
            "content": content.content,
            "hashtags": content.hashtags,
            "scheduled_time": scheduled_time,
            "content_type": content.content_type,
            "research_backed": content.research_backed,
            "effectiveness_target": content.effectiveness_target,
            "status": "scheduled",
            "created_at": datetime.datetime.now().isoformat()
        }
        
        self.scheduled_posts.append(post_data)
        self._save_scheduled_posts()
        
        logging.info(f"Scheduled {content.content_type} post for {platform} at {scheduled_time}")
    
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
    
    def generate_weekly_content(self) -> List[Dict]:
        """Generate weekly content plan based on research"""
        weekly_plan = [
            {
                "day": "monday",
                "content_type": "research_insight",
                "platforms": ["linkedin"],
                "content": {"research_focus": "harvard"}
            },
            {
                "day": "tuesday", 
                "content_type": "project_showcase",
                "platforms": ["linkedin"],
                "content": {
                    "title": "Bioinformatics Data Analysis Project",
                    "description": "Analyzed genomic data to identify potential drug targets",
                    "technologies": ["Python", "Pandas", "BioPython", "Matplotlib"],
                    "key_finding": "Identified 3 novel protein interactions"
                }
            },
            {
                "day": "wednesday",
                "content_type": "mood_tracking", 
                "platforms": ["facebook"],
                "content": {"mood": 7.5, "productivity": 8.0}
            },
            {
                "day": "thursday",
                "content_type": "skill_highlight",
                "platforms": ["linkedin"],
                "content": {
                    "skill_name": "Advanced Python for Bioinformatics",
                    "progress": "85",
                    "tools": ["Pandas", "NumPy", "Scikit-learn", "BioPython"]
                }
            },
            {
                "day": "friday",
                "content_type": "attention_tracking",
                "platforms": ["twitter"],
                "content": {"avg_attention": 180, "longest_session": 420}
            },
            {
                "day": "saturday",
                "content_type": "career_milestone",
                "platforms": ["facebook"],
                "content": {
                    "achievement": "Completed Python for Data Science certification",
                    "skills": ["Data Analysis", "Visualization", "Statistical Computing"]
                }
            },
            {
                "day": "sunday",
                "content_type": "future_self",
                "platforms": ["linkedin"],
                "content": {
                    "future_goal": "Lead bioinformatics team at major pharmaceutical company",
                    "daily_action": "Completed advanced genomics analysis tutorial"
                }
            }
        ]
        
        return weekly_plan
    
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
    
    def post_to_linkedin(self, content: str) -> bool:
        """Post content to LinkedIn (placeholder for API integration)"""
        logging.info(f"LinkedIn post: {content[:100]}...")
        # Placeholder for LinkedIn API integration
        return True
    
    def post_to_facebook(self, content: str) -> bool:
        """Post content to Facebook (placeholder for API integration)"""
        logging.info(f"Facebook post: {content[:100]}...")
        # Placeholder for Facebook API integration
        return True
    
    def post_to_twitter(self, content: str) -> bool:
        """Post content to Twitter (placeholder for API integration)"""
        logging.info(f"Twitter post: {content[:100]}...")
        # Placeholder for Twitter API integration
        return True
    
    def track_procrastination_metrics(self, metrics: ProcrastinationMetrics):
        """Track procrastination solution effectiveness"""
        metrics_file = Path("procrastination_metrics.json")
        
        if metrics_file.exists():
            with open(metrics_file, 'r') as f:
                all_metrics = json.load(f)
        else:
            all_metrics = []
        
        all_metrics.append(asdict(metrics))
        
        with open(metrics_file, 'w') as f:
            json.dump(all_metrics, f, indent=2)
        
        logging.info(f"Tracked procrastination metrics: mood={metrics.mood_score}, productivity={metrics.productivity_score}")
    
    def generate_research_based_content(self, research_focus: str = None):
        """Generate content based on specific research finding"""
        if research_focus is None:
            research_focus = random.choice(self.config["research_focus"])
        
        post = self.post_generator.generate_research_insight_post(research_focus)
        scheduled_time = self.post_generator._get_optimal_time('linkedin')
        
        self.schedule_post(post, 'linkedin', scheduled_time)
        
        logging.info(f"Generated research-based content for {research_focus} research")
    
    def _get_scheduled_time(self, day: str, platform: str) -> str:
        """Get scheduled time for specific day and platform"""
        days_ahead = {
            'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
            'friday': 4, 'saturday': 5, 'sunday': 6
        }
        
        target_day = days_ahead[day.lower()]
        today = datetime.datetime.now().weekday()
        days_until_target = (target_day - today) % 7
        
        if days_until_target == 0 and datetime.datetime.now().hour >= 18:
            days_until_target = 7  # Schedule for next week if today is past posting time
        
        target_date = datetime.datetime.now() + datetime.timedelta(days=days_until_target)
        
        # Get optimal time for platform
        optimal_times = {
            'linkedin': ['09:00', '14:00'],
            'facebook': ['11:00', '13:00'], 
            'twitter': ['08:00', '17:00']
        }
        
        time_str = random.choice(optimal_times.get(platform, ['12:00']))
        time_parts = time_str.split(':')
        
        scheduled_datetime = target_date.replace(
            hour=int(time_parts[0]),
            minute=int(time_parts[1]),
            second=0,
            microsecond=0
        )
        
        return scheduled_datetime.isoformat()
    
    def _load_scheduled_posts(self):
        """Load scheduled posts from file"""
        posts_file = Path("scheduled_posts.json")
        if posts_file.exists():
            with open(posts_file, 'r') as f:
                self.scheduled_posts = json.load(f)
        else:
            self.scheduled_posts = []
    
    def _save_scheduled_posts(self):
        """Save scheduled posts to file"""
        posts_file = Path("scheduled_posts.json")
        with open(posts_file, 'w') as f:
            json.dump(self.scheduled_posts, f, indent=2)
    
    def run_scheduler(self, interval_minutes: int = 15):
        """Run the scheduler continuously"""
        logging.info(f"Starting social media scheduler (checking every {interval_minutes} minutes)")
        
        try:
            while True:
                self.check_and_post_scheduled()
                
                # Generate new content if queue is low
                if len(self.scheduled_posts) < 5:
                    logging.info("Queue low, generating new content...")
                    self.schedule_weekly_posts()
                
                # Sleep for specified interval
                time.sleep(interval_minutes * 60)
                
        except KeyboardInterrupt:
            logging.info("Scheduler stopped by user")
        except Exception as e:
            logging.error(f"Scheduler error: {e}")

def main():
    """Main function to run the scheduler"""
    scheduler = SocialMediaScheduler()
    
    # Example: Track some procrastination metrics
    metrics = ProcrastinationMetrics(
        mood_score=7.5,
        productivity_score=8.0,
        attention_span=180,  # 3 minutes
        future_self_clarity=8.5,
        habit_completion_rate=0.85,
        timestamp=datetime.datetime.now().isoformat()
    )
    
    scheduler.track_procrastination_metrics(metrics)
    
    # Generate research-based content
    scheduler.generate_research_based_content("harvard")
    
    # Schedule weekly posts
    scheduler.schedule_weekly_posts()
    
    # Run the scheduler
    try:
        scheduler.run_scheduler(interval_minutes=15)
    except KeyboardInterrupt:
        print("\nScheduler stopped by user")

if __name__ == "__main__":
    main()