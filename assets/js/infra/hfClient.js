import { HF_API_BASE_URL, HF_MODEL_ID, HF_API_KEY, USE_FAKE_AI } from "./config.js";

async function fakeDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const hfClient = {
  async generateText(prompt) {
    if (USE_FAKE_AI) {
      // Simple fake response for local testing without any API key.
      await fakeDelay(900);
      return "Astro Lite (demo): I received your message and this is a placeholder response. Configure a real model in config.js to enable live AI.";
    }

    if (!HF_API_KEY || HF_API_KEY === "YOUR_HF_API_KEY_HERE") {
      throw new Error("HF_API_KEY is not configured. Set it in config.js.");
    }

    const url = `${HF_API_BASE_URL}/models/${encodeURIComponent(HF_MODEL_ID)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 256,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`AI request failed: ${response.status} ${text}`);
    }

    const data = await response.json();

    // Hugging Face text generation usually returns an array with generated_text.
    if (Array.isArray(data) && data.length > 0 && typeof data[0].generated_text === "string") {
      return data[0].generated_text;
    }

    if (typeof data === "string") {
      return data;
    }

    // Fallback: just stringify.
    return JSON.stringify(data);
  }
};
