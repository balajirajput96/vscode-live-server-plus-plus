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

## 5) Account Migration Setup
### Balaji's Account Configuration
- Primary Email: balaji.web.design1@gmail.com
- University Email: 22034563001@paruluniversity.ac.in
- Instance ID: 8f75859920be976c80a11c1dd4be8852c698c893b1073cb8716ee93cd8d6a3c9
- Version: 1.108.1

### Migration Process
1. Export existing workflows from balaji.web.design1@gmail.com account
2. Set up new n8n instance with paruluniversity.ac.in credentials
3. Import workflows and configure all credentials
4. Test all nodes and connections
5. Set up email notifications to confirm successful migration

## 6) Pro Version Features
- Enhanced performance optimization
- Advanced security configurations
- Offline functionality support
- High-speed execution without internet dependency
- Multi-region VPN support
- Local AI model integration