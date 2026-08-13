# Day 5: End-to-End AI Document Processing Workflow

## Task Description
Build an end-to-end automation that receives a document, summarizes it using AI, stores the result, and sends a notification.

## Overview
This folder contains the complete, final automation for Day 5! This workflow simulates a real-world corporate pipeline where a business receives a long document over the web, automatically reads it, uses AI to extract the key points, securely stores the summary in the workflow's database, and instantly alerts the team via **Telegram**!
**you can check the bot on telegram if you type in search bar "Week6_day5_bot"**

## Workflow Details
1. **Manual Trigger**: Starts the workflow.
2. **Receive Document (Download)**: Uses an HTTP Request node to securely download a massive text document directly from the internet (n8n's official GitHub README). This bypasses any local folder permission issues.
3. **AI Summarizer (Gemini 2.5 Flash)**: Reads the downloaded text and uses a strict prompt to boil it down to exactly 3 short, readable bullet points.
4. **Store Result (Database)**: Uses a Set node to permanently save the AI summary into the internal workflow memory (simulating a database save).
5. **Send Telegram Notification**: Takes the securely stored summary and automatically sends it as a perfectly formatted Markdown message directly to your phone via Telegram!

## How to Test It
1. Open n8n and import `day5_workflow.json`.
2. **Setup Telegram**: Double-click the "Send Telegram Notification" node. Make sure you have created a credential using your Bot Token (from `@BotFather`) and entered your Chat ID.
3. Click **Test Workflow**.
4. Watch the nodes execute one by one!
5. **The Magic Moment**: Your phone will instantly buzz with a Telegram message containing the perfect AI summary of the downloaded document!
