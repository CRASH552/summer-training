# AI Email Agent - Day 2

This project is an AI-powered email auto-responder built using Python and the Google Gemini API.

## Features Built in Day 2
1. **IMAP & SMTP Integration**: The script connects securely to a Gmail inbox, scans for unread emails received today, and sends automated replies.
2. **AI Email Drafting**: Uses the Gemini API (`gemini-2.5-flash`) to read the incoming email and automatically generate a contextual, concise reply on behalf of the user.
3. **Human-in-the-Loop**: The agent prints the proposed reply to the terminal and waits for human approval (`y` to send, `n` to skip). It also allows the user to type custom instructions to force the AI to rewrite the draft before sending!
4. **Spam & Commercial Filter**: The AI's system prompt is instructed to detect newsletters, spam, and marketing emails. If detected, the script silently ignores them without bothering the user for approval.
5. **Prompt Injection Defense**: A security rule was added to the AI's instructions to detect and ignore emails that attempt to use "force commands" or jailbreaks to override the AI's behavior.

## How to Run
1. Ensure your `.env` file is properly configured with your `EMAIL_ADDRESS`, `EMAIL_APP_PASSWORD`, and `GEMINI_API_KEY`.
2. Run `python main.py` in your terminal.
3. The script will run continuously in the background, checking for new emails every 60 seconds!
