# n8n Automation Setup (Docker) + Perplexity AI Pro Integration

## 1) Prepare .env
Copy `.env.example` to `.env` and set:
- DOMAIN, EMAIL (now configured for balaji.web.design1@gmail.com), WEBHOOK_URL (e.g., https://n8n.example.com/)
- N8N_ENCRYPTION_KEY (generate one: `openssl rand -base64 32`)
- PERPLEXITY_API_KEY (get from your Perplexity AI Pro account)
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

## 5) Perplexity AI Pro Integration
After n8n is running:

1. **Get Perplexity API Key**:
   - Login to [perplexity.ai](https://perplexity.ai) with balaji.web.design1@gmail.com
   - Navigate to API settings and generate an API key
   - Add to your `.env` file: `PERPLEXITY_API_KEY=your_api_key_here`

2. **Import Workflows**:
   ```bash
   # Import the provided workflow templates
   cp n8n-workflows/*.json /path/to/your/n8n/data/workflows/
   ```

3. **Configure Credentials**:
   - In n8n web interface, go to Settings → Credentials
   - Add "HTTP Header Auth" credential for Perplexity API
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_PERPLEXITY_API_KEY`

4. **Test Integration**:
   - Import `perplexity-content-generator.json` workflow
   - Test with webhook: `POST /webhook/generate-content`
   - Payload: `{"topic": "Bioinformatics trends", "content_type": "linkedin_post"}`

See `n8n-perplexity-integration.md` for detailed setup instructions and workflow examples.