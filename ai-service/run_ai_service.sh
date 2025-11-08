#!/bin/bash
# ======================================================
# 🚀 DigiCompanion AI Service Launcher
# Creates venv (if needed), installs deps, runs FastAPI
# ======================================================

# Define venv path
VENV_DIR="venv"

# Step 1: Check if virtual environment exists
if [ ! -d "$VENV_DIR" ]; then
  echo "🧱 Creating Python virtual environment..."
  python -m venv $VENV_DIR
fi

# Step 2: Activate venv
echo "🐍 Activating virtual environment..."
source $VENV_DIR/bin/activate

# Step 3: Install dependencies
echo "📦 Installing dependencies..."
if [ -f "requirements.txt" ]; then
  pip install -r requirements.txt
else
  pip install fastapi uvicorn requests pyttsx3 python-dotenv
fi

# Step 4: Check if Ollama is running
echo "🧠 Checking Ollama service..."
if ! systemctl is-active --quiet ollama; then
  echo "⚙️  Ollama is not running — starting it now..."
  sudo systemctl start ollama
else
  echo "✅ Ollama is already running."
fi

# Step 5: Launch FastAPI app
echo "🚀 Starting FastAPI (Uvicorn)..."
uvicorn app:app --reload --port 9000
