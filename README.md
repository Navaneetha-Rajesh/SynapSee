# KinKeep

KinKeep is a modern, production-grade dual-interface cognitive health and memory vault platform for seniors and caregivers. It helps elderly adults (specifically those experiencing mild cognitive impairment or dementia) preserve their legacy and engage in warm, nostalgia-driven conversations using Google Gemini 1.5 Flash, while providing caregivers with real-time anomaly alerts, routine compliance tracking, and memory vault management.

---

## 🚀 Key Features

### 1. Senior/Patient Portal
- **Memory Spotlight Card**: High-contrast, clean visual focal point displaying genuine family memories, dates, and locations.
- **One-Tap Voice Control**: An accessible, pulsing 80px x 80px mic button designed for elderly motor accessibility.
- **Voice Transcription Pipeline**: Translates audio speech to text using `faster-whisper` on FastAPI, with automatic fallback to Gemini 1.5 Flash's native audio model.
- **Warm Reassurance (Gemini 1.5 Flash)**: Generates nostalgic, cognitive-focused, 2-3 sentence prompts to guide memory recollection gently.
- **Text-to-Speech (TTS)**: Built-in voice playback utilizing native browser speech synthesis so the senior can hear replies spoken aloud.
- **Reminders Dock**: High-visibility pill and routine tracking indicator.

### 2. Caregiver Dashboard
- **Patient Selector & Metrics Bar**: Live tracking of engagement rates, checklist compliance, and active alerts.
- **Memory Vault Manager**: Drag-and-drop simulated file dropzone to upload photos, input metadata (dates/locations), and review uploaded memories.
- **Engagement Tracker**: Visual feedback of historical conversation recall scores and a chronological activity log.
- **Routine & Medication Log**: Live checklist to check off daily tasks (updates state and backend).
- **Smart Alerts Panel**: Displays warning anomalies (e.g. Speech hesitation detected by Gemini, routine deviations) with one-click phone dialer and dismissal.

---

## 🎨 Color Palette & Design
- **Primary Navy (`#2F4156`)**: Background, hero blocks, primary buttons, headers.
- **Accent Teal (`#567C8D`)**: Borders, active highlights, subheaders, secondary buttons.
- **Sky Blue (`#C8D9E6`)**: Secondary containers, tags, muted backgrounds.
- **Sky Soft (`#F0F5F9`)**: Patient card surfaces and clean page tints.
- **White (`#FFFFFF`)**: Pure white card surfaces.
- **Coral Alert (`#E76F51`)**: Target highlighted warnings and anomaly widgets.

---

## 🛠️ Tech Stack & Architecture

### Backend: FastAPI
- **Language**: Python 3.9+ / 3.11+
- **Speech Engine**: `faster-whisper` (CTranslate2) or Gemini 1.5 Flash API fallback.
- **LLM Engine**: Google Gemini 1.5 Flash (`google-genai` SDK) utilizing structured JSON response schema mapping.
- **Database integration**: Supabase Python SDK Client.

### Frontend: React
- **Bundler**: Vite (ES6)
- **Styling**: Tailwind CSS v4 (configured via Vite plugin and `@theme` CSS directives).
- **Routing**: `react-router-dom` (Hash Routing for local setup compatibility).
- **Icons**: Lucide Icons (`lucide-react`).

---

## 📦 Getting Started

### Prerequisites
- Python 3.9+ installed.
- Node.js (v18+) and npm installed.
- A Gemini API Key from Google AI Studio.

### Backend Installation & Run
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set your environment variables:
   ```bash
   export GEMINI_API_KEY="your-gemini-api-key-here"
   # Optional Supabase credentials:
   # export SUPABASE_URL="your-supabase-url"
   # export SUPABASE_KEY="your-supabase-anon-key"
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Installation & Run
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
