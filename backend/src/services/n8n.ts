import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const N8N_URL = process.env.N8N_LOCAL_WEBHOOK_URL || 'http://localhost:5678/webhook';

export async function triggerN8NWebhook<T>(endpoint: string, payload: any): Promise<T> {
  const url = `${N8N_URL}/${endpoint.replace(/^\//, '')}`;
  console.log(`[n8n Service] Triggering webhook at: ${url}`);
  
  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // 5s timeout
    });
    return response.data as T;
  } catch (error: any) {
    console.error(`[n8n Service] Error triggering webhook at ${url}:`, error.message);
    throw error;
  }
}
