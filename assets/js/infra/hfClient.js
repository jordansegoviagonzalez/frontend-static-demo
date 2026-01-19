// hfClient.js
// AstroAI → Cloudflare Worker → OpenAI (no fake/demo mode)

import { GEMMA_PROXY_URL } from "./config.js";

export const hfClient = {
  /**
   * Send a prompt to the Cloudflare Worker and return the model text.
   */
  async generateText(prompt) {
    const promptText = String(prompt ?? "").trim();
    if (!promptText) {
      throw new Error("Prompt is required.");
    }

    const response = await fetch(GEMMA_PROXY_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ prompt: promptText }),
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      const raw = await response.text().catch(() => "");
      throw new Error(
        `AI proxy returned non-JSON response (status ${response.status}): ${raw}`,
      );
    }

    if (!response.ok) {
      const msg = data?.error || data?.message || JSON.stringify(data);
      throw new Error(
        `AI request failed via proxy (status ${response.status}): ${msg}`,
      );
    }

    if (data && typeof data.text === "string") {
      return data.text;
    }

    return JSON.stringify(data);
  },
};

