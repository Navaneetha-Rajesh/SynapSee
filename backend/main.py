import os
import time
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SynapseeBackend")

app = FastAPI(title="Synapsee API", version="2.0.0", description="Cognitive Care and Memory Vault Platform")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# SEED DATA & MOCK DATABASE
# ----------------------------------------------------
mock_users = [
    {
        "id": "user-eleanor",
        "name": "Eleanor Vance",
        "role": "user",
        "home_address": "742 Evergreen Terrace, Springfield, OR 97477",
        "home_coordinates": {"lat": 44.0462, "lng": -123.022}
    },
    {
        "id": "user-thomas",
        "name": "Thomas Miller",
        "role": "user",
        "home_address": "500 Birchwood Street, Eugene, OR 97401",
        "home_coordinates": {"lat": 44.0510, "lng": -123.0890}
    },
    {
        "id": "caregiver-sarah",
        "name": "Sarah Vance",
        "role": "caregiver",
        "home_address": "120 Oak Lane, Eugene, OR 97401",
        "home_coordinates": {"lat": 44.0521, "lng": -123.0867}
    }
]

mock_memories = [
    {
        "id": "munnar-2018",
        "user_id": "user-eleanor",
        "title": "Family Trip to Munnar",
        "date": "2018",
        "event_date": "2018-05-15",
        "location": "Munnar, Kerala",
        "people_tags": ["Eleanor", "Grandson Leo", "Sarah"],
        "photo_url": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800",
        "image_url": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800",
        "voice_clip_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_rain.ogg",
        "description": "Our wonderful family vacation to the tea gardens of Munnar. It was cool and foggy, and we spent the afternoon drinking hot chai."
    },
    {
        "id": "wedding-1975",
        "user_id": "user-eleanor",
        "title": "Our Wedding Day",
        "date": "1975",
        "event_date": "1975-06-21",
        "location": "St. Mary's Church",
        "people_tags": ["Eleanor", "Arthur Vance", "Family"],
        "photo_url": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        "voice_clip_url": "",
        "description": "The beautiful spring morning when we got married. Family and friends danced until evening."
    },
    {
        "id": "beach-2012",
        "user_id": "user-eleanor",
        "title": "Summer at Sunset Beach",
        "date": "2012",
        "event_date": "2012-07-10",
        "location": "Sunset Beach",
        "people_tags": ["Eleanor", "Grandson Leo"],
        "photo_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
        "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
        "voice_clip_url": "",
        "description": "Building sandcastles with young Leo during summer sunset. The ocean breeze was warm and refreshing."
    }
]

mock_medications = [
    {
        "id": "med-1",
        "user_id": "user-eleanor",
        "med_name": "Donepezil (Aricept)",
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
        "dosage": "10 mg",
        "remarks": "Take 1 pill with water after breakfast.",
        "scheduled_time": "08:30 AM",
        "taken_status": "taken",
        "taken_at": "2026-07-25T08:32:00Z"
    },
    {
        "id": "med-2",
        "user_id": "user-eleanor",
        "med_name": "Memantine (Namenda)",
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400",
        "dosage": "10 mg",
        "remarks": "Take after lunch with a full glass of water.",
        "scheduled_time": "02:00 PM",
        "taken_status": "pending",
        "taken_at": None
    },
    {
        "id": "med-3",
        "user_id": "user-eleanor",
        "med_name": "Multivitamin & Omega-3",
        "image_url": "https://images.unsplash.com/photo-1550572017-edf70602de36?auto=format&fit=crop&q=80&w=400",
        "dosage": "1 Softgel",
        "remarks": "Take before bedtime.",
        "scheduled_time": "08:00 PM",
        "taken_status": "pending",
        "taken_at": None
    },
    {
        "id": "med-tm1",
        "user_id": "user-thomas",
        "med_name": "Metoprolol Succinate",
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
        "dosage": "50 mg",
        "remarks": "Take in morning with breakfast.",
        "scheduled_time": "09:00 AM",
        "taken_status": "taken",
        "taken_at": "2026-07-25T09:05:00Z"
    },
    {
        "id": "med-tm2",
        "user_id": "user-thomas",
        "med_name": "Atorvastatin (Lipitor)",
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400",
        "dosage": "20 mg",
        "remarks": "Take at bedtime.",
        "scheduled_time": "09:00 PM",
        "taken_status": "pending",
        "taken_at": None
    }
]

mock_game_logs = [
    {
        "id": "glog-1",
        "user_id": "user-eleanor",
        "game_id": "photo-recall",
        "game_name": "Photo Recall Quiz",
        "start_time": "2026-07-25T10:15:00Z",
        "duration_seconds": 120,
        "correct_count": 4,
        "wrong_count": 1,
        "accuracy_pct": 80,
        "status": "completed",
        "completed_at": "2026-07-25T10:17:00Z"
    },
    {
        "id": "glog-2",
        "user_id": "user-eleanor",
        "game_id": "memory-matching",
        "game_name": "Memory Matching",
        "start_time": "2026-07-25T11:00:00Z",
        "duration_seconds": 95,
        "correct_count": 6,
        "wrong_count": 2,
        "accuracy_pct": 75,
        "status": "completed",
        "completed_at": "2026-07-25T11:01:35Z"
    },
    {
        "id": "glog-tm1",
        "user_id": "user-thomas",
        "game_id": "which-room",
        "game_name": "Which Room?",
        "start_time": "2026-07-25T11:15:00Z",
        "duration_seconds": 110,
        "correct_count": 3,
        "wrong_count": 2,
        "accuracy_pct": 60,
        "status": "completed",
        "completed_at": "2026-07-25T11:17:00Z"
    }
]

mock_alerts = [
    {
        "id": "alert-1",
        "user_id": "user-eleanor",
        "patient_name": "Eleanor Vance",
        "alert_type": "Medication Reminder",
        "type": "Medication Reminder",
        "message": "Afternoon Memantine dosage scheduled for 2:00 PM is pending",
        "description": "Afternoon Memantine dosage scheduled for 2:00 PM is pending",
        "severity": "medium",
        "status": "active",
        "acknowledged": False,
        "created_at": "2026-07-25T14:05:00Z"
    },
    {
        "id": "alert-tm1",
        "user_id": "user-thomas",
        "patient_name": "Thomas Miller",
        "alert_type": "Speech Hesitation",
        "type": "Speech Hesitation",
        "message": "Speech hesitation and word searching detected during recall session",
        "description": "Speech hesitation and word searching detected during recall session",
        "severity": "medium",
        "status": "active",
        "acknowledged": False,
        "created_at": "2026-07-25T11:20:00Z"
    }
]

mock_routines = [
    {"id": "rout-1", "title": "💊 Afternoon Medication", "time": "2:00 PM", "status": "Pending", "type": "medication"},
    {"id": "rout-2", "title": "🚶 Morning Walk in Garden", "time": "8:30 AM", "status": "Completed", "type": "routine"},
    {"id": "rout-3", "title": "🥗 Eat Nutritious Lunch", "time": "12:30 PM", "status": "Completed", "type": "routine"},
    {"id": "rout-4", "title": "🩺 Check Blood Pressure", "time": "6:00 PM", "status": "Pending", "type": "routine"}
]

# Env vars
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase_client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")

gemini_client = None
if GEMINI_API_KEY:
    try:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("Google Gemini Client initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Gemini Client: {e}")
else:
    logger.warning("GEMINI_API_KEY missing. Operating in fallback interactive mode.")

whisper_model = None
try:
    from faster_whisper import WhisperModel
    whisper_model = WhisperModel("tiny", device="cpu", compute_type="int8")
    logger.info("faster-whisper model loaded.")
except Exception as e:
    logger.warning(f"faster-whisper not available: {e}. Fallback enabled.")

# ----------------------------------------------------
# PYDANTIC SCHEMAS
# ----------------------------------------------------
class InteractionRequest(BaseModel):
    transcript: str
    memory_id: str
    current_context: Optional[str] = None

class InteractionResponse(BaseModel):
    response: str
    cognitive_score: int
    hesitation_detected: bool
    suggestions: List[str]

class AlertCreate(BaseModel):
    user_id: Optional[str] = "user-eleanor"
    patient_name: str = "Eleanor Vance"
    alert_type: str = "General Alert"
    type: Optional[str] = None
    message: str = ""
    description: Optional[str] = None
    severity: str = "medium"

class RoutineUpdate(BaseModel):
    status: str

class MedicationTakenRequest(BaseModel):
    user_id: Optional[str] = "user-eleanor"
    taken_at: Optional[str] = None

class GameLogCreate(BaseModel):
    user_id: Optional[str] = "user-eleanor"
    game_id: str
    game_name: str
    start_time: str
    duration_seconds: int
    correct_count: int
    wrong_count: int
    status: str = "completed"

class GeminiStructuredOutput(BaseModel):
    response: str = Field(description="A warm, reassuring, nostalgia-driven response of 2-3 sentences to the senior.")
    cognitive_score: int = Field(description="A score between 0 and 100 on memory recall accuracy.")
    hesitation_detected: bool = Field(description="True if speech shows hesitation, confusion, or severe memory gaps.")

# ----------------------------------------------------
# API ENDPOINTS
# ----------------------------------------------------
@app.get("/")
def read_root():
    return {
        "app": "Synapsee API",
        "version": "2.0.0",
        "status": "online",
        "features": ["Memory Vault", "Accessibility Suite", "GPS Home Guidance", "Mandatory Medication Alerts", "Cognitive Games Hub", "Caregiver Analytics"]
    }

# --- USERS ---
@app.get("/api/v1/users")
def get_users():
    if supabase_client:
        try:
            res = supabase_client.table("users").select("*").execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Supabase users error: {e}")
    return mock_users

@app.get("/api/v1/users/{user_id}")
def get_user(user_id: str):
    if supabase_client:
        try:
            res = supabase_client.table("users").select("*").eq("id", user_id).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            logger.error(f"Supabase user error: {e}")
    for u in mock_users:
        if u["id"] == user_id:
            return u
    return mock_users[0]

# --- MEDICATIONS ---
@app.get("/api/v1/medications")
def get_medications(user_id: Optional[str] = None):
    if supabase_client:
        try:
            query = supabase_client.table("medications").select("*")
            if user_id:
                query = query.eq("user_id", user_id)
            res = query.execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Supabase get medications error: {e}")
    if user_id:
        return [m for m in mock_medications if m.get("user_id") == user_id]
    return mock_medications

@app.post("/api/v1/medications/{med_id}/taken")
def mark_medication_taken(med_id: str, payload: MedicationTakenRequest):
    timestamp = payload.taken_at or datetime.utcnow().isoformat() + "Z"
    updated_med = None
    
    if supabase_client:
        try:
            res = supabase_client.table("medications").update({
                "taken_status": "taken",
                "taken_at": timestamp
            }).eq("id", med_id).execute()
            if res.data:
                updated_med = res.data[0]
        except Exception as e:
            logger.error(f"Supabase mark taken error: {e}")
            
    if not updated_med:
        for m in mock_medications:
            if m["id"] == med_id:
                m["taken_status"] = "taken"
                m["taken_at"] = timestamp
                updated_med = m
                break

    med_name_str = updated_med["med_name"] if (updated_med and isinstance(updated_med, dict) and "med_name" in updated_med) else med_id

    # Update associated routine if applicable
    for r in mock_routines:
        if "Medication" in r["title"] or med_id in r["id"]:
            r["status"] = "Completed"

    # Create caregiver confirmation log alert
    confirmation_alert = {
        "id": f"alert-{int(time.time())}",
        "user_id": payload.user_id or "user-eleanor",
        "patient_name": "Eleanor Vance" if payload.user_id != "user-thomas" else "Thomas Miller",
        "alert_type": "Medication Compliance",
        "type": "Medication Compliance",
        "message": f"Confirmed medication taken for dosage {med_name_str}",
        "description": f"Confirmed medication taken for dosage {med_name_str}",
        "severity": "low",
        "status": "resolved",
        "acknowledged": True,
        "created_at": timestamp
    }
    mock_alerts.insert(0, confirmation_alert)
    if supabase_client:
        try:
            supabase_client.table("alerts").insert(confirmation_alert).execute()
        except Exception as e:
            logger.error(f"Supabase insert alert error: {e}")

    return {
        "status": "success",
        "medication_id": med_id,
        "taken_status": "taken",
        "taken_at": timestamp,
        "medication": updated_med
    }

# --- GAME LOGS ---
@app.get("/api/v1/game-logs")
def get_game_logs(user_id: Optional[str] = None):
    if supabase_client:
        try:
            query = supabase_client.table("game_logs").select("*").order("start_time", descending=True)
            if user_id:
                query = query.eq("user_id", user_id)
            res = query.execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Supabase get game logs error: {e}")
    if user_id:
        return [g for g in mock_game_logs if g.get("user_id") == user_id]
    return mock_game_logs

@app.post("/api/v1/game-logs")
def create_game_log(payload: GameLogCreate):
    total = payload.correct_count + payload.wrong_count
    accuracy = round((payload.correct_count / total * 100)) if total > 0 else 100
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    new_log = {
        "id": f"glog-{int(time.time())}",
        "user_id": payload.user_id or "user-eleanor",
        "game_id": payload.game_id,
        "game_name": payload.game_name,
        "start_time": payload.start_time,
        "duration_seconds": payload.duration_seconds,
        "correct_count": payload.correct_count,
        "wrong_count": payload.wrong_count,
        "accuracy_pct": accuracy,
        "status": payload.status,
        "completed_at": timestamp
    }

    if supabase_client:
        try:
            res = supabase_client.table("game_logs").insert(new_log).execute()
            if res.data:
                new_log = res.data[0]
        except Exception as e:
            logger.error(f"Supabase insert game log error: {e}")

    mock_game_logs.insert(0, new_log)

    # Flag anomaly alert if accuracy is low
    if accuracy < 50:
        low_acc_alert = {
            "id": f"alert-{int(time.time())}",
            "user_id": payload.user_id or "user-eleanor",
            "patient_name": "Eleanor Vance" if payload.user_id != "user-thomas" else "Thomas Miller",
            "alert_type": "Cognitive Performance Anomaly",
            "type": "Cognitive Anomaly",
            "message": f"Accuracy dropped to {accuracy}% in {payload.game_name}",
            "description": f"Accuracy dropped to {accuracy}% in {payload.game_name}",
            "severity": "medium",
            "status": "active",
            "acknowledged": False,
            "created_at": timestamp
        }
        mock_alerts.insert(0, low_acc_alert)
        if supabase_client:
            try:
                supabase_client.table("alerts").insert(low_acc_alert).execute()
            except Exception as s_err:
                logger.error(f"Supabase insert alert error: {s_err}")

    return new_log

# --- VOICE & INTERACTION ---
@app.post("/api/v1/patient/voice-transcribe")
async def voice_transcribe(file: UploadFile = File(...)):
    logger.info(f"Received audio file: {file.filename}")
    try:
        audio_content = await file.read()
        if whisper_model is not None:
            temp_path = f"temp_{int(time.time())}_{file.filename}"
            with open(temp_path, "wb") as f:
                f.write(audio_content)
            try:
                segments, info = whisper_model.transcribe(temp_path, beam_size=5)
                transcript = " ".join([segment.text for segment in segments]).strip()
                os.remove(temp_path)
                return {"transcript": transcript}
            except Exception as w_err:
                logger.error(f"faster-whisper error: {w_err}")
                if os.path.exists(temp_path):
                    os.remove(temp_path)

        if gemini_client is not None:
            try:
                response = gemini_client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=[
                        types.Part.from_bytes(data=audio_content, mime_type=file.content_type or "audio/wav"),
                        "Transcribe the spoken audio text precisely. Return ONLY the transcribed text, with no extra commentary."
                    ]
                )
                if response and response.text:
                    return {"transcript": response.text.strip()}
            except Exception as g_err:
                logger.error(f"Gemini transcription error: {g_err}")

        return {"transcript": "I remember the beautiful mountains and tea fields."}
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        return {"transcript": "I remember the beautiful mountains and tea fields."}

@app.post("/api/v1/patient/interact", response_model=InteractionResponse)
async def patient_interact(payload: InteractionRequest):
    target_memory = None
    if supabase_client:
        try:
            res = supabase_client.table("memories").select("*").eq("id", payload.memory_id).execute()
            if res.data:
                target_memory = res.data[0]
        except Exception as e:
            logger.error(f"Supabase fetch memory error: {e}")
            
    if not target_memory:
        for m in mock_memories:
            if m["id"] == payload.memory_id:
                target_memory = m
                break
                
    if not target_memory:
        target_memory = {"title": "A past memory", "location": "Munnar", "date": "2018", "description": "Family trip."}

    system_instruction = (
        "You are Synapsee, a compassionate, warm, highly patient cognitive companion for an elderly senior. "
        "Review the senior's voice response to a memory photo, formulate a reassuring, nostalgia-driven response of 2-3 sentences, "
        "rate memory recall accuracy (cognitive_score) from 0-100, and flag speech hesitation or confusion (hesitation_detected).\n\n"
        f"Memory Details:\n"
        f"- Title: {target_memory['title']}\n"
        f"- Location: {target_memory['location']}\n"
        f"- Date: {target_memory['date']}\n"
        f"- Description: {target_memory['description']}\n\n"
        "Be gentle and encouraging. Never tell them they are wrong."
    )

    prompt = f"The senior said: \"{payload.transcript}\""

    if gemini_client:
        try:
            response = gemini_client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_schema=GeminiStructuredOutput,
                ),
            )
            structured_data = GeminiStructuredOutput.model_validate_json(response.text)
            
            if structured_data.hesitation_detected:
                new_alert = {
                    "id": f"alert-{int(time.time())}",
                    "user_id": "user-eleanor",
                    "created_at": datetime.utcnow().isoformat() + "Z",
                    "patient_name": "Eleanor Vance",
                    "alert_type": "Speech Anomaly",
                    "type": "Speech Anomaly",
                    "message": f"Speech hesitation/confusion detected during recall of '{target_memory['title']}'",
                    "description": f"Speech hesitation/confusion detected during recall of '{target_memory['title']}'",
                    "severity": "medium",
                    "status": "active",
                    "acknowledged": False
                }
                mock_alerts.insert(0, new_alert)
                if supabase_client:
                    try:
                        supabase_client.table("alerts").insert(new_alert).execute()
                    except Exception as s_err:
                        logger.error(f"Supabase alert insert error: {s_err}")
            
            return InteractionResponse(
                response=structured_data.response,
                cognitive_score=structured_data.cognitive_score,
                hesitation_detected=structured_data.hesitation_detected,
                suggestions=["Tell me about the tea", "Who was there?", "Remember the cool breeze?"]
            )
        except Exception as e:
            logger.error(f"Gemini error: {e}")
            
    return InteractionResponse(
        response="Oh, that sounds lovely! Munnar is indeed beautiful. Do you remember who drank hot chai with us?",
        cognitive_score=85,
        hesitation_detected=False,
        suggestions=["Tell me about the tea", "Who was there?", "Remember the cool breeze?"]
    )

# --- ALERTS ---
@app.get("/api/v1/caregiver/alerts")
def get_alerts(user_id: Optional[str] = None, patient_name: Optional[str] = None):
    if supabase_client:
        try:
            query = supabase_client.table("alerts").select("*").order("created_at", descending=True)
            if user_id:
                query = query.eq("user_id", user_id)
            if patient_name:
                query = query.eq("patient_name", patient_name)
            res = query.execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Failed to fetch alerts: {e}")
    res_list = mock_alerts
    if user_id:
        res_list = [a for a in res_list if a.get("user_id") == user_id]
    if patient_name:
        res_list = [a for a in res_list if a.get("patient_name") == patient_name]
    return res_list

@app.post("/api/v1/caregiver/alerts")
def create_alert(payload: AlertCreate):
    new_alert = {
        "id": f"alert-{int(time.time())}",
        "user_id": payload.user_id or "user-eleanor",
        "created_at": datetime.utcnow().isoformat() + "Z",
        "patient_name": payload.patient_name,
        "alert_type": payload.alert_type or payload.type or "Alert",
        "type": payload.type or payload.alert_type or "Alert",
        "message": payload.message or payload.description or "",
        "description": payload.description or payload.message or "",
        "severity": payload.severity,
        "status": "active",
        "acknowledged": False
    }
    if supabase_client:
        try:
            res = supabase_client.table("alerts").insert(new_alert).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            logger.error(f"Failed to insert alert: {e}")
    mock_alerts.insert(0, new_alert)
    return new_alert

@app.post("/api/v1/caregiver/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: str):
    if supabase_client:
        try:
            res = supabase_client.table("alerts").update({"status": "resolved", "acknowledged": True}).eq("id", alert_id).execute()
            if res.data:
                return {"status": "success", "data": res.data}
        except Exception as e:
            logger.error(f"Failed to resolve alert: {e}")
    for alert in mock_alerts:
        if alert["id"] == alert_id:
            alert["status"] = "resolved"
            alert["acknowledged"] = True
            return {"status": "success", "message": f"Alert {alert_id} resolved"}
    raise HTTPException(status_code=404, detail="Alert not found")

# --- MEMORIES ---
@app.get("/api/v1/memories")
def get_memories():
    if supabase_client:
        try:
            res = supabase_client.table("memories").select("*").execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Failed to fetch memories: {e}")
    return mock_memories

@app.post("/api/v1/memories")
def add_memory(
    title: str = Form(...),
    description: str = Form(...),
    date: str = Form(...),
    location: str = Form(...),
    people_tags: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    voice_clip_url: Optional[str] = Form(None),
    user_id: Optional[str] = Form("user-eleanor")
):
    tags_list = [t.strip() for t in people_tags.split(",")] if people_tags else ["Family"]
    fallback_img = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
    
    new_memory = {
        "id": f"mem-{int(time.time())}",
        "user_id": user_id or "user-eleanor",
        "title": title,
        "description": description,
        "date": date,
        "event_date": f"{date}-01-01" if len(date) == 4 else date,
        "location": location,
        "people_tags": tags_list,
        "photo_url": image_url or fallback_img,
        "image_url": image_url or fallback_img,
        "voice_clip_url": voice_clip_url or ""
    }
    if supabase_client:
        try:
            res = supabase_client.table("memories").insert(new_memory).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            logger.error(f"Failed to add memory: {e}")
    mock_memories.insert(0, new_memory)
    return new_memory

# --- ROUTINES ---
@app.get("/api/v1/routines")
def get_routines():
    if supabase_client:
        try:
            res = supabase_client.table("routines").select("*").execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Failed to fetch routines: {e}")
    return mock_routines

@app.put("/api/v1/routines/{routine_id}")
def update_routine(routine_id: str, payload: RoutineUpdate):
    if supabase_client:
        try:
            res = supabase_client.table("routines").update({"status": payload.status}).eq("id", routine_id).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            logger.error(f"Failed to update routine: {e}")
    for rout in mock_routines:
        if rout["id"] == routine_id:
            rout["status"] = payload.status
            return rout
    raise HTTPException(status_code=404, detail="Routine not found")
