#!/usr/bin/env python3
"""
AI-Powered LinkedIn Post Generator for Biotechnology & Bioinformatics
Automated content creation for professional networking
"""

import json
import random
import datetime
from typing import Dict, List, Optional
import openai
import requests
from pathlib import Path

class LinkedInPostGenerator:
    def __init__(self, api_key: str = None):
        """Initialize the LinkedIn post generator"""
        self.api_key = api_key
        self.post_templates = self._load_post_templates()
        self.hashtags = self._load_hashtags()
        
    def _load_post_templates(self) -> Dict:
        """Load post templates for different content types"""
        return {
            "project_showcase": [
                "🚀 Excited to share my latest {project_type} project: {project_name}!",
                "🔬 Just completed an interesting {project_type} analysis: {project_name}",
                "📊 New {project_type} insights: {project_name} - here's what I discovered",
                "💡 Working on {project_type} has been fascinating. Here's my project: {project_name}"
            ],
            "skill_highlight": [
                "🛠️ Recently mastered {skill_name} and applied it to {application_area}",
                "📈 Leveled up my {skill_name} skills with this {application_area} project",
                "🎯 {skill_name} has become my go-to tool for {application_area}",
                "⚡ Exploring {skill_name} for {application_area} - the results are promising!"
            ],
            "industry_insight": [
                "🧬 Fascinating developments in {industry_topic} - here's my take",
                "🔍 Deep dive into {industry_topic} - what this means for the future",
                "💭 Thoughts on the latest {industry_topic} trends",
                "📋 Key insights from recent {industry_topic} research"
            ],
            "career_milestone": [
                "🎉 Proud to share: {milestone_description}",
                "🌟 Milestone achieved: {milestone_description}",
                "🏆 Excited to announce: {milestone_description}",
                "📈 Progress update: {milestone_description}"
            ]
        }
    
    def _load_hashtags(self) -> Dict:
        """Load relevant hashtags for different content types"""
        return {
            "biotechnology": ["#Biotechnology", "#Biotech", "#LifeSciences", "#Bioinformatics"],
            "data_analysis": ["#DataAnalysis", "#DataScience", "#Python", "#RStats"],
            "pharmaceutical": ["#Pharma", "#Pharmaceutical", "#DrugDiscovery", "#ClinicalResearch"],
            "research": ["#Research", "#Science", "#Innovation", "#Discovery"],
            "career": ["#CareerGrowth", "#ProfessionalDevelopment", "#Networking", "#JobSearch"],
            "general": ["#Biotechnology", "#DataAnalysis", "#Science", "#Innovation"]
        }
    
    def generate_project_post(self, project_data: Dict) -> str:
        """Generate a LinkedIn post for project showcase"""
        template = random.choice(self.post_templates["project_showcase"])
        
        # Extract project information
        project_name = project_data.get("name", "Bioinformatics Project")
        project_type = project_data.get("type", "bioinformatics")
        description = project_data.get("description", "Analysis of biological data")
        tools = project_data.get("tools", ["Python", "R"])
        key_findings = project_data.get("key_findings", "Interesting patterns discovered")
        portfolio_link = project_data.get("portfolio_link", "my portfolio")
        
        # Build the post content
        post = template.format(project_type=project_type, project_name=project_name)
        post += f"\n\n{description}\n\n"
        
        # Add tools used
        if tools:
            tools_str = ", ".join(tools)
            post += f"🛠️ Tools: {tools_str}\n\n"
        
        # Add key findings
        if key_findings:
            post += f"🔍 Key Finding: {key_findings}\n\n"
        
        # Add call to action
        post += f"📖 Read the full case study on {portfolio_link}\n\n"
        
        # Add hashtags
        hashtags = self._get_relevant_hashtags(project_type)
        post += " ".join(hashtags)
        
        return post
    
    def generate_skill_post(self, skill_data: Dict) -> str:
        """Generate a LinkedIn post for skill highlights"""
        template = random.choice(self.post_templates["skill_highlight"])
        
        skill_name = skill_data.get("skill", "Python")
        application_area = skill_data.get("application", "data analysis")
        project_example = skill_data.get("project", "gene expression analysis")
        learning_outcome = skill_data.get("outcome", "improved data processing efficiency")
        
        post = template.format(skill_name=skill_name, application_area=application_area)
        post += f"\n\n💡 Applied it to: {project_example}\n"
        post += f"📈 Result: {learning_outcome}\n\n"
        
        # Add learning tip
        post += "🎓 Tip: Start with small datasets and gradually scale up. Practice makes perfect!\n\n"
        
        # Add hashtags
        hashtags = self._get_relevant_hashtags("data_analysis")
        post += " ".join(hashtags)
        
        return post
    
    def generate_industry_insight_post(self, insight_data: Dict) -> str:
        """Generate a LinkedIn post for industry insights"""
        template = random.choice(self.post_templates["industry_insight"])
        
        topic = insight_data.get("topic", "personalized medicine")
        insight = insight_data.get("insight", "AI is revolutionizing drug discovery")
        impact = insight_data.get("impact", "faster drug development")
        future_outlook = insight_data.get("future", "more targeted therapies")
        
        post = template.format(industry_topic=topic)
        post += f"\n\n{insight}\n\n"
        post += f"🎯 Impact: {impact}\n"
        post += f"🔮 Future: {future_outlook}\n\n"
        
        # Add engagement question
        post += "🤔 What are your thoughts on this trend? Share your perspective below!\n\n"
        
        # Add hashtags
        hashtags = self._get_relevant_hashtags("biotechnology")
        post += " ".join(hashtags)
        
        return post
    
    def generate_career_milestone_post(self, milestone_data: Dict) -> str:
        """Generate a LinkedIn post for career milestones"""
        template = random.choice(self.post_templates["career_milestone"])
        
        milestone = milestone_data.get("milestone", "completed bioinformatics certification")
        impact = milestone_data.get("impact", "enhanced my data analysis skills")
        next_steps = milestone_data.get("next_steps", "applying these skills to real-world projects")
        
        post = template.format(milestone_description=milestone)
        post += f"\n\n📊 Impact: {impact}\n"
        post += f"🚀 Next Steps: {next_steps}\n\n"
        
        # Add gratitude
        post += "🙏 Grateful for the learning opportunities and supportive community!\n\n"
        
        # Add hashtags
        hashtags = self._get_relevant_hashtags("career")
        post += " ".join(hashtags)
        
        return post
    
    def _get_relevant_hashtags(self, content_type: str) -> List[str]:
        """Get relevant hashtags based on content type"""
        base_hashtags = self.hashtags.get("general", [])
        specific_hashtags = self.hashtags.get(content_type, [])
        
        # Combine and limit to 5-7 hashtags
        all_hashtags = base_hashtags + specific_hashtags
        return random.sample(all_hashtags, min(6, len(all_hashtags)))
    
    def generate_ai_enhanced_post(self, prompt: str, content_type: str = "general") -> str:
        """Generate AI-enhanced post using OpenAI API"""
        if not self.api_key:
            return self._generate_fallback_post(content_type)
        
        try:
            openai.api_key = self.api_key
            
            system_prompt = f"""You are a professional biotechnology and bioinformatics expert creating LinkedIn posts. 
            Create engaging, informative posts that showcase expertise in:
            - Biotechnology and life sciences
            - Bioinformatics and data analysis
            - Python, R, and other technical skills
            - Pharmaceutical and clinical research
            
            The post should be:
            - Professional yet engaging
            - 200-300 words maximum
            - Include relevant hashtags
            - Have a clear call-to-action
            - Suitable for LinkedIn audience (recruiters, researchers, industry professionals)
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=400,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"AI generation failed: {e}")
            return self._generate_fallback_post(content_type)
    
    def _generate_fallback_post(self, content_type: str) -> str:
        """Generate a fallback post when AI is not available"""
        fallback_posts = {
            "project": "🔬 Excited to share my latest bioinformatics project! Analyzed gene expression data using Python and discovered interesting patterns. The intersection of biology and data science never ceases to amaze me. 📊 #Bioinformatics #DataAnalysis #Python #Biotechnology",
            "skill": "🛠️ Leveled up my Python skills with a new bioinformatics project! Data cleaning, visualization, and statistical analysis - all coming together beautifully. The learning journey continues! 🚀 #Python #Bioinformatics #DataScience #Learning",
            "insight": "🧬 Fascinating developments in personalized medicine! AI and machine learning are revolutionizing how we approach drug discovery and patient treatment. The future of healthcare looks promising! 💡 #PersonalizedMedicine #AI #Healthcare #Innovation",
            "general": "📈 Progress update: Completed another bioinformatics analysis project! The combination of biological knowledge and computational skills is powerful. Always learning, always growing! 🌱 #Bioinformatics #CareerGrowth #Science #Innovation"
        }
        
        return fallback_posts.get(content_type, fallback_posts["general"])
    
    def schedule_post(self, post_content: str, platform: str = "linkedin", 
                     scheduled_time: Optional[datetime.datetime] = None) -> Dict:
        """Schedule a post for later publication"""
        if not scheduled_time:
            scheduled_time = datetime.datetime.now() + datetime.timedelta(hours=2)
        
        schedule_data = {
            "content": post_content,
            "platform": platform,
            "scheduled_time": scheduled_time.isoformat(),
            "status": "scheduled",
            "created_at": datetime.datetime.now().isoformat()
        }
        
        # Save to file (in practice, you'd use a database)
        self._save_scheduled_post(schedule_data)
        
        return schedule_data
    
    def _save_scheduled_post(self, schedule_data: Dict):
        """Save scheduled post to file"""
        posts_file = Path("scheduled_posts.json")
        
        if posts_file.exists():
            with open(posts_file, 'r') as f:
                posts = json.load(f)
        else:
            posts = []
        
        posts.append(schedule_data)
        
        with open(posts_file, 'w') as f:
            json.dump(posts, f, indent=2)
    
    def get_content_calendar(self, days: int = 7) -> List[Dict]:
        """Generate a content calendar for the next N days"""
        calendar = []
        
        content_types = ["project_showcase", "skill_highlight", "industry_insight", "career_milestone"]
        
        for i in range(days):
            content_type = content_types[i % len(content_types)]
            date = datetime.datetime.now() + datetime.timedelta(days=i)
            
            calendar_item = {
                "date": date.strftime("%Y-%m-%d"),
                "content_type": content_type,
                "suggested_time": "10:00 AM",
                "status": "planned"
            }
            
            calendar.append(calendar_item)
        
        return calendar

def main():
    """Main function to demonstrate the LinkedIn post generator"""
    
    # Initialize the generator
    generator = LinkedInPostGenerator()
    
    # Example project data
    project_data = {
        "name": "Gene Expression Analysis in Breast Cancer",
        "type": "bioinformatics",
        "description": "Analyzed TCGA breast cancer data to identify differentially expressed genes and potential biomarkers.",
        "tools": ["Python", "Pandas", "Matplotlib", "DESeq2"],
        "key_findings": "Discovered 1,247 significantly differentially expressed genes with potential therapeutic implications.",
        "portfolio_link": "my portfolio website"
    }
    
    # Generate different types of posts
    print("=== LinkedIn Post Generator Demo ===\n")
    
    # Project showcase post
    print("1. PROJECT SHOWCASE POST:")
    project_post = generator.generate_project_post(project_data)
    print(project_post)
    print("\n" + "="*50 + "\n")
    
    # Skill highlight post
    skill_data = {
        "skill": "Python for Bioinformatics",
        "application": "gene expression analysis",
        "project": "breast cancer data analysis",
        "outcome": "automated data processing pipeline"
    }
    
    print("2. SKILL HIGHLIGHT POST:")
    skill_post = generator.generate_skill_post(skill_data)
    print(skill_post)
    print("\n" + "="*50 + "\n")
    
    # Industry insight post
    insight_data = {
        "topic": "AI in Drug Discovery",
        "insight": "Machine learning algorithms are reducing drug discovery time from years to months",
        "impact": "accelerated drug development process",
        "future": "more personalized and effective treatments"
    }
    
    print("3. INDUSTRY INSIGHT POST:")
    insight_post = generator.generate_industry_insight_post(insight_data)
    print(insight_post)
    print("\n" + "="*50 + "\n")
    
    # Content calendar
    print("4. CONTENT CALENDAR (Next 7 days):")
    calendar = generator.get_content_calendar(7)
    for item in calendar:
        print(f"{item['date']} - {item['content_type']} ({item['suggested_time']})")
    
    print("\n" + "="*50 + "\n")
    
    # Schedule a post
    print("5. SCHEDULING A POST:")
    scheduled_post = generator.schedule_post(project_post, "linkedin")
    print(f"Post scheduled for: {scheduled_post['scheduled_time']}")
    print("Status:", scheduled_post['status'])

if __name__ == "__main__":
    main()