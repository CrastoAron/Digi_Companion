import React, { useState, useRef } from "react";
import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/solid";

export default function VoiceAssistant() {
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState("🎙️ Tap the mic to speak");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = handleAudio;

      recorder.start();
      setRecording(true);
      setMessage("🎧 Listening...");
    } catch (err) {
      console.error(err);
      setMessage("🚫 Microphone access blocked.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    setMessage("🧠 Processing...");
  };

  const handleAudio = async () => {
    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];

      const formData = new FormData();
      formData.append("file", blob, "voice.webm");

      // Speech → Text
      const speechRes = await fetch("http://127.0.0.1:9000/speech", {
        method: "POST",
        body: formData,
      });
      const speechData = await speechRes.json();
      const text = (speechData.text || "").trim();

      if (!text) {
        setMessage("❗ I couldn't understand. Try again.");
        return;
      }

      setMessage(`🗣️ You: "${text}"\n\n🤖 Thinking...`);

      // AI Response (non-streaming)
      const aiRes = await fetch("http://127.0.0.1:9000/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const reply = await aiRes.text();
      setMessage(`🤖 ${reply}`);

      // Speak out loud
      const utter = new SpeechSynthesisUtterance(reply);
      utter.rate = 1.28;
      utter.pitch = 1.03;
      utter.volume = 1.0;
      speechSynthesis.speak(utter);

    } catch (err) {
      console.error(err);
      setMessage("⚠️ Could not reach AI service.");
    } finally {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600
        dark:from-gray-900 dark:via-gray-800 dark:to-black
        px-6 py-10
      "
    >
      {/* Glass Card */}
      <div
        className="
          w-full max-w-lg p-10 rounded-3xl shadow-2xl
          bg-white/20 dark:bg-gray-800/40
          backdrop-blur-xl border border-white/20
          text-center
        "
      >
        <h2
          className="
            text-3xl font-extrabold mb-6 
            text-white dark:text-gray-100 drop-shadow-md
          "
        >
          🎤 Voice Assistant
        </h2>

        {/* MIC BUTTON */}
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`
            w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6
            shadow-xl transition-all duration-300
            ${recording 
              ? "bg-red-600 hover:bg-red-700 animate-pulse" 
              : "bg-indigo-600 hover:bg-indigo-700"
            }
          `}
        >
          {recording ? (
            <StopCircleIcon className="h-16 w-16 text-white" />
          ) : (
            <MicrophoneIcon className="h-16 w-16 text-white" />
          )}
        </button>

        {/* MESSAGE BOX */}
        <div
          className="
            bg-white/70 dark:bg-gray-700/70
            text-gray-900 dark:text-gray-100
            p-5 rounded-2xl shadow-lg min-h-[160px]
            whitespace-pre-line text-sm leading-relaxed
          "
        >
          {message}
        </div>
      </div>
    </div>
  );
}
