// hfClient.js
import { USE_FAKE_AI, GEMMA_PROXY_URL } from "./config.js";

async function fakeDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const hfClient = {
  async generateText(prompt) {
    // 1) Demo mode – no real model, safe for offline/local testing
    if (USE_FAKE_AI) {
      await fakeDelay(900);
      return "Astro Lite (demo): I received your message and this is a placeholder response. Configure the Cloudflare proxy in config.js to enable live AI.";
    }

    // 2) Real mode – call your Cloudflare Worker (which calls Gemma)
    const response = await fetch(GEMMA_PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`AI request failed via proxy: ${response.status} ${text}`);
    }

    const data = await response.json();

    // Worker returns { text: "..." }
    if (data && typeof data.text === "string") {
      return data.text;
    }

    // Fallback: stringify whatever came back
    return JSON.stringify(data);
  },
};
