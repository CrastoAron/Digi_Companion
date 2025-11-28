# ai-service/app.py
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from voice_utils import process_command, transcribe_audio
from pydub import AudioSegment
import tempfile
import os

app = FastAPI(title="Digi Companion AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI Service is running ✅"}


@app.post("/speech")
async def speech_to_text(file: UploadFile = File(...)):
    """
    Receives WebM audio from frontend, converts to WAV and transcribes.
    Returns: {"text": "..."}
    """
    try:
        # Save webm temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        wav_path = tmp_path.replace(".webm", ".wav")

        # Convert WebM → WAV (16kHz mono)
        audio = AudioSegment.from_file(tmp_path, format="webm")
        duration = len(audio) / 1000.0
        print(f"🎧 Received audio duration: {duration:.2f} sec")

        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export(wav_path, format="wav")

        # Transcribe using speech_recognition
        text_result = transcribe_audio(wav_path)

        # Cleanup temp files
        for p in (tmp_path, wav_path):
            if os.path.exists(p):
                try:
                    os.remove(p)
                except Exception:
                    pass

        print(f"🧠 Transcribed text: {text_result}")
        return text_result if isinstance(text_result, dict) else {"text": text_result}

    except Exception as e:
        print(f"💀 /speech error: {e}")
        return {"text": ""}


@app.post("/process")
async def process_text(request: Request):
    """
    Streams AI output back to the frontend as text/plain chunks.
    Frontend reads the response body stream and speaks while tokens arrive.
    """
    data = await request.json()
    text = data.get("text", "")
    def streamer():
        for chunk in process_command(text):
            # ensure we send bytes; StreamingResponse will chunk for us
            yield chunk
    return StreamingResponse(streamer(), media_type="text/plain")
