# 🚀 Personal Automation System

Complete automation framework for personal tasks, content creation, and productivity optimization.

## 📋 Quick Start

### 1. One-Command Setup
```bash
chmod +x setup.sh
./setup.sh
```

### 2. Configure Your System
Edit `config.json` with your preferences:
```json
{
  "settings": {
    "morning_routine_time": "09:00",
    "evening_routine_time": "18:00",
    "social_media_posting": true,
    "email_processing": true,
    "file_organization": true
  }
}
```

### 3. Add API Keys
Copy `.env.example` to `.env` and add your API keys:
```bash
cp .env.example .env
# Edit .env with your actual API keys
```

### 4. Start Automation
```bash
./start_automation.sh
```

## 🛠️ Features

### Daily Automation
- **Morning Routine (9:00 AM)**
  - Daily briefing generation
  - Email processing and categorization
  - Social media content creation
  - Task priority updates
  - Morning notifications

- **Evening Routine (6:00 PM)**
  - File backup
  - Progress tracking
  - Tomorrow's schedule preparation
  - Evening summary

### Continuous Tasks
- **File Organization** (every 2 hours)
  - Downloads folder cleanup
  - Desktop organization
  - File categorization by type

- **Backup** (11:00 PM daily)
  - Important documents
  - Project files
  - Configuration backups

## 📁 Directory Structure

```
personal-automation/
├── automation_manager.py    # Main automation script
├── setup.sh                 # One-command setup
├── start_automation.sh      # Start the system
├── stop_automation.sh       # Stop the system
├── test_automation.py       # Test individual functions
├── config.json             # Configuration settings
├── .env                    # API keys and secrets
├── requirements.txt        # Python dependencies
├── scheduled_posts/        # Generated social media content
├── schedules/             # Daily schedules
├── reports/               # Weekly reports
├── plans/                 # Weekly plans
└── backups/               # File backups
```

## 🧪 Testing

Test individual components:
```bash
# Test morning routine
python test_automation.py morning

# Test evening routine
python test_automation.py evening

# Test file organization
python test_automation.py files
```

## 📊 Monitoring

- **Logs**: Check `automation.log` for system activity
- **Progress**: View `progress_tracking.json` for metrics
- **Scheduled Content**: Check `scheduled_posts/` for generated content

## ⚙️ Configuration Options

### Timing Settings
- `morning_routine_time`: When to run morning automation
- `evening_routine_time`: When to run evening automation
- `backup_time`: When to backup files

### Feature Toggles
- `social_media_posting`: Enable/disable content generation
- `email_processing`: Enable/disable email automation
- `file_organization`: Enable/disable file cleanup

### Platform Integration
- `make_com`: Integration with Make.com
- `zapier`: Integration with Zapier
- `n8n`: Integration with n8n

## 🔧 Customization

### Adding New Routines
1. Edit `automation_manager.py`
2. Add your custom function
3. Schedule it in `setup_automation_schedule()`

### Custom Content Templates
Modify `generate_ai_content()` method to add new content types.

### Platform Integration
Add new platforms in the `platforms` section of `config.json`.

## 🆘 Troubleshooting

### Common Issues

**Automation not starting:**
```bash
# Check if virtual environment exists
ls automation_env/

# Reinstall if needed
./setup.sh
```

**Missing dependencies:**
```bash
# Activate environment and install
source automation_env/bin/activate
pip install -r requirements.txt
```

**Permission errors:**
```bash
# Make scripts executable
chmod +x *.sh
```

## 🔗 Integration with Main System

This personal automation system integrates with:
- Career automation dashboard (`../career-automation-system/`)
- Portfolio automation (`../portfolio-automation-system/`)
- Social media templates (`../Social_Media_Templates.md`)
- AI prompts library (`../ai-prompts/`)

## 📈 Expected Results

After 30 days of use:
- ✅ 5+ hours saved per week
- ✅ Organized digital workspace
- ✅ Consistent content creation
- ✅ Automated file management
- ✅ Daily progress tracking

## 🚀 Next Steps

1. **Week 1**: Basic automation setup and testing
2. **Week 2**: Add AI integrations and custom content
3. **Week 3**: Integrate with external platforms
4. **Week 4**: Optimize and expand automation workflows

---

**Happy automating! 🤖**