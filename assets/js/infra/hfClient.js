// hfClient.js
// AstroAI → Cloudflare Worker → OpenAI (no fake/demo mode)

import { GEMMA_PROXY_URL } from "./config.js";

export const hfClient = {
  /**
   * Send a prompt (or messages array) to the Cloudflare Worker and stream the response.
   * @param {string|Array} input - The user's input text OR an array of message objects.
   * @param {function(string): void} [onChunk] - Optional callback for streaming updates.
   * @returns {Promise<string>} The full generated text.
   */
  async generateText(input, onChunk) {
    let payload = {};
    
    if (Array.isArray(input)) {
      payload.messages = input;
    } else {
      const promptText = String(input ?? "").trim();
      if (!promptText) throw new Error("Prompt is required.");
      payload.prompt = promptText;
    }

    const response = await fetch(GEMMA_PROXY_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let msg = "Unknown error";
      try {
        const data = await response.json();
        msg = data.error || data.message || JSON.stringify(data);
      } catch (e) {
        msg = await response.text();
      }
      throw new Error(`AI request failed via proxy (status ${response.status}): ${msg}`);
    }

    // Handle Streaming (SSE)
    if (response.headers.get("content-type")?.includes("text/event-stream")) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        const lines = buffer.split("\n");
        // Keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          
          const dataStr = trimmed.slice(6); // remove "data: "
          if (dataStr === "[DONE]") continue;

          try {
            const data = JSON.parse(dataStr);
            const delta = data.choices?.[0]?.delta?.content || "";
            if (delta) {
              fullText += delta;
              if (onChunk) onChunk(delta);
            }
          } catch (e) {
            console.warn("Failed to parse SSE line:", line, e);
          }
        }
      }
      return fullText;
    }

    // Fallback: Handle Non-Streaming JSON (Legacy)
    const data = await response.json();
    if (data && typeof data.text === "string") {
      return data.text;
    }
    return JSON.stringify(data);
  },
};

