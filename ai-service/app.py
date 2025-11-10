# ai-service/app.py
from fastapi import FastAPI, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from voice_utils import process_command, transcribe_audio
from pydub import AudioSegment
import tempfile
import os

# =======================
# Initialize FastAPI app
# =======================
app = FastAPI(title="Digi Companion AI Service", version="1.0.0")

# =======================
# CORS Setup
# =======================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # You can restrict this later to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
# Routes
# =======================
@app.get("/")
def home():
    """Health check endpoint."""
    return {"message": "AI Service is running ✅"}


@app.post("/process")
async def process_text(request: Request):
    """
    Accepts JSON { "text": "your message" }
    Sends text to local Ollama model and returns AI response.
    """
    data = await request.json()
    text = data.get("text", "").strip()
    response = process_command(text)
    return {"response": response}


@app.post("/speech")
async def speech_to_text(file: UploadFile = File(...)):
    """Handles audio from frontend (WebM), converts to WAV, and transcribes text."""
    try:
        # Step 1. Save WebM temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Step 2. Convert WebM → WAV (16kHz mono)
        wav_path = tmp_path.replace(".webm", ".wav")
        try:
            audio = AudioSegment.from_file(tmp_path, format="webm")
            duration = len(audio) / 1000.0
            print(f"🎧 Received audio duration: {duration:.2f} sec")

            if duration < 0.3:
                print("⚠️ Audio too short to process.")
                os.remove(tmp_path)
                return {"text": ""}
            
            audio = audio.set_channels(1).set_frame_rate(16000)
            audio.export(wav_path, format="wav")
        except Exception as e:
            print(f"💥 FFmpeg conversion error: {e}")
            return {"text": ""}

        # Step 3. Transcribe using SpeechRecognition
        try:
            text_result = transcribe_audio(wav_path)
        except Exception as e:
            print(f"💥 SpeechRecognition error: {e}")
            text_result = {"text": ""}

        # Step 4. Cleanup temp files
        for path in [tmp_path, wav_path]:
            if os.path.exists(path):
                os.remove(path)

        # Step 5. Return transcription
        print(f"🧠 Transcribed text: {text_result}")
        return text_result if isinstance(text_result, dict) else {"text": text_result}

    except Exception as e:
        print(f"💀 Speech endpoint failure: {e}")
        return {"text": ""}
