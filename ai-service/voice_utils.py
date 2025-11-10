import requests
import speech_recognition as sr
import os

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
def process_command(text: str) -> str:
    if not text.strip():
        return "Please say or type something."

    payload = {
        "model": MODEL,
        "prompt": text,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()

        if "response" in data:
            return data["response"].strip()
        elif "text" in data:
            return data["text"].strip()
        else:
            return "Hmm, I couldn’t quite find the right words."

    except requests.exceptions.ConnectionError:
        return "It looks like the local AI engine isn’t running. Please start Ollama first."
    except requests.exceptions.Timeout:
        return "The AI took too long to respond. Try again in a moment."
    except Exception as e:
        print("💥 Error from Ollama:", e)
        return "Something went wrong while talking to the AI."


# =======================
# Text-to-Speech
# =======================
def speak(text: str):
    try:
        import pyttsx3
        engine = pyttsx3.init()
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print("🔇 TTS error:", e)


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

        ai_reply = process_command(user_text)
        print(f"\n🤖 AI: {ai_reply}\n")

        speak(ai_reply)
