// Turn OFF the fake AI and use the real model via your Cloudflare proxy
export const USE_FAKE_AI = false;

// Astro Gemma proxy (Cloudflare Worker) – safe to expose
export const GEMMA_PROXY_URL =
  "https://astro-gemma-router.segoviajordan91.workers.dev";

// Core API Configuration
export const HF_API_BASE_URL = GEMMA_PROXY_URL; 
export const HF_MODEL_ID = "google/gemma-2-2b-it";
// Note: API Key is managed securely by the Cloudflare Worker.
export const HF_API_KEY = null;
