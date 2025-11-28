# ai-service/voice_utils.py
import speech_recognition as sr
import requests
import json
import codecs

# =======================
# CONFIG
# =======================
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3:instruct"   # use the faster model you pulled with ollama
# If you want shorter answers by default, tune NUM_PREDICT
NUM_PREDICT = 80

# =======================
# Speech-to-Text
# =======================
def transcribe_audio(file_path):
    """
    Convert wav file to text using SpeechRecognition (Google).
    Short ambient noise calibration for speed.
    """
    recognizer = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        # short calibration (faster)
        recognizer.adjust_for_ambient_noise(source, duration=0.1)
        audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio)
        return {"text": text}
    except sr.UnknownValueError:
        return {"text": ""}
    except sr.RequestError:
        return {"text": "Speech API unavailable"}


# =======================
# Streaming Text-to-Text (AI)
# =======================
def process_command(text: str):
    """
    Stream tokens from Ollama (stream=True). Yields chunk strings.
    The frontend will read these chunks and speak them in phrases.
    """
    if not text or not text.strip():
        yield "Please say something."
        return

    # Add a short "fast reply" instruction to make replies concise and faster.
    fast_prompt = (
        "Reply briefly in simple, clear language. Use 1–2 short sentences.\n\nUser: "
        + text
    )

    payload = {
        "model": MODEL,
        "prompt": fast_prompt,
        "stream": True,
        "num_predict": NUM_PREDICT
    }

    try:
        with requests.post(OLLAMA_URL, json=payload, stream=True) as response:
            response.raise_for_status()
            for line in response.iter_lines():
                if not line:
                    continue
                try:
                    data = json.loads(line.decode("utf-8"))
                    # Ollama may send JSON lines with key "response" carrying a chunk
                    if "response" in data:
                        part = data["response"]
                        # Clean a little; avoid altering spacing
                        part = codecs.decode(part, "unicode_escape")
                        yield part
                except Exception:
                    # ignore non-json or decode errors
                    continue
    except Exception as e:
        print("💥 Error from Ollama:", e)
        yield "AI service error. Please try again."
