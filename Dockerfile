# Dockerfile for Cloud Deployment (Railway, Render, etc.)
# Optimized n8n deployment with all dependencies

FROM n8nio/n8n:latest

# Set user to root for installation
USER root

# Install additional dependencies
RUN apk add --no-cache \
    curl \
    bash \
    git \
    openssh-client \
    ca-certificates \
    python3 \
    py3-pip

# Create necessary directories
RUN mkdir -p /home/node/.n8n && \
    chown -R node:node /home/node/.n8n

# Switch back to node user
USER node

# Set working directory
WORKDIR /home/node

# Environment variables (can be overridden by platform)
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=https
ENV N8N_SECURE_COOKIE=true
ENV EXECUTIONS_DATA_SAVE_ON_ERROR=all
ENV EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
ENV EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
ENV GENERIC_TIMEZONE=America/New_York

# Expose port
EXPOSE 5678

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:5678/healthz || exit 1

# Start n8n
CMD ["n8n"]
