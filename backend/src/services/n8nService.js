const axios = require('axios');

// Base URL for your local n8n instance
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678/webhook';

/**
 * 1. Analyze Speech / Text
 */
async function analyzeSpeechText(text, hesitationScore = 0.0) {
  try {
    const response = await axios.post(`${N8N_BASE_URL}/stt-analyze`, {
      text,
      hesitationScore,
    });
    return response.data;
  } catch (error) {
    console.error('n8n STT Analyze Error:', error.message);
    throw error;
  }
}

/**
 * 2. Process Game Completion Analytics
 */
async function sendGameAnalytics(patientId, gameType, score, durationSeconds) {
  try {
    const response = await axios.post(`${N8N_BASE_URL}/game-analytics`, {
      patientId,
      gameType,
      score,
      durationSeconds,
    });
    return response.data;
  } catch (error) {
    console.error('n8n Game Analytics Error:', error.message);
    throw error;
  }
}

/**
 * 3. Generate Dynamic Game Configuration
 */
async function generateDynamicGame(patientId, category = 'memory', difficulty = 'medium') {
  try {
    const response = await axios.post(`${N8N_BASE_URL}/generate-game`, {
      patientId,
      category,
      difficulty,
    });
    return response.data;
  } catch (error) {
    console.error('n8n Dynamic Game Error:', error.message);
    throw error;
  }
}

/**
 * 4. Fetch Caregiver Insights Digest
 */
async function getCaregiverInsights(patientId, patientName, timeframe = 'daily') {
  try {
    const response = await axios.post(`${N8N_BASE_URL}/caregiver-insights`, {
      patientId,
      patientName,
      timeframe,
    });
    return response.data;
  } catch (error) {
    console.error('n8n Caregiver Insights Error:', error.message);
    throw error;
  }
}

module.exports = {
  analyzeSpeechText,
  sendGameAnalytics,
  generateDynamicGame,
  getCaregiverInsights,
};