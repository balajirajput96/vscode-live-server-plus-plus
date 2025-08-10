# n8n Docker Setup (Postgres + Redis + Queue Workers + Optional HTTPS via Caddy)

## Quick start
1) Copy env file
   ```bash
   cp .env.example .env
   ```
   - Local only: set N8N_HOST=localhost, N8N_PROTOCOL=http, WEBHOOK_URL=http://localhost:5678/, N8N_TRUST_PROXY=false
   - With domain + HTTPS: set DOMAIN, ACME_EMAIL; keep N8N_PROTOCOL=https, WEBHOOK_URL=https://your-domain/, N8N_TRUST_PROXY=true

2) Generate secrets
   - `openssl rand -base64 48` → put into N8N_ENCRYPTION_KEY
   - Choose a strong POSTGRES_PASSWORD

3) Start
   - Local (no proxy): 
     ```bash
     docker compose up -d
     ```
     Open http://localhost:5678
   - With HTTPS (domain): 
     ```bash
     docker compose up -d
     ```
     Open https://your-domain (Caddy auto‑TLS)

## Queue workers (scaling)
- Default brings up 1 worker. Scale as needed:
  ```bash
  docker compose up -d --scale n8n-worker=3
  ```
- Adjust WORKER_CONCURRENCY in .env to tune per-worker throughput.

## Operational tips
- **Webhook URL:**
  - Local: WEBHOOK_URL=http://localhost:5678/
  - HTTPS domain: WEBHOOK_URL=https://your-domain/
  - Behind proxy, keep N8N_TRUST_PROXY=true

- **Timezone:** set GENERIC_TIMEZONE/TZ (e.g., Asia/Kolkata)

- **Data retention:**
  - Success executions: none (recommended)
  - Error executions: all
  - Pruning: enabled, 14 days (tweak in .env)

- **Basic auth (optional):**
  - Uncomment N8N_BASIC_AUTH_* in .env for an extra protection layer.

- **Metrics:**
  - Set N8N_METRICS=true to expose /metrics (behind your proxy).

- **Updating:**
  ```bash
  docker compose pull && docker compose up -d
  ```

- **Logs:**
  ```bash
  docker compose logs -f n8n n8n-worker caddy
  ```

- **Health:**
  - n8n: GET /healthz is used for healthcheck
  - Postgres/Redis healthchecks are built-in in compose

## Execute Command node
- Commands run inside the n8n container. If you need extra tools (curl/ssh/python), create a small custom image based on n8nio/n8n and install packages, or mount tools via volumes.

## Reverse proxy notes
- Prefer setting WEBHOOK_URL to the final public URL to avoid wrong webhook links.
- Keep N8N_SECURE_COOKIE=true when using HTTPS.