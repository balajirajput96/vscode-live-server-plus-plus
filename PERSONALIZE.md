# 🎨 Personalize Your Automation System

This guide will walk you through the process of personalizing the deployment and automation components of this project.

**Important:** This project is a VS Code extension called `Live Server++`. The core functionality of the extension is not meant to be personalized. The following steps are for customizing the `n8n` deployment and automation system that is bundled with this project.

## 1. Configure Your Environment

The most important step is to configure your environment variables. These are the settings that control how your `n8n` instance runs.

1.  **Copy the example file:**
    ```bash
    cp .env.example .env
    ```

2.  **Edit the `.env` file:**
    Open the `.env` file in a text editor and update the following values:

    *   `N8N_BASIC_AUTH_USER`: Your desired username for n8n.
    *   `N8N_BASIC_AUTH_PASSWORD`: A strong password for n8n.
    *   `DOMAIN`: Your domain name (if deploying to production).
    *   `EMAIL`: Your email address (for SSL).
    *   `WEBHOOK_URL`: Your n8n webhook URL.
    *   `ENCRYPTION_KEY`: A randomly generated key (you can create one with `openssl rand -base64 32`).
    *   `N8N_LISTEN_ADDRESS`: Set to `0.0.0.0` if you have issues with IPv6.

## 2. Customize the Automation Workflows

The `n8n-workflows/` directory contains several pre-built automation workflows. You should customize these to fit your needs.

1.  **Import the workflows:**
    Import the JSON files from the `n8n-workflows/` directory into your n8n instance.

2.  **Update the workflows:**
    Open each workflow in the n8n editor and update the following:

    *   **Credentials:** Replace the placeholder credentials with your own API keys and tokens.
    *   **Content:** Customize the content of social media posts, emails, and other messages.
    *   **Triggers:** Adjust the triggers to match your desired schedule and conditions.

## 3. Personalize the Documentation

Finally, you should update the documentation to reflect your changes.

*   **`README.md`**: Update the `README.md` file to describe your personalized automation system.
*   **`DEPLOYMENT.md`**: Update the `DEPLOYMENT.md` file with your specific deployment details.
*   **Other documentation:** Review the other documentation files and update them as needed.

By following these steps, you can transform the bundled automation system into a powerful, personalized tool that is tailored to your specific needs.