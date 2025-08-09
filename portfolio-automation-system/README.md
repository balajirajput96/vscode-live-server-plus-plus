# 🚀 AI-Powered Portfolio & Social Media Automation System

## 🎯 Overview
This system automates your entire digital presence as a Biotechnology & Bioinformatics professional, including portfolio website, GitHub documentation, LinkedIn optimization, and social media content generation.

## 🛠️ System Components

### 1. Portfolio Website Generator
- **Tool**: Wix AI Website Builder
- **Purpose**: Professional portfolio showcasing biotech & bioinformatics skills
- **Features**: Auto-generated content, responsive design, SEO optimized

### 2. GitHub Documentation Automation
- **Tool**: DocuWriter.ai + Custom Scripts
- **Purpose**: Professional README.md and documentation for all projects
- **Features**: Auto-analysis of Python scripts, technical documentation

### 3. Social Media Content Generator
- **Tool**: ChatGPT + Custom Prompts
- **Purpose**: LinkedIn, Facebook, and Twitter content automation
- **Features**: Industry-specific hashtags, engaging content, scheduled posting

### 4. LinkedIn Profile Optimizer
- **Tool**: AI-powered content generation
- **Purpose**: Professional headline and about section optimization
- **Features**: Keyword optimization, industry-specific language

### 5. n8n AI Agent Automation Pack 🆕
- **Tool**: n8n workflows + OpenAI + Predis + Buffer
- **Purpose**: Automated weekly social posts from Google Sheets
- **Features**: No-code automation, custom/HTTP nodes, scheduled posting
- **See**: [AI-AGENT-README.md](AI-AGENT-README.md) for setup guide

## 📚 Documentation & Guides

### Core Setup Guides
- **[Quick Start Guide](AI-AGENT-README.md)** - Get started with n8n automation
- **[Setup Guide](docs/setup.md)** - Detailed n8n configuration
- **[Database Connection Guide](docs/database-connection.md)** - Connect your portfolio projects to SQL databases

- Use prompts from the [AI Prompts Library](prompts/ai-prompts-library.md)
- Follow database connectivity best practices in the [Database Connection Guide](docs/database-connection.md)

## 📁 Project Structure
```
portfolio-automation-system/
├── prompts/                 # AI prompts for different tasks
│   ├── ai-prompts-library.md    # Copy-paste ready prompts for all platforms
│   ├── github-documentation-prompts.md
│   ├── linkedin-optimization-prompts.md
│   └── website-builder-prompts.md
├── templates/              # Content templates
├── automation/             # Automation scripts
├── workflows/              # n8n automation workflows
│   └── n8n/               # n8n JSON workflow files
│       ├── demo-weekly-social-posts.json
│       └── http-variant-weekly-social-posts.json
├── sheets/                 # Sample data sheets
│   └── topics.sample.csv  # Example Google Sheets format
├── docs/                   # Documentation
│   ├── setup.md           # n8n setup guide
│   └── database-connection.md  # Database connectivity guide
├── .env.example           # Environment variables template
└── AI-AGENT-README.md     # Quick start for n8n automation
```

## 🚀 Quick Start

1. **Setup Portfolio Website**
   ```bash
   # Use Wix AI Builder with provided prompts
   ```

2. **Generate GitHub Documentation**
   ```bash
   # Use DocuWriter.ai with project analysis prompts
   ```

3. **Optimize LinkedIn Profile**
   ```bash
   # Use ChatGPT with career optimization prompts
   ```

4. **Automate Social Media Posts**
   ```bash
   # Use provided automation scripts
   ```

## 📊 Weekly Automation Workflow

| Day | Task | Tool | Output |
|-----|------|------|--------|
| Monday | New Project Summary | Predis.ai | LinkedIn Post |
| Tuesday | GitHub Documentation | DocuWriter.ai | README.md |
| Wednesday | LinkedIn Outreach | Taplio | 10 Connections |
| Thursday | Blog Writing | ChatGPT | Medium Article |
| Friday | Resume Update | Wix Editor | Portfolio Refresh |
| Saturday | Career Research | Perplexity | Job Trends |
| Sunday | Progress Review | Notion | Weekly Report |

## 🎨 Customization

### For Biotechnology Professionals
- Focus on lab techniques, data analysis, and research projects
- Include Python, SQL, and bioinformatics tools
- Target pharmaceutical and clinical research companies

### For Bioinformatics Specialists
- Emphasize computational biology and data science skills
- Showcase machine learning and statistical analysis projects
- Target biotech startups and research institutions

## 🔧 Technical Requirements

- Node.js 16+
- Python 3.8+
- Git
- API keys for various services
- Database connectivity (PostgreSQL, MySQL, etc.) - see [Database Connection Guide](docs/database-connection.md)

## 📈 Success Metrics

- Portfolio website visits
- LinkedIn profile views
- GitHub repository stars
- Job interview invitations
- Social media engagement

## 🆘 Support

For technical issues or customization requests, please refer to the documentation in the `docs/` folder or create an issue in the repository.

---

**Built with ❤️ for Biotechnology & Bioinformatics Professionals**