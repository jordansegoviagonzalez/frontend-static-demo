export const USE_FAKE_AI = true;

// Hugging Face Inference API config (only used when USE_FAKE_AI === false)
export const HF_API_BASE_URL = "https://api-inference.huggingface.co";
export const HF_MODEL_ID = "YOUR_MODEL_ID_HERE"; // e.g. "mistralai/Mistral-7B-Instruct-v0.2"
export const HF_API_KEY = "YOUR_HF_API_KEY_HERE"; // <--- set this before using real AI

// Safety: you can also point to your own backend API instead of HF directly.
// e.g. export const HF_API_BASE_URL = "https://your-backend.example.com";
