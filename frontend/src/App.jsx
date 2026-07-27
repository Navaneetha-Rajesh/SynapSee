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
  Phone,
  User,
  ShieldCheck,
  Search,
  Tag,
  Gamepad2,
  Lock,
  Sparkles,
  Key,
  Home
} from 'lucide-react';

import AccessibilitySuite from './components/AccessibilitySuite';
import TakeMeHomeGPS from './components/TakeMeHomeGPS';
import MedicationAlertModal from './components/MedicationAlertModal';
import CognitiveGamesHub from './components/CognitiveGamesHub';
import VoiceInteraction from './components/VoiceInteraction';

const API_BASE = "http://localhost:3000";

// Global navigation bar
function Navigation() {
  return (
    <nav className="bg-navy px-6 py-4 flex items-center justify-between border-b border-teal/30 sticky top-0 z-40 shadow-lg">
      <Link to="/" className="text-white text-2xl font-black flex items-center gap-2">
        <Heart className="text-skyblue fill-skyblue h-7 w-7" />
        <span className="tracking-tight text-3xl font-extrabold text-white">Synapsee</span>
      </Link>
      <div className="flex items-center gap-4 sm:gap-6">
        <Link to="/select-role" className="bg-teal hover:bg-teal/80 text-white px-5 py-2.5 rounded-xl transition font-black text-sm shadow-md">
          Portal Login
        </Link>
      </div>
    </nav>
  );
}

// Global state sharing during runtime
let globalMemories = [
  {
    id: "munnar-2018",
    title: "Family Trip to Munnar",
    date: "2018",
    location: "Munnar",
    people_tags: ["Eleanor", "Grandson Leo", "Sarah"],
    image_url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800",
    description: "Our wonderful family vacation to the tea gardens of Munnar. It was cool and foggy, and we spent the afternoon drinking hot chai."
  },
  {
    id: "wedding-1975",
    title: "Our Wedding Day",
    date: "1975",
    location: "St. Mary's Church",
    people_tags: ["Eleanor", "Arthur Vance"],
    image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    description: "The beautiful spring morning when we got married. Family and friends danced until evening."
  },
  {
    id: "beach-2012",
    title: "Summer at Sunset Beach",
    date: "2012",
    location: "Sunset Beach",
    people_tags: ["Eleanor", "Grandson Leo"],
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    description: "Building sandcastles with young Leo during summer sunset. The ocean breeze was warm and refreshing."
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
      {/* 1. Header & Hero Block */}
      <header className="bg-navy text-white py-20 px-8 flex-1 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-teal/20 border border-teal/40 px-4 py-1.5 rounded-full text-skyblue font-extrabold text-sm">
              <Sparkles className="h-4 w-4 text-skyblue" />
              <span>Next-Gen Cognitive Care & Memory Vault</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">
              Your Memories. <br />
              <span className="text-skyblue">Your Companion.</span>
            </h1>
            <p className="text-skyblue/90 text-lg leading-relaxed max-w-lg font-medium">
              Synapsee bridges the gap between generations. A secure memory vault and cognitive health companion designed to help seniors preserve their legacy while providing families with real-time care reassurance.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/select-role')}
                className="bg-teal hover:bg-teal/90 text-white font-black px-8 py-4 rounded-2xl shadow-xl transition flex items-center gap-3 text-lg cursor-pointer transform hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRight className="h-6 w-6" />
              </button>
              <button
                onClick={() => navigate('/patient/games')}
                className="bg-navy border-2 border-teal hover:bg-teal/20 text-skyblue font-black px-6 py-4 rounded-2xl shadow transition flex items-center gap-2 text-lg cursor-pointer"
              >
                <Gamepad2 className="h-5 w-5 text-skyblue" />
                <span>Try Cognitive Games</span>
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-[4/3] rounded-3xl border-4 border-teal overflow-hidden shadow-2xl relative bg-navy/40">
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=800"
                alt="Senior with family"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-navy/80 via-transparent to-transparent flex items-end p-6">
                <span className="text-white font-bold bg-teal/90 px-4 py-1.5 rounded-full text-sm shadow">
                  Empowering Dignity & Care
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Advantages Section */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-4xl font-black text-navy">Advantages</h2>
            <p className="text-teal font-extrabold mt-2 text-lg">Why families trust Synapsee for cognitive health</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-skysoft border-2 border-skyblue p-6 rounded-2xl text-left space-y-4 hover:shadow-lg transition">
              <div className="bg-teal/10 p-3 rounded-2xl w-fit">
                <Brain className="text-teal h-7 w-7" />
              </div>
              <h3 className="font-black text-navy text-xl">Memory Vault</h3>
              <p className="text-navy/70 text-sm">
                Easily upload and organize precious photos, dates, locations, and voice clips into a searchable family gallery.
              </p>
            </div>
            <div className="bg-skysoft border-2 border-skyblue p-6 rounded-2xl text-left space-y-4 hover:shadow-lg transition">
              <div className="bg-teal/10 p-3 rounded-2xl w-fit">
                <Smile className="text-teal h-7 w-7" />
              </div>
              <h3 className="font-black text-navy text-xl">Cognitive Games</h3>
              <p className="text-navy/70 text-sm">
                10 interactive reminiscence games tracking recall accuracy, duration, and cognitive health trends.
              </p>
            </div>
            <div className="bg-skysoft border-2 border-skyblue p-6 rounded-2xl text-left space-y-4 hover:shadow-lg transition">
              <div className="bg-teal/10 p-3 rounded-2xl w-fit">
                <Calendar className="text-teal h-7 w-7" />
              </div>
              <h3 className="font-black text-navy text-xl">Mandatory Alerts</h3>
              <p className="text-navy/70 text-sm">
                Non-dismissible medication alert modals requiring explicit confirmation and logging compliance to caregivers.
              </p>
            </div>
            <div className="bg-skysoft border-2 border-skyblue p-6 rounded-2xl text-left space-y-4 hover:shadow-lg transition">
              <div className="bg-teal/10 p-3 rounded-2xl w-fit">
                <ShieldCheck className="text-teal h-7 w-7" />
              </div>
              <h3 className="font-black text-navy text-xl">Caregiver Feed</h3>
              <p className="text-navy/70 text-sm">
                Monitors speech hesitation, game accuracy, and medication status with instant AI anomaly alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-6 border-t border-skyblue">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-navy font-black text-xl flex items-center gap-2">
            <Heart className="text-teal fill-teal h-6 w-6" />
            <span>Synapsee</span>
          </div>
          <p className="text-teal text-sm font-semibold">© 2026 Synapsee Inc. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-navy hover:text-teal font-bold">Privacy Policy</a>
            <a href="#" className="text-navy hover:text-teal font-bold">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------
// VIEW 1.5: ROLE SELECTION & LOGIN FLOWS
// ----------------------------------------------------
function SelectRolePage() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 bg-skysoft flex items-center justify-center p-6 text-center">
      <div className="max-w-3xl w-full space-y-8 bg-white p-8 sm:p-12 rounded-3xl border-4 border-skyblue shadow-2xl">
        <div className="space-y-3">
          <div className="bg-teal/10 p-4 rounded-3xl w-fit mx-auto text-teal">
            <Heart className="h-12 w-12 fill-teal" />
          </div>
          <h1 className="text-4xl font-black text-navy">Welcome to Synapsee</h1>
          <p className="text-teal font-extrabold text-lg">Please select your portal to log in</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Senior User Portal */}
          <div
            onClick={() => navigate('/login/user')}
            className="bg-skysoft hover:bg-teal/10 border-4 border-skyblue hover:border-teal rounded-3xl p-8 space-y-4 cursor-pointer transition transform hover:-translate-y-1 shadow-md text-left flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="bg-teal text-white p-3.5 rounded-2xl w-fit">
                <User className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-navy">Senior Portal</h3>
              <p className="text-navy/70 text-sm">
                Simplified login interface tailored for elderly users with extra-large buttons, voice prompts, and simple PIN access.
              </p>
            </div>
            <button className="w-full bg-teal text-white font-black py-3.5 rounded-2xl shadow transition text-md flex items-center justify-center gap-2">
              <span>Enter Senior Portal</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Caregiver Hub */}
          <div
            onClick={() => navigate('/login/caregiver')}
            className="bg-skysoft hover:bg-navy/10 border-4 border-skyblue hover:border-navy rounded-3xl p-8 space-y-4 cursor-pointer transition transform hover:-translate-y-1 shadow-md text-left flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="bg-navy text-white p-3.5 rounded-2xl w-fit">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-navy">Caregiver Hub</h3>
              <p className="text-navy/70 text-sm">
                Secure monitoring dashboard portal for family members and caregivers with game analytics, live medication logs, and alerts.
              </p>
            </div>
            <button className="w-full bg-navy text-white font-black py-3.5 rounded-2xl shadow transition text-md flex items-center justify-center gap-2">
              <span>Enter Caregiver Hub</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeniorLoginPage() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/patient');
  };

  return (
    <div className="flex-1 bg-skysoft flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border-4 border-teal shadow-2xl space-y-6">
        <div className="bg-teal/10 p-4 rounded-3xl w-fit mx-auto text-teal">
          <User className="h-12 w-12 text-teal" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-navy">Senior Portal Login</h2>
          <p className="text-teal font-extrabold text-sm">Welcome back, Eleanor!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-sm font-black text-navy uppercase tracking-wider block">Enter Your Easy 4-Digit PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="• • • •"
              maxLength={4}
              className="w-full bg-skysoft border-2 border-skyblue rounded-2xl p-4 text-center font-black text-3xl tracking-widest text-navy focus:outline-none focus:border-teal"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal hover:bg-navy text-white font-black py-5 rounded-2xl shadow-xl transition text-xl cursor-pointer min-h-[56px] flex items-center justify-center gap-2"
          >
            <span>Start My Day</span>
            <ArrowRight className="h-6 w-6" />
          </button>
        </form>

        <button
          onClick={() => navigate('/select-role')}
          className="text-navy/60 hover:text-navy font-bold text-sm underline cursor-pointer"
        >
          Back to Portal Selection
        </button>
      </div>
    </div>
  );
}

function CaregiverLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("caregiver@synapsee.com");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 bg-skysoft flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border-4 border-navy shadow-2xl space-y-6">
        <div className="bg-navy p-4 rounded-3xl w-fit mx-auto text-white shadow-md">
          <ShieldCheck className="h-12 w-12 text-skyblue" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-navy">Caregiver Hub Login</h2>
          <p className="text-teal font-extrabold text-sm">Secure Portal Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-black text-navy uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-skysoft border-2 border-skyblue rounded-2xl p-3.5 font-bold text-navy text-sm focus:outline-none focus:border-navy"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-navy uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-skysoft border-2 border-skyblue rounded-2xl p-3.5 font-bold text-navy text-sm focus:outline-none focus:border-navy"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-navy hover:bg-navy/90 text-white font-black py-4 rounded-2xl shadow-xl transition text-lg cursor-pointer min-h-[50px] flex items-center justify-center gap-2 mt-4"
          >
            <Lock className="h-5 w-5 text-skyblue" />
            <span>Secure Login</span>
          </button>
        </form>

        <button
          onClick={() => navigate('/select-role')}
          className="text-navy/60 hover:text-navy font-bold text-sm underline cursor-pointer"
        >
          Back to Portal Selection
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// VIEW 2: SENIOR / PATIENT INTERFACE
// ----------------------------------------------------
function PatientInterface({ isMuted, setIsMuted }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recording, setRecording] = useState(false);
  const [responseMode, setResponseMode] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [recallScore, setRecallScore] = useState(null);
  const [speechActive, setSpeechActive] = useState(false);
  const [memories, setMemories] = useState(globalMemories);
  const [currentIdx, setCurrentIdx] = useState(globalActiveMemoryIdx);
  const [medications, setMedications] = useState([]);

  // Search & Tag Filter for Memory Vault Grid
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchData();

    const syncTimer = setInterval(async () => {
      try {
        const memRes = await fetch(`${API_BASE}/api/memories`);
        const mems = await memRes.json();
        if (Array.isArray(mems) && mems.length > 0) {
          setMemories(mems);
          globalMemories = mems;
        }

        const spotRes = await fetch(`${API_BASE}/api/spotlight`);
        const spotData = await spotRes.json();
        const spotId = spotData.activeId;
        if (spotId && Array.isArray(mems)) {
          const idx = mems.findIndex(m => m.id === spotId);
          if (idx !== -1) {
            setCurrentIdx(idx);
            globalActiveMemoryIdx = idx;
          }
        }
      } catch (e) {
        console.warn("Offline sync memories / spotlight:", e);
      }
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(syncTimer);
    };
  }, []);

  const fetchData = async () => {
    try {
      const memRes = await fetch(`${API_BASE}/api/memories`);
      const mems = await memRes.json();
      if (Array.isArray(mems) && mems.length > 0) {
        setMemories(mems);
        globalMemories = mems;
      }

      const medRes = await fetch(`${API_BASE}/api/v1/medications`);
      const meds = await medRes.json();
      if (Array.isArray(meds)) {
        setMedications(meds);
      }
    } catch (e) {
      console.error("Using local fallback memory data.", e);
    }
  };

  const safeMemories = Array.isArray(memories) && memories.length > 0 ? memories : globalMemories;
  const currentMemory = safeMemories[currentIdx] || safeMemories[0] || globalMemories[0];

  const speakText = (text) => {
    if (isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
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

      const res = await fetch(`${API_BASE}/api/voice/process`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setTranscript(data.transcript);
      setResponseMsg(data.response);
      setRecallScore(data.cognitive_score);
      setResponseMode(true);
      speakText(data.response);
    } catch {
      const fallbackText = "I remember the beautiful mountains and tea fields.";
      setTranscript(fallbackText);
      await submitTextInteraction(fallbackText);
    }
  };

  const submitTextInteraction = async (textStr) => {
    try {
      const res = await fetch(`${API_BASE}/api/voice/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: textStr,
          memory_id: currentMemory?.id || "munnar-2018"
        })
      });
      const data = await res.json();
      setTranscript(data.transcript);
      setResponseMsg(data.response);
      setRecallScore(data.cognitive_score);
      setResponseMode(true);
      speakText(data.response);
    } catch {
      const mockReply = "Oh, that sounds lovely! Munnar is indeed beautiful. Do you remember who drank hot chai with us?";
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
    const nextIdx = (currentIdx + 1) % (safeMemories.length || 1);
    setCurrentIdx(nextIdx);
    globalActiveMemoryIdx = nextIdx;
  };

  const handleMedicationTaken = (medId, takenAt) => {
    setMedications(prev => (Array.isArray(prev) ? prev : []).map(m => m.id === medId ? { ...m, taken_status: "taken", taken_at: takenAt } : m));
  };

  // Filter Memories in Vault
  const filteredMemories = safeMemories.filter(m => {
    if (!m) return false;
    const title = m.title || "";
    const loc = m.location || "";
    const desc = m.description || "";

    const matchesSearch = searchQuery === "" ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = selectedTag === "ALL" || (Array.isArray(m.people_tags) && m.people_tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex-1 bg-skysoft flex flex-col p-6 max-w-5xl mx-auto w-full space-y-6 text-left relative pb-28">



      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white shadow-sm rounded-3xl p-5 border border-skyblue gap-4">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-navy">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-3xl font-black text-navy/80">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/patient/games')}
            className="bg-teal hover:bg-teal/90 text-white font-black py-3 px-5 rounded-2xl shadow transition flex items-center gap-2 text-md cursor-pointer border border-teal"
          >
            <Gamepad2 className="h-5 w-5" />
            <span>Play Cognitive Games</span>
          </button>

          <div className="flex items-center gap-2 bg-teal/10 px-4 py-2 rounded-full border border-teal/20">
            <div className="h-3 w-3 bg-teal rounded-full animate-pulse" />
            <span className="text-teal font-extrabold text-md">Synapsee Online</span>
          </div>
        </div>
      </div>

      {/* 2. Medication Reminder Dock & Mandatory Alert Modal */}
      <MedicationAlertModal medications={Array.isArray(medications) ? medications : []} onMedicationTaken={handleMedicationTaken} />

      {/* 3. Memory Spotlight Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-skyblue flex flex-col md:flex-row gap-6">
        <div className="flex-1 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-skyblue relative bg-skysoft">
          <img
            src={currentMemory?.image_url || currentMemory?.photo_url || globalMemories[0].image_url}
            alt={currentMemory?.title || "Memory photo"}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-navy text-white px-4 py-2 rounded-xl text-md font-extrabold shadow flex items-center gap-2">
            <MapPin className="h-4 w-4 text-skyblue" />
            <span>{currentMemory?.location || "Memory"} • {currentMemory?.date || "Past"}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between text-left space-y-4">
          <div className="space-y-3">
            <span className="text-teal font-extrabold tracking-wider text-xs uppercase bg-teal/10 px-3 py-1 rounded-full">Featured Memory Spotlight</span>
            <h2 className="text-3xl font-black text-navy leading-tight">{currentMemory?.title || "Family Memory"}</h2>
            <p className="text-navy/80 text-lg leading-relaxed">{currentMemory?.description || "A special memory."}</p>
            {Array.isArray(currentMemory?.people_tags) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {currentMemory.people_tags.map(t => (
                  <span key={t} className="bg-skysoft text-teal border border-skyblue px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={nextMemory}
            className="mt-4 bg-skyblue hover:bg-skyblue/80 text-navy font-black py-3.5 px-6 rounded-2xl border border-teal/20 transition self-start flex items-center gap-2 text-md min-h-[48px] cursor-pointer"
          >
            <span>Next Photo</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 4. Dialogue Section & Microphone */}
      <VoiceInteraction currentMemory={currentMemory} isMuted={isMuted} />

      {/* 5. Memory Vault Grid Component */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-skyblue space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-skyblue pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-teal/10 p-3 rounded-2xl text-teal">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-navy">Personal Family Memory Vault</h3>
              <p className="text-teal font-extrabold text-xs">Search and explore stored family life moments</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-navy/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories..."
              className="w-full pl-10 pr-4 py-2.5 bg-skysoft border border-skyblue rounded-2xl text-sm font-bold text-navy focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-navy uppercase tracking-wider mr-2">Filter People:</span>
          {["ALL", "Eleanor", "Grandson Leo", "Sarah"].map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer border ${selectedTag === tag
                  ? "bg-teal text-white border-teal shadow"
                  : "bg-skysoft text-navy border-skyblue hover:bg-skyblue/50"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((mem, idx) => (
            <div
              key={mem.id}
              onClick={() => {
                setCurrentIdx(idx);
                globalActiveMemoryIdx = idx;
                window.scrollTo({ top: 250, behavior: 'smooth' });
              }}
              className="bg-skysoft border-2 border-skyblue hover:border-teal rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={mem.image_url || mem.photo_url} alt={mem.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                <div className="absolute top-2 left-2 bg-navy/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {mem.date}
                </div>
              </div>
              <div className="p-4 space-y-2 text-left">
                <h4 className="font-black text-navy text-lg group-hover:text-teal transition line-clamp-1">{mem.title}</h4>
                <p className="text-navy/70 text-xs line-clamp-2">{mem.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-skyblue/60">
                  <span className="text-[11px] font-extrabold text-teal flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {mem.location}
                  </span>
                  <span className="text-[10px] font-bold bg-white text-navy px-2 py-0.5 rounded-md border border-skyblue">
                    Tap to Spotlight
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ----------------------------------------------------
// VIEW 3: CAREGIVER DASHBOARD
// ----------------------------------------------------
function CaregiverDashboard() {
  const [patient, setPatient] = useState("Eleanor Vance");
  const targetUserId = patient === "Eleanor Vance" ? "user-eleanor" : "user-thomas";
  const [alerts, setAlerts] = useState([]);
  const [memories, setMemories] = useState(globalMemories);
  const [medications, setMedications] = useState([]);
  const [gameLogs, setGameLogs] = useState([]);
  const [previewMemory, setPreviewMemory] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [digestData, setDigestData] = useState(null);

  const parseDigest = (rawOutput) => {
    if (!rawOutput) return null;
    try {
      let clean = rawOutput.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      return JSON.parse(clean);
    } catch (err) {
      console.error("Failed to parse digest JSON:", err);
      return null;
    }
  };

  // Memory Form state
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [vaultTitle, setVaultTitle] = useState("");
  const [vaultDate, setVaultDate] = useState("");
  const [vaultLocation, setVaultLocation] = useState("");
  const [vaultPeople, setVaultPeople] = useState("");
  const [vaultDesc, setVaultDesc] = useState("");
  const [vaultImg, setVaultImg] = useState("");

  const loadData = useCallback(async () => {
    try {
      const alertRes = await fetch(`${API_BASE}/api/v1/caregiver/alerts`);
      const alertData = await alertRes.json();
      if (Array.isArray(alertData)) setAlerts(alertData);

      const memRes = await fetch(`${API_BASE}/api/memories`);
      const memData = await memRes.json();
      if (Array.isArray(memData) && memData.length > 0) {
        setMemories(memData);
        globalMemories = memData;
      }

      const medRes = await fetch(`${API_BASE}/api/v1/medications`);
      const medData = await medRes.json();
      if (Array.isArray(medData)) setMedications(medData);

      const logRes = await fetch(`${API_BASE}/api/v1/game-logs`);
      const logData = await logRes.json();
      if (Array.isArray(logData)) setGameLogs(logData);
    } catch (e) {
      console.log("Using cached local state.", e);
      setMemories(globalMemories);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, [loadData]);

  const fetchAiSummary = useCallback(async (patientId) => {
    setLoadingSummary(true);
    setDigestData(null);

    try {
      const targetId = "11111111-1111-1111-1111-111111111111";
      const digestRes = await fetch(`http://localhost:5678/webhook/caregiver-digest?patientId=${targetId}`);
      const data = await digestRes.json();
      
      if (data && data.output) {
        // Output wrapped JSON
        const parsed = parseDigest(data.output);
        if (parsed) setDigestData(parsed);
      } else {
        // Direct JSON response
        setDigestData(data);
      }
    } catch (err) {
      console.warn("n8n local digest webhook offline:", err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  useEffect(() => {
    fetchAiSummary(targetUserId);
  }, [targetUserId, fetchAiSummary]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => { setIsDragOver(false); };

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => setVaultImg(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const handleAddMemorySubmit = async (e) => {
    e.preventDefault();
    if (!vaultTitle || !vaultDesc) return;

    const fallbackUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800";
    const newMemory = {
      id: `mem-${Date.now()}`,
      user_id: targetUserId,
      title: vaultTitle,
      description: vaultDesc,
      date: vaultDate || "2026",
      location: vaultLocation || "Home",
      people_tags: vaultPeople ? vaultPeople.split(",") : ["Family"],
      image_url: vaultImg || fallbackUrl
    };

    try {
      const formData = new FormData();
      formData.append("title", vaultTitle);
      formData.append("description", vaultDesc);
      formData.append("date", vaultDate || "2026");
      formData.append("location", vaultLocation || "Home");
      formData.append("people_tags", vaultPeople || "Family");
      formData.append("image_url", vaultImg || fallbackUrl);
      formData.append("user_id", targetUserId);

      await fetch(`${API_BASE}/api/v1/memories`, { method: "POST", body: formData });
    } catch {
      console.log("Saving memory locally.");
    }

    const updatedMems = [newMemory, ...memories];
    setMemories(updatedMems);
    globalMemories = updatedMems;

    setVaultTitle(""); setVaultDate(""); setVaultLocation(""); setVaultPeople(""); setVaultDesc(""); setVaultImg("");
  };

  const handleResolveAlert = async (id) => {
    try {
      await fetch(`${API_BASE}/api/alerts/${id}/resolve`, { method: "PATCH" });
    } catch {
      console.log("Resolving alert locally.");
    }
    setAlerts(prev => (Array.isArray(prev) ? prev : []).map(a => a.id === id ? { ...a, status: "resolved" } : a));
  };

  const handlePushSpotlight = async (index) => {
    if (memories && memories[index]) {
      const memory = memories[index];
      try {
        await fetch(`${API_BASE}/api/spotlight`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activeId: memory.id })
        });
        alert(`"${memory.title}" has been pushed to the Senior Portal Spotlight!`);
      } catch (e) {
        console.warn("Failed to push spotlight to server:", e);
      }
    }
  };

  // Safe Analytics Metrics
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const safeMedications = Array.isArray(medications) ? medications : [];
  const safeGameLogs = Array.isArray(gameLogs) ? gameLogs : [];
  const safeMemories = Array.isArray(memories) ? memories : [];

  const filteredAlerts = safeAlerts.filter(a =>
    patient === "Eleanor Vance"
      ? (a.patient_name === "Eleanor Vance" || a.user_id === "user-eleanor" || !a.user_id)
      : (a.patient_name === "Thomas Miller" || a.user_id === "user-thomas")
  );

  const filteredMeds = safeMedications.filter(m =>
    patient === "Eleanor Vance"
      ? (m.user_id === "user-eleanor" || !m.user_id)
      : (m.user_id === "user-thomas")
  );

  const filteredGameLogs = safeGameLogs.filter(g =>
    patient === "Eleanor Vance"
      ? (g.user_id === "user-eleanor" || !g.user_id)
      : (g.user_id === "user-thomas")
  );

  const activeAlerts = filteredAlerts.filter(a => a.status === "active");
  const completedMeds = filteredMeds.filter(m => m.taken_status === "taken");
  const medAdherencePct = filteredMeds.length > 0 ? Math.round((completedMeds.length / filteredMeds.length) * 100) : 100;

  const totalGamesPlayed = filteredGameLogs.length;
  const avgGameAccuracy = filteredGameLogs.length > 0
    ? Math.round(filteredGameLogs.reduce((acc, g) => acc + (g.accuracy_pct || 80), 0) / filteredGameLogs.length)
    : (patient === "Eleanor Vance" ? 85 : 62);
  const historicalArray = digestData?.historical_analytics && Array.isArray(digestData.historical_analytics)
    ? digestData.historical_analytics
    : [];

  const latestHist = historicalArray.length > 0
    ? historicalArray[historicalArray.length - 1]
    : null;

  const displayAccuracy = digestData?.latest_session?.accuracy_percentage !== undefined
    ? `${Math.round(digestData.latest_session.accuracy_percentage)}%`
    : `${avgGameAccuracy}%`;

  const displayAccuracySub = digestData?.latest_session
    ? `Latest: ${digestData.latest_session.game_name}`
    : `${totalGamesPlayed} games logged`;

  const displayMedAdherence = latestHist?.medication_adherence_rate !== undefined
    ? `${latestHist.medication_adherence_rate}%`
    : `${medAdherencePct}%`;

  const displayMedSub = digestData?.medication_and_adherence?.medication_logs_count !== undefined
    ? `${digestData.medication_and_adherence.medication_logs_count} logs synced`
    : `${completedMeds.length}/{filteredMeds.length} Taken`;

  const displayHesitation = latestHist?.speech_hesitation_score !== undefined
    ? `${latestHist.speech_hesitation_score}%`
    : "15%";

  if (loadingSummary && !digestData) {
    return (
      <div className="flex-1 bg-skysoft flex flex-col items-center justify-center p-12 min-h-[70vh] space-y-6 text-center">
        <div className="bg-navy p-5 rounded-full shadow-2xl text-white">
          <Brain className="h-16 w-16 text-skyblue animate-spin" />
        </div>
        <h2 className="text-3xl font-black text-navy leading-tight">Generating Caregiver AI Digest...</h2>
        <p className="text-teal font-extrabold max-w-md text-sm leading-relaxed">
          Please wait. Ollama and n8n are running cognitive analytics models to compile games, speech interaction signals, and medication compliance logs.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-skysoft p-6 max-w-7xl mx-auto w-full space-y-6 text-left">
      {/* Top Bar / Patient Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border-2 border-skyblue">
        <div>
          <h1 className="text-3xl font-black text-navy">Caregiver Monitoring Hub</h1>
          <p className="text-teal font-extrabold mt-1 text-sm">Real-time cognitive analytics & behavioral signals</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-navy font-black text-sm">Active Patient:</label>
          <select
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            className="bg-skysoft border-2 border-skyblue font-extrabold text-navy py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal cursor-pointer text-sm"
          >
            <option value="Eleanor Vance">Eleanor Vance</option>
            <option value="Thomas Miller">Thomas Miller</option>
          </select>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-2 border-teal p-6 rounded-3xl shadow-sm space-y-2">
          <span className="text-teal font-extrabold text-xs uppercase tracking-wider block">Game Analytics Accuracy</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-navy">{displayAccuracy}</span>
            <span className="text-teal font-extrabold text-xs">{displayAccuracySub}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-teal p-6 rounded-3xl shadow-sm space-y-2">
          <span className="text-teal font-extrabold text-xs uppercase tracking-wider block">Medication Compliance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-navy">{displayMedAdherence}</span>
            <span className="text-teal font-extrabold text-xs">{displayMedSub}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-teal p-6 rounded-3xl shadow-sm space-y-2">
          <span className="text-teal font-extrabold text-xs uppercase tracking-wider block">Speech Hesitation Index</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-navy">{displayHesitation}</span>
            <span className="text-teal font-extrabold text-xs">{latestHist ? "Active tracking" : "Stable recall"}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-teal p-6 rounded-3xl shadow-sm space-y-2">
          <span className="text-teal font-extrabold text-xs uppercase tracking-wider block">Active Smart Alerts</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${activeAlerts.length > 0 ? 'text-alert' : 'text-navy'}`}>
              {activeAlerts.length} New
            </span>
            <span className="text-teal font-extrabold text-xs">AI signals</span>
          </div>
        </div>
      </div>

      {/* Premium AI Activity Summary Card */}
      <div className="bg-gradient-to-r from-teal/10 via-skyblue/10 to-transparent border-2 border-teal rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-skyblue pb-3">
          <div className="bg-teal text-white p-2.5 rounded-2xl shadow-sm">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-navy">AI-Elaborated Activity Digest</h3>
            <p className="text-teal font-extrabold text-[10px] uppercase tracking-wider">Ollama & n8n Synced Cognitive Insights</p>
          </div>
        </div>
        {loadingSummary && !digestData ? (
          <div className="flex items-center gap-2 text-teal font-bold py-2">
            <div className="h-4 w-4 border-2 border-teal border-t-transparent rounded-full animate-spin" />
            <span>Analyzing patient activity logs...</span>
          </div>
        ) : (
          <div className="space-y-4 text-left">
            <div>
              <span className="text-xs font-black text-teal uppercase tracking-wider block">Cognitive Performance</span>
              <p className="text-navy font-bold text-md italic mt-1">
                "{digestData?.caretaker_summary?.cognitive_performance || "Eleanor's cognitive performance is steady, retaining wedding dates and Munnar locations cleanly."}"
              </p>
            </div>
            <div>
              <span className="text-xs font-black text-teal uppercase tracking-wider block">Speech & Hesitation Trends</span>
              <p className="text-navy font-bold text-md italic mt-1">
                "{digestData?.caretaker_summary?.speech_hesitation_trends || "Speech rate is clear and normal, with hesitation indices below alert thresholds."}"
              </p>
            </div>
            <div>
              <span className="text-xs font-black text-teal uppercase tracking-wider block">Recommended Actions</span>
              <p className="text-navy font-bold text-md italic mt-1">
                "{digestData?.caretaker_summary?.action_items || "Engage in another song matching exercise or discuss old family trip photos to reinforce recent prompts."}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CARD 1: Real-Time Game Analytics Panel */}
        <div className="bg-white rounded-3xl p-6 border-2 border-skyblue shadow-sm space-y-6">
          <div className="border-b border-skyblue pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="text-teal h-6 w-6" />
              <h3 className="text-xl font-black text-navy">Real-time Game Analytics Panel</h3>
            </div>
            <span className="text-teal text-xs font-black uppercase tracking-wider">{totalGamesPlayed} Logged Sessions</span>
          </div>

          <div className="space-y-4">
            {/* Latest Session Details from n8n */}
            {digestData?.latest_session && (
              <div className="bg-teal/10 border-2 border-teal/30 p-5 rounded-2xl space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="bg-teal text-white font-black text-[10px] uppercase px-3 py-1 rounded-full">
                    Latest Activity Details
                  </span>
                  <span className="text-navy/60 text-xs font-bold">
                    {new Date(digestData.latest_session.played_at_utc).toLocaleString()}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-navy text-lg">{digestData.latest_session.game_name}</h4>
                  <p className="text-xs font-bold text-teal">Key: {digestData.latest_session.game_key}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center pt-2">
                  <div className="bg-white p-3 rounded-xl border border-skyblue">
                    <span className="text-navy font-black text-lg block">{digestData.latest_session.accuracy_percentage}%</span>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-teal">Accuracy</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-skyblue">
                    <span className="text-navy font-black text-lg block">{digestData.latest_session.correct_count} - {digestData.latest_session.wrong_count}</span>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-teal">Right/Wrong</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-skyblue">
                    <span className="text-navy font-black text-lg block">{digestData.latest_session.duration_seconds}s</span>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-teal">Duration</span>
                  </div>
                </div>
              </div>
            )}

            <span className="text-xs font-black text-teal uppercase tracking-wider block">Recent Cognitive Game Logs</span>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {filteredGameLogs.length === 0 ? (
                <p className="text-navy/60 text-sm italic py-4 text-center">No game logs recorded yet today for {patient}.</p>
              ) : (
                filteredGameLogs.map((log) => (
                  <div key={log.id} className="bg-skysoft border border-skyblue p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-black text-navy text-md block">{log.game_name}</span>
                      <span className="text-xs text-teal font-extrabold">Duration: {log.duration_seconds}s</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-teal">{log.accuracy_pct || 80}% Accuracy</span>
                      <span className="text-[10px] text-[#2F4156]/60 block font-bold">
                        {log.correct_count} Right / {log.wrong_count} Wrong
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* n8n Historical Trend Table */}
            {historicalArray.length > 0 && (
              <div className="border-t border-skyblue pt-4 space-y-3">
                <span className="text-xs font-black text-teal uppercase tracking-wider block">n8n Historical Trend Analysis</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-bold text-navy">
                    <thead>
                      <tr className="border-b border-skyblue text-teal uppercase text-[9px] tracking-wider">
                        <th className="py-2">Record</th>
                        <th className="py-2">Hesitation</th>
                        <th className="py-2">Avg Accuracy</th>
                        <th className="py-2">Meds Adherence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicalArray.map((hist) => (
                        <tr key={hist.record_number} className="border-b border-skysoft hover:bg-skysoft">
                          <td className="py-2">#{hist.record_number}</td>
                          <td className="py-2">{hist.speech_hesitation_score}%</td>
                          <td className="py-2">{hist.avg_game_accuracy}%</td>
                          <td className="py-2">{hist.medication_adherence_rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: Live Medication Compliance Log */}
        <div className="bg-white rounded-3xl p-6 border-2 border-skyblue shadow-sm space-y-6">
          <div className="border-b border-skyblue pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-teal h-6 w-6" />
              <h3 className="text-xl font-black text-navy">Live Medication Adherence Log</h3>
            </div>
            <span className="text-xs font-black text-teal uppercase tracking-wider">Synced Live</span>
          </div>

          <div className="space-y-3">
            {filteredMeds.length === 0 ? (
              <p className="text-navy/60 text-sm italic py-4 text-center">No active medications scheduled for {patient}.</p>
            ) : (
              filteredMeds.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-4 bg-skysoft border border-skyblue rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${med.taken_status === "taken" ? "bg-teal" : "bg-alert animate-pulse"}`} />
                    <div>
                      <p className={`font-black text-md ${med.taken_status === "taken" ? "line-through text-navy/50" : "text-navy"}`}>
                        {med.med_name} ({med.dosage})
                      </p>
                      <span className="text-xs font-bold text-navy/60">Scheduled: {med.scheduled_time}</span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${med.taken_status === "taken" ? "bg-teal/10 text-teal border border-teal/20" : "bg-alert/10 text-alert border border-alert/20"
                    }`}>
                    {med.taken_status === "taken" ? `Taken (${med.taken_at ? new Date(med.taken_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Logged'})` : "Pending Alert"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CARD 3: Activity Signals & Anomaly Detector */}
        <div className="bg-white rounded-3xl p-6 border-2 border-alert shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-skyblue pb-4 flex items-center gap-2">
              <AlertTriangle className="text-alert h-6 w-6 animate-pulse" />
              <h3 className="text-xl font-black text-navy">Activity Signals & Anomaly Detector</h3>
            </div>

            <div className="space-y-3">
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <CheckCircle className="text-teal h-12 w-12 mx-auto" />
                  <p className="font-black text-navy text-lg">All Clear</p>
                  <p className="text-navy/60 text-xs font-semibold">No cognitive deviations or routine exceptions logged for {patient}.</p>
                </div>
              ) : (
                activeAlerts.map((alertItem) => (
                  <div key={alertItem.id} className="bg-alert/10 border border-alert/30 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-alert text-white font-black text-[10px] uppercase px-3 py-0.5 rounded-full">
                        {alertItem.type || alertItem.alert_type}
                      </span>
                      <span className="text-navy/60 text-xs font-bold">
                        {new Date(alertItem.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-black text-navy text-md">{alertItem.description || alertItem.message}</p>
                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => alert(`Dialing emergency contact for ${alertItem.patient_name || patient}...`)}
                        className="flex-grow bg-navy text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Phone className="h-4 w-4 text-skyblue" />
                        <span>Call Patient</span>
                      </button>
                      <button
                        onClick={() => handleResolveAlert(alertItem.id)}
                        className="flex-grow bg-white border border-skyblue text-navy font-black py-2.5 px-4 rounded-xl text-xs cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CARD 4: Memory Vault Manager & Spotlight Control */}
        <div className="bg-white rounded-3xl p-6 border-2 border-skyblue shadow-sm space-y-6">
          <div className="border-b border-skyblue pb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Upload className="text-teal h-6 w-6" />
              <h3 className="text-xl font-black text-navy">Memory Vault Manager</h3>
            </div>
            <span className="text-teal text-xs font-extrabold">{safeMemories.length} Stored Memories</span>
          </div>

          <form onSubmit={handleAddMemorySubmit} className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center ${isDragOver ? 'border-teal bg-teal/5' : 'border-skyblue hover:bg-skysoft/50'
                }`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <Upload className="h-6 w-6 text-teal mb-1" />
              <span className="text-xs font-black text-navy">Drag Photo Here or Tap to Choose File</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={vaultTitle}
                onChange={(e) => setVaultTitle(e.target.value)}
                placeholder="Title (e.g. Munnar Trip)"
                className="bg-skysoft border border-skyblue rounded-xl p-2.5 text-navy text-xs font-bold focus:outline-none focus:border-teal"
                required
              />
              <input
                type="text"
                value={vaultLocation}
                onChange={(e) => setVaultLocation(e.target.value)}
                placeholder="Location (e.g. Munnar)"
                className="bg-skysoft border border-skyblue rounded-xl p-2.5 text-navy text-xs font-bold focus:outline-none focus:border-teal"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={vaultDate}
                onChange={(e) => setVaultDate(e.target.value)}
                placeholder="Year (e.g. 2018)"
                className="bg-skysoft border border-skyblue rounded-xl p-2.5 text-navy text-xs font-bold focus:outline-none focus:border-teal"
              />
              <input
                type="text"
                value={vaultPeople}
                onChange={(e) => setVaultPeople(e.target.value)}
                placeholder="People Tags (comma separated)"
                className="bg-skysoft border border-skyblue rounded-xl p-2.5 text-navy text-xs font-bold focus:outline-none focus:border-teal"
              />
            </div>

            <textarea
              value={vaultDesc}
              onChange={(e) => setVaultDesc(e.target.value)}
              rows="2"
              placeholder="Description & story details..."
              className="w-full bg-skysoft border border-skyblue rounded-xl p-2.5 text-navy text-xs font-bold focus:outline-none focus:border-teal resize-none"
              required
            />

            <button
              type="submit"
              className="bg-navy hover:bg-navy/95 text-white font-black py-3 px-6 rounded-xl text-sm transition flex items-center justify-center gap-2 w-full cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Save to Memory Vault</span>
            </button>
          </form>

          {/* Thumbnail grid */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-black text-teal uppercase block">Vault Gallery (Click to Spotlight)</span>
            <div className="grid grid-cols-4 gap-3 max-h-[140px] overflow-y-auto">
              {safeMemories.map((mem, index) => (
                <div
                  key={mem.id}
                  onClick={() => setPreviewMemory({ mem, index })}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-skyblue bg-skysoft cursor-pointer hover:border-teal transition"
                >
                  <img src={mem.image_url || mem.photo_url} alt={mem.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Preview Overlay */}
      {previewMemory && (
        <div className="fixed inset-0 bg-navy/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-skyblue shadow-2xl space-y-4 text-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-skyblue">
              <img src={previewMemory.mem.image_url || previewMemory.mem.photo_url} alt={previewMemory.mem.title} className="w-full h-full object-cover" />
            </div>
            <h4 className="text-2xl font-black text-navy">{previewMemory.mem.title}</h4>
            <p className="text-navy/70 text-xs font-medium">{previewMemory.mem.description}</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { handlePushSpotlight(previewMemory.index); setPreviewMemory(null); }}
                className="flex-grow bg-navy text-white font-black py-3 rounded-xl text-sm cursor-pointer"
              >
                Push Spotlight to Senior
              </button>
              <button
                onClick={() => setPreviewMemory(null)}
                className="bg-skysoft text-navy font-black py-3 px-4 rounded-xl text-sm cursor-pointer border border-skyblue"
              >
                Close
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
  const [memories, setMemories] = useState(globalMemories);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('synapsee_is_muted') === 'true');

  useEffect(() => {
    localStorage.setItem('synapsee_is_muted', String(isMuted));
  }, [isMuted]);

  const handleReturnToDashboard = () => {
    window.location.hash = "#/patient";
  };

  return (
    <Router>
      <div className="min-h-screen bg-skysoft flex flex-col font-sans relative">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/select-role" element={<SelectRolePage />} />
          <Route path="/login/user" element={<SeniorLoginPage />} />
          <Route path="/login/caregiver" element={<CaregiverLoginPage />} />
          <Route path="/patient" element={<PatientInterface isMuted={isMuted} setIsMuted={setIsMuted} />} />
          <Route path="/patient/games" element={<CognitiveGamesHub memories={memories} onReturnToDashboard={handleReturnToDashboard} />} />
          <Route path="/dashboard" element={<CaregiverDashboard />} />
        </Routes>


        {/* Global Accessibility Suite overlay */}
        <AccessibilitySuite isMuted={isMuted} setIsMuted={setIsMuted} />

        {/* Global "Take Me Home" GPS overlay and button */}
        <TakeMeHomeGPS />
      </div>
    </Router>
  );
}
