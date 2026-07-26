import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertTriangle } from 'lucide-react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceInteraction({ currentMemory, isMuted }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [speechActive, setSpeechActive] = useState(false);
  const [hesitationScore, setHesitationScore] = useState(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setRecording(true);
        setErrorMsg("");
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        submitToN8N(text);
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        if (e.error !== 'no-speech') {
          setErrorMsg(`Error: ${e.error}. Please check your microphone permissions.`);
        }
        setRecording(false);
      };

      rec.onend = () => {
        setRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Reset interaction state on memory change
  useEffect(() => {
    setTranscript("");
    setResponseMsg("");
    setErrorMsg("");
    setHesitationScore(null);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, [currentMemory]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Recognition already started:", err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecording(false);
    }
  };

  const submitToN8N = async (textStr) => {
    setLoading(true);
    setResponseMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5678/webhook/speech-interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: "11111111-1111-1111-1111-111111111111",
          transcript: textStr
        })
      });
      if (!res.ok) throw new Error("n8n responded with an error");
      const data = await res.json();
      const reply = data.response || "That's wonderful! Tell me more about that memory.";
      setResponseMsg(reply);
      setHesitationScore(data.hesitation_score);
      speakText(reply);
    } catch (err) {
      console.warn("n8n offline, using fallback response:", err);
      // Friendly local fallback
      const fallbackReplies = [
        "That sounds beautiful! I recall it was a lovely and memorable experience.",
        "Oh, how wonderful! Do you remember who went with you on that special day?",
        "Yes, indeed! It's so special to cherish these sweet moments together."
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      setResponseMsg(randomReply);
      speakText(randomReply);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for elderly readability
      utterance.pitch = 1.0;
      utterance.onstart = () => setSpeechActive(true);
      utterance.onend = () => setSpeechActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!SpeechRecognition) {
    return (
      <div className="bg-alert/10 border-2 border-alert/20 p-6 rounded-3xl text-center space-y-3 max-w-lg mx-auto">
        <AlertTriangle className="h-10 w-10 text-alert mx-auto" />
        <h4 className="font-black text-navy text-lg">Speech Recognition Not Supported</h4>
        <p className="text-navy/70 text-sm">
          Your browser does not support the native Web Speech API. For the best experience, please use **Google Chrome** or **Microsoft Edge**.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-skyblue text-center space-y-6">
      <div className="space-y-2">
        <span className="text-teal font-extrabold text-md uppercase tracking-wider">Memory Reminiscence Companion</span>
        <p className="text-3xl font-black text-navy leading-tight px-4">
          Do you remember this trip to {currentMemory?.location || "this place"}?
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-4 space-y-4">
        <button
          onClick={recording ? stopListening : startListening}
          className={`h-24 w-24 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer ${
            recording
              ? 'bg-alert text-white animate-pulse ring-8 ring-alert/30'
              : 'bg-navy hover:bg-teal text-white ring-8 ring-navy/10'
          }`}
          aria-label={recording ? "Stop Recording" : "Start Recording"}
        >
          {recording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
        </button>
        <span className="text-teal font-black text-lg">
          {recording ? "🛑 Listening... Tap to Stop" : "🎤 Tap to Speak"}
        </span>
      </div>

      {errorMsg && (
        <div className="text-alert font-bold text-sm bg-alert/5 p-3 rounded-xl border border-alert/20 max-w-md mx-auto">
          {errorMsg}
        </div>
      )}

      {transcript && (
        <div className="bg-skysoft border border-skyblue p-5 rounded-2xl max-w-xl mx-auto text-left">
          <span className="text-xs font-black text-teal block mb-1">YOUR SPOKEN RESPONSE:</span>
          <p className="text-navy font-bold text-lg italic">"{transcript}"</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-teal font-extrabold text-md">
          <div className="h-4 w-4 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          <span>Processing memory context...</span>
        </div>
      )}

      {responseMsg && (
        <div className="bg-teal/10 border-2 border-teal/30 p-6 rounded-2xl max-w-xl mx-auto text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-teal uppercase">SYNAPSEE COMPANION:</span>
            {hesitationScore !== undefined && hesitationScore !== null && (
              <span className="bg-white border border-teal/20 px-3.5 py-1 rounded-full text-xs font-black text-navy shadow-sm">
                Hesitation: {hesitationScore}%
              </span>
            )}
          </div>
          <p className="text-navy font-extrabold text-xl leading-relaxed">
            {responseMsg}
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => speakText(responseMsg)}
              className={`flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-teal/20 hover:bg-teal/5 text-navy font-bold text-sm transition min-h-[48px] cursor-pointer ${
                speechActive ? 'border-teal ring-2 ring-teal/20' : ''
              }`}
            >
              <Volume2 className="h-4 w-4" />
              <span>Listen Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
