// config.js

// No fake/demo AI anywhere in the app
export const USE_FAKE_AI = false;

// Cloudflare Worker proxy for AstroAI → OpenAI
// This is the ONLY URL the frontend should call.
export const GEMMA_PROXY_URL =
  "https://wild-star-02ba.segoviajordan91.workers.dev/";

// Legacy HF-style config (not used by the worker anymore)
// Kept only so other imports don't break.
export const HF_API_BASE_URL = GEMMA_PROXY_URL;
export const HF_MODEL_ID = "gpt-4o-mini"; // FYI: actual model is chosen in the Worker
export const HF_API_KEY = null;          // Key is managed securely by Cloudflare Worker
