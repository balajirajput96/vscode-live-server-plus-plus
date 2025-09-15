# Balaji Rajput's Personal AI Automation System

Welcome to your unified AI-powered automation system. This project combines a professional portfolio dashboard with a powerful, command-driven automation engine powered by n8n. This guide explains the structure and how to get everything set up.

---

## 🚀 Core Components

This repository has been organized into a clean, modular structure. Here's what each part does:

-   `📁 portfolio_website/`: This is your professional dashboard and portfolio. Open the `index.html` file in a browser to see and use it. It has been personalized for you and enhanced for maintainability.
-   `📁 n8n_workflows/`: Contains all the n8n workflow JSON files.
    -   `n8n_workflows/00_main_command_router.json`: The most important workflow. This is the central brain that receives all your commands.
    -   `n8n_workflows/commands/`: Contains the individual task workflows (like posting to social media) that the main router calls.
    -   `n8n_workflows/existing_workflows/`: A collection of your previous workflows, kept for reference.
-   `📁 docs/`: Contains the core documentation for the system.
    -   `docs/AI_INSTRUCTIONS.md`: **The AI's Brain.** This file tells the AI agent how to behave. You can edit this file to change the AI's instructions, personality, and commands.
-   `📁 scripts/`: A centralized location for all the helper scripts (`.py`, `.js`, `.sh`) found in the original repository.
-   `📁 templates/`: Contains the consolidated library of AI prompts and other templates.
    -   `templates/prompts_library.md`: A master file containing all the high-quality prompts for generating resumes, social media posts, and more.
-   `📁 archive/`: Contains all the files and folders from the original repository that were duplicates or have been superseded by the new, unified system.

---

## ⚙️ How It Works: The Automation Flow

The system is designed for one-command automation. Here's the high-level flow:

1.  **Command:** You issue a command via an Android voice trigger, an HTTP Shortcut, or an email.
2.  **Router Receives:** The command is sent to your n8n instance and is caught by the **`00_main_command_router.json`** workflow.
3.  **Router Analyzes:** A Switch node inside the router analyzes your command to understand its intent (e.g., it looks for keywords like "resume" or "linkedin").
4.  **Task Dispatched:** The router triggers the appropriate sub-workflow from the `n8n_workflows/commands/` directory.
5.  **AI Executes:** The sub-workflow, guided by the master prompt in `docs/AI_INSTRUCTIONS.md`, performs the task (e.g., drafting a post, generating a document).
6.  **Result Returned:** The system returns a structured JSON response to you, containing links to documents, drafts for approval, or status updates.

---

## 🛠️ Setup and Installation Guide

Follow these steps to get the system fully operational.

### Step 1: View Your Portfolio Dashboard

No complex setup is needed to view the dashboard.
-   Simply navigate to the `portfolio_website/` directory.
-   Open the `index.html` file in any modern web browser (like Chrome, Firefox, or Edge).
-   For the best experience, you can use a simple tool like the "Live Server" extension in VS Code to serve the file locally.

### Step 2: Set Up n8n Workflows

You need to import the workflows into your n8n instance at `balajiwebdesign.app.n8n.cloud`.

1.  **Import the Main Router:**
    -   In your n8n dashboard, go to "Workflows" and click "Import from File".
    -   Select and upload `n8n_workflows/00_main_command_router.json`.
2.  **Import the Command Workflows:**
    -   Repeat the process for the command workflows located in `n8n_workflows/commands/`. Start with `social_media_poster.json`.
    -   **Important:** The "Execute Workflow" nodes in the main router refer to other workflows by name. Ensure the names match up in your n8n instance.
3.  **Activate the Workflows:** Make sure to activate the main router and any command workflows you have imported. The webhook in the main router will give you a URL to send your commands to.

### Step 3: Configure Credentials & Environment

The automation workflows need to connect to various services.

1.  **n8n Credentials:**
    -   In your n8n instance, go to the "Credentials" section.
    -   Add new credentials for each service you need to connect to (e.g., Google for Gmail/Drive, OpenAI, LinkedIn, etc.). The workflows I've provided will show you which credentials you need to create.
2.  **Environment Variables:**
    -   Some workflows may require environment variables (like API keys or Sheet IDs).
    -   This project includes a `.env.example` file which lists the variables needed for the social media posting workflow.
    -   You will need to set these variables in your n8n server environment or directly in the workflow where needed.

---

## ▶️ Usage Examples

Once set up, you can send commands to the webhook URL provided by the `00_main_command_router.json` workflow. The command should be in a JSON format in the body of a POST request:

```json
{
  "command": "Draft a LinkedIn post about my latest project on DNA sequence analysis."
}
```

Or simply:

```json
{
  "command": "create my resume"
}
```

The system will process the command and execute the correct workflow.

---

## 🧠 Modifying the AI's Brain

The heart of the AI's intelligence is the **`docs/AI_INSTRUCTIONS.md`** file. If you want to change how the AI responds, add new commands, or modify its personality, simply edit this Markdown file. The n8n workflows are designed to fetch and use these instructions for every execution.
