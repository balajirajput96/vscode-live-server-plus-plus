# n8n Custom Docker Image with additional tools
FROM docker.n8n.io/n8nio/n8n:latest

# Switch to root user to install packages
USER root

# Install additional tools for automation
RUN apk --update add \
    curl \
    wget \
    git \
    python3 \
    py3-pip \
    nodejs \
    npm \
    bash \
    openssh-client \
    && rm -rf /var/cache/apk/*

# Install Python packages for bioinformatics automation
RUN pip3 install pandas numpy matplotlib seaborn requests

# Switch back to node user
USER node

# Set working directory
WORKDIR /home/node

# Copy custom workflows if any
COPY --chown=node:node ./workflows /home/node/.n8n/workflows

# Expose n8n port
EXPOSE 5678