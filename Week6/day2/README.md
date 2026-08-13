# Day 2: Scheduled API Data Exchange in n8n

## Task Description
Connect two external APIs inside n8n and exchange data between them successfully (running automatically on a schedule, applying Day 1 concepts).

## Overview
This directory contains an exported n8n workflow (`api_exchange_workflow.json`) that fulfills the task requirements. The workflow fetches data from a public API and then sends that exact data as URL Query Parameters to a completely different API. It is configured to run automatically every 1 hour, perfectly combining the tasks of Day 1 and Day 2.

## Workflow Details
The workflow consists of three connected nodes:
1. **Schedule Trigger**: Set to run automatically every 1 hour.
2. **Fetch Cat Fact (API 1)**: Performs a `GET` request to `https://catfact.ninja/fact` to retrieve a random fact about cats.
3. **Send Data to External API (API 2)**: Performs a `GET` request to `https://httpbin.org/get`. It dynamically reads the `"fact"` text that was fetched from the first API (using the expression `{{ $json.fact }}`) and securely appends it to the URL as a query parameter (e.g., `?fact=...`).

## How to Import and Test
1. Open your n8n instance and create a new workflow.
2. Click the **Options menu (...)** in the top right > **Import from File**.
3. Select the `api_exchange_workflow.json` file.
4. Click the **Test Workflow** button at the bottom of the screen to test it immediately.
5. Click on the final node ("Send Data to External API") and view the **Output** tab. You will see that `httpbin.org` successfully received the cat fact sent from the first API!
6. Toggle the workflow to **Active** (top right of n8n UI) if you want it to run every hour automatically.
