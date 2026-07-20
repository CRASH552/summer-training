# Delivery Checker — Agent Context

## Project
CLI tool that centralizes and tracks multi-carrier shipments without a backend database. Built iteratively via prompt-based vibecoding — treat this file as the persistent memory that survives across sessions/context resets.

## Core behavior (right-altitude — what, not how)
- Track shipments across multiple carriers in one interface.
- Auto-sort shipments by tracking status.
- Generate AI daily summaries of shipment progress.
- Export tracking history to local files.

Don't hardcode carrier-specific parsing logic into this file — that belongs in code/tests, not context. Keep this file describing *intent and constraints*, not implementation detail that will drift out of sync with the codebase.

## Hard constraints (do not reintroduce these)
| Excluded | Reason |
|---|---|
| Database / backend | Local-file storage only |
| Web interface | CLI-only |
| User accounts / login | Single-user tool |
| SMS alerts | Out of scope |
| Live maps / visuals | Out of scope |

If a request implies any of the above (e.g. "add a login screen," "store this in Postgres"), flag the conflict with this constraint list before implementing — don't silently comply or silently refuse.

## Known issues (context for the agent, not a todo list)
1. Real-time chat rendering fails.
2. Post-finalization check-in loophole — a shipment can register a check-in after it's marked finalized/delivered. Root-cause before patching; likely a missing state-transition guard.
3. Photo upload display broken in the shipment timeline.

## Working agreements for iterative sessions
- **Note-taking over memorizing**: log architectural decisions, open bugs, and rejected approaches to `NOTES.md` as you go, not just in chat. Read `NOTES.md` at the start of each session instead of re-deriving context.
- **Just-in-time file access**: don't dump the whole repo into context. Use targeted reads (`grep`/`glob`-style lookups) for the file actually being touched.
- **Minimal tool surface**: prefer a small set of unambiguous tools (fetch tracking status, write export file, categorize shipment) over broad multi-purpose ones. If it's unclear which tool to reach for, that's a signal the tool set needs tightening, not a signal to guess.
- **Compact long threads**: on long debugging sessions, summarize into `NOTES.md` (decisions + unresolved bugs) before the context window fills, rather than letting the whole trace ride along.

## Reference implementation stub
```python
def check_system():
    print("Initializing Delivery Checker...")
    print("Status: CLI Mode Active (No Database Connected)")

check_system()
```
