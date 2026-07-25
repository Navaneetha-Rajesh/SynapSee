import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate 
} from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Upload, 
  Heart, 
  Brain, 
  Calendar, 
  AlertTriangle, 
  Play, 
  CheckCircle, 
  Clock, 
  Check, 
  MapPin, 
  Plus, 
  ArrowRight,
  Shield,
  Activity,
  Smile,
  X,
  Phone
} from 'lucide-react';

const API_BASE = "http://localhost:8000";

// Global navigation bar
function Navigation() {
  return (
    <nav className="bg-navy px-6 py-4 flex items-center justify-between border-b border-teal/30">
      <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
        <Heart className="text-skyblue fill-skyblue h-6 w-6" />
        <span>KinKeep</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="text-skyblue hover:text-white transition font-medium">Home</Link>
        <Link to="/patient" className="text-skyblue hover:text-white transition font-medium">Senior Portal</Link>
        <Link to="/dashboard" className="text-skyblue hover:text-white transition font-medium">Caregiver Hub</Link>
        <Link to="/patient" className="bg-teal hover:bg-teal/80 text-white px-4 py-2 rounded-lg transition font-medium">
          Join
        </Link>
      </div>
    </nav>
  );
}

// Global state mechanism to share memories between Caregiver and Patient Views during mock run
let globalMemories = [
  {
    id: "munnar-2018",
    title: "Family Trip to Munnar",
    date: "2018",
    location: "Munnar",
    image_url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800",
    description: "Our wonderful family vacation to the tea gardens of Munnar. It was cool and foggy, and we spent the afternoon drinking hot chai."
  },
  {
    id: "wedding-1975",
    title: "Our Wedding Day",
    date: "1975",
    location: "St. Mary's Church",
    image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    description: "The beautiful spring morning when we got married. Family and friends danced until evening."
  }
];

let globalActiveMemoryIdx = 0;

// ----------------------------------------------------
// VIEW 1: LANDING PAGE
// ----------------------------------------------------
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Header & Hero Block (Dark Theme - bg-navy: #2F4156) */}
      <header className="bg-navy text-white py-20 px-8 flex-1 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Your Memories. <br />
              <span className="text-skyblue">Your Companion.</span>
            </h1>
            <p className="text-skyblue/90 text-lg leading-relaxed max-w-lg">
              KinKeep bridges the gap between generations. A secure memory vault and cognitive health companion designed to help seniors preserve their legacy while providing families with reassurance and care alerts.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => navigate('/patient')}
                className="bg-teal hover:bg-teal/90 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition flex items-center gap-3 text-lg cursor-pointer"
              >
                <span>Preserve Your Legacy</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-[4/3] rounded-2xl border-4 border-teal overflow-hidden shadow-2xl relative bg-navy/40">
              <img 
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=800" 
                alt="Senior with family smiling" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-navy/80 via-transparent to-transparent flex items-end p-6">
                <span className="text-white font-medium bg-teal/80 px-3 py-1 rounded-full text-sm">
                  Connecting Generations
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Advantages Section (Light Theme - bg-white: #FFFFFF) */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-4xl font-bold text-navy">Advantages</h2>
            <p className="text-teal font-medium mt-2">Why families trust KinKeep for cognitive care</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-skysoft border border-skyblue p-6 rounded-xl text-left space-y-4 hover:shadow-md transition">
              <div className="bg-teal/10 p-3 rounded-lg w-fit">
                <Brain className="text-teal h-6 w-6" />
              </div>
              <h3 className="font-semibold text-navy text-xl">Build Vault</h3>
              <p className="text-navy/70 text-sm">
                Easily upload and organize precious photos, locations, and audio descriptions into a secure digital gallery.
              </p>
            </div>
            <div className="bg-skysoft border border-skyblue p-6 rounded-xl text-left space-y-4 hover:shadow-md transition">
              <div className="bg-teal/10 p-3 rounded-lg w-fit">
                <Smile className="text-teal h-6 w-6" />
              </div>
              <h3 className="font-semibold text-navy text-xl">AI Intelligence</h3>
              <p className="text-navy/70 text-sm">
                Generates interactive nostalgia-driven prompts using Google Gemini to stimulate positive reminiscence therapy.
              </p>
            </div>
            <div className="bg-skysoft border border-skyblue p-6 rounded-xl text-left space-y-4 hover:shadow-md transition">
              <div className="bg-teal/10 p-3 rounded-lg w-fit">
                <Calendar className="text-teal h-6 w-6" />
              </div>
              <h3 className="font-semibold text-navy text-xl">Daily Connection</h3>
              <p className="text-navy/70 text-sm">
                Enables simple voice conversations that make seniors feel valued while capturing rich life histories.
              </p>
            </div>
            <div className="bg-skysoft border border-skyblue p-6 rounded-xl text-left space-y-4 hover:shadow-md transition">
              <div className="bg-teal/10 p-3 rounded-lg w-fit">
                <AlertTriangle className="text-teal h-6 w-6" />
              </div>
              <h3 className="font-semibold text-navy text-xl">Caregiver Alerts</h3>
              <p className="text-navy/70 text-sm">
                Monitors responses to detect anomalies or speech hesitation, alerting caregivers in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Value Proposition Section (Sky Blue Theme - bg-skyblue: #C8D9E6) */}
      <section className="bg-skyblue py-20 px-8 text-navy">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Preserve Cognitive Health & Reminisce Together</h2>
            <p className="text-navy/80 leading-relaxed">
              Dementia and Alzheimer's care require warmth and daily engagement. KinKeep offers structured memory support that helps seniors jog their memory and record details from their legacy.
            </p>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl flex items-start gap-3 shadow-sm">
                <CheckCircle className="text-teal h-6 w-6 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-navy">Tailored Memory Walks</h4>
                  <p className="text-navy/75 text-sm">Custom conversation prompts triggered by genuine family pictures.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl flex items-start gap-3 shadow-sm">
                <CheckCircle className="text-teal h-6 w-6 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-navy">Dignity First Design</h4>
                  <p className="text-navy/75 text-sm">Large 48px+ touch targets and intuitive microphone voice control.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl bg-white p-4 border border-teal/20">
              <img 
                src="https://images.unsplash.com/photo-1507209696998-3c532be9b2b5?auto=format&fit=crop&q=80&w=800" 
                alt="Elderly holding hands" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section (Dark Theme - bg-navy: #2F4156) */}
      <section className="bg-navy text-white py-20 px-8 border-t border-teal/20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Platform Walkthrough</h2>
            <p className="text-skyblue mt-2">See how KinKeep operates on a daily basis</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Video placeholder */}
            <div className="bg-teal/10 rounded-2xl aspect-video border-2 border-teal/30 flex items-center justify-center relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-navy/50 flex items-center justify-center">
                <div className="bg-white/90 hover:bg-white text-navy h-16 w-16 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <Play className="h-6 w-6 fill-navy" />
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800" 
                alt="Interface demo preview" 
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            {/* Right: 2x3 Grid of Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="bg-teal/20 border border-teal/30 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-white">Voice Companion</h4>
                <p className="text-skyblue/80 text-sm">Natural talk-to-text inputs specifically optimized for elderly pitch and pace.</p>
              </div>
              <div className="bg-teal/20 border border-teal/30 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-white">AI Nostalgia Engine</h4>
                <p className="text-skyblue/80 text-sm">Google Gemini dynamically reviews transcripts and asks follow-ups.</p>
              </div>
              <div className="bg-teal/20 border border-teal/30 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-white">Caregiver Feed</h4>
                <p className="text-skyblue/80 text-sm">Immediate updates for missed schedule or speech hesitation patterns.</p>
              </div>
              <div className="bg-teal/20 border border-teal/30 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-white">Reminders Dock</h4>
                <p className="text-skyblue/80 text-sm">Simple visual cards showing pill schedules and routine reminders.</p>
              </div>
              <div className="bg-teal/20 border border-teal/30 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-white">Realtime Analytics</h4>
                <p className="text-skyblue/80 text-sm">Visual metrics detailing cognitive recall score trends over time.</p>
              </div>
              <div className="bg-teal/20 border border-teal/30 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-white">Secure Media Vault</h4>
                <p className="text-skyblue/80 text-sm">Supabase Storage securely encrypts family images and recordings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer (Light Theme - bg-white: #FFFFFF) */}
      <footer className="bg-white py-8 px-6 border-t border-skyblue">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-navy font-semibold text-lg flex items-center gap-2">
            <Heart className="text-teal fill-teal h-5 w-5" />
            <span>KinKeep</span>
          </div>
          <p className="text-teal text-sm">© 2026 KinKeep Inc. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-navy hover:text-teal font-medium">Privacy Policy</a>
            <a href="#" className="text-navy hover:text-teal font-medium">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------
// VIEW 2: SENIOR / PATIENT INTERFACE
// ----------------------------------------------------
function PatientInterface() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recording, setRecording] = useState(false);
  const [responseMode, setResponseMode] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [recallScore, setRecallScore] = useState(null);
  const [speechActive, setSpeechActive] = useState(false);
  const [memories, setMemories] = useState(globalMemories);
  const [currentIdx, setCurrentIdx] = useState(globalActiveMemoryIdx);
  const [routines, setRoutines] = useState([]);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Load date, time, and API details
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchData();
    
    // Sync with global changes every 2 seconds during demo
    const syncTimer = setInterval(() => {
      setMemories([...globalMemories]);
      setCurrentIdx(globalActiveMemoryIdx);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(syncTimer);
    };
  }, []);

  const fetchData = async () => {
    try {
      const memRes = await fetch(`${API_BASE}/api/v1/memories`);
      const mems = await memRes.json();
      if (mems && mems.length > 0) {
        setMemories(mems);
        globalMemories = mems;
      }

      const routRes = await fetch(`${API_BASE}/api/v1/routines`);
      const routs = await routRes.json();
      setRoutines(routs.filter(r => r.status === "Pending"));
    } catch (e) {
      console.error("Using local memory sync.", e);
    }
  };

  const currentMemory = memories[currentIdx] || {
    id: "default",
    title: "Family Trip to Munnar",
    date: "2018",
    location: "Munnar",
    image_url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800",
    description: "Our wonderful family vacation to the tea gardens of Munnar."
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => setSpeechActive(true);
      utterance.onend = () => setSpeechActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleAudioUpload(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setResponseMode(false);
    } catch (err) {
      console.error("Microphone simulation mode:", err);
      setRecording(true);
      setTimeout(() => {
        setRecording(false);
        const simText = "Yes, I remember it was very cold and foggy. We drank hot chai together in the tea garden.";
        setTranscript(simText);
        submitTextInteraction(simText);
      }, 3000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");

      const res = await fetch(`${API_BASE}/api/v1/patient/voice-transcribe`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setTranscript(data.transcript);
      await submitTextInteraction(data.transcript);
    } catch {
      const fallbackText = "I remember the beautiful mountains and tea fields.";
      setTranscript(fallbackText);
      await submitTextInteraction(fallbackText);
    }
  };

  const submitTextInteraction = async (textStr) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/patient/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: textStr,
          memory_id: currentMemory.id
        })
      });
      const data = await res.json();
      setResponseMsg(data.response);
      setRecallScore(data.cognitive_score);
      setResponseMode(true);
      speakText(data.response);
    } catch {
      const mockReply = "Oh, that sounds lovely! Munnar is indeed beautiful. Do you remember who drove us up the winding roads?";
      setResponseMsg(mockReply);
      setRecallScore(85);
      setResponseMode(true);
      speakText(mockReply);
    }
  };

  const nextMemory = () => {
    setResponseMode(false);
    setTranscript("");
    setRecallScore(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const nextIdx = (currentIdx + 1) % (memories.length || 1);
    setCurrentIdx(nextIdx);
    globalActiveMemoryIdx = nextIdx;
  };

  return (
    <div className="flex-1 bg-skysoft flex flex-col p-6 max-w-4xl mx-auto w-full space-y-6">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between bg-white shadow-sm rounded-2xl p-4 border border-skyblue">
        <div className="flex flex-col text-left">
          <span className="text-xl font-bold text-navy">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-2xl font-black text-navy/80">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-teal/10 px-4 py-2 rounded-full border border-teal/20">
          <div className="h-3 w-3 bg-teal rounded-full animate-pulse" />
          <span className="text-teal font-bold text-lg">KinKeep Online</span>
        </div>
      </div>

      {/* 2. Memory Spotlight Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-skyblue flex flex-col md:flex-row gap-6">
        <div className="flex-1 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-skyblue relative bg-skysoft">
          <img 
            src={currentMemory.image_url} 
            alt={currentMemory.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-navy text-white px-4 py-2 rounded-xl text-md font-bold shadow flex items-center gap-2">
            <MapPin className="h-4 w-4 text-skyblue" />
            <span>{currentMemory.location} • {currentMemory.date}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between text-left space-y-4">
          <div className="space-y-3">
            <span className="text-teal font-bold tracking-wider text-sm uppercase">Featured Memory</span>
            <h2 className="text-3xl font-extrabold text-navy leading-tight">{currentMemory.title}</h2>
            <p className="text-navy/80 text-lg leading-relaxed">{currentMemory.description}</p>
          </div>

          <button 
            onClick={nextMemory}
            className="mt-4 bg-skyblue hover:bg-skyblue/80 text-navy font-bold py-3 px-6 rounded-2xl border border-teal/20 transition self-start flex items-center gap-2 text-md min-h-[48px] cursor-pointer"
          >
            <span>Next Photo</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 3. Dialogue Section & Microphone */}
      <div className="bg-white rounded-3xl p-8 shadow-md border border-skyblue text-center space-y-6">
        <div className="space-y-2">
          <span className="text-teal font-bold text-lg uppercase tracking-wide">Memory Companion</span>
          <p className="text-3xl font-black text-navy leading-tight px-4">
            Do you remember this trip to {currentMemory.location}?
          </p>
        </div>

        {/* Microphone Button */}
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <button 
            onClick={recording ? stopRecording : startRecording}
            className={`h-24 w-24 rounded-full flex items-center justify-center transition-all shadow-xl min-h-[48px] min-w-[48px] cursor-pointer ${
              recording 
              ? 'bg-alert text-white animate-pulse ring-8 ring-alert/30' 
              : 'bg-navy hover:bg-navy/90 text-white ring-8 ring-navy/10'
            }`}
            aria-label={recording ? "Stop Recording" : "Start Recording"}
          >
            {recording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
          </button>
          <span className="text-teal font-bold text-lg">
            {recording ? "Listening... Tap to Save" : "Tap once to speak"}
          </span>
        </div>

        {transcript && (
          <div className="bg-skysoft border border-skyblue p-5 rounded-2xl max-w-xl mx-auto text-left">
            <span className="text-xs font-bold text-teal block mb-1">YOUR ANSWER:</span>
            <p className="text-navy font-medium text-lg italic">"{transcript}"</p>
          </div>
        )}

        {responseMode && (
          <div className="bg-teal/10 border border-teal/20 p-6 rounded-2xl max-w-xl mx-auto text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal">KINKEEP RESPONSE:</span>
              {recallScore !== null && (
                <span className="bg-white border border-teal/20 px-3 py-1 rounded-full text-sm font-bold text-navy">
                  Recall Score: {recallScore}/100
                </span>
              )}
            </div>
            <p className="text-navy font-bold text-xl leading-relaxed">
              {responseMsg}
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => speakText(responseMsg)}
                className={`flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-teal/20 hover:bg-teal/5 text-navy font-semibold text-sm transition min-h-[48px] cursor-pointer ${
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

      {/* 5. Reminders Dock */}
      <div className="bg-skyblue text-navy rounded-3xl p-6 shadow-sm border border-teal/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm text-teal shrink-0">
            <Clock className="h-8 w-8" />
          </div>
          <div className="text-left">
            <span className="text-teal font-extrabold text-sm uppercase block tracking-wider">Upcoming Schedule</span>
            <p className="text-xl font-black">
              {routines.length > 0 ? `💊 Next: ${routines[0].title} at ${routines[0].time}` : "✅ All routines completed for today!"}
            </p>
          </div>
        </div>
        {routines.length > 0 && (
          <button 
            onClick={() => {
              const updated = routines.slice(1);
              setRoutines(updated);
            }}
            className="bg-white hover:bg-skysoft text-navy font-bold py-3 px-6 rounded-2xl shadow transition min-h-[48px] cursor-pointer"
          >
            Mark Completed
          </button>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// VIEW 3: CAREGIVER DASHBOARD
// ----------------------------------------------------
function CaregiverDashboard() {
  const [patient, setPatient] = useState("Eleanor Vance");
  const [alerts, setAlerts] = useState([]);
  const [memories, setMemories] = useState(globalMemories);
  const [routines, setRoutines] = useState([]);
  const [previewMemory, setPreviewMemory] = useState(null);
  
  // Drag and drop / file input state
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Form states
  const [vaultTitle, setVaultTitle] = useState("");
  const [vaultDate, setVaultDate] = useState("");
  const [vaultLocation, setVaultLocation] = useState("");
  const [vaultDesc, setVaultDesc] = useState("");
  const [vaultImg, setVaultImg] = useState("");

  const loadData = useCallback(async () => {
    // Generate different data depending on selected patient
    if (patient === "Eleanor Vance") {
      setRoutines([
        {id: "rout-1", title: "Afternoon Medication", time: "2:00 PM", status: "Pending", type: "medication"},
        {id: "rout-2", title: "Morning Walk in Garden", time: "8:30 AM", status: "Completed", type: "routine"},
        {id: "rout-3", title: "Eat Nutritious Lunch", time: "12:30 PM", status: "Completed", type: "routine"},
        {id: "rout-4", title: "Check Blood Pressure", time: "6:00 PM", status: "Pending", type: "routine"}
      ]);
      setAlerts([
        {
          id: "alert-1",
          created_at: new Date().toISOString(),
          patient_name: "Eleanor Vance",
          type: "Routine Deviation",
          description: "Missed morning routine 2 days in a row",
          severity: "high",
          status: "active"
        }
      ]);
    } else {
      // Thomas Miller
      setRoutines([
        {id: "rout-tm1", title: "Heart Medication", time: "9:00 AM", status: "Completed", type: "medication"},
        {id: "rout-tm2", title: "Physical Therapy Exercises", time: "11:00 AM", status: "Pending", type: "routine"},
        {id: "rout-tm3", title: "Check Blood Sugar", time: "4:00 PM", status: "Pending", type: "routine"}
      ]);
      setAlerts([
        {
          id: "alert-2",
          created_at: new Date().toISOString(),
          patient_name: "Thomas Miller",
          type: "Speech Anomaly",
          description: "Hesitation & vocabulary struggle detected during conversation",
          severity: "medium",
          status: "active"
        }
      ]);
    }

    try {
      const memRes = await fetch(`${API_BASE}/api/v1/memories`);
      const memData = await memRes.json();
      if (memData && memData.length > 0) {
        setMemories(memData);
        globalMemories = memData;
      }
    } catch {
      console.log("Using cached global memories");
      setMemories(globalMemories);
    }
  }, [patient]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Drag and Drop files handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setVaultImg(event.target.result); // Populate preview as base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Add new Memory Card
  const handleAddMemorySubmit = async (e) => {
    e.preventDefault();
    if (!vaultTitle || !vaultDesc) return;

    const fallbackUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800";
    const newMemory = {
      id: `mem-${Date.now()}`,
      title: vaultTitle,
      description: vaultDesc,
      date: vaultDate || "2026",
      location: vaultLocation || "Home",
      image_url: vaultImg || fallbackUrl
    };

    // Attempt to post to backend
    try {
      const formData = new FormData();
      formData.append("title", vaultTitle);
      formData.append("description", vaultDesc);
      formData.append("date", vaultDate || "2026");
      formData.append("location", vaultLocation || "Home");
      formData.append("image_url", vaultImg || fallbackUrl);

      await fetch(`${API_BASE}/api/v1/memories`, {
        method: "POST",
        body: formData
      });
    } catch {
      console.log("Saving locally in fallback mode.");
    }

    // Always update client memory state to make it functional instantly
    const updatedMems = [newMemory, ...memories];
    setMemories(updatedMems);
    globalMemories = updatedMems;

    // Reset Form
    setVaultTitle("");
    setVaultDate("");
    setVaultLocation("");
    setVaultDesc("");
    setVaultImg("");
  };

  // Resolve Alert
  const handleResolveAlert = async (id) => {
    try {
      await fetch(`${API_BASE}/api/v1/caregiver/alerts/${id}/resolve`, { method: "POST" });
    } catch {
      console.log("Resolving alert locally.");
    }
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "resolved" } : a));
  };

  // Toggle routine compliance
  const toggleRoutine = async (id) => {
    const updated = routines.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === "Completed" ? "Pending" : "Completed";
        
        // Push update to backend in background
        fetch(`${API_BASE}/api/v1/routines/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus })
        }).catch(() => console.log("Offline mode, updated client-side."));

        return { ...r, status: nextStatus };
      }
      return r;
    });
    setRoutines(updated);
  };

  // Dynamic calculations for caregiver metrics
  const activeAlerts = alerts.filter(a => a.status === "active");
  
  const meds = routines.filter(r => r.type === "medication");
  const completedMeds = meds.filter(m => m.status === "Completed");
  const medAdherence = meds.length > 0 ? Math.round((completedMeds.length / meds.length) * 100) : 100;

  const totalRoutines = routines.length;
  const completedRoutines = routines.filter(r => r.status === "Completed").length;
  const routinePercentage = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 100;

  // Promotes a memory to the senior spotlight card (View 2)
  const handlePushSpotlight = (index) => {
    globalActiveMemoryIdx = index;
    alert(`"${memories[index].title}" has been set as the Active Memory Spotlight in the Senior Portal!`);
  };

  return (
    <div className="flex-1 bg-skysoft p-6 max-w-7xl mx-auto w-full space-y-6 text-left">
      {/* Top Bar / Patient Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-skyblue">
        <div>
          <h1 className="text-3xl font-extrabold text-navy">Caregiver Hub</h1>
          <p className="text-teal font-medium mt-1">Operational control and cognitive metrics feed</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-navy font-bold text-sm">Patient Monitor:</label>
          <select 
            value={patient} 
            onChange={(e) => setPatient(e.target.value)}
            className="bg-skysoft border border-skyblue font-semibold text-navy py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal cursor-pointer"
          >
            <option value="Eleanor Vance">Eleanor Vance</option>
            <option value="Thomas Miller">Thomas Miller</option>
          </select>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-2 border-teal p-6 rounded-2xl shadow-sm">
          <span className="text-teal font-bold text-sm uppercase block tracking-wider">Memory Engagement</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-navy">85%</span>
            <span className="text-teal font-medium text-sm">Target &gt; 80%</span>
          </div>
        </div>
        <div className="bg-white border-2 border-teal p-6 rounded-2xl shadow-sm">
          <span className="text-teal font-bold text-sm uppercase block tracking-wider">Medication Adherence</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-navy">{medAdherence}%</span>
            <span className="text-teal font-medium text-sm">Today's compliance</span>
          </div>
        </div>
        <div className="bg-white border-2 border-teal p-6 rounded-2xl shadow-sm">
          <span className="text-teal font-bold text-sm uppercase block tracking-wider">Routine Status</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-navy">{routinePercentage}%</span>
            <span className="text-teal font-medium text-sm">{completedRoutines}/{totalRoutines} Done</span>
          </div>
        </div>
        <div className="bg-white border-2 border-teal p-6 rounded-2xl shadow-sm">
          <span className="text-teal font-bold text-sm uppercase block tracking-wider">Active Alerts</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-black ${activeAlerts.length > 0 ? 'text-alert' : 'text-navy'}`}>
              {activeAlerts.length} New
            </span>
            <span className="text-teal font-medium text-sm">Requires response</span>
          </div>
        </div>
      </div>

      {/* Main Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: Memory Vault Manager */}
        <div className="bg-white rounded-2xl p-6 border border-skyblue shadow-sm space-y-6 flex flex-col justify-between">
          <div className="border-b border-skyblue pb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Upload className="text-teal h-6 w-6" />
              <h3 className="text-xl font-bold text-navy">Memory Vault Manager</h3>
            </div>
            <span className="text-teal text-sm font-semibold">{memories.length} Memories</span>
          </div>

          <form onSubmit={handleAddMemorySubmit} className="space-y-4">
            {/* Drag & Drop Area */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-1 ${
                isDragOver ? 'border-teal bg-teal/5' : 'border-skyblue hover:bg-skysoft/50'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <Upload className="h-6 w-6 text-teal" />
              <span className="text-xs font-bold text-navy">Drag Photo Here or Tap to Choose File</span>
              <span className="text-[10px] text-teal">Accepts PNG, JPG, JPEG</span>
            </div>

            {/* Display loaded file preview */}
            {vaultImg && (
              <div className="flex items-center gap-3 bg-skysoft p-2 rounded-xl border border-skyblue">
                <img src={vaultImg} alt="Preview" className="h-12 w-12 object-cover rounded-md" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-teal uppercase">Photo Preview Attached</span>
                  <p className="text-xs text-navy truncate">Local file ready to save</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setVaultImg("")}
                  className="p-1 hover:bg-skyblue rounded-md text-navy"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-navy uppercase">Memory Title</label>
                <input 
                  type="text" 
                  value={vaultTitle} 
                  onChange={(e) => setVaultTitle(e.target.value)} 
                  placeholder="e.g. Munnar Trip"
                  className="w-full bg-skysoft border border-skyblue rounded-xl p-3 text-navy placeholder:text-navy/30 text-sm focus:outline-none focus:ring-1 focus:ring-teal"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-navy uppercase">Location</label>
                <input 
                  type="text" 
                  value={vaultLocation} 
                  onChange={(e) => setVaultLocation(e.target.value)} 
                  placeholder="e.g. Munnar"
                  className="w-full bg-skysoft border border-skyblue rounded-xl p-3 text-navy placeholder:text-navy/30 text-sm focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-navy uppercase">Year / Date</label>
                <input 
                  type="text" 
                  value={vaultDate} 
                  onChange={(e) => setVaultDate(e.target.value)} 
                  placeholder="e.g. 2018"
                  className="w-full bg-skysoft border border-skyblue rounded-xl p-3 text-navy placeholder:text-navy/30 text-sm focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-navy uppercase">Photo URL Fallback</label>
                <input 
                  type="text" 
                  value={vaultImg.startsWith("data:") ? "" : vaultImg} 
                  onChange={(e) => setVaultImg(e.target.value)} 
                  placeholder="Paste URL if not dropping image"
                  className="w-full bg-skysoft border border-skyblue rounded-xl p-3 text-navy placeholder:text-navy/30 text-sm focus:outline-none focus:ring-1 focus:ring-teal"
                  disabled={vaultImg.startsWith("data:")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-navy uppercase">Description / Story Context</label>
              <textarea 
                value={vaultDesc} 
                onChange={(e) => setVaultDesc(e.target.value)} 
                rows="2"
                placeholder="Give a descriptive paragraph to guide the AI conversation..."
                className="w-full bg-skysoft border border-skyblue rounded-xl p-3 text-navy placeholder:text-navy/30 text-sm focus:outline-none resize-none focus:ring-1 focus:ring-teal"
                required
              />
            </div>

            <button 
              type="submit"
              className="bg-navy hover:bg-navy/95 text-white font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center gap-2 w-full cursor-pointer min-h-[48px]"
            >
              <Plus className="h-4 w-4" />
              <span>Save & Upload to Vault</span>
            </button>
          </form>

          {/* Thumbnail grid */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-teal block uppercase tracking-wider">Vault Gallery (Click to Spotlight / Preview)</span>
            <div className="grid grid-cols-4 gap-3 max-h-[140px] overflow-y-auto pr-2">
              {memories.map((mem, index) => (
                <div 
                  key={mem.id} 
                  onClick={() => setPreviewMemory({ mem, index })}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-skyblue bg-skysoft cursor-pointer hover:border-teal transition"
                >
                  <img src={mem.image_url} alt={mem.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2 text-left">
                    <span className="text-white font-bold text-[10px] truncate">{mem.title}</span>
                    <span className="text-skyblue text-[8px]">{mem.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 2: Engagement Tracker */}
        <div className="bg-white rounded-2xl p-6 border border-skyblue shadow-sm space-y-6">
          <div className="border-b border-skyblue pb-4 flex items-center gap-2">
            <Activity className="text-teal h-6 w-6" />
            <h3 className="text-xl font-bold text-navy">Engagement Tracker</h3>
          </div>

          <div className="space-y-6">
            <div className="bg-skysoft border border-skyblue rounded-xl p-4 space-y-4">
              <span className="text-xs font-bold text-teal block uppercase tracking-wider">Conversation Recall Scores</span>
              <div className="flex items-end justify-between h-24 pt-4 px-2">
                <div className="flex flex-col items-center gap-2 w-1/5">
                  <div className="w-8 bg-teal/40 rounded-t-md h-12" />
                  <span className="text-[10px] font-bold text-navy/70">Mon (70)</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-1/5">
                  <div className="w-8 bg-teal/60 rounded-t-md h-16" />
                  <span className="text-[10px] font-bold text-navy/70">Tue (78)</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-1/5">
                  <div className="w-8 bg-teal/40 rounded-t-md h-10" />
                  <span className="text-[10px] font-bold text-navy/70">Wed (65)</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-1/5">
                  <div className="w-8 bg-teal rounded-t-md h-20" />
                  <span className="text-[10px] font-bold text-navy/70">Thu (88)</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-1/5">
                  <div className="w-8 bg-teal rounded-t-md h-[85px]" />
                  <span className="text-[10px] font-bold text-navy/70">Fri (92)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-teal block uppercase tracking-wider">Recall Timeline</span>
              <div className="space-y-4 border-l border-skyblue pl-4 ml-2">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-3.5 w-3.5 rounded-full bg-teal border-2 border-white" />
                  <span className="text-[11px] font-bold text-teal">Today, 2:10 PM</span>
                  <p className="text-sm font-semibold text-navy">Discussed "Family Trip to Munnar" with 85% accuracy</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-3.5 w-3.5 rounded-full bg-teal/40 border-2 border-white" />
                  <span className="text-[11px] font-bold text-teal/70">Yesterday, 9:30 AM</span>
                  <p className="text-sm font-semibold text-navy/75">Talked about "Wedding Day". Recall score: 92%</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-3.5 w-3.5 rounded-full bg-alert border-2 border-white" />
                  <span className="text-[11px] font-bold text-alert">2 days ago, 10:15 AM</span>
                  <p className="text-sm font-semibold text-navy/75">Routine deviances logged: Missed morning breakfast check-in</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Routine & Medication Log */}
        <div className="bg-white rounded-2xl p-6 border border-skyblue shadow-sm space-y-6">
          <div className="border-b border-skyblue pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-teal h-6 w-6" />
              <h3 className="text-xl font-bold text-navy">Routine & Medication Log</h3>
            </div>
            <span className="text-xs font-bold text-teal uppercase tracking-wider">Compliance Monitor</span>
          </div>

          <div className="space-y-3">
            {routines.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 bg-skysoft border border-skyblue rounded-xl hover:bg-skysoft/80 transition"
              >
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleRoutine(item.id)}
                    className={`h-6 w-6 rounded-md border flex items-center justify-center transition cursor-pointer ${
                      item.status === "Completed" 
                      ? "bg-teal border-teal text-white" 
                      : "border-skyblue hover:border-teal bg-white"
                    }`}
                  >
                    {item.status === "Completed" && <Check className="h-4 w-4" />}
                  </button>
                  <div className="text-left">
                    <p className={`font-semibold ${item.status === "Completed" ? "line-through text-navy/50" : "text-navy"}`}>
                      {item.title}
                    </p>
                    <span className="text-xs text-navy/60 font-semibold">{item.time}</span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === "Completed" 
                  ? "bg-teal/10 text-teal" 
                  : "bg-skyblue text-navy/80"
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4: Smart Alerts Panel */}
        <div className="bg-white rounded-2xl p-6 border-2 border-alert shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-skyblue pb-4 flex items-center gap-2">
              <AlertTriangle className="text-alert h-6 w-6 animate-pulse" />
              <h3 className="text-xl font-bold text-navy">Smart Alerts (AI Anomaly Detector)</h3>
            </div>

            <div className="space-y-4">
              {activeAlerts.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <CheckCircle className="text-teal h-12 w-12 mx-auto" />
                  <p className="font-bold text-navy">All Clear</p>
                  <p className="text-navy/60 text-sm">No cognitive deviations or routine exceptions logged.</p>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div key={alert.id} className="bg-alert/10 border border-alert/30 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-alert text-white font-extrabold text-[10px] uppercase px-3 py-0.5 rounded-full">
                        {alert.type}
                      </span>
                      <span className="text-navy/60 text-xs font-semibold">
                        {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-bold text-navy text-lg">{alert.description}</p>
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => alert(`Dialing emergency call for ${alert.patient_name}...`)}
                        className="flex-grow bg-navy hover:bg-navy/95 text-white font-bold py-3 px-4 rounded-xl text-sm transition text-center min-h-[48px] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Phone className="h-4 w-4 text-skyblue" />
                        <span>Call Patient</span>
                      </button>
                      <button 
                        onClick={() => handleResolveAlert(alert.id)}
                        className="flex-grow bg-white hover:bg-skysoft border border-skyblue text-navy font-bold py-3 px-4 rounded-xl text-sm transition min-h-[48px] cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-skysoft p-4 rounded-xl border border-skyblue flex items-center gap-3">
            <Shield className="text-teal h-6 w-6 shrink-0" />
            <p className="text-navy/70 text-xs leading-normal">
              KinKeep continuously monitors speech and daily checklist logs. Alerts are generated through semantic anomalies detected by Google Gemini.
            </p>
          </div>
        </div>

      </div>

      {/* Memory Spotlight Preview Overlay / Modal */}
      {previewMemory && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-skyblue shadow-2xl relative space-y-4">
            <button 
              onClick={() => setPreviewMemory(null)}
              className="absolute top-4 right-4 p-2 bg-skysoft hover:bg-skyblue rounded-full text-navy cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-skyblue">
              <img src={previewMemory.mem.image_url} alt={previewMemory.mem.title} className="w-full h-full object-cover" />
            </div>
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-teal/10 text-teal px-2 py-0.5 rounded-full">{previewMemory.mem.location}</span>
                <span className="text-xs font-bold bg-teal/10 text-teal px-2 py-0.5 rounded-full">{previewMemory.mem.date}</span>
              </div>
              <h4 className="text-2xl font-black text-navy leading-tight">{previewMemory.mem.title}</h4>
              <p className="text-navy/70 text-sm">{previewMemory.mem.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => {
                  handlePushSpotlight(previewMemory.index);
                  setPreviewMemory(null);
                }}
                className="bg-navy hover:bg-navy/95 text-white font-bold py-3 px-4 rounded-xl text-sm transition min-h-[48px] cursor-pointer flex items-center justify-center gap-2"
              >
                <Activity className="h-4 w-4 text-skyblue" />
                <span>Spotlight to Senior</span>
              </button>
              <button 
                onClick={() => setPreviewMemory(null)}
                className="bg-skysoft hover:bg-skyblue border border-skyblue text-navy font-bold py-3 px-4 rounded-xl text-sm transition min-h-[48px] cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// MAIN APP COMPONENT & ROUTER
// ----------------------------------------------------
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-skysoft flex flex-col font-sans">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient" element={<PatientInterface />} />
          <Route path="/dashboard" element={<CaregiverDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
