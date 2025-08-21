# 🔐 Security Configuration and Best Practices

## Security Checklist

### ✅ Account Security
- [ ] **GitHub**: 2FA enabled, strong password
- [ ] **Google/Gmail**: 2FA enabled, app passwords for automation
- [ ] **OpenAI**: 2FA enabled, API key rotation schedule
- [ ] **n8n Instance**: Basic auth enabled, secure passwords
- [ ] **University Accounts**: 2FA where available

### ✅ API Key Management
- [ ] All keys stored in secure vaults (not plain text)
- [ ] GitHub Secrets configured for repository automation
- [ ] n8n credentials vault used for workflow keys
- [ ] Regular rotation schedule (monthly recommended)
- [ ] Access logs monitored

### ✅ Network Security
- [ ] HTTPS enabled for all public endpoints
- [ ] Basic authentication for n8n instance
- [ ] Reverse proxy configured correctly
- [ ] Firewall rules applied
- [ ] VPN access for sensitive operations

---

## API Key Security Guidelines

### Storage Best Practices
```bash
# ❌ NEVER do this - plain text in files
OPENAI_API_KEY=sk-1234567890abcdef

# ✅ ALWAYS do this - use environment variables
export OPENAI_API_KEY="$(cat ~/.secrets/openai_key)"

# ✅ Or use secure vault systems
# GitHub Secrets, n8n credentials vault, etc.
```

### Key Rotation Schedule
```bash
#!/bin/bash
# monthly-key-rotation.sh

# Set calendar reminder for monthly execution
# This script helps track when keys need rotation

KEYS_TO_ROTATE=(
    "OPENAI_API_KEY"
    "GEMINI_API_KEY" 
    "GITHUB_PAT"
    "N8N_BASIC_AUTH_PASSWORD"
)

echo "🔄 Monthly Key Rotation Reminder - $(date)"
echo "Keys to check/rotate:"

for key in "${KEYS_TO_ROTATE[@]}"; do
    echo "  - $key"
done

echo ""
echo "✅ Update locations:"
echo "  - GitHub Repository Secrets"
echo "  - n8n Credentials Vault"
echo "  - Local .env files"
echo "  - Documentation (if containing examples)"
```

### GitHub Security Configuration
```yaml
# .github/security.yml
security:
  # Enable security advisories
  advisories: true
  
  # Enable dependency scanning
  dependency_scanning: true
  
  # Secret scanning (automatically enabled for public repos)
  secret_scanning: true
  
  # Code scanning with CodeQL
  code_scanning:
    enabled: true
    languages: ["javascript", "typescript"]
```

---

## n8n Security Configuration

### Environment Security
```bash
# .env security settings for n8n
N8N_BASIC_AUTH=true
N8N_BASIC_AUTH_USERNAME=admin_user_$(date +%s)
N8N_BASIC_AUTH_PASSWORD=$(openssl rand -base64 32)

# Secure cookies (HTTPS only)
N8N_SECURE_COOKIE=true

# Proxy trust (when behind reverse proxy)
N8N_TRUST_PROXY=true

# Disable user management UI (single-user mode)
N8N_USER_MANAGEMENT_DISABLED=true

# Restrict webhook access
N8N_WEBHOOK_TUNNEL_ENABLED=false

# Encryption for credentials storage
N8N_ENCRYPTION_KEY=$(openssl rand -base64 32)

# Log level (avoid debug in production)
N8N_LOG_LEVEL=info
```

### Workflow Security Best Practices
```javascript
// ❌ NEVER store credentials in workflow nodes
{
  "parameters": {
    "authentication": "generic",
    "credential": "openaiApi",  // ✅ Use credential references
    "apiKey": "sk-1234..."     // ❌ Never plain text API keys
  }
}

// ✅ ALWAYS use n8n credentials vault
// 1. Settings → Credentials → Add Credential
// 2. Select credential type (OpenAI, Gmail, etc.)
// 3. Enter credentials securely
// 4. Reference in nodes by name

// ✅ Validate input data in workflows
const validateInput = (input) => {
  // Sanitize user input
  const sanitized = input.replace(/[<>]/g, '');
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (input.email && !emailRegex.test(input.email)) {
    throw new Error('Invalid email format');
  }
  
  // Limit query length
  if (input.query && input.query.length > 500) {
    throw new Error('Query too long');
  }
  
  return sanitized;
};
```

---

## GitHub Repository Security

### Repository Settings
```yaml
# Security settings to enable in GitHub repo settings:
# Settings → Security & analysis

security_settings:
  # Enable all security features
  dependency_graph: enabled
  dependabot_alerts: enabled
  dependabot_security_updates: enabled
  secret_scanning: enabled
  push_protection: enabled  # Prevents pushing secrets
  
  # Branch protection rules
  branch_protection:
    main:
      - require_status_checks: true
      - require_branches_up_to_date: true
      - require_pull_request_reviews: true
      - restrict_pushes: true
```

### Secret Management
```bash
# GitHub Secrets configuration (via web interface)
# Repository → Settings → Secrets → Actions

# Required secrets for automation:
OPENAI_API_KEY=sk-...        # OpenAI API access
N8N_WEBHOOK_URL=https://...  # n8n webhook endpoint
GEMINI_API_KEY=...           # Google Gemini API (optional)

# Optional deployment secrets:
AZURE_PUBLISH_PROFILE=...    # Azure deployment
AZURE_CREDENTIALS=...        # Azure service principal

# Security secrets:
ENCRYPTION_KEY=...           # Additional encryption key
SIGNING_SECRET=...           # Webhook signature verification
```

### Dependabot Configuration
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "balajirajput96"
    assignees:
      - "balajirajput96"
    commit-message:
      prefix: "security"
      include: "scope"
```

---

## Network and Infrastructure Security

### Reverse Proxy Security (Caddy)
```caddy
# Caddyfile security configuration
{
    # Global security headers
    header {
        # Security headers
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
        
        # Hide server information
        -Server
        -X-Powered-By
    }
    
    # Rate limiting
    rate_limit {
        zone dynamic {
            key {remote_host}
            events 100
            window 1m
        }
    }
}

# n8n subdomain with security
n8n.example.com {
    # Basic authentication
    basicauth /* {
        admin $2a$14$...  # bcrypt hashed password
    }
    
    # Rate limiting for API endpoints
    rate_limit {
        zone api {
            key {remote_host}
            events 60
            window 1m
        }
    }
    
    reverse_proxy localhost:5678 {
        # Security headers
        header_up Host {upstream_hostport}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }
}
```

### Docker Security
```yaml
# docker-compose.yml security configuration
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    
    # Security settings
    user: "1000:1000"  # Non-root user
    read_only: true    # Read-only filesystem
    
    # Resource limits
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
    
    # Security options
    security_opt:
      - no-new-privileges:true
    
    # Network security
    networks:
      - n8n-network
    
    # Environment security
    environment:
      - N8N_SECURE_COOKIE=true
      - N8N_BASIC_AUTH=true
    
    # Volume security
    tmpfs:
      - /tmp:noexec,nosuid,size=100m

networks:
  n8n-network:
    driver: bridge
    internal: false  # Set to true if no external access needed
```

---

## Monitoring and Alerting

### Security Monitoring Script
```bash
#!/bin/bash
# security-monitor.sh

# Monitor for security events
monitor_security() {
    echo "🔍 Security Monitoring - $(date)"
    
    # Check for failed authentication attempts
    echo "📊 Failed auth attempts (last 24h):"
    grep "authentication failed" /var/log/n8n/*.log | wc -l
    
    # Check for suspicious API usage
    echo "📊 High-frequency API calls:"
    grep "rate limit" /var/log/nginx/access.log | tail -5
    
    # Monitor certificate expiry
    echo "📊 SSL certificate status:"
    echo | openssl s_client -connect n8n.example.com:443 2>/dev/null | \
    openssl x509 -noout -dates
    
    # Check for known vulnerable dependencies
    echo "📊 Dependency security scan:"
    npm audit --audit-level moderate
}

# Send alerts if issues found
send_alert() {
    local message="$1"
    # Send to webhook, email, or notification service
    curl -X POST "$ALERT_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{\"text\":\"Security Alert: $message\"}"
}

# Run monitoring
monitor_security
```

### Backup and Recovery
```bash
#!/bin/bash
# backup-security.sh

# Backup critical configurations
backup_configs() {
    BACKUP_DIR="/backups/$(date +%Y%m%d)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup n8n data (encrypted)
    tar -czf - ~/.n8n | gpg --cipher-algo AES256 --compress-algo 1 \
        --symmetric --output "$BACKUP_DIR/n8n-backup.tar.gz.gpg"
    
    # Backup environment files (without secrets)
    cp .env.example "$BACKUP_DIR/"
    
    # Backup workflow exports
    cp n8n-workflows/*.json "$BACKUP_DIR/"
    
    echo "✅ Backup completed: $BACKUP_DIR"
}

# Automated backup schedule (add to crontab)
# 0 2 * * * /path/to/backup-security.sh
```

---

## Compliance and Documentation

### Security Documentation Requirements
- [ ] **Access Control**: Who has access to what systems
- [ ] **Key Inventory**: List of all API keys and their purposes  
- [ ] **Incident Response**: Steps for security incidents
- [ ] **Recovery Procedures**: Backup and restore processes
- [ ] **Audit Trail**: Logging and monitoring setup
- [ ] **Update Schedule**: Regular security update timeline

### University Compliance
```yaml
# University-specific security requirements
university_compliance:
  data_protection:
    - student_data_encryption: true
    - gdpr_compliance: true
    - data_retention_policy: "7 years"
    
  access_controls:
    - multi_factor_auth: required
    - role_based_access: true
    - regular_access_review: quarterly
    
  monitoring:
    - security_logs: enabled
    - incident_response: documented
    - vulnerability_scanning: monthly
```

---

## Emergency Procedures

### Security Incident Response
```bash
# emergency-response.sh
# Run if security breach suspected

# 1. Immediate actions
revoke_api_keys() {
    echo "🚨 EMERGENCY: Revoking all API keys"
    # Disable GitHub PATs
    # Revoke OpenAI keys
    # Change n8n passwords
    # Update all secrets
}

# 2. Assess damage
assess_breach() {
    echo "🔍 Assessing potential damage"
    # Check access logs
    # Review recent activities
    # Identify affected systems
}

# 3. Notify stakeholders
notify_breach() {
    echo "📢 Notifying relevant parties"
    # University IT security team
    # GitHub security team (if needed)
    # Affected users
}

# Emergency contact information
SECURITY_CONTACTS=(
    "university-it@paruluniversity.ac.in"
    "security-team@paruluniversity.ac.in"
)
```

---

**🛡️ Remember: Security is an ongoing process, not a one-time setup. Review and update these configurations regularly!**