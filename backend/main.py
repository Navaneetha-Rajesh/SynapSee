import os
import time
import logging
from typing import List, Optional
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
logger = logging.getLogger("KinKeepBackend")

app = FastAPI(title="KinKeep API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed data
mock_memories = [
    {
        "id": "munnar-2018",
        "title": "Family Trip to Munnar",
        "date": "2018",
        "location": "Munnar",
        "image_url": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800",
        "description": "Our wonderful family vacation to the tea gardens of Munnar. It was cool and foggy, and we spent the afternoon drinking hot chai."
    },
    {
        "id": "wedding-1975",
        "title": "Our Wedding Day",
        "date": "1975",
        "location": "St. Mary's Church",
        "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        "description": "The beautiful spring morning when we got married. Family and friends danced until evening."
    }
]

mock_alerts = [
    {
        "id": "alert-1",
        "created_at": "2026-07-25T09:00:00Z",
        "patient_name": "Eleanor Vance",
        "type": "Routine Deviation",
        "description": "Missed morning routine 2 days in a row",
        "severity": "high",
        "status": "active"
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
        logger.info("Supabase client initialized.")
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")

gemini_client = None
if GEMINI_API_KEY:
    try:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("Google Gemini Client initialized.")
    except Exception as e:
        logger.error(f"Failed to initialize Gemini Client: {e}")
else:
    logger.warning("GEMINI_API_KEY is missing. Running in mockup mode.")

whisper_model = None
try:
    from faster_whisper import WhisperModel
    whisper_model = WhisperModel("tiny", device="cpu", compute_type="int8")
    logger.info("faster-whisper model loaded.")
except Exception as e:
    logger.warning(f"faster-whisper not loaded: {e}. Fallback to Gemini transcription will be used.")

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
    patient_name: str
    type: str
    description: str
    severity: str

class RoutineUpdate(BaseModel):
    status: str

class GeminiStructuredOutput(BaseModel):
    response: str = Field(description="A warm, reassuring, nostalgia-driven response of 2-3 sentences to the patient.")
    cognitive_score: int = Field(description="A score between 0 and 100 on how accurately they remembered details of the memory or showed cognitive clarity.")
    hesitation_detected: bool = Field(description="True if their speech shows hesitation, heavy confusion, repetitive loops, or severe memory gaps.")

@app.get("/")
def read_root():
    return {"app": "KinKeep API", "status": "online"}

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
                        "Transcribe the spoken audio text precisely. Return ONLY the transcribed text, with absolutely no additional commentary, notes, or introductions."
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
            logger.error(f"Supabase fetch error: {e}")
            
    if not target_memory:
        for m in mock_memories:
            if m["id"] == payload.memory_id:
                target_memory = m
                break
                
    if not target_memory:
        target_memory = {"title": "A past memory", "location": "Munnar", "date": "2018", "description": "Family trip."}

    system_instruction = (
        "You are KinKeep, a compassionate, highly patient, warm cognitive companion for an elderly senior. "
        "Your task is to review the senior's voice response to a displayed memory, formulate a reassuring, warm, "
        "nostalgia-driven response of 2-3 sentences, rate their memory recall accuracy (cognitive_score) from 0-100, "
        "and note if they exhibit speech hesitation or confusion (hesitation_detected).\n\n"
        f"Memory Details they are looking at:\n"
        f"- Title: {target_memory['title']}\n"
        f"- Location: {target_memory['location']}\n"
        f"- Date: {target_memory['date']}\n"
        f"- Description: {target_memory['description']}\n\n"
        "Be extremely loving, gentle, and encouraging. Never tell them they are wrong. If they show confusion, "
        "help guide them back gently with comforting words."
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
                    "created_at": "2026-07-25T12:28:00Z",
                    "patient_name": "Eleanor Vance",
                    "type": "Speech Anomaly",
                    "description": f"Speech hesitation/confusion detected during conversation on '{target_memory['title']}'",
                    "severity": "medium",
                    "status": "active"
                }
                mock_alerts.append(new_alert)
                if supabase_client:
                    try:
                        supabase_client.table("alerts").insert(new_alert).execute()
                    except Exception as s_err:
                        logger.error(f"Could not insert alert to Supabase: {s_err}")
            
            return InteractionResponse(
                response=structured_data.response,
                cognitive_score=structured_data.cognitive_score,
                hesitation_detected=structured_data.hesitation_detected,
                suggestions=["Tell me about the tea", "Who was there?", "Remember the cold mornings?"]
            )
        except Exception as e:
            logger.error(f"Gemini error: {e}")
            
    return InteractionResponse(
        response="Oh, that sounds lovely! Munnar is indeed beautiful. Do you remember who drove us up the winding roads?",
        cognitive_score=85,
        hesitation_detected=False,
        suggestions=["Tell me about the tea", "Who was there?", "Remember the cold mornings?"]
    )

@app.get("/api/v1/caregiver/alerts")
def get_alerts():
    if supabase_client:
        try:
            res = supabase_client.table("alerts").select("*").order("created_at", descending=True).execute()
            return res.data
        except Exception as e:
            logger.error(f"Failed to fetch alerts: {e}")
    return mock_alerts

@app.post("/api/v1/caregiver/alerts")
def create_alert(payload: AlertCreate):
    new_alert = {
        "id": f"alert-{int(time.time())}",
        "created_at": "2026-07-25T12:28:00Z",
        "patient_name": payload.patient_name,
        "type": payload.type,
        "description": payload.description,
        "severity": payload.severity,
        "status": "active"
    }
    if supabase_client:
        try:
            res = supabase_client.table("alerts").insert(new_alert).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            logger.error(f"Failed to insert alert: {e}")
    mock_alerts.append(new_alert)
    return new_alert

@app.post("/api/v1/caregiver/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: str):
    if supabase_client:
        try:
            res = supabase_client.table("alerts").update({"status": "resolved"}).eq("id", alert_id).execute()
            if res.data:
                return {"status": "success", "data": res.data}
        except Exception as e:
            logger.error(f"Failed to resolve alert: {e}")
    for alert in mock_alerts:
        if alert["id"] == alert_id:
            alert["status"] = "resolved"
            return {"status": "success", "message": f"Alert {alert_id} resolved"}
    raise HTTPException(status_code=404, detail="Alert not found")

@app.get("/api/v1/memories")
def get_memories():
    if supabase_client:
        try:
            res = supabase_client.table("memories").select("*").execute()
            return res.data
        except Exception as e:
            logger.error(f"Failed to fetch memories: {e}")
    return mock_memories

@app.post("/api/v1/memories")
def add_memory(title: str = Form(...), description: str = Form(...), date: str = Form(...), location: str = Form(...), image_url: Optional[str] = Form(None)):
    new_memory = {
        "id": f"mem-{int(time.time())}",
        "title": title,
        "description": description,
        "date": date,
        "location": location,
        "image_url": image_url or "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
    }
    if supabase_client:
        try:
            res = supabase_client.table("memories").insert(new_memory).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            logger.error(f"Failed to add memory: {e}")
    mock_memories.append(new_memory)
    return new_memory

@app.get("/api/v1/routines")
def get_routines():
    if supabase_client:
        try:
            res = supabase_client.table("routines").select("*").execute()
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
