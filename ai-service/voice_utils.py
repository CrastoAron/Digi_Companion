import requests
import speech_recognition as sr
import os
import codecs
import json
from gtts import gTTS


# =======================
# Configuration
# =======================
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3"


# =======================
# Speech-to-Text
# =======================
def transcribe_audio(file_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        audio = recognizer.record(source)
    try:
        text = recognizer.recognize_google(audio)
        return {"text": text}
    except sr.UnknownValueError:
        return {"text": ""}
    except sr.RequestError:
        return {"text": "API unavailable or network issue"}


def listen_from_mic():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    with mic as source:
        print("\n🎙️  Listening... (speak now)")
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        audio = recognizer.listen(source)

    try:
        print("🧠  Processing speech...")
        text = recognizer.recognize_google(audio)
        print(f"🗣️  You said: {text}")
        return text
    except sr.UnknownValueError:
        print("❌ Could not understand audio.")
        return ""
    except sr.RequestError:
        print("⚠️ Speech Recognition service unavailable.")
        return ""


# =======================
# Text-to-Text (AI Processing)
# =======================
def process_command(text: str):
    """
    Streams AI-generated text from Ollama, yields parts as they arrive.
    Automatically cleans up escape sequences and formatting.
    """
    if not text.strip():
        yield "Please say or type something."
        return

    payload = {
        "model": MODEL,
        "prompt": text,
        "stream": True
    }

    try:
        with requests.post(OLLAMA_URL, json=payload, stream=True) as response:
            response.raise_for_status()
            for line in response.iter_lines():
                if not line:
                    continue
                try:
                    data = json.loads(line.decode("utf-8"))
                    if "response" in data:
                        part = data["response"]
                        part = codecs.decode(part, 'unicode_escape')
                        part = part.replace('\r', '').replace('\\', '')
                        yield part
                except json.JSONDecodeError:
                    yield line.decode("utf-8")
    except Exception as e:
        print("💥 Error from Ollama:", e)
        yield "⚠️ Something went wrong while talking to the AI."


# =======================
# Text-to-Speech
# =======================
def speak(text):

    if not text.strip():
        return

    try:
        from gtts import gTTS
        from playsound import playsound

        tts = gTTS(text=text, lang="en", slow=False)
        temp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        tts.save(temp.name)
        playsound(temp.name)
        os.remove(temp.name)
    except Exception as e:
        print("🔇 gTTS fallback failed:", e)

# =======================
# Main Interaction Loop
# =======================
if __name__ == "__main__":
    print("🧠 Digi Companion (Local AI + Speech)")
    print("Say something to start or press Ctrl+C to quit.\n")

    while True:
        user_text = listen_from_mic()
        if not user_text:
            continue

        print("\n🤖 AI: ", end="", flush=True)
        ai_reply_full = ""

        # Stream partial replies in real time
        for chunk in process_command(user_text):
            print(chunk, end="", flush=True)
            ai_reply_full += chunk

        print("\n\n[✔ Done]\n")

        # Speak the full reply once complete
        speak(ai_reply_full.strip())
