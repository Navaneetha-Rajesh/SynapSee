"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerN8NWebhook = triggerN8NWebhook;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const N8N_URL = process.env.N8N_LOCAL_WEBHOOK_URL || 'http://localhost:5678/webhook';
async function triggerN8NWebhook(endpoint, payload) {
    const url = `${N8N_URL}/${endpoint.replace(/^\//, '')}`;
    console.log(`[n8n Service] Triggering webhook at: ${url}`);
    try {
        const response = await axios_1.default.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 5000, // 5s timeout
        });
        return response.data;
    }
    catch (error) {
        console.error(`[n8n Service] Error triggering webhook at ${url}:`, error.message);
        throw error;
    }
}
