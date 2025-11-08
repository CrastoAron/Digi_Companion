import React, { useState } from 'react';
import { MicrophoneIcon, StopCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';

const VoiceAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState({ message: 'Tap to start voice command', type: 'info' });
  const [recognition, setRecognition] = useState(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setFeedback({ message: 'Speech recognition not supported in this browser.', type: 'error' });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.lang = 'en-IN';
    recog.interimResults = false;

    recog.onstart = () => {
      setIsRecording(true);
      setFeedback({ message: '🎙️ Listening... speak now', type: 'listening' });
    };

    recog.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setFeedback({ message: `🗣️ You said: "${transcript}"`, type: 'processing' });
      setIsRecording(false);

      try {
        const res = await fetch('http://localhost:9000/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: transcript }),
        });
        const data = await res.json();
        const reply = data.response || 'No response from AI.';

        setFeedback({ message: reply, type: 'success' });

        // Speak the AI’s reply aloud
        const utter = new SpeechSynthesisUtterance(reply);
        utter.rate = 0.95;
        window.speechSynthesis.speak(utter);
      } catch (error) {
        console.error('Error talking to AI:', error);
        setFeedback({ message: '⚠️ Could not connect to AI service.', type: 'error' });
      }
    };

    recog.onerror = () => {
      setFeedback({ message: 'Microphone error. Try again.', type: 'error' });
      setIsRecording(false);
    };

    recog.onend = () => setIsRecording(false);

    setRecognition(recog);
    recog.start();
  };

  const stopRecording = () => {
    if (recognition) recognition.stop();
    setIsRecording(false);
    setFeedback({ message: 'Processing...', type: 'processing' });
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg text-center">
      <h3 className="text-xl font-bold mb-3 flex items-center justify-center">
        <SparklesIcon className="h-6 w-6 text-indigo-500 mr-2" /> Digital Assistant
      </h3>

      <button
        onClick={() => (isRecording ? stopRecording() : startRecording())}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white ${isRecording ? 'bg-red-600' : 'bg-indigo-600'} mx-auto mb-4`}
      >
        {isRecording ? <StopCircleIcon className="h-8 w-8" /> : <MicrophoneIcon className="h-8 w-8" />}
        {isRecording && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50"></span>}
      </button>

      <div
        className={`rounded-full py-2 px-4 text-sm font-medium w-full max-w-md mx-auto ${
          feedback.type === 'processing'
            ? 'bg-indigo-100 text-indigo-800'
            : feedback.type === 'success'
            ? 'bg-green-100 text-green-800'
            : feedback.type === 'listening'
            ? 'bg-yellow-100 text-yellow-800'
            : feedback.type === 'error'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        {feedback.message}
      </div>
    </div>
  );
};

export default VoiceAssistant;
