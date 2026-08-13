 # AI Email Agent - Day 5: Guardrails & Safety

As autonomous agents become more capable, they also become more susceptible to unexpected edge cases, endless loops, or third-party API failures. In Day 5, we focused on identifying three major failure scenarios in our ReAct loop and implementing robust guardrails to ensure the agent fails gracefully rather than crashing.

## 1. Guardrail 1: Wikipedia API Crash Protection
* **The Failure Scenario:** The AI outputs `SEARCH: <Query>`, but the `wikipedia` Python package throws an exception (e.g., the page doesn't exist, the term is too ambiguous, or there is a network timeout). By default, this unhandled exception crashes the entire `main.py` script.
* **The Guardrail:** We wrapped the `wikipedia.summary()` call in a `try/except` block. We specifically catch `DisambiguationError` and `PageError`. Instead of crashing the script, we inject a mock string back to the AI that says `"TOOL ERROR: The Wikipedia page does not exist"`. The AI reads this error and gracefully apologizes to the user in the email instead of shutting down.

## 2. Guardrail 2: Infinite Tool Loop Prevention
* **The Failure Scenario:** If the AI fails to find an answer, it might get confused and output `SEARCH:` over and over again in an endless loop, burning API tokens and getting stuck forever.
* **The Guardrail:** We converted the simple `if reply.startswith("SEARCH:")` block into a `while` loop, but we added a hardcoded `max_tool_calls = 3` limit. A `tool_call_count` variable tracks how many times the AI has searched per email. If it reaches the limit, a system override is triggered, injecting a prompt that forces the AI to output a final draft without searching.

## 3. Guardrail 3: Malformed Email Parsing
* **The Failure Scenario:** An incoming email arrives with a malformed header, a `None` subject, or no body text at all. The `decode_header()` or `strip()` methods fail, crashing the script before the AI even gets to look at it.
* **The Guardrail:** We wrapped the `msg.get("Subject")` extraction in a `try/except` block with a safe fallback of `"[No Subject]"`. We also utilized the `msg.get("From", "[Unknown Sender]")` default parameter. This guarantees that even completely broken emails can be passed to the AI safely for processing.
