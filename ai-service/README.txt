DigiCompanion AI Service Setup Guide

🧠 Overview

This folder contains the AI backend for the DigiCompanion project — the intelligent companion that chats with elderly users, helps them set reminders, and assists with daily tasks.
It runs using FastAPI (backend framework) and Ollama (local AI engine).

The service runs completely offline, ensuring privacy, security, and reliability — even without an internet connection.

🧩 Requirements

Python 3.10+

pip (Python package manager)

Ollama installed

Internet connection (only needed the first time to download models)

Optional: NVIDIA GPU for faster AI response times

🪟 SETUP ON WINDOWS
1️⃣ Install Ollama

Download and install from:
👉 https://ollama.com/download

Once installed, open Command Prompt or PowerShell and run:

ollama serve


Then pull your AI model (example: llama3):

ollama pull llama3


You’ll only need to do this once.

2️⃣ Set Up Python Virtual Environment

Open Command Prompt and move to your project’s AI service folder:

cd path\to\Digi_Companion\ai-service


Create and activate a virtual environment:

python -m venv venv
venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


If there’s no requirements.txt file, install manually:

pip install fastapi uvicorn requests pyttsx3 python-dotenv

3️⃣ Start the AI Service

You can start it manually:

uvicorn app:app --reload --port 9000


You’ll see:

INFO:     Uvicorn running on http://127.0.0.1:9000
INFO:     Application startup complete.


Or use the startup script for one-click setup.

4️⃣ One-Click Startup — run_ai_service.bat

Simply double-click the file run_ai_service.bat in the ai-service folder, or run:

run_ai_service.bat


This script:

Creates and activates the venv

Installs required packages

Starts Ollama automatically

Launches FastAPI on port 9000

You’ll see:

Uvicorn running on http://127.0.0.1:9000

5️⃣ Test the AI Service

In another terminal, run:

curl -X POST http://127.0.0.1:9000/process ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"Hello! How are you?\"}"


You should get:

{"response": "I'm doing well! How can I help you today?"}

🧱 Stopping the AI Service (Windows)

Close the FastAPI terminal window.

Stop Ollama manually (if desired):

taskkill /IM ollama.exe /F

🐧 SETUP ON LINUX (EndeavourOS / Ubuntu / Debian / Arch)
1️⃣ Install Ollama

Run in the terminal:

curl -fsSL https://ollama.com/install.sh | sh


Start Ollama:

sudo systemctl start ollama


Check its status:

systemctl status ollama


Pull a model (example: llama3):

ollama pull llama3

2️⃣ Create and Activate Virtual Environment

Go to your project folder:

cd ~/Projects/Digi_Companion/ai-service


Create a venv:

python -m venv venv


Activate it:

source venv/bin/activate


Install dependencies:

pip install -r requirements.txt


Or manually:

pip install fastapi uvicorn requests pyttsx3 python-dotenv

3️⃣ Start the AI Service

Run:

uvicorn app:app --reload --port 9000


You should see:

INFO:     Uvicorn running on http://127.0.0.1:9000

4️⃣ One-Command Setup — run_ai_service.sh

A helper script is included for easy startup.

Make it executable:

chmod +x run_ai_service.sh


Then run it:

./run_ai_service.sh


It will:

Create and activate a venv

Install packages

Ensure Ollama is running

Start FastAPI

5️⃣ Test the AI Service

Run:

curl -X POST http://127.0.0.1:9000/process \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello! How are you?"}'


Expected:

{"response":"I'm doing well! How can I help you today?"}

🧱 Stopping the AI Service (Linux)

Stop FastAPI:

pkill -f "uvicorn app:app"


Stop Ollama:

sudo systemctl stop ollama


Or both at once:

pkill -f "uvicorn app:app"; sudo systemctl stop ollama

🔌 Connecting the Frontend

The frontend (React app) connects to this service using:

Endpoint:

POST http://localhost:9000/process


Request Example:

{ "text": "Remind me to take medicine at 8 PM" }


Response Example:

{ "response": "Got it! I’ll remind you at 8 PM." }

🧭 Folder Overview
ai-service/
├── app.py                # FastAPI entrypoint
├── voice_utils.py        # Handles AI logic (Ollama integration)
├── requirements.txt      # Python dependencies
├── run_ai_service.bat    # One-click startup for Windows
├── run_ai_service.sh     # One-command startup for Linux
└── README.txt            # Setup guide

🧡 Credits

DigiCompanion AI Service
Developed by the DigiCompanion Team
Powered by Ollama + FastAPI
Offline • Private • Designed for Accessibility 🌿
