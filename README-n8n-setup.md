# n8n Automation Setup (Docker)

## 1) Prepare .env
Copy `.env.template` to `.env` and set:
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

## 5) Migration from n8n Cloud
1. Export workflows from n8n Cloud (Settings → Export)
2. Import workflows to your self-hosted instance (Settings → Import)
3. Update webhook URLs in your external apps
4. Test all workflows before switching completely
5. Cancel n8n Cloud subscription after confirming everything works

## 6) Health Monitoring
Use the provided `comprehensive_health_check.sh` script to monitor your n8n instance:
```bash
./comprehensive_health_check.sh
```

## 7) Backup Strategy
- Database backups are automated daily
- Workflow exports are stored in `/backup` volume
- Use `scripts/backup.sh` for manual backups

## 8) Security Best Practices
- Use strong N8N_ENCRYPTION_KEY
- Enable N8N_BASIC_AUTH for production
- Keep Docker images updated
- Use HTTPS in production
- Restrict database access