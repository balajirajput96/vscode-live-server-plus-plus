# 🚀 Biotech Career Automation Agent

## Overview

This repository contains an AI-powered Approval-Driven Automation Agent designed to accelerate biotech job search, learning, portfolio posts, and CI reliability with minimal manual effort.

## Features

### 🔬 Core Automation Services

1. **Job Aggregation & Auto-Apply**
   - Daily aggregation of QC/Lab/Bioinformatics jobs
   - Deduplication and quality scoring
   - Google Sheets integration for tracking
   - WhatsApp approval workflow
   - Automated application to pre-approved jobs

2. **Learning Plan Tracker**
   - 16-week structured learning plan
   - Daily progress monitoring (30min target)
   - Micro-task generation for gaps
   - Calendar integration for learning blocks
   - WhatsApp notifications and approvals

3. **GitHub Activity → Portfolio Posts**
   - Automated GitHub activity analysis
   - 120-word portfolio post generation
   - WhatsApp preview and approval
   - Multi-platform scheduling (LinkedIn, Twitter, Facebook)
   - Engagement tracking and analytics

4. **CI Failure Classifier**
   - Automated root cause analysis
   - Exact fix snippet generation
   - Failure pattern recognition
   - Real-time notification system

### 🔧 Technical Stack

- **Backend**: Node.js, TypeScript
- **APIs**: WhatsApp Business, Google Sheets, GitHub, Buffer, Meta
- **Cloud**: Azure ML for MLOps workflows
- **CI/CD**: GitHub Actions with modern practices
- **Monitoring**: Structured logging and KPI tracking

## Quick Start

### 1. Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd vscode-live-server-plus-plus

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your actual credentials
```

### 2. Required Credentials

#### WhatsApp Business API
1. Create Meta Business account
2. Get WhatsApp Business API access
3. Add phone number and get verification
4. Generate access token

#### Google Services
1. Create Google Cloud Project
2. Enable Sheets API and Calendar API
3. Create service account
4. Download credentials JSON
5. Create Google Sheets for tracking

#### Social Media APIs
1. **Buffer**: Sign up and get API access token
2. **Meta**: Facebook/Instagram business integration
3. **LinkedIn**: Professional API access (if available)

#### GitHub & Azure
1. **GitHub**: Personal access token with repo permissions
2. **Azure**: ML workspace and service principal

### 3. Run Automation

```bash
# Daily automation (jobs + learning + GitHub)
npm run automation:daily

# Individual services
npm run automation:jobs      # Job aggregation
npm run automation:learning  # Learning tracker
npm run automation:github    # GitHub activity

# CI failure analysis
node automation/ci-failure-classifier.js <workflow_run_id>

# Health check
node automation/main.js health
```

## Architecture

### Service Components

```
automation/
├── main.js                    # Orchestrator
├── job-aggregator.js         # Job search automation
├── learning-tracker.js       # Learning plan management
├── github-activity-tracker.js # Portfolio post generation
├── ci-failure-classifier.js  # CI analysis
├── services/
│   ├── whatsapp.service.js   # WhatsApp Business API
│   ├── google-sheets.service.js # Data persistence
│   ├── calendar.service.js   # Google Calendar integration
│   ├── job-scraping.service.js # Job site scraping
│   └── social-media.service.js # Multi-platform posting
├── utils/
│   ├── logger.js            # Structured logging
│   └── retry.js             # Retry with exponential backoff
└── azure-ml/
    ├── hello-world-job.yml  # Validation job
    └── biotech-pipeline.yml # ML pipeline
```

### Workflow Design

1. **Human-in-the-Loop**: All actions require WhatsApp approval within 15 minutes
2. **Reliability**: 3x retry with exponential backoff, 30s timeouts
3. **Monitoring**: Comprehensive logging to Google Sheets
4. **CI Hygiene**: actions/checkout@v4, clean workflows, pre-clean steps

## GitHub Actions Integration

### Automated Workflows

- **Daily Job Aggregation**: 9 AM UTC (2:30 PM IST)
- **Learning Plan Check**: Daily at 9 AM UTC
- **CI/CD Pipeline**: On push/PR with modern practices
- **Azure ML Jobs**: On-demand via workflow_dispatch

### Environment Variables

Set these in GitHub repository secrets:

```
WHATSAPP_TOKEN
WHATSAPP_PHONE_ID
WHATSAPP_TARGET_NUMBER
GOOGLE_SHEETS_CREDENTIALS
AZURE_CREDENTIALS
BUFFER_ACCESS_TOKEN
META_ACCESS_TOKEN
```

## Usage Examples

### 1. Job Search Automation

```bash
# Manual trigger
node automation/job-aggregator.js

# Expected workflow:
# 1. Scrape jobs from multiple sources
# 2. Deduplicate and score matches
# 3. Write to Google Sheets
# 4. Send WhatsApp summary
# 5. Wait for approval
# 6. Auto-apply to approved jobs
```

### 2. Learning Progress

```bash
# Check daily progress
node automation/learning-tracker.js

# Expected workflow:
# 1. Check today's learning minutes
# 2. If gap > 30min, propose micro-tasks
# 3. Send WhatsApp proposal
# 4. Wait for approval
# 5. Create calendar blocks
```

### 3. Portfolio Automation

```bash
# Generate portfolio post from GitHub activity
node automation/github-activity-tracker.js

# Expected workflow:
# 1. Analyze GitHub activity (last 7 days)
# 2. Generate 120-word portfolio post
# 3. Send WhatsApp preview
# 4. Wait for approval
# 5. Schedule across platforms
```

## Key Performance Indicators (KPIs)

The system tracks and reports:

### Daily Metrics
- Applications submitted
- Learning minutes completed
- GitHub commits/activities
- Social media posts scheduled
- CI success rate

### Weekly Analytics
- Application response rate
- Interview conversion rate
- Learning streak maintenance
- Portfolio engagement metrics
- Network growth

### Monthly Goals
- 60-75 quality job applications
- 15-20% application response rate
- 150+ new LinkedIn connections
- 300+ portfolio website visits

## Configuration

### Learning Plan Structure (16 weeks)

1. **Weeks 1-4**: Python & Data Analysis Foundations
2. **Weeks 5-8**: Bioinformatics Tools & Techniques
3. **Weeks 9-12**: Pharmaceutical Industry Applications
4. **Weeks 13-16**: Portfolio Development & Job Search

### Job Targeting

Primary focus on Indian pharmaceutical companies:
- Sun Pharma, Zydus Cadila, Dr. Reddy's
- Biocon, Lupin, Cipla, Aurobindo
- QC/Lab/Bioinformatics positions

### Approval Workflow

All automated actions require explicit approval:
1. WhatsApp message with action preview
2. 15-minute timeout window
3. "Approve" keyword to proceed
4. Automatic fallback if no response

## Monitoring & Maintenance

### Health Checks
```bash
# Check all services
node automation/main.js health

# Individual service checks
# - WhatsApp API connectivity
# - Google Sheets access
# - GitHub API limits
# - Social media API status
```

### Error Handling
- Automatic retry with exponential backoff
- Error logging to Google Sheets
- WhatsApp notifications for critical failures
- Graceful degradation for non-critical errors

### Data Privacy
- All credentials stored as environment variables
- No sensitive data in code
- GDPR-compliant data handling
- Secure API token management

## Contributing

1. Fork the repository
2. Create feature branch
3. Ensure all tests pass
4. Add comprehensive documentation
5. Submit pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check troubleshooting section
2. Review error logs in Google Sheets
3. Verify environment configuration
4. Create GitHub issue with details

---

**🎯 Goal**: Automate 80% of biotech job search activities while maintaining human oversight for critical decisions.

**📈 Success Metrics**: 3x improvement in application efficiency, 2x increase in response rates, consistent skill development progress.