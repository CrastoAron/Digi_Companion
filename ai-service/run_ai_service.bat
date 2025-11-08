@echo off
REM ===============================================
REM 🚀 DigiCompanion AI Service Launcher (Windows)
REM Creates venv (if missing), installs deps, runs FastAPI
REM ===============================================

set VENV_DIR=venv

echo.
echo 🧱 Checking virtual environment...

if not exist %VENV_DIR% (
    echo 🧠 Creating virtual environment...
    python -m venv %VENV_DIR%
)

echo.
echo 🐍 Activating virtual environment...
call %VENV_DIR%\Scripts\activate.bat

echo.
echo 📦 Installing dependencies...
if exist requirements.txt (
    pip install -r requirements.txt
) else (
    pip install fastapi uvicorn requests pyttsx3 python-dotenv
)

echo.
echo 🧠 Checking Ollama installation...
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Ollama not found. Please install it from https://ollama.com/download
    pause
    exit /b
) else (
    echo ✅ Ollama found.
)

echo.
echo ⚙️  Starting Ollama (if not already running)...
start /min ollama serve
timeout /t 3 >nul

echo.
echo 🚀 Launching FastAPI app on port 9000...
uvicorn app:app --reload --port 9000
pause
