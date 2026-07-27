# SynapSee

SynapSee is a modern, production-grade dual-portal cognitive care and memory reminiscence platform built to support seniors living with early-stage dementia or mild cognitive impairment, while providing real-time compliance oversight, alerts, and analytics to caregivers.

📺 **[Watch the Demo Video](https://drive.google.com/file/d/1jOhyAWkJW1ERveMtoN7I_YqCkTUdNET8/view?usp=drive_link)**

---

## 🚀 Key Features

### 1. Senior/Patient Portal
- **Memory Spotlight Card**: High-contrast, clean visual focal point displaying genuine family memories, dates, and locations synced directly from Supabase.
- **One-Tap Voice Control**: An accessible, pulsing microphone button using browser native Web Speech API for real-time speech recognition and text-to-speech companion feedback.
- **Medication Routine Dock**: High-visibility pill and routine tracking indicators showing today's schedule, with direct confirmation logging to the database.
- **Mandatory Reminder Popups**: accessible popup alerts for pending medicines with built-in 15-minute Snooze controls.

### 2. Caregiver Dashboard
- **Caregiver Digest AI Insights**: Real-time AI cognitive summaries, speech hesitation trends, and medication adherence metrics synthesized via local Ollama and n8n models.
- **Memory Vault Manager**: Form controls to upload images, input locations, dates, tags, and complete full CRUD actions (Add, Edit, Delete) directly on the Supabase database.
- **Medication Management CRUD Panel**: Full CRUD interface for caretaker routine setup, allowing adding, editing, and deleting medications.
- **Interactive Game Analytics**: Panel charting total games played, accuracy logs, and latest session details.

---

## 🛠️ Core Technology Stack & Architecture

- **Frontend**: React (Vite bundler), Tailwind CSS, Lucide Icons, native Web Speech API.
- **Backend Proxy**: Node.js Express server (TypeScript).
- **Database Storage**: Supabase Database REST API (real-time data layer).
- **AI Automation & Orchestration**: Local n8n Workflow Engine.
- **Local Large Language Model**: Ollama running llama3 / mistral for real-time speech evaluation, cognitive diagnostics, and caregiver summary synthesis.

---

## 📦 Getting Started & Setup

### Prerequisites
- Node.js (v18+) and npm installed.
- Ollama installed locally.
- n8n installed locally.

### Backend Installation & Run
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables in `.env`:
   ```env
   SUPABASE_URL=https://xuprrsbzcikdakyetsfh.supabase.co
   SUPABASE_ANON_KEY=sb_publishable_WvpPiNVC5P7EKpIT3XqRwg_8JtAgCYr
   N8N_LOCAL_WEBHOOK_URL=http://localhost:5678/webhook
   PORT=3000
   ```
4. Build and start the server:
   ```bash
   npm run build
   npm run start
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
4. Open your browser and navigate to `http://localhost:5173`.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
