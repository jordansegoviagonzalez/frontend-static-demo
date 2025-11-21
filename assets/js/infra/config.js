// Turn OFF the fake AI and use the real model via your Cloudflare proxy
export const USE_FAKE_AI = false;

// Astro Gemma proxy (Cloudflare Worker) – safe to expose
export const GEMMA_PROXY_URL =
  "https://astro-gemma-router.segoviajordan91.workers.dev";

// Legacy HF config (kept for future, but NOT used when going through the proxy)
export const HF_API_BASE_URL = GEMMA_PROXY_URL; // front-end always calls the proxy now
export const HF_MODEL_ID = "google/gemma-2-2b-it";
// Do NOT put a real key here – the only real key lives in Cloudflare
export const HF_API_KEY = null;

// If later you build your own backend instead of Cloudflare:
// export const HF_API_BASE_URL = "https://your-backend.example.com";
