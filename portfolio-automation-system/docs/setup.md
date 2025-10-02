# Setup Guide

## Overview
- Import one of the workflows into n8n:
  - Demo (uses custom Predis/Buffer nodes)
  - HTTP-only (uses standard HTTP Request node for Predis + Buffer)
- Connect credentials
- Point Google Sheets to your topic list
- Test and turn on

## Prerequisites
- n8n Cloud or self-hosted
- OpenAI API key
- Google Sheets with topics (see sheets/topics.sample.csv)
- Predis AI API key (or any image API)
- Buffer access token + profile IDs (LinkedIn, Facebook)

## Env Vars (for HTTP-only workflow)
Create .env in n8n (Variables):
- OPENAI_API_KEY
- GOOGLE_SHEETS_ID
- PREDIS_API_KEY (if using Bearer in HTTP node, set as credential header)
- BUFFER_ACCESS_TOKEN
- BUFFER_PROFILE_ID_LINKEDIN
- BUFFER_PROFILE_ID_FACEBOOK

## Google Sheets
- Columns: Project, Link, Context
- Range used: Sheet1!A2:C2 pulls the next row
- For multiple rows rotation:
  - Add a "Status" column and filter for "Pending"
  - After posting, mark it "Done" using Google Sheets "update" operation

## Credentials Mapping (n8n)
- OpenAI: "OpenAI API" credential
- Google Sheets: "Google Sheets OAuth2"
- Predis: Use HTTP Request with Auth header:
  - Authorization: Bearer {{PREDIS_API_KEY}}
- Buffer: HTTP Request with access_token as query param

## Buffer Notes
- Endpoint: https://api.bufferapp.com/1/updates/create.json
- Required: access_token, profile_ids[], text, media.photo
- Set now=false to schedule via Buffer's queue; or use "scheduled_at" to time posts.

## Testing
1. Run "Get Topic" node → verify JSON (project/link/context).
2. Run "OpenAI: Generate Post" → check post text.
3. Run "Predis (HTTP)" → ensure imageUrl in response.
4. Run "Buffer (HTTP) Schedule" → verify queued updates in Buffer.

## Production Tips
- Add error branches and retry logic on HTTP nodes.
- Add a "Wait" node if you want image generation to complete asynchronously.
- Log outputs to Google Sheets/Notion for auditing.
- Add UTM parameters in portfolio links.