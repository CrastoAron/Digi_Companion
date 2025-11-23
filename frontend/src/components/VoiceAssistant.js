// src/components/VoiceAssistant.js
import React, { useState } from "react";
import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/solid";

export default function VoiceAssistant() {
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState("🎙️ Tap the mic to speak");
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);

      recorder.onstop = async () => {
        setRecording(false);
        setMessage("🧠 Processing your voice...");

        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob, "voice.webm");

        try {
          // ✅ Step 1 — Send audio to /speech
          const speechRes = await fetch("http://localhost:9000/speech", {
            method: "POST",
            body: formData,
          });

          const speechData = await speechRes.json();
          const text = speechData.text?.trim() || "";

          if (!text) {
            setMessage("❗ No speech detected. Try again.");
            return;
          }

          setMessage(`🗣️ You said: "${text}"`);

          // ✅ Step 2 — Send text to /process
          const aiRes = await fetch("http://localhost:9000/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
          });

          // ✅ ✅ READ AS TEXT — NOT JSON
          const reply = await aiRes.text();

          setMessage(`🤖 ${reply}`);

        } catch (err) {
          console.error(err);
          setMessage("⚠️ Could not reach AI service.");
        } finally {
          stream.getTracks().forEach((t) => t.stop());
        }
      };

      recorder.start();
      setRecording(true);
      setMediaRecorder(recorder);
      setMessage("🎧 Listening... speak now");

      // ✅ Auto-stop after 4 seconds
      setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 4000);

    } catch (err) {
      console.error(err);
      setMessage("🚫 Microphone access blocked.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    setRecording(false);
    setMessage("✅ Stopped recording");
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow text-center">
      <h2 className="text-xl font-bold mb-4">Voice Assistant</h2>

      <button
        onClick={recording ? stopRecording : startRecording}
        className={`w-24 h-24 rounded-full text-white flex items-center justify-center mx-auto mb-4 ${
          recording ? "bg-red-600" : "bg-indigo-600"
        }`}
      >
        {recording ? (
          <StopCircleIcon className="h-12 w-12" />
        ) : (
          <MicrophoneIcon className="h-12 w-12" />
        )}
      </button>

      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm min-h-[140px]">
        {message}
      </div>
    </div>
  );
}
