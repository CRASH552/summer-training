# Project Summary: Containerized Text Summarizer

**Training Log:** Days 4 & 5  

---

## What It Does
This project is a localized Python application that uses a Large Language Model (LLM) API to summarize raw text inputs. Instead of using buttons or menus, the Python script reads the user's prompt instructions to automatically decide what type of file to create:
* **A standard plain text file** (`summarize.txt`).
* **A professionally formatted, A4-sized PDF document**.

## How It Is Built
* **Python Engine:** Handles the core application logic, API communication, and the direct programmatic generation of the text and PDF files.
* **Docker Integration:** The entire script environment is packaged inside a `Dockerfile` to guarantee it runs exactly the same way on any host machine.
* **Docker Compose & Shared Volumes:** Configured to sync folders between the running container and your computer. This ensures that the generated PDFs and text files are saved safely onto your local hard drive. 
