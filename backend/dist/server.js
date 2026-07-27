"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_1 = require("./src/services/supabase");
const n8n_1 = require("./src/services/n8n");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
const upload = (0, multer_1.default)();
// Seeded local fallback data
const mockMemories = [
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
const mockMedications = [
    { id: "rout-1", med_name: "💊 Afternoon Medication", scheduled_time: "2:00 PM", dosage: "1 Tablet", taken_status: "pending", remarks: "Take with food", user_id: "user-eleanor" },
    { id: "rout-2", med_name: "🚶 Morning Walk in Garden", scheduled_time: "8:30 AM", dosage: "30 Minutes", taken_status: "taken", remarks: "Wear comfortable shoes", user_id: "user-eleanor" },
    { id: "rout-3", med_name: "🥗 Eat Nutritious Lunch", scheduled_time: "12:30 PM", dosage: "Full Meal", taken_status: "taken", remarks: "Include green vegetables", user_id: "user-eleanor" },
    { id: "rout-4", med_name: "🩺 Check Blood Pressure", scheduled_time: "6:00 PM", dosage: "Daily check", taken_status: "pending", remarks: "Sit quietly for 5 minutes before", user_id: "user-eleanor" }
];
let mockAlerts = [
    {
        id: "alert-1",
        created_at: new Date().toISOString(),
        patient_name: "Eleanor Vance",
        alert_type: "Routine Deviation",
        description: "Missed morning routine 2 days in a row",
        severity: "high",
        status: "active"
    }
];
// Helper to check if Supabase is active
const isSupabaseActive = () => !!supabase_1.supabase;
// ==========================================
// 1. MEMORIES ENDPOINTS
// ==========================================
app.get(['/api/v1/memories', '/api/memories'], async (req, res) => {
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase.from('memories').select('*');
            if (!error && data && data.length > 0) {
                return res.json(data);
            }
        }
        catch (e) {
            console.error("Supabase memories fetch error:", e);
        }
    }
    return res.json(mockMemories);
});
app.post(['/api/v1/memories', '/api/memories'], async (req, res) => {
    const newMemory = {
        id: req.body.id || `mem-${Date.now()}`,
        title: req.body.title,
        date: req.body.date,
        location: req.body.location,
        image_url: req.body.image_url || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
        description: req.body.description,
        created_at: new Date().toISOString(),
        people_tags: req.body.people_tags || ["Family"],
        user_id: req.body.user_id || "user-eleanor"
    };
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase.from('memories').insert(newMemory).select();
            if (!error && data) {
                return res.json(data[0]);
            }
        }
        catch (e) {
            console.error("Supabase memory insert error:", e);
        }
    }
    mockMemories.push(newMemory);
    return res.json(newMemory);
});
// Spotlight sync endpoints
let activeSpotlightMemoryId = "munnar-2018";
app.get('/api/spotlight', (req, res) => {
    return res.json({ activeId: activeSpotlightMemoryId });
});
app.post('/api/spotlight', (req, res) => {
    if (req.body && req.body.activeId) {
        activeSpotlightMemoryId = req.body.activeId;
    }
    return res.json({ activeId: activeSpotlightMemoryId });
});
// ==========================================
// 2. ROUTINES / MEDICATIONS ENDPOINTS
// ==========================================
app.get('/api/v1/medications', async (req, res) => {
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase.from('medication_logs').select('*');
            if (!error && data && data.length > 0) {
                return res.json(data);
            }
        }
        catch (e) {
            console.error("Supabase medication_logs fetch error:", e);
        }
    }
    return res.json(mockMedications);
});
app.get('/api/v1/routines', async (req, res) => {
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase.from('medication_logs').select('*');
            if (!error && data && data.length > 0) {
                return res.json(data);
            }
        }
        catch (e) {
            console.error("Supabase routines fetch error:", e);
        }
    }
    return res.json(mockMedications);
});
// Medication compliance endpoint
app.post('/api/medications/compliance', async (req, res) => {
    const { medId, userId } = req.body;
    const nowIso = new Date().toISOString();
    console.log(`[Medication Compliance] Marking taken for: ${medId}`);
    let updatedRecord = null;
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('medication_logs')
                .update({ taken_status: 'taken', taken_at: nowIso })
                .eq('id', medId)
                .select();
            if (!error && data && data.length > 0) {
                updatedRecord = data[0];
            }
        }
        catch (e) {
            console.error("Supabase update medication status error:", e);
        }
    }
    if (!updatedRecord) {
        const localMed = mockMedications.find(m => m.id === medId);
        if (localMed) {
            localMed.taken_status = 'taken';
            updatedRecord = { ...localMed, taken_at: nowIso };
        }
    }
    // Trigger n8n check
    try {
        await (0, n8n_1.triggerN8NWebhook)('medication-check', {
            medId,
            userId: userId || 'user-eleanor',
            status: 'taken',
            timestamp: nowIso,
            record: updatedRecord
        });
    }
    catch (err) {
        console.warn("[Medication Compliance] n8n webhook offline. Continuing gracefully.");
    }
    return res.json({ status: 'success', record: updatedRecord });
});
// Legacy path routing fallback for frontend PUT /api/v1/routines/:id
app.put('/api/v1/routines/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const nowIso = new Date().toISOString();
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('medication_logs')
                .update({ taken_status: status, taken_at: status === 'taken' ? nowIso : null })
                .eq('id', id)
                .select();
            if (!error && data && data.length > 0) {
                return res.json(data[0]);
            }
        }
        catch (e) {
            console.error("Supabase legacy routine update error:", e);
        }
    }
    const localMed = mockMedications.find(m => m.id === id);
    if (localMed) {
        localMed.taken_status = status;
        return res.json(localMed);
    }
    return res.status(404).json({ error: "Routine not found" });
});
// Legacy path routing for medication status POST
app.post('/api/v1/medications/:id/taken', async (req, res) => {
    const { id } = req.params;
    const { user_id, taken_at } = req.body;
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('medication_logs')
                .update({ taken_status: 'taken', taken_at: taken_at || new Date().toISOString() })
                .eq('id', id)
                .select();
            if (!error && data && data.length > 0) {
                return res.json(data[0]);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    const localMed = mockMedications.find(m => m.id === id);
    if (localMed) {
        localMed.taken_status = 'taken';
        return res.json(localMed);
    }
    return res.status(404).json({ error: "Medication not found" });
});
// ==========================================
// 3. SPEECH PROCESSING ENDPOINTS
// ==========================================
app.post('/api/voice/process', upload.single('file'), async (req, res) => {
    console.log("[Voice Process] Processing incoming senior speech request");
    let base64Audio = '';
    if (req.file) {
        base64Audio = req.file.buffer.toString('base64');
    }
    else if (req.body.audio) {
        base64Audio = req.body.audio;
    }
    let n8nResult = null;
    try {
        n8nResult = await (0, n8n_1.triggerN8NWebhook)('stt-analyze', {
            audio: base64Audio,
            mimeType: req.file?.mimetype || 'audio/wav',
            fileName: req.file?.originalname || 'recording.wav'
        });
    }
    catch (err) {
        console.warn("[Voice Process] n8n stt-analyze webhook offline. Using mock fallbacks.");
    }
    const finalResponse = n8nResult || {
        transcript: req.body.transcript || "I remember the beautiful mountains and tea fields.",
        replyText: "Oh, that sounds lovely! Munnar is indeed beautiful. Do you remember who drank hot chai with us?",
        hesitationScore: 15,
        memoryContext: "Family vacation to Munnar tea gardens"
    };
    // Update Supabase patient_analytics
    if (isSupabaseActive() && finalResponse.hesitationScore !== undefined) {
        try {
            await supabase_1.supabase
                .from('patient_analytics')
                .upsert({
                id: 'eleanor-vance',
                speech_hesitation_score: finalResponse.hesitationScore,
                updated_at: new Date().toISOString()
            });
        }
        catch (e) {
            console.error("Supabase patient_analytics update error:", e);
        }
    }
    return res.json({
        transcript: finalResponse.transcript,
        response: finalResponse.replyText,
        cognitive_score: 100 - (finalResponse.hesitationScore || 0),
        hesitation_detected: (finalResponse.hesitationScore || 0) > 40,
        suggestions: ["Tell me about the tea", "Who was there?", "Remember the cold mornings?"]
    });
});
// Legacy path routing for compatibility
app.post('/api/v1/patient/voice-transcribe', upload.single('file'), async (req, res) => {
    return res.json({ transcript: "I remember the beautiful mountains and tea fields." });
});
app.post('/api/v1/patient/interact', async (req, res) => {
    return res.json({
        response: "Oh, that sounds lovely! Munnar is indeed beautiful. Do you remember who drank hot chai with us?",
        cognitive_score: 85,
        hesitation_detected: false,
        suggestions: ["Tell me about the tea", "Who was there?", "Remember the cold mornings?"]
    });
});
app.post('/api/game/complete', async (req, res) => {
    try {
        const { score, durationSeconds, gameType, patientId, timestamp } = req.body;
        const payload = {
            score: score ?? 0,
            durationSeconds: durationSeconds ?? 0,
            gameType: gameType || 'unknown-game',
            patientId: patientId || 'user-eleanor',
            timestamp: timestamp || new Date().toISOString()
        };
        let n8nResult = null;
        try {
            n8nResult = await (0, n8n_1.triggerN8NWebhook)('game-analytics', payload);
        }
        catch (err) {
            console.warn("[Game Complete] n8n game-analytics webhook offline. Returning fallback response.");
        }
        return res.status(200).json({
            success: true,
            message: "Game completion recorded",
            data: n8nResult || payload
        });
    }
    catch (error) {
        console.error("Error handling game completion:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});
app.get('/api/games/data/:gameKey', async (req, res) => {
    const { gameKey } = req.params;
    console.log(`[Games Hub] Generating dynamic data for game: ${gameKey}`);
    let n8nResult = null;
    try {
        n8nResult = await (0, n8n_1.triggerN8NWebhook)('generate-game', { gameKey });
    }
    catch (err) {
        console.warn("[Games Hub] n8n generate-game webhook offline. Using mock fallbacks.");
    }
    if (n8nResult) {
        return res.json(n8nResult);
    }
    // Fallbacks
    if (gameKey === 'photo-recall') {
        return res.json({
            question: "Where was this photo taken?",
            image_url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800",
            correctAnswer: "Munnar",
            options: ["Munnar", "Sunset Beach", "Paris", "New York"]
        });
    }
    else if (gameKey === 'memory-matching') {
        return res.json({
            items: [
                { id: 1, content: "Munnar Trip", pairId: "A" },
                { id: 2, content: "☕ Hot Chai", pairId: "A" },
                { id: 3, content: "Wedding Day", pairId: "B" },
                { id: 4, content: "💍 St. Mary's", pairId: "B" }
            ]
        });
    }
    else if (gameKey === 'sequencing') {
        return res.json({
            events: [
                { id: "e3", title: "Sunset Beach Trip (2012)" },
                { id: "e1", title: "Wedding Day (1975)" },
                { id: "e2", title: "Munnar Vacation (2018)" }
            ],
            correctOrder: ["e1", "e3", "e2"]
        });
    }
    return res.json({ message: "Game key not supported" });
});
app.post('/api/games/log', async (req, res) => {
    const { patientId, gameKey, durationSeconds, correctCount, wrongCount, metrics } = req.body;
    const nowIso = new Date().toISOString();
    console.log(`[Games Log] Logging results for game ${gameKey}`);
    const gameLog = {
        id: `log-${Date.now()}`,
        user_id: patientId || 'user-eleanor',
        game_id: gameKey,
        game_name: gameKey,
        duration_seconds: durationSeconds,
        correct_count: correctCount,
        wrong_count: wrongCount,
        status: 'completed',
        created_at: nowIso
    };
    if (isSupabaseActive()) {
        try {
            await supabase_1.supabase.from('game_logs').insert(gameLog);
        }
        catch (e) {
            console.error("Supabase game log insert error:", e);
        }
    }
    // Trigger n8n game-analytics
    try {
        const n8nResult = await (0, n8n_1.triggerN8NWebhook)('game-analytics', {
            patientId: patientId || 'user-eleanor',
            gameKey,
            durationSeconds,
            correctCount,
            wrongCount,
            metrics,
            log: gameLog
        });
        return res.json({ status: 'success', analytics: n8nResult });
    }
    catch (err) {
        console.warn("[Games Log] n8n game-analytics webhook offline. Returning success.");
    }
    return res.json({ status: 'success', log: gameLog });
});
// Legacy path routing for compatibility
app.get('/api/v1/game-logs', async (req, res) => {
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase.from('game_logs').select('*');
            if (!error && data) {
                return res.json(data);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    return res.json([]);
});
app.post('/api/v1/game-logs', async (req, res) => {
    const { game_id, duration_seconds, correct_count, wrong_count } = req.body;
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase.from('game_logs').insert({
                user_id: 'user-eleanor',
                game_id,
                game_name: game_id,
                duration_seconds,
                correct_count,
                wrong_count,
                status: 'completed',
                created_at: new Date().toISOString()
            }).select();
            if (!error && data) {
                return res.json(data[0]);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    return res.json({ status: 'success' });
});
app.get('/api/caregiver/insights/:patientId', async (req, res) => {
    const { patientId } = req.params;
    console.log(`[Caregiver Insights] Requesting digest for patient: ${patientId}`);
    try {
        let n8nResult = null;
        try {
            n8nResult = await (0, n8n_1.triggerN8NWebhook)('caregiver-insights', {
                patientId: patientId || 'user-eleanor'
            });
        }
        catch (err) {
            console.warn("[Caregiver Insights] n8n caregiver-insights webhook offline. Fallback triggered.");
        }
        const summary = n8nResult?.summary || n8nResult?.response || "Patient showing stable engagement across recent memory exercises. Memory recall speed remains consistent with baseline.";
        return res.status(200).json({ summary });
    }
    catch (error) {
        console.error("Error retrieving caregiver insights:", error);
        return res.status(200).json({
            summary: "Unable to retrieve AI summary digest at this time. Standard routine tracking remains active."
        });
    }
});
app.get('/api/v1/caregiver/alerts', async (req, res) => {
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('caregiver_alerts')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && data && data.length > 0) {
                return res.json(data);
            }
        }
        catch (e) {
            console.error("Supabase caregiver_alerts fetch error:", e);
        }
    }
    return res.json(mockAlerts);
});
app.patch('/api/alerts/:id/resolve', async (req, res) => {
    const { id } = req.params;
    console.log(`[Caregiver Alerts] Resolving alert ${id}`);
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('caregiver_alerts')
                .update({ status: 'resolved' })
                .eq('id', id)
                .select();
            if (!error && data && data.length > 0) {
                return res.json(data[0]);
            }
        }
        catch (e) {
            console.error("Supabase alert resolution error:", e);
        }
    }
    const localAlert = mockAlerts.find(a => a.id === id);
    if (localAlert) {
        localAlert.status = 'resolved';
        return res.json(localAlert);
    }
    return res.status(404).json({ error: "Alert not found" });
});
// Legacy path routing for compatibility
app.post('/api/v1/caregiver/alerts/:id/resolve', async (req, res) => {
    const { id } = req.params;
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('caregiver_alerts')
                .update({ status: 'resolved' })
                .eq('id', id)
                .select();
            if (!error && data) {
                return res.json(data[0]);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    const localAlert = mockAlerts.find(a => a.id === id);
    if (localAlert) {
        localAlert.status = 'resolved';
        return res.json(localAlert);
    }
    return res.status(404).json({ error: "Alert not found" });
});
app.get('/api/v1/patient/analytics', async (req, res) => {
    if (isSupabaseActive()) {
        try {
            const { data, error } = await supabase_1.supabase.from('patient_analytics').select('*');
            if (!error && data) {
                return res.json(data);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    return res.json([{ id: 'eleanor-vance', speech_hesitation_score: 15 }]);
});
app.listen(PORT, () => {
    console.log(`[Express Server] Server running on http://localhost:${PORT}`);
});
