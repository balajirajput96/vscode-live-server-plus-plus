# n8n Workflows Directory

This directory contains n8n workflow files for the AI Career Automation system.

## 📁 Workflow Categories

### 1. Career Automation
- `linkedin-content-generator.json` - Automatically generates LinkedIn posts
- `job-application-tracker.json` - Tracks job applications across platforms
- `portfolio-sync.json` - Syncs GitHub projects with portfolio

### 2. Social Media
- `social-media-scheduler.json` - Schedules posts across platforms
- `engagement-tracker.json` - Monitors social media engagement
- `hashtag-optimizer.json` - Optimizes hashtags for better reach

### 3. AI Content Generation
- `resume-generator.json` - Generates tailored resumes
- `cover-letter-automation.json` - Creates customized cover letters
- `project-documentation.json` - Auto-generates project docs

## 🚀 How to Import Workflows

1. Start the n8n system using docker-compose
2. Access n8n at http://localhost:5678
3. Go to Workflows > Import from File
4. Select the .json workflow files from this directory
5. Configure your API keys and settings
6. Activate the workflows

## ⚙️ Configuration Required

Most workflows require configuration of:
- API keys for external services
- Database connections
- Email settings
- Social media credentials

## 📝 Creating Custom Workflows

1. Design your workflow in the n8n interface
2. Export as JSON
3. Save in this directory
4. Document any special requirements

## 🔗 Integration with Live Server++

These workflows are designed to integrate with the Live Server++ career dashboard, automatically updating your portfolio and social media presence.

---

*Place your n8n workflow files (.json) in this directory for easy import and version control.*