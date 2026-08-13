# How `memory.json` Works in the AI Email Agent

In Day 3 of the AI Email Agent project, we introduced a local database file named `memory.json`. This file acts as the "Brain" for our AI, solving the critical problem of AI amnesia.

## 1. The Problem: AI Amnesia
By default, Large Language Models (like Gemini) have no memory of past interactions. If someone emails you, the AI replies, and then that person replies back, the AI will evaluate that second email completely out of context, having no idea what was just said.

## 2. The Solution: Persistent Storage
`memory.json` is a lightweight JSON (JavaScript Object Notation) database that we use to persistently store conversation history locally on your computer.

### How it operates in the code:
1. **Saving Data (`save_memory` function):** 
   Every time you approve an email to be sent, the Python script takes the sender's email address, the message they sent, and the reply the AI generated. It opens `memory.json`, finds the specific sender's address, and appends this new interaction to their history log.
   
2. **Retrieving Data (`load_memory` function):** 
   When a new email arrives, before the script asks the AI to draft a reply, it checks `memory.json` for the sender's email address. If it finds a match, it pulls the recent conversation history.

3. **Context Injection:**
   The retrieved history is dynamically injected directly into the AI's System Prompt. This provides the LLM with the full context of the ongoing conversation, allowing it to reference past topics, answer follow-up questions accurately, and maintain a consistent conversation thread.

## 3. Token Optimization
To prevent the prompt from becoming too large and exceeding the AI's token limit (which would cause crashes and slow response times), the script is programmed to only store and inject the **last 5 interactions** per sender. Older messages are automatically pruned from the `memory.json` file.
