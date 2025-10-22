import React, { useState } from 'react';
import { MicrophoneIcon, StopCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';

/**
 * Simple UI for voice assistant. The real speech recognition or API integration
 * should be hooked in later.
 */
const VoiceAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState({ message: 'Tap to start voice command', type: 'info' });

  const startRecording = () => {
    setIsRecording(true);
    setFeedback({ message: 'Listening... speak now', type: 'listening' });
    // TODO: hook up browser speech recognition or send audio to backend
  };

  const stopRecording = () => {
    setIsRecording(false);
    setFeedback({ message: 'Processing...', type: 'processing' });
    // TODO: process recognized text and display response; simulate for now
    setTimeout(() => {
      setFeedback({ message: 'Reminder added: Take medicine at 8 AM', type: 'success' });
      // speak via Web Speech API
      const utter = new SpeechSynthesisUtterance('Reminder added. Take medicine at 8 AM.');
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    }, 1200);
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

      <div className={`rounded-full py-2 px-4 text-sm font-medium w-full max-w-md mx-auto
        ${feedback.type === 'processing' ? 'bg-indigo-100 text-indigo-800' :
          feedback.type === 'success' ? 'bg-green-100 text-green-800' :
          feedback.type === 'listening' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-700'}`}>
        {feedback.message}
      </div>
    </div>
  );
};

export default VoiceAssistant;
