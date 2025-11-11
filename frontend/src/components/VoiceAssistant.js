import React, { useState, useEffect } from 'react';
import { MicrophoneIcon, StopCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';

const VoiceAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState({
    message: '🎙️ Tap the mic to start speaking',
    type: 'info',
  });
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);

  // 🧩 Load available voices (for better accents)
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let audioChunks = [];

      recorder.ondataavailable = (event) => audioChunks.push(event.data);

      recorder.onstop = async () => {
        setIsRecording(false);
        setFeedback({ message: '🧠 Processing your speech...', type: 'processing' });

        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', blob, 'speech.webm');

        try {
          // 🎤 Step 1: Convert speech → text
          const res = await fetch('http://localhost:9000/speech', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          const transcript = data.text?.trim() || '[No speech detected]';
          setFeedback({ message: `🗣️ You said: "${transcript}"`, type: 'success' });

          // 🧠 Step 2: Stream text from Ollama AI (real-time typing effect)
          const aiRes = await fetch('http://localhost:9000/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: transcript }),
          });

          if (!aiRes.body) {
            setFeedback({ message: '⚠️ No response stream from AI.', type: 'error' });
            return;
          }

          const reader = aiRes.body.getReader();
          const decoder = new TextDecoder();
          let fullReply = "";
          let words= "";

          setFeedback({ message: "🤖 Thinking...", type: "processing" });

          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              words += chunk.replace(/\\n/g, '\n');
              fullReply += chunk.replace(/\\n/g, '\n'); 
              setFeedback({ message: fullReply, type: 'success' });

              // 🗣️ Speak the final AI reply once complete
          if (aiVoiceEnabled && 'speechSynthesis' in window) {
            try {
              const utter = new SpeechSynthesisUtterance(words);
              utter.lang = 'en-IN';
              utter.pitch = 1.0;
              utter.rate = 0.95;
              utter.volume = 1.0;
              utter.voice = voices.find(v => v.lang.startsWith('en')) || null;
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(utter);
            } catch (ttsErr) {
              console.warn("TTS failed:", ttsErr);
            }
          }

            }
          } catch (streamErr) {
            console.warn("⚠️ Stream read error:", streamErr);
          }

          // ✅ Finished streaming successfully
          if (fullReply.trim().length === 0) {
            setFeedback({ message: '🤔 No response from AI.', type: 'error' });
            return;
          }

        } catch (err) {
          console.error('Streaming error:', err);
          setFeedback({ message: '⚠️ Error while fetching AI response.', type: 'error' });
        } finally {
          stream.getTracks().forEach((t) => t.stop());
        }
      };

      // ✅ Start recording
      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);
      setFeedback({ message: '🎧 Listening... Speak now!', type: 'listening' });

      // Auto-stop after 5 seconds
      setTimeout(() => recorder.state === 'recording' && recorder.stop(), 5000);

    } catch (err) {
      console.error('Microphone error:', err);
      setFeedback({ message: '🚫 Microphone access denied.', type: 'error' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setFeedback({ message: '🧠 Processing...', type: 'processing' });
    }
  };

  const toggleVoice = () => {
    setAiVoiceEnabled(!aiVoiceEnabled);
    setFeedback({
      message: aiVoiceEnabled ? '🔇 AI voice disabled.' : '🔊 AI voice enabled.',
      type: 'info',
    });
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg text-center">
      <h3 className="text-xl font-bold mb-3 flex items-center justify-center">
        <SparklesIcon className="h-6 w-6 text-indigo-500 mr-2" /> Digital Assistant
      </h3>

      <button
        onClick={() => (isRecording ? stopRecording() : startRecording())}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
          isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
        } mx-auto mb-4`}
      >
        {isRecording ? <StopCircleIcon className="h-8 w-8" /> : <MicrophoneIcon className="h-8 w-8" />}
        {isRecording && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50"></span>
        )}
      </button>

      <div className="flex justify-center mb-3">
        <button
          onClick={toggleVoice}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            aiVoiceEnabled
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          } transition-all`}
        >
          {aiVoiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
        </button>
      </div>

      <div
        className={`rounded-xl p-4 text-sm font-medium w-full max-w-md mx-auto text-left overflow-y-auto shadow-inner ${
          feedback.type === 'processing'
            ? 'bg-indigo-50 text-indigo-800'
            : feedback.type === 'success'
            ? 'bg-green-50 text-green-800'
            : feedback.type === 'listening'
            ? 'bg-yellow-50 text-yellow-800'
            : feedback.type === 'error'
            ? 'bg-red-50 text-red-800'
            : 'bg-gray-50 text-gray-700'
        }`}
        style={{
          height: '250px',
          whiteSpace: 'pre-wrap',
          borderRadius: '1rem',
        }}
      >
        {feedback.message}
      </div>
    </div>
  );
};

export default VoiceAssistant;
