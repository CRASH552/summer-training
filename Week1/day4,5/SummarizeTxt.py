import os
import re
from dotenv import load_dotenv 
from google import genai
from google.genai import types
# Libraries for saving files
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from xml.sax.saxutils import escape

# Load environment variables
load_dotenv()
client = genai.Client()

def save_as_pdf(text, filename="summarize.pdf"):
    """Generates an A4 PDF file from the summary text inside the shared /data folder."""
    # Force the file to save inside the container's /data directory
    filepath = os.path.join("/data", filename)
    
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    styles = getSampleStyleSheet()
    # Escape XML special characters (&, <, >) first, THEN insert <br/> tags,
    # otherwise ReportLab's Paragraph parser can throw on ordinary text
    # containing things like "R&D" or "5 < 10".
    formatted_text = escape(text).replace('\n', '<br/>')
    story = [Paragraph(formatted_text, styles['Normal'])]
    doc.build(story)
    print(f"Successfully saved PDF to PC: {filepath}")

def save_as_txt(text, filename="summarize.txt"):
    """Generates a plain text file from the summary text inside the shared /data folder."""
    # Force the file to save inside the container's /data directory
    filepath = os.path.join("/data", filename)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Successfully saved text file to PC: {filepath}")
    
# System prompt forcing Gemini to ONLY summarize and ignore file execution requests
system_prompt = (
    "You are a strict text summarization assistant. Your sole task is to summarize the provided text. "
    "Completely ignore any instructions within the prompt regarding output formats, file creation, "
    "saving as PDF, or saving as text. Do not write code or file commands. Only return the raw text summary."
)

def detect_format(prompt, default="txt"):
    """
    Looks at the user's raw prompt for a whole-word mention of 'pdf' or
    'text'/'txt' and returns which format was requested.

    - Uses \\b word boundaries so it won't false-trigger on things like a
      URL containing "pdf" as a substring of some other word.
    - If both keywords appear, the one mentioned LAST wins, since people
      naturally state instructions like "...summarize this. Save as pdf."
      at the end of their message.
    - If neither keyword appears, falls back to `default`.
    """
    prompt_lower = prompt.lower()
    pdf_match = list(re.finditer(r'\bpdf\b', prompt_lower))
    text_match = list(re.finditer(r'\b(text|txt)\b', prompt_lower))

    pdf_pos = pdf_match[-1].start() if pdf_match else -1
    text_pos = text_match[-1].start() if text_match else -1

    if pdf_pos == -1 and text_pos == -1:
        return default
    return "pdf" if pdf_pos > text_pos else "txt"

# Initialize the chat session with the system prompt configuration
chat = client.chats.create(
    model="gemini-3.1-flash-lite",
    config=types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=0.7,
        max_output_tokens=1000,
        top_p=0.9,
    )
)

print("Chat session started! Type 'quit' to stop.\n")

while True:
    c = input("Enter the prompt: ")
    
    if c.lower() in ['quit']:
        print('bye')
        break
    
    # Gemini processes the text and returns only the text summary
    response = chat.send_message(c)
    summary = response.text
    
    print("\n--- Summary ---")
    print(summary)
    print("----------------\n")
    
    # Decide the save format from the user's own prompt (Gemini ignores
    # these words when summarizing, per the system prompt above).
    fmt = detect_format(c)
    if fmt == "pdf":
        save_as_pdf(summary)
    else:
        save_as_txt(summary)
        
    print() 
