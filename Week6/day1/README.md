# Day 1: n8n Scheduled Workflow

## Task Description
Build an n8n workflow that runs automatically on a schedule and performs at least two connected actions.

## Overview
This directory contains an exported n8n workflow (`scheduled_joke_workflow.json`) that fulfills the task requirements. The workflow is designed to execute automatically on a recurring schedule, make an external HTTP request, and process the resulting data.

## Workflow Details
The workflow consists of three connected nodes:
1. **Schedule Trigger**: Set to run automatically every 1 hour.
2. **HTTP Request (Fetch Joke)**: Performs a `GET` request to the Official Joke API (`https://official-joke-api.appspot.com/random_joke`) to retrieve a random joke.
3. **Set / Edit Fields (Format Joke)**: Takes the JSON response from the API, extracts the `setup` and `punchline` fields, and formats them into a single coherent string.

## How to Import and Test
1. Open your n8n instance.
2. In the top right corner of a new workflow, click the **Options menu (...)** > **Import from File**.
3. Select the `scheduled_joke_workflow.json` file.
4. To test it immediately, click the **Test Workflow** button at the bottom of the screen.
5. Click on the final "Format Joke" node and view the **Output** tab to see the generated joke.
