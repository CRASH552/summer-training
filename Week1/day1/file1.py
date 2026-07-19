from dotenv import load_dotenv 
from google import genai
from google.genai import types

# The client automatically picks up your GEMINI_API_KEY environment variable
load_dotenv()
client = genai.Client()

# 1. Initialize the chat session cleanly outside the loop
chat = client.chats.create(
    model="gemini-3.1-flash-lite",
    config=types.GenerateContentConfig(
        temperature=0.7,
        max_output_tokens=1000,
        top_p=0.9,
        #stop_sequences=["\n"]
    )
)

print("Chat session started! Type 'quit' to stop.\n")

# 2. Keep the conversation looping
while True:
    # 3. Ask for the prompt INSIDE the loop so it asks every turn
    c = input("Enter the prompt: ")
    
    # 4. Corrected the syntax for checking the exit command
    if c.lower() in ['quit']:
        print('bye')
        break
    
    # 5. Use chat.send_message() to send the text and remember history
    response = chat.send_message(c)
    
    print(response.text) 