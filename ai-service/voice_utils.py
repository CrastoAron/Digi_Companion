import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3"

def process_command(text: str) -> str:
    """
    Sends user text to the local Ollama model and returns the AI response.
    Works fully offline — no external API calls.
    """

    if not text.strip():
        return "Please say or type something."

    payload = {
        "model": MODEL,
        "prompt": text,
        "stream": False  # Disable streaming for cleaner output
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()

        # Extract and clean text
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


def speak(text: str):
    """
    Optional: Converts text to speech using pyttsx3 (offline).
    """
    try:
        import pyttsx3
        engine = pyttsx3.init()
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print("TTS error:", e)
