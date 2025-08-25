# n8n Automation Setup (Docker)

## 1) Prepare .env
Copy `.env.example` to `.env` and set:
- DOMAIN, EMAIL, WEBHOOK_URL (e.g., https://n8n.example.com/)
- N8N_ENCRYPTION_KEY (generate one: `openssl rand -base64 32`)
- For local dev without HTTPS: set `N8N_SECURE_COOKIE=false`, `WEBHOOK_URL=` blank or http URL.

## 2) Local/dev (no HTTPS)
```bash
docker compose --env-file .env -f docker-compose.basic.yml up -d
```
Open http://localhost:5678

## 3) With HTTPS + Caddy
Point your DNS A/AAAA to this host, then:
```bash
docker compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
```
Open https://$DOMAIN

## 4) Notes
- WEBHOOK_URL should be your final public URL (esp. behind proxy/tunnel).
- Keep `N8N_TRUST_PROXY=true` when behind Caddy/Nginx/Traefik.
- For Execute Command node extra tools, build and use `n8n-extended` image, or run commands on a separate worker host.

## 5) Parul University Account Setup
- Primary Account: 22034563001@paruluniversity.ac.in
- Backup Account: balaji.web.design1@gmail.com
- Instance ID: 8f75859920be976c80a11c1dd4be8852c698c893b1073cb8716ee93cd8d6a3c9
- Version: 1.108.1
- License: Sustainable Use License + n8n Enterprise License

## 6) Workflow Migration Guide
1. Export existing workflows from balaji.web.design1@gmail.com account
2. Import into 22034563001@paruluniversity.ac.in account
3. Update all credentials and API keys
4. Test each workflow component
5. Validate execution flow
6. Set up monitoring and alerts

## 7) Security Configuration
- Enable 2FA on both accounts
- Use environment variables for sensitive data
- Encrypt all credentials
- Regular backup of workflows
- Monitor execution logs for security issues

## 8) Offline Configuration
- Local AI models setup (Gemma 3n, SHAKTI)
- VPN switching capabilities
- Cached data for offline operation
- Local execution environment
- High-speed performance optimization