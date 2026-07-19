# Delivery Checker Application

## Description
A CLI-based tool designed to centralize and track multi-carrier shipments without using a backend database. Developed using an iterative, prompt-based vibecoding methodology.

## Core Features
* **Multi-Carrier Integration:** Tracks shipments across multiple carriers in a centralized interface.
* **Automated Status Sorting:** Automatically categorizes shipments by tracking status.
* **AI-Generated Daily Summaries:** Provides automated daily overviews of shipment progress.
* **Local File Status Exports:** Saves tracking history directly to local files instead of a server.

## System Specifications & Constraints
| System Element | Status / Constraint |
| :--- | :--- |
| Database | Excluded (Runs without a backend database) |
| Interface | CLI-only (No web-based interface) |
| Accounts | Excluded (No user accounts or login system) |
| Alerts | Excluded (No SMS alerts) |
| Visuals | Excluded (No live maps) |

## Known Bugs
1. Real-time chat rendering failures.
2. Post-finalization check-in loophole.
3. Broken photo upload displays in the shipment timeline.

## Sample Initialization Code
```python
def check_system():
    print("Initializing Delivery Checker...")
    print("Status: CLI Mode Active (No Database Connected)")

check_system() 